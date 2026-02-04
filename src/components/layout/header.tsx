'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui'
import { useAuth } from '@/components/auth/auth-provider'
import { siteConfig } from '@/config/site'

export function Header() {
  const { t, locale, setLocale } = useTranslation()
  const { user, loading, logout } = useAuth()

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'zh' : 'en')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">{siteConfig.brand.logo}</span>
            <span className="hidden sm:inline">{siteConfig.brand.name}</span>
          </Link>

          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link href="/" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              {t('nav.home')}
            </Link>
            <Link href="/pricing" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              {t('nav.pricing')}
            </Link>
            <Link href="/faq" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              {t('nav.faq')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLocale}
            className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {locale === 'en' ? '中文' : 'EN'}
          </button>

          {loading ? (
            <div className="h-8 w-16 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  {t('nav.dashboard')}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                {t('nav.logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  {t('nav.signup')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
