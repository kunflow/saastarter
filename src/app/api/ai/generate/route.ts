import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getEmojiForText, aiConfig } from '@/lib/ai/config'
import { creditsConfig } from '@/config/credits'

export const runtime = 'nodejs'

interface GenerateRequest {
  text: string
  idempotencyKey?: string
}

// Mock quota storage for development without database
const mockQuotaStore = new Map<string, { count: number; date: string }>()

function getMockQuota(ip: string): { allowed: boolean; usage_count: number; daily_limit: number; remaining: number } {
  const today = new Date().toISOString().split('T')[0]
  const dailyLimit = creditsConfig.anonymousQuota.dailyLimit

  const existing = mockQuotaStore.get(ip)

  if (!existing || existing.date !== today) {
    mockQuotaStore.set(ip, { count: 1, date: today })
    return {
      allowed: true,
      usage_count: 1,
      daily_limit: dailyLimit,
      remaining: dailyLimit - 1
    }
  }

  if (existing.count >= dailyLimit) {
    return {
      allowed: false,
      usage_count: existing.count,
      daily_limit: dailyLimit,
      remaining: 0
    }
  }

  existing.count += 1
  mockQuotaStore.set(ip, existing)

  return {
    allowed: true,
    usage_count: existing.count,
    daily_limit: dailyLimit,
    remaining: dailyLimit - existing.count
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { text, idempotencyKey } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    if (text.length > 100) {
      return NextResponse.json(
        { error: 'Text is too long (max 100 characters)' },
        { status: 400 }
      )
    }

    // Try to get current user
    let user = null
    if (db.isConfigured()) {
      const { data } = await db.auth.getUser()
      user = data
    }

    // Handle anonymous users with IP-based quota
    if (!user) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                 request.headers.get('x-real-ip') ||
                 '127.0.0.1'

      // Try database quota check first
      if (db.isConfigured()) {
        const quotaResult = await db.checkAnonymousQuota(ip, 'ip')

        if (quotaResult && !quotaResult.allowed) {
          return NextResponse.json(
            {
              error: 'Daily quota exceeded',
              quota: quotaResult
            },
            { status: 429 }
          )
        }

        if (quotaResult) {
          const emoji = await generateEmoji(text)
          return createStreamingResponse(emoji, {
            anonymous: true,
            quota: quotaResult
          })
        }
      }

      // Fallback to mock quota
      const mockQuota = getMockQuota(ip)
      console.log('[AI Generate] Mock mode - IP:', ip, 'Quota:', mockQuota)

      if (!mockQuota.allowed) {
        return NextResponse.json(
          {
            error: 'Daily quota exceeded',
            quota: mockQuota
          },
          { status: 429 }
        )
      }

      const emoji = await generateEmoji(text)
      return createStreamingResponse(emoji, {
        anonymous: true,
        quota: mockQuota
      })
    }

    // For authenticated users, check and deduct credits
    if (!db.isConfigured()) {
      // Fallback to mock mode
      console.log('[AI Generate] No database - running in mock mode, credits not deducted')
      const emoji = await generateEmoji(text)
      return createStreamingResponse(emoji, {
        anonymous: false,
        credits: { balance: 99, deducted: 1, idempotent: false }
      })
    }

    // Generate idempotency key if not provided
    const key = idempotencyKey || `gen_${user.id}_${Date.now()}_${Math.random().toString(36).slice(2)}`

    // Deduct credits
    console.log('[AI Generate] Deducting credits for user:', user.id)
    const deductResult = await db.deductCredits(
      user.id,
      creditsConfig.creditPerGeneration,
      key,
      `Text to emoji: ${text.slice(0, 50)}`,
      { text, type: 'text_to_emoji' }
    )
    console.log('[AI Generate] Deduct result:', deductResult)

    if (!deductResult?.success) {
      return NextResponse.json(
        {
          error: deductResult?.error || 'Failed to deduct credits',
          balance: deductResult?.balance_after
        },
        { status: 402 }
      )
    }

    // Generate emoji
    const emoji = await generateEmoji(text)

    return createStreamingResponse(emoji, {
      anonymous: false,
      credits: {
        balance: deductResult.balance_after,
        deducted: creditsConfig.creditPerGeneration,
        idempotent: deductResult.idempotent
      }
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateEmoji(text: string): Promise<string> {
  if (aiConfig.mockMode || aiConfig.provider === 'mock') {
    await new Promise(resolve => setTimeout(resolve, 500))
    return getEmojiForText(text)
  }

  // TODO: Integrate with actual AI provider
  return getEmojiForText(text)
}

function createStreamingResponse(
  emoji: string,
  metadata: { anonymous: boolean; quota?: unknown; credits?: unknown }
): Response {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for (const char of emoji) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: char })}\n\n`))
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
        type: 'done',
        content: emoji,
        ...metadata
      })}\n\n`))

      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
