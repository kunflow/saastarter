import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

export async function GET() {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Call get_user_status function
    const { data, error } = await supabase.rpc('get_user_status', {
      p_user_id: user.id,
    })

    if (error) {
      console.error('Error fetching user status:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user status' },
        { status: 500 }
      )
    }

    // Check for error in response
    if (data?.error) {
      return NextResponse.json(
        { error: data.error },
        { status: 404 }
      )
    }

    return NextResponse.json(data as UserStatus)
  } catch (error) {
    console.error('User status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
