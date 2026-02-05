'use client'

import { useTranslations } from 'next-intl'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'
import { Link } from '@/lib/i18n/navigation'

function FreePlanCard() {
  const t = useTranslations('pricing.free')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t('name')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{t('price')}</span>
          <span className="text-zinc-500">{t('period')}</span>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          <li className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✓</span>
            {t('features.credits')}
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✓</span>
            {t('features.rateLimit')}
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✓</span>
            {t('features.models')}
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✓</span>
            {t('features.support')}
          </li>
        </ul>
      </CardContent>

      <CardFooter>
        <Link href="/signup" className="w-full">
          <Button variant="outline" className="w-full">
            {t('cta')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function ProPlanCard() {
  const t = useTranslations('pricing.pro')

  return (
    <Card className="border-2 border-violet-500 shadow-lg">
      <div className="bg-violet-500 py-1 text-center text-sm font-medium text-white">
        {t('badge')}
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{t('name')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{t('price')}</span>
          <span className="text-zinc-500">{t('period')}</span>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          <li className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✓</span>
            {t('features.credits')}
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✓</span>
            {t('features.rateLimit')}
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✓</span>
            {t('features.models')}
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✓</span>
            {t('features.support')}
          </li>
          <li className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✓</span>
            {t('features.api')}
          </li>
        </ul>
      </CardContent>

      <CardFooter>
        <Link href="/signup" className="w-full">
          <Button variant="primary" className="w-full">
            {t('cta')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function PricingContent() {
  const t = useTranslations('pricing')

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t('subtitle')}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <FreePlanCard />
        <ProPlanCard />
      </div>
    </div>
  )
}
