/**
 * Database Abstraction Layer
 * Unified entry point for database operations
 *
 * Usage:
 *   import { db } from '@/lib/db'
 *
 *   // Auth operations
 *   const { data: user } = await db.auth.getUser()
 *
 *   // Database operations
 *   const status = await db.getUserStatus(userId)
 */

import { env } from '@/config/env'
import { SupabaseAdapter } from './adapters/supabase'
import { PostgreSQLAdapter } from './adapters/postgresql'
import { MySQLAdapter } from './adapters/mysql'
import type { DatabaseAdapter, DatabaseType } from './types'

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
 * Database client - use this for all database operations
 *
 * @example
 * ```typescript
 * import { db } from '@/lib/db'
 *
 * // Get current user
 * const { data: user, error } = await db.auth.getUser()
 *
 * // Get user status
 * const status = await db.getUserStatus(userId)
 *
 * // Check anonymous quota
 * const quota = await db.checkAnonymousQuota(ip, 'ip')
 *
 * // Deduct credits
 * const result = await db.deductCredits(userId, 1, key, 'description', {})
 * ```
 */
export const db = {
  /**
   * Authentication methods
   */
  get auth() {
    return getAdapter().auth
  },

  /**
   * Get user status including plan, credits, and entitlements
   */
  getUserStatus: (userId: string) => getAdapter().getUserStatus(userId),

  /**
   * Check anonymous user quota
   */
  checkAnonymousQuota: (identifier: string, identifierType: 'ip' | 'fingerprint') =>
    getAdapter().checkAnonymousQuota(identifier, identifierType),

  /**
   * Deduct credits from user balance
   */
  deductCredits: (
    userId: string,
    amount: number,
    idempotencyKey: string,
    description: string,
    metadata: Record<string, unknown>
  ) => getAdapter().deductCredits(userId, amount, idempotencyKey, description, metadata),

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
