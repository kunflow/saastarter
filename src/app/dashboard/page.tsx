'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/components/auth'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user, userStatus, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" />
      </div>
    )
  }

  if (!user || !userStatus) {
    return null
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">{t('dashboard.title')}</h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        {t('dashboard.welcome')}, {userStatus.user.display_name}!
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📋</span>
              {t('dashboard.subscription.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{t('dashboard.subscription.currentPlan')}</span>
              <Badge variant={userStatus.plan.slug === 'pro' ? 'success' : 'default'}>
                {userStatus.plan.name}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{t('dashboard.subscription.status')}</span>
              <Badge variant="info">{userStatus.plan.status}</Badge>
            </div>
            {userStatus.plan.slug === 'free' && (
              <button className="w-full rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 py-2 text-sm font-medium text-white hover:from-violet-600 hover:to-purple-700">
                {t('dashboard.subscription.upgrade')}
              </button>
            )}
          </CardContent>
        </Card>

        {/* Entitlements Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎁</span>
              {t('dashboard.entitlements.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{t('dashboard.entitlements.monthlyCredits')}</span>
              <span className="font-medium">{userStatus.entitlements.monthly_credits || 100}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{t('dashboard.entitlements.rateLimit')}</span>
              <span className="font-medium">{userStatus.entitlements.rate_limit_per_minute || 5}/min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{t('dashboard.entitlements.apiAccess')}</span>
              <Badge variant={userStatus.entitlements.api_access ? 'success' : 'default'}>
                {userStatus.entitlements.api_access ? '✓' : '✗'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{t('dashboard.entitlements.advancedModels')}</span>
              <Badge variant={userStatus.entitlements.advanced_models ? 'success' : 'default'}>
                {userStatus.entitlements.advanced_models ? '✓' : '✗'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Credits Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💰</span>
              {t('dashboard.credits.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-800/50">
              <p className="text-sm text-zinc-500">{t('dashboard.credits.balance')}</p>
              <p className="text-3xl font-bold">{userStatus.credits.balance}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-zinc-500">{t('dashboard.credits.totalEarned')}</p>
                <p className="font-medium text-green-600">{userStatus.credits.total_earned}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">{t('dashboard.credits.totalSpent')}</p>
                <p className="font-medium text-red-600">{userStatus.credits.total_spent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
