/**
 * PostgreSQL Database Adapter
 * Uses pg package for direct PostgreSQL connections
 * Requires NextAuth.js or similar for authentication
 */

import { Pool } from 'pg'
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

let pool: Pool | null = null

function getPool(): Pool | null {
  if (!env.database.url) return null

  if (!pool) {
    pool = new Pool({ connectionString: env.database.url })
  }

  return pool
}

async function query<T>(sql: string, params?: unknown[]): Promise<T[]> {
  const p = getPool()
  if (!p) return []
  const result = await p.query(sql, params)
  return result.rows as T[]
}

export class PostgreSQLAdapter implements DatabaseAdapter {
  auth = {
    async getUser(): Promise<AuthResult<DbUser>> {
      // PostgreSQL adapter requires external auth (NextAuth.js)
      // This should be called after NextAuth session is validated
      // For now, return not configured - implement with NextAuth integration
      return {
        data: null,
        error: {
          message: 'PostgreSQL adapter requires NextAuth.js integration. See database/postgresql/README.md',
        },
      }
    },

    async signUp(_email: string, _password: string): Promise<AuthResult<{ user: DbUser; session: DbSession }>> {
      // Implement with NextAuth.js Credentials provider
      // See: https://next-auth.js.org/providers/credentials
      return {
        data: null,
        error: {
          message: 'PostgreSQL adapter requires NextAuth.js integration. See database/postgresql/README.md',
        },
      }
    },

    async signIn(_email: string, _password: string): Promise<AuthResult<{ user: DbUser; session: DbSession }>> {
      // Implement with NextAuth.js Credentials provider
      return {
        data: null,
        error: {
          message: 'PostgreSQL adapter requires NextAuth.js integration. See database/postgresql/README.md',
        },
      }
    },

    async signOut(): Promise<AuthResult<void>> {
      // Implement with NextAuth.js signOut
      return {
        data: null,
        error: {
          message: 'PostgreSQL adapter requires NextAuth.js integration. See database/postgresql/README.md',
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
        cancel_at_period_end: boolean
        credits_balance: number
        total_earned: number
        total_spent: number
      }>(
        `
        SELECT
          u.id as user_id,
          u.email,
          COALESCE(up.display_name, split_part(u.email, '@', 1)) as display_name,
          up.avatar_url,
          COALESCE(up.locale, 'en') as locale,
          COALESCE(up.timezone, 'UTC') as timezone,
          COALESCE(p.slug, 'free') as plan_slug,
          COALESCE(p.name, 'Free') as plan_name,
          COALESCE(s.status, 'active') as subscription_status,
          s.current_period_start,
          s.current_period_end,
          COALESCE(s.cancel_at_period_end, false) as cancel_at_period_end,
          COALESCE(c.balance, 0) as credits_balance,
          COALESCE(c.total_earned, 0) as total_earned,
          COALESCE(c.total_spent, 0) as total_spent
        FROM users u
        LEFT JOIN user_profiles up ON up.user_id = u.id
        LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
        LEFT JOIN plans p ON p.id = s.plan_id
        LEFT JOIN credits c ON c.user_id = u.id
        WHERE u.id = $1
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
          cancel_at_period_end: row.cancel_at_period_end,
        },
        entitlements: {}, // Load from plan_entitlements table if needed
        credits: {
          balance: row.credits_balance,
          total_earned: row.total_earned,
          total_spent: row.total_spent,
        },
      }
    } catch (error) {
      console.error('PostgreSQL getUserStatus error:', error)
      return null
    }
  }

  async checkAnonymousQuota(identifier: string, _identifierType: 'ip' | 'fingerprint'): Promise<QuotaResult | null> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const dailyLimit = env.credits.anonymousQuota

      // Get or create quota record
      const rows = await query<{ usage_count: number }>(
        `
        INSERT INTO anonymous_quotas (identifier, usage_count, last_used_at)
        VALUES ($1, 1, NOW())
        ON CONFLICT (identifier) DO UPDATE SET
          usage_count = CASE
            WHEN DATE(anonymous_quotas.last_used_at) = $2::date THEN anonymous_quotas.usage_count + 1
            ELSE 1
          END,
          last_used_at = NOW()
        RETURNING usage_count
        `,
        [identifier, today]
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
      console.error('PostgreSQL checkAnonymousQuota error:', error)
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

    const client = await p.connect()
    try {
      await client.query('BEGIN')

      // Check for idempotent request
      const existing = await client.query(
        'SELECT id FROM credit_ledger WHERE idempotency_key = $1',
        [idempotencyKey]
      )

      if (existing.rows.length > 0) {
        const balance = await client.query(
          'SELECT balance FROM credits WHERE user_id = $1',
          [userId]
        )
        await client.query('COMMIT')
        return {
          success: true,
          balance_after: balance.rows[0]?.balance || 0,
          idempotent: true,
        }
      }

      // Check balance
      const balanceResult = await client.query(
        'SELECT balance FROM credits WHERE user_id = $1 FOR UPDATE',
        [userId]
      )

      const currentBalance = balanceResult.rows[0]?.balance || 0
      if (currentBalance < amount) {
        await client.query('ROLLBACK')
        return {
          success: false,
          balance_after: currentBalance,
          idempotent: false,
          error: 'Insufficient credits',
        }
      }

      // Deduct credits
      const newBalance = currentBalance - amount
      await client.query(
        'UPDATE credits SET balance = $1, total_spent = total_spent + $2, updated_at = NOW() WHERE user_id = $3',
        [newBalance, amount, userId]
      )

      // Record in ledger
      await client.query(
        `INSERT INTO credit_ledger (user_id, amount, balance_after, type, description, idempotency_key, metadata)
         VALUES ($1, $2, $3, 'deduction', $4, $5, $6)`,
        [userId, -amount, newBalance, description, idempotencyKey, JSON.stringify(metadata)]
      )

      await client.query('COMMIT')

      return {
        success: true,
        balance_after: newBalance,
        idempotent: false,
      }
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('PostgreSQL deductCredits error:', error)
      return null
    } finally {
      client.release()
    }
  }

  isConfigured(): boolean {
    return env.database.type === 'postgresql' && !!env.database.url
  }
}
