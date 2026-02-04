import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getEmojiForText, aiConfig } from '@/lib/ai/config'
import { creditsConfig } from '@/config/credits'

export const runtime = 'nodejs'

interface GenerateRequest {
  text: string
  idempotencyKey?: string
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
      const serviceClient = await createServiceClient()

      // If no service client, allow generation in mock mode only
      if (!serviceClient) {
        const emoji = await generateEmoji(text)
        return createStreamingResponse(emoji, {
          anonymous: true,
          quota: { usage_count: 1, daily_limit: 3, remaining: 2 }
        })
      }

      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                 request.headers.get('x-real-ip') ||
                 'unknown'

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
      const emoji = await generateEmoji(text)
      return createStreamingResponse(emoji, {
        anonymous: false,
        credits: { balance: 99, deducted: 1, idempotent: false }
      })
    }

    // Generate idempotency key if not provided
    const key = idempotencyKey || `gen_${user.id}_${Date.now()}_${Math.random().toString(36).slice(2)}`

    // Deduct credits
    const { data: deductResult } = await serviceClient.rpc('deduct_credits', {
      p_user_id: user.id,
      p_amount: creditsConfig.creditPerGeneration,
      p_idempotency_key: key,
      p_description: `Text to emoji: ${text.slice(0, 50)}`,
      p_metadata: { text, type: 'text_to_emoji' }
    })

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
