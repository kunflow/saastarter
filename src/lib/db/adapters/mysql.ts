/**
 * MySQL Database Adapter
 * Uses mysql2 package for direct MySQL connections
 * Requires NextAuth.js or similar for authentication
 */

import mysql from 'mysql2/promise'
import { env } from '@/config/env'
import type {
  DatabaseAdapter,
  DbUser,
  DbSession,
  AuthResult,
  UserStatus,
  QuotaResult,
  DeductResult,
} from '../types'

let pool: mysql.Pool | null = null

function getPool(): mysql.Pool | null {
  if (!env.database.url) return null

  if (!pool) {
    pool = mysql.createPool({ uri: env.database.url })
  }

  return pool
}

async function query<T>(sql: string, params?: unknown[]): Promise<T[]> {
  const p = getPool()
  if (!p) return []
  const [rows] = await p.execute(sql, params)
  return rows as T[]
}

export class MySQLAdapter implements DatabaseAdapter {
  auth = {
    async getUser(): Promise<AuthResult<DbUser>> {
      // MySQL adapter requires external auth (NextAuth.js)
      return {
        data: null,
        error: {
          message: 'MySQL adapter requires NextAuth.js integration. See database/mysql/README.md',
        },
      }
    },

    async signUp(_email: string, _password: string): Promise<AuthResult<{ user: DbUser; session: DbSession }>> {
      return {
        data: null,
        error: {
          message: 'MySQL adapter requires NextAuth.js integration. See database/mysql/README.md',
        },
      }
    },

    async signIn(_email: string, _password: string): Promise<AuthResult<{ user: DbUser; session: DbSession }>> {
      return {
        data: null,
        error: {
          message: 'MySQL adapter requires NextAuth.js integration. See database/mysql/README.md',
        },
      }
    },

    async signOut(): Promise<AuthResult<void>> {
      return {
        data: null,
        error: {
          message: 'MySQL adapter requires NextAuth.js integration. See database/mysql/README.md',
        },
      }
    },
  }

  async getUserStatus(userId: string): Promise<UserStatus | null> {
    try {
      const rows = await query<{
        user_id: string
        email: string
        display_name: string
        avatar_url: string | null
        locale: string
        timezone: string
        plan_slug: string
        plan_name: string
        subscription_status: string
        current_period_start: string | null
        current_period_end: string | null
        cancel_at_period_end: number
        credits_balance: number
        total_earned: number
        total_spent: number
      }>(
        `
        SELECT
          u.id as user_id,
          u.email,
          COALESCE(up.display_name, SUBSTRING_INDEX(u.email, '@', 1)) as display_name,
          up.avatar_url,
          COALESCE(up.locale, 'en') as locale,
          COALESCE(up.timezone, 'UTC') as timezone,
          COALESCE(p.slug, 'free') as plan_slug,
          COALESCE(p.name, 'Free') as plan_name,
          COALESCE(s.status, 'active') as subscription_status,
          s.current_period_start,
          s.current_period_end,
          COALESCE(s.cancel_at_period_end, 0) as cancel_at_period_end,
          COALESCE(c.balance, 0) as credits_balance,
          COALESCE(c.total_earned, 0) as total_earned,
          COALESCE(c.total_spent, 0) as total_spent
        FROM users u
        LEFT JOIN user_profiles up ON up.user_id = u.id
        LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
        LEFT JOIN plans p ON p.id = s.plan_id
        LEFT JOIN credits c ON c.user_id = u.id
        WHERE u.id = ?
        `,
        [userId]
      )

      if (rows.length === 0) return null

      const row = rows[0]
      return {
        user: {
          id: row.user_id,
          email: row.email,
          display_name: row.display_name,
          avatar_url: row.avatar_url,
          locale: row.locale,
          timezone: row.timezone,
        },
        plan: {
          slug: row.plan_slug as 'free' | 'pro',
          name: row.plan_name,
          status: row.subscription_status,
          current_period_start: row.current_period_start || undefined,
          current_period_end: row.current_period_end || undefined,
          cancel_at_period_end: Boolean(row.cancel_at_period_end),
        },
        entitlements: {},
        credits: {
          balance: row.credits_balance,
          total_earned: row.total_earned,
          total_spent: row.total_spent,
        },
      }
    } catch (error) {
      console.error('MySQL getUserStatus error:', error)
      return null
    }
  }

