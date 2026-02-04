'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { siteConfig } from '@/config/site'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="text-lg">{siteConfig.brand.logo}</span>
            <span>{siteConfig.brand.name}</span>
          </div>

          <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('nav.pricing')}
            </Link>
            <Link href="/faq" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('nav.faq')}
            </Link>
            <Link href="/legal" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('nav.legal')}
            </Link>
          </nav>

          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} {siteConfig.legal.companyName}
          </p>
        </div>
      </div>
    </footer>
  )
}
