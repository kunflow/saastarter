import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    if (!db.isConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Logged out successfully',
      })
    }

    const { error } = await db.auth.signOut()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