  async checkAnonymousQuota(identifier: string, _identifierType: 'ip' | 'fingerprint'): Promise<QuotaResult | null> {
    try {
      const dailyLimit = env.credits.anonymousQuota

      // Get or create quota record using MySQL's INSERT ... ON DUPLICATE KEY UPDATE
      await query(
        `
        INSERT INTO anonymous_quotas (identifier, usage_count, last_used_at)
        VALUES (?, 1, NOW())
        ON DUPLICATE KEY UPDATE
          usage_count = IF(DATE(last_used_at) = CURDATE(), usage_count + 1, 1),
          last_used_at = NOW()
        `,
        [identifier]
      )

      const rows = await query<{ usage_count: number }>(
        'SELECT usage_count FROM anonymous_quotas WHERE identifier = ?',
        [identifier]
      )

      const usageCount = rows[0]?.usage_count || 1
      const allowed = usageCount <= dailyLimit

      return {
        allowed,
        usage_count: usageCount,
        daily_limit: dailyLimit,
        remaining: Math.max(0, dailyLimit - usageCount),
      }
    } catch (error) {
      console.error('MySQL checkAnonymousQuota error:', error)
      return null
    }
  }

  async deductCredits(
    userId: string,
    amount: number,
    idempotencyKey: string,
    description: string,
    metadata: Record<string, unknown>
  ): Promise<DeductResult | null> {
    const p = getPool()
    if (!p) return null

    const connection = await p.getConnection()
    try {
      await connection.beginTransaction()

      // Check for idempotent request
      const [existing] = await connection.execute(
        'SELECT id FROM credit_ledger WHERE idempotency_key = ?',
        [idempotencyKey]
      ) as [{ id: string }[], unknown]

      if (existing.length > 0) {
        const [balance] = await connection.execute(
          'SELECT balance FROM credits WHERE user_id = ?',
          [userId]
        ) as [{ balance: number }[], unknown]
        await connection.commit()
        return {
          success: true,
          balance_after: balance[0]?.balance || 0,
          idempotent: true,
        }
      }

      // Check balance with row lock
      const [balanceResult] = await connection.execute(
        'SELECT balance FROM credits WHERE user_id = ? FOR UPDATE',
        [userId]
      ) as [{ balance: number }[], unknown]

      const currentBalance = balanceResult[0]?.balance || 0
      if (currentBalance < amount) {
        await connection.rollback()
        return {
          success: false,
          balance_after: currentBalance,
          idempotent: false,
          error: 'Insufficient credits',
        }
      }

      // Deduct credits
      const newBalance = currentBalance - amount
      await connection.execute(
        'UPDATE credits SET balance = ?, total_spent = total_spent + ?, updated_at = NOW() WHERE user_id = ?',
        [newBalance, amount, userId]
      )

      // Record in ledger
      await connection.execute(
        `INSERT INTO credit_ledger (user_id, amount, balance_after, type, description, idempotency_key, metadata)
         VALUES (?, ?, ?, 'deduction', ?, ?, ?)`,
        [userId, -amount, newBalance, description, idempotencyKey, JSON.stringify(metadata)]
      )

      await connection.commit()

      return {
        success: true,
        balance_after: newBalance,
        idempotent: false,
      }
    } catch (error) {
      await connection.rollback()
      console.error('MySQL deductCredits error:', error)
      return null
    } finally {
      connection.release()
    }
  }

  isConfigured(): boolean {
    return env.database.type === 'mysql' && !!env.database.url
  }
}
