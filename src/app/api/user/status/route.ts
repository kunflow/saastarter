import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export type { UserStatus } from '@/lib/db'

export async function GET() {
  try {
    if (!db.isConfigured()) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Get current user
    const { data: user, error: authError } = await db.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user status
    const status = await db.getUserStatus(user.id)

    if (!status) {
      return NextResponse.json(
        { error: 'Failed to fetch user status' },
        { status: 500 }
      )
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('User status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
