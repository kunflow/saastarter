'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'

export default function PricingContent() {
  const { t } = useTranslation()

  const plans = [
    {
      key: 'free',
      features: [
        '100 credits on signup',
        '5 requests per minute',
        'Basic AI models',
        'Community support',
      ],
      popular: false,
    },
    {
      key: 'pro',
      features: [
        '1000 credits per month',
        '20 requests per minute',
        'Advanced AI models',
        'Priority support',
        'API access',
      ],
      popular: true,
    },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold">{t('pricing.title')}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t('pricing.subtitle')}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.key}
            className={plan.popular ? 'border-2 border-violet-500 shadow-lg' : ''}
          >
            {plan.popular && (
              <div className="bg-violet-500 py-1 text-center text-sm font-medium text-white">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">
                {t(`pricing.${plan.key}.name`)}
              </CardTitle>
              <CardDescription>
                {t(`pricing.${plan.key}.description`)}
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{t(`pricing.${plan.key}.price`)}</span>
                <span className="text-zinc-500">{t(`pricing.${plan.key}.period`)}</span>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Link href={plan.key === 'free' ? '/signup' : '/signup'} className="w-full">
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {t(`pricing.${plan.key}.cta`)}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
