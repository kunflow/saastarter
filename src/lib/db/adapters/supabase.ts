/**
 * Supabase Database Adapter
 * Uses Supabase client for auth and database operations
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
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

// Create Supabase client for server-side operations
async function createClient() {
  if (!env.supabase.isConfigured) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient(env.supabase.url, env.supabase.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component cannot set cookies
        }
      },
    },
  })
}

// Create Supabase client with service role for admin operations
async function createServiceClient() {
  if (!env.supabase.isServiceConfigured) {
    return null
  }

  return createServerClient(env.supabase.url, env.supabase.serviceRoleKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // Service client doesn't need cookies
      },
    },
  })
}

export class SupabaseAdapter implements DatabaseAdapter {
  auth = {
    async getUser(): Promise<AuthResult<DbUser>> {
      const supabase = await createClient()
      if (!supabase) {
        return { data: null, error: { message: 'Database not configured' } }
      }

      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        return { data: null, error: error ? { message: error.message } : null }
      }

      return {
        data: {
          id: data.user.id,
          email: data.user.email || '',
          display_name: data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || '',
          avatar_url: data.user.user_metadata?.avatar_url || null,
          locale: data.user.user_metadata?.locale || 'en',
          timezone: data.user.user_metadata?.timezone || 'UTC',
          created_at: data.user.created_at,
        },
        error: null,
      }
    },

    async signUp(email: string, password: string): Promise<AuthResult<{ user: DbUser; session: DbSession }>> {
      const supabase = await createClient()
      if (!supabase) {
        return { data: null, error: { message: 'Database not configured' } }
      }

      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error || !data.user || !data.session) {
        return { data: null, error: error ? { message: error.message } : null }
      }

      return {
        data: {
          user: {
            id: data.user.id,
            email: data.user.email || '',
            display_name: data.user.user_metadata?.display_name || email.split('@')[0],
            avatar_url: null,
            locale: 'en',
            timezone: 'UTC',
            created_at: data.user.created_at,
          },
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at || 0,
            user: {
              id: data.user.id,
              email: data.user.email || '',
              display_name: email.split('@')[0],
              avatar_url: null,
              locale: 'en',
              timezone: 'UTC',
              created_at: data.user.created_at,
            },
          },
        },
        error: null,
      }
    },

    async signIn(email: string, password: string): Promise<AuthResult<{ user: DbUser; session: DbSession }>> {
      const supabase = await createClient()
      if (!supabase) {
        return { data: null, error: { message: 'Database not configured' } }
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data.user || !data.session) {
        return { data: null, error: error ? { message: error.message } : null }
      }

      return {
        data: {
          user: {
            id: data.user.id,
            email: data.user.email || '',
            display_name: data.user.user_metadata?.display_name || email.split('@')[0],
            avatar_url: data.user.user_metadata?.avatar_url || null,
            locale: data.user.user_metadata?.locale || 'en',
            timezone: data.user.user_metadata?.timezone || 'UTC',
            created_at: data.user.created_at,
          },
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at || 0,
            user: {
              id: data.user.id,
              email: data.user.email || '',
              display_name: data.user.user_metadata?.display_name || email.split('@')[0],
              avatar_url: data.user.user_metadata?.avatar_url || null,
              locale: data.user.user_metadata?.locale || 'en',
              timezone: data.user.user_metadata?.timezone || 'UTC',
              created_at: data.user.created_at,
            },
          },
        },
        error: null,
      }
    },

    async signOut(): Promise<AuthResult<void>> {
      const supabase = await createClient()
      if (!supabase) {
        return { data: null, error: { message: 'Database not configured' } }
      }

      const { error } = await supabase.auth.signOut()
      return { data: undefined, error: error ? { message: error.message } : null }
    },
  }

  async getUserStatus(userId: string): Promise<UserStatus | null> {
    const supabase = await createClient()
    if (!supabase) return null

    const { data, error } = await supabase.rpc('get_user_status', {
      p_user_id: userId,
    })

    if (error || data?.error) {
      console.error('Error fetching user status:', error || data?.error)
      return null
    }

    return data as UserStatus
  }

  async checkAnonymousQuota(identifier: string, identifierType: 'ip' | 'fingerprint'): Promise<QuotaResult | null> {
    const serviceClient = await createServiceClient()
    if (!serviceClient) return null

    const { data } = await serviceClient.rpc('check_anonymous_quota', {
      p_identifier: identifier,
      p_identifier_type: identifierType,
    })

    return data as QuotaResult | null
  }

  async deductCredits(
    userId: string,
    amount: number,
    idempotencyKey: string,
    description: string,
    metadata: Record<string, unknown>
  ): Promise<DeductResult | null> {
    const serviceClient = await createServiceClient()
    if (!serviceClient) return null

    const { data, error } = await serviceClient.rpc('deduct_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_idempotency_key: idempotencyKey,
      p_description: description,
      p_metadata: metadata,
    })

    if (error) {
      console.error('Error deducting credits:', error)
      return null
    }

    return data as DeductResult
  }

  isConfigured(): boolean {
    return env.supabase.isConfigured
  }
}
