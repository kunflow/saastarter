'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserStatus {
  user: {
    id: string
    email: string
    display_name: string
    avatar_url: string | null
  }
  plan: {
    slug: 'free' | 'pro'
    name: string
    status: string
  }
  entitlements: Record<string, number | boolean>
  credits: {
    balance: number
    total_earned: number
    total_spent: number
  }
}

interface AuthContextType {
  user: User | null
  userStatus: UserStatus | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (email: string, password: string, displayName?: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  refreshUserStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null)
  const [loading, setLoading] = useState(!!supabase)

  const fetchUserStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/user/status')
      if (res.ok) {
        const data = await res.json()
        setUserStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch user status:', error)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      return
    }

    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        await fetchUserStatus()
      }

      setLoading(false)
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserStatus()
      } else {
        setUserStatus(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchUserStatus])

  const login = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Supabase not configured' }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { error: error.message }
    }
    return {}
  }, [supabase])

  const signup = useCallback(async (email: string, password: string, displayName?: string) => {
    if (!supabase) {
      return { error: 'Supabase not configured' }
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName || email.split('@')[0],
        },
      },
    })
    if (error) {
      return { error: error.message }
    }
    return {}
  }, [supabase])

  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setUserStatus(null)
  }, [supabase])

  const refreshUserStatus = useCallback(async () => {
    if (user) {
      await fetchUserStatus()
    }
  }, [user, fetchUserStatus])

  const value = useMemo(() => ({
    user,
    userStatus,
    loading,
    login,
    signup,
    logout,
    refreshUserStatus,
  }), [user, userStatus, loading, login, signup, logout, refreshUserStatus])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
