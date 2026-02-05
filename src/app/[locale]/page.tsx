'use client'

import { useTranslations } from 'next-intl'
import { TextToEmojiDemo } from '@/components/demo'
import { Button } from '@/components/ui'
import { Link } from '@/lib/i18n/navigation'

export default function HomePage() {
  const t = useTranslations('home')
  const tNav = useTranslations('nav')

  return (
    <div className="flex flex-col items-center px-4 py-16">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          {t('description')}
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
            {t('getStarted')}
          </Button>
        </Link>
        <Link href="/pricing">
          <Button variant="outline" size="lg">
            {tNav('pricing')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
