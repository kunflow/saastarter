'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/components/auth'
import { Header, Footer } from '@/components/layout'
import type { Locale } from '@/lib/i18n/config'

interface ProvidersProps {
  children: ReactNode
  locale?: Locale
}

export function Providers({ children, locale = 'en' }: ProvidersProps) {
  return (
    <AuthProvider>
      <Header locale={locale} />
      <main className="min-h-[calc(100vh-8rem)]">
        {children}
      </main>
      <Footer locale={locale} />
    </AuthProvider>
  )
}
