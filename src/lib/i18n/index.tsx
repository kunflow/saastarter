'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import en from '@/locales/en.json'
import zh from '@/locales/zh.json'

export type Locale = 'en' | 'zh'

type TranslationValue = string | Record<string, unknown>
type Translations = typeof en

const translations: Record<Locale, Translations> = { en, zh }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

function getNestedValue(obj: Record<string, unknown>, path: string): TranslationValue | undefined {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[key]
  }

  return current as TranslationValue
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale)
      document.documentElement.lang = newLocale
    }
  }, [])

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const value = getNestedValue(translations[locale] as unknown as Record<string, unknown>, key)

    if (typeof value !== 'string') {
      console.warn(`Translation key not found: ${key}`)
      return key
    }

    if (!params) return value

    return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
      return acc.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue))
    }, value)
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }
  return context
}
