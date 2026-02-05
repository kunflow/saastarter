/**
 * Database Abstraction Layer - Open Source Version
 *
 * This is the open source version of the database layer.
 * Credits and quota operations return mock data.
 * Auth operations work normally with configured database.
 *
 * For full database functionality, please upgrade to the Pro version.
 */

import { env } from '@/config/env'
import { SupabaseAdapter } from './adapters/supabase'
import { PostgreSQLAdapter } from './adapters/postgresql'
import { MySQLAdapter } from './adapters/mysql'
import type { DatabaseAdapter, DatabaseType, UserStatus, QuotaResult, DeductResult } from './types'

// Export types
export * from './types'

// Singleton adapter instance
let adapter: DatabaseAdapter | null = null

/**
 * Get the database adapter based on DATABASE_TYPE environment variable
 */
export function getAdapter(): DatabaseAdapter {
  if (adapter) return adapter

  const dbType = env.database.type as DatabaseType

  switch (dbType) {
    case 'postgresql':
      adapter = new PostgreSQLAdapter()
      break
    case 'mysql':
      adapter = new MySQLAdapter()
      break
    case 'supabase':
    default:
      adapter = new SupabaseAdapter()
      break
  }

  return adapter
}

/**
 * Open Source Version: Mock user status
 * Returns demo data without database query
 */
function getMockUserStatus(): UserStatus {
  return {
    user: {
      id: 'demo-user',
      email: 'demo@example.com',
      display_name: 'Demo User',
      avatar_url: null,
      locale: 'en',
      timezone: 'UTC'
    },
    plan: {
      slug: 'free',
      name: 'Free',
      status: 'active'
    },
    credits: {
      balance: 999999, // Unlimited for open source
      total_earned: 999999,
      total_spent: 0
    },
    entitlements: {
      monthly_credits: 999999,
      rate_limit_per_minute: 999,
      rate_limit_per_hour: 9999,
      concurrent_requests: 10,
      max_input_length: 10000,
      max_output_length: 20000,
      api_access: true,
      priority_queue: false,
      advanced_models: false
    }
  }
}

/**
 * Open Source Version: Mock anonymous quota
 * Always allows requests
 */
function getMockAnonymousQuota(): QuotaResult {
  return {
    allowed: true,
    usage_count: 0,
    daily_limit: 999999,
    remaining: 999999
  }
}

/**
 * Open Source Version: Mock credits deduction
 * Always returns success without actual deduction
 */
function getMockDeductCredits(): DeductResult {
  return {
    success: true,
    balance_after: 999999,
    idempotent: false
  }
}

/**
 * Database client - use this for all database operations
 *
 * Open Source Version:
 * - Auth operations work normally
 * - Credits/quota operations return mock data
 */
export const db = {
  /**
   * Authentication methods (works normally)
   */
  get auth() {
    return getAdapter().auth
  },

  /**
   * Get user status - Open Source: Returns mock data
   */
  getUserStatus: async (_userId: string): Promise<UserStatus | null> => {
    // Open Source Version: Return mock status
    // Auth still works, but credits are unlimited
    console.log('[DB] Open Source Version: Returning mock user status')
    return getMockUserStatus()
  },

  /**
   * Check anonymous quota - Open Source: Always allows
   */
  checkAnonymousQuota: async (
    _identifier: string,
    _identifierType: 'ip' | 'fingerprint'
  ): Promise<QuotaResult | null> => {
    // Open Source Version: Always allow requests
    console.log('[DB] Open Source Version: Returning mock quota (unlimited)')
    return getMockAnonymousQuota()
  },

  /**
   * Deduct credits - Open Source: Mock success, no actual deduction
   */
  deductCredits: async (
    _userId: string,
    _amount: number,
    _idempotencyKey: string,
    _description: string,
    _metadata: Record<string, unknown>
  ): Promise<DeductResult | null> => {
    // Open Source Version: Return success without deduction
    console.log('[DB] Open Source Version: Mock credits deduction (no actual deduction)')
    return getMockDeductCredits()
  },

  /**
   * Check if database is configured
   */
  isConfigured: () => getAdapter().isConfigured(),

  /**
   * Get current database type
   */
  getType: () => env.database.type as DatabaseType,
}

// Default export
export default db
