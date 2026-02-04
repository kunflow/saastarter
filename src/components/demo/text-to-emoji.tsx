'use client'

import { useState, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/components/auth'
import { Button, Input, Card, CardContent } from '@/components/ui'

interface GenerateResult {
  emoji: string
  anonymous?: boolean
  quota?: {
    usage_count: number
    daily_limit: number
    remaining: number
  }
  credits?: {
    balance: number
    deducted: number
  }
}

export function TextToEmojiDemo() {
  const { t } = useTranslation()
  const { user, userStatus, refreshUserStatus } = useAuth()

  const [input, setInput] = useState('')
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [streamingEmoji, setStreamingEmoji] = useState('')

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) return

    setLoading(true)
    setError('')
    setResult(null)
    setStreamingEmoji('')

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || t('errors.generic'))
        setLoading(false)
        return
      }

      // Handle SSE streaming
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        setError(t('errors.generic'))
        setLoading(false)
        return
      }

      let emoji = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'chunk') {
                emoji += data.content
                setStreamingEmoji(emoji)
              } else if (data.type === 'done') {
                setResult({
                  emoji: data.content,
                  anonymous: data.anonymous,
                  quota: data.quota,
                  credits: data.credits,
                })

                // Refresh user status to get updated credits
                if (user) {
                  await refreshUserStatus()
                }
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      console.error('Generate error:', err)
      setError(t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }, [input, t, user, refreshUserStatus])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="space-y-4 pt-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">{t('demo.title')}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {user ? (
              <span>{t('demo.credits')}: <strong>{userStatus?.credits.balance ?? '...'}</strong></span>
            ) : (
              <span>{t('demo.anonymousQuota')}</span>
            )}
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('demo.inputPlaceholder')}
            disabled={loading}
          />
          <Button onClick={handleGenerate} loading={loading} disabled={!input.trim()}>
            {loading ? t('demo.generating') : t('demo.generate')}
          </Button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {(streamingEmoji || result) && (
          <div className="rounded-lg bg-zinc-50 p-6 text-center dark:bg-zinc-800/50">
            <p className="mb-2 text-sm text-zinc-500">{t('demo.result')}</p>
            <div className="text-6xl">{streamingEmoji || result?.emoji}</div>

            {result && (
              <div className="mt-4 text-xs text-zinc-400">
                {result.anonymous && result.quota && (
                  <span>
                    {result.quota.remaining} / {result.quota.daily_limit} {t('demo.anonymousQuota')}
                  </span>
                )}
                {!result.anonymous && result.credits && (
                  <span>
                    -{result.credits.deducted} {t('demo.credits')} ({result.credits.balance} remaining)
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {!user && (
          <p className="text-center text-xs text-zinc-400">
            {t('demo.loginRequired')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
