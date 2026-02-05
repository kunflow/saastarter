/**
 * AI Generate API - Open Source Version
 *
 * This is the open source version of the AI generation endpoint.
 * It returns mock/demo data instead of calling real AI providers.
 *
 * For real AI capabilities, please upgrade to the Pro version.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getEmojiForText } from '@/lib/ai/config'

export const runtime = 'nodejs'

interface GenerateRequest {
  text: string
  idempotencyKey?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { text } = body

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

    // Open Source Version: Always use mock emoji generation
    // No credits check, no credits deduction, no real AI calls
    const emoji = await generateMockEmoji(text)

    return createStreamingResponse(emoji, {
      anonymous: true,
      openSource: true,
      message: 'Open Source Version - Demo Mode'
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Generate mock emoji response
 * Simulates a 1-2 second delay to mimic real AI processing
 */
async function generateMockEmoji(text: string): Promise<string> {
  // Simulate AI processing delay (1-2 seconds)
  const delay = 1000 + Math.random() * 1000
  await new Promise(resolve => setTimeout(resolve, delay))

  // Return emoji based on text (using local mapping)
  return getEmojiForText(text)
}

/**
 * Create streaming response for frontend compatibility
 * Maintains the same streaming format as the Pro version
 */
function createStreamingResponse(
  emoji: string,
  metadata: { anonymous: boolean; openSource: boolean; message: string }
): Response {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      // Stream each character with delay for typewriter effect
      for (const char of emoji) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: char })}\n\n`))
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Send completion message
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
