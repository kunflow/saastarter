/**
 * Database Abstraction Layer - Type Definitions
 * Provides unified interfaces for different database backends
 */

// User types
export interface DbUser {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  locale: string
  timezone: string
  created_at: string
}

// Session types
export interface DbSession {
  access_token: string
  refresh_token?: string
  expires_at: number
  user: DbUser
}

// Auth result types
export interface AuthResult<T = unknown> {
  data: T | null
  error: AuthError | null
}

export interface AuthError {
  message: string
  code?: string
}

// User status types (from get_user_status RPC)
export interface UserStatus {
  user: {
    id: string
    email: string
    display_name: string
    avatar_url: string | null
    locale: string
    timezone: string
  }
  plan: {
    slug: 'free' | 'pro'
    name: string
    status: string
    current_period_start?: string
    current_period_end?: string
    cancel_at_period_end?: boolean
  }
  entitlements: Record<string, number | boolean | string>
  credits: {
    balance: number
    total_earned: number
    total_spent: number
  }
}

// Quota check result
export interface QuotaResult {
  allowed: boolean
  usage_count: number
  daily_limit: number
  remaining: number
}

// Credit deduction result
export interface DeductResult {
  success: boolean
  balance_after: number
  idempotent: boolean
  error?: string
}

// Database adapter interface
export interface DatabaseAdapter {
  // Auth methods
  auth: {
    getUser(): Promise<AuthResult<DbUser>>
    signUp(email: string, password: string): Promise<AuthResult<{ user: DbUser; session: DbSession }>>
    signIn(email: string, password: string): Promise<AuthResult<{ user: DbUser; session: DbSession }>>
    signOut(): Promise<AuthResult<void>>
  }

  // Database methods
  getUserStatus(userId: string): Promise<UserStatus | null>
  checkAnonymousQuota(identifier: string, identifierType: 'ip' | 'fingerprint'): Promise<QuotaResult | null>
  deductCredits(
    userId: string,
    amount: number,
    idempotencyKey: string,
    description: string,
    metadata: Record<string, unknown>
  ): Promise<DeductResult | null>

  // Connection status
  isConfigured(): boolean
}

// Database type
export type DatabaseType = 'supabase' | 'postgresql' | 'mysql'
