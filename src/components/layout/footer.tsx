'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { siteConfig } from '@/config/site'
import { Link } from '@/lib/i18n/navigation'
import type { Locale } from '@/lib/i18n/config'

interface FooterProps {
  locale: Locale
}

function Logo() {
  const logo = siteConfig.brand.logo

  // Check if logo is an image path (starts with / or http)
  const isImagePath = logo.startsWith('/') || logo.startsWith('http')

  if (isImagePath) {
    return (
      <Image
        src={logo}
        alt={siteConfig.brand.name}
        width={20}
        height={20}
        className="h-5 w-5"
      />
    )
  }

  // Fallback to emoji/text
  return <span className="text-lg">{logo}</span>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Footer(_props: FooterProps) {
  const t = useTranslations('nav')

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Logo />
            <span>{siteConfig.brand.name}</span>
          </div>

          <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('pricing')}
            </Link>
            <Link href="/faq" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('faq')}
            </Link>
            <Link href="/legal" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('legal')}
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
