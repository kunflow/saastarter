'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { TextToEmojiDemo } from '@/components/demo'
import { Button } from '@/components/ui'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center px-4 py-16">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('home.title')}
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          {t('home.subtitle')}
        </p>
      </div>

      {/* Demo Section */}
      <div className="mb-12 w-full max-w-md">
        <TextToEmojiDemo />
      </div>

      {/* CTA Section */}
      <div className="flex gap-4">
        <Link href="/signup">
          <Button size="lg">
            {t('home.getStarted')}
          </Button>
        </Link>
        <Link href="/pricing">
          <Button variant="outline" size="lg">
            {t('nav.pricing')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
