'use client'

import { useSyncExternalStore } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui'
import { useAuth } from '@/components/auth/auth-provider'
import { siteConfig } from '@/config/site'
import { i18nConfig, type Locale } from '@/lib/i18n/config'
import { Link, useRouter, usePathname } from '@/lib/i18n/navigation'

// Hook to detect client-side mounting without triggering lint warnings
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
}

interface HeaderProps {
  locale: Locale
}

function Logo() {
  const logo = siteConfig.brand.logo
  const isImagePath = logo.startsWith('/') || logo.startsWith('http')

  if (isImagePath) {
    return (
      <Image
        src={logo}
        alt={siteConfig.brand.name}
        width={28}
        height={28}
        className="h-7 w-7"
        priority
      />
    )
  }

  return <span className="text-xl">{logo}</span>
}

// Separate components to avoid hooks order issues
function AuthLoading() {
  return <div className="h-8 w-16 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
}

function AuthLoggedIn({ onLogout }: { onLogout: () => void }) {
  const t = useTranslations('nav')
  return (
    <div className="flex items-center gap-3">
      <Link href="/dashboard">
        <Button variant="ghost" size="sm">
          {t('dashboard')}
        </Button>
      </Link>
      <Button variant="outline" size="sm" onClick={onLogout}>
        {t('logout')}
      </Button>
    </div>
  )
}

function AuthLoggedOut() {
  const t = useTranslations('nav')
  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="ghost" size="sm">
          {t('login')}
        </Button>
      </Link>
      <Link href="/signup">
        <Button size="sm">
          {t('signup')}
        </Button>
      </Link>
    </div>
  )
}

export function Header({ locale }: HeaderProps) {
  const mounted = useIsMounted()
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('nav')

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'zh' : 'en'
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo />
            <span className="hidden sm:inline">{siteConfig.brand.name}</span>
          </Link>

          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link href="/" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              {t('home')}
            </Link>
            <Link href="/pricing" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              {t('pricing')}
            </Link>
            <Link href="/faq" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              {t('faq')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Language switcher - only show when i18n is enabled */}
          {i18nConfig.enabled && (
            <button
              onClick={toggleLocale}
              className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              {locale === 'en' ? '中文' : 'EN'}
            </button>
          )}

          {!mounted || loading ? (
            <AuthLoading />
          ) : user ? (
            <AuthLoggedIn onLogout={logout} />
          ) : (
            <AuthLoggedOut />
          )}
        </div>
      </div>
    </header>
  )
}
