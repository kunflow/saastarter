import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '@/config/env'

/**
 * Create Supabase client with service role for admin operations
 * Use this for operations that need to bypass RLS
 */
export async function createServiceClient() {
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

/**
 * Create Supabase client for server-side operations
 * Uses the user's session from cookies
 */
export async function createClient() {
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
          // Server Component 中无法设置 cookie
        }
      },
    },
  })
}
