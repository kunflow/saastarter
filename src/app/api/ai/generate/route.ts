import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getEmojiForText, aiConfig } from '@/lib/ai/config'
import { creditsConfig } from '@/config/credits'

export const runtime = 'nodejs'

interface GenerateRequest {
  text: string
  idempotencyKey?: string
}

// Mock quota storage for development without Supabase
// Key: IP address, Value: { count: number, date: string (YYYY-MM-DD) }
const mockQuotaStore = new Map<string, { count: number; date: string }>()

function getMockQuota(ip: string): { allowed: boolean; usage_count: number; daily_limit: number; remaining: number } {
  const today = new Date().toISOString().split('T')[0]
  const dailyLimit = creditsConfig.anonymousQuota.dailyLimit

  const existing = mockQuotaStore.get(ip)

  // Reset if new day
  if (!existing || existing.date !== today) {
    mockQuotaStore.set(ip, { count: 1, date: today })
    return {
      allowed: true,
      usage_count: 1,
      daily_limit: dailyLimit,
      remaining: dailyLimit - 1
    }
  }

  // Check if quota exceeded
  if (existing.count >= dailyLimit) {
    return {
      allowed: false,
      usage_count: existing.count,
      daily_limit: dailyLimit,
      remaining: 0
    }
  }

  // Increment usage
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

    const supabase = await createClient()
    let user = null

    if (supabase) {
      const { data } = await supabase.auth.getUser()
      user = data.user
    }

    // Handle anonymous users with IP-based quota
    if (!user) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                 request.headers.get('x-real-ip') ||
                 '127.0.0.1'

      const serviceClient = await createServiceClient()

      // If no service client, use mock quota
      if (!serviceClient) {
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

      const { data: quotaResult } = await serviceClient.rpc('check_anonymous_quota', {
        p_identifier: ip,
        p_identifier_type: 'ip'
      })

      if (!quotaResult?.allowed) {
        return NextResponse.json(
          {
            error: 'Daily quota exceeded',
            quota: quotaResult
          },
          { status: 429 }
        )
      }

      // Generate emoji for anonymous user
      const emoji = await generateEmoji(text)

      return createStreamingResponse(emoji, {
        anonymous: true,
        quota: quotaResult
      })
    }

    // For authenticated users, check and deduct credits
    const serviceClient = await createServiceClient()

    if (!serviceClient) {
      // Fallback to mock mode
      console.log('[AI Generate] No service client - running in mock mode, credits not deducted')
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
    const { data: deductResult, error: deductError } = await serviceClient.rpc('deduct_credits', {
      p_user_id: user.id,
      p_amount: creditsConfig.creditPerGeneration,
      p_idempotency_key: key,
      p_description: `Text to emoji: ${text.slice(0, 50)}`,
      p_metadata: { text, type: 'text_to_emoji' }
    })
    console.log('[AI Generate] Deduct result:', deductResult, 'Error:', deductError)

    if (!deductResult?.success) {
      return NextResponse.json(
        {
          error: deductResult?.error || 'Failed to deduct credits',
          balance: deductResult?.balance
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
  // In mock mode or without AI provider, use local mapping
  if (aiConfig.mockMode || aiConfig.provider === 'mock') {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500))
    return getEmojiForText(text)
  }

  // TODO: Integrate with actual AI provider (OpenAI, Anthropic, etc.)
  // For now, fallback to mock
  return getEmojiForText(text)
}

function createStreamingResponse(
  emoji: string,
  metadata: { anonymous: boolean; quota?: unknown; credits?: unknown }
): Response {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      // Simulate streaming by sending character by character
      for (const char of emoji) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: char })}\n\n`))
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Send completion with metadata
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
