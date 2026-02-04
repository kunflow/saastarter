'use client'

import { ReactNode } from 'react'
import { I18nProvider } from '@/lib/i18n'
import { AuthProvider } from '@/components/auth'
import { Header, Footer } from '@/components/layout'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <Header />
        <main className="min-h-[calc(100vh-8rem)]">
          {children}
        </main>
        <Footer />
      </AuthProvider>
    </I18nProvider>
  )
}
