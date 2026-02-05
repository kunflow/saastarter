// i18n Configuration
// Supports three modes:
// 1. Single language mode (I18N_ENABLED=false): No locale prefix in URLs
// 2. Multi-language manual translation: Customer translates messages/*.json
// 3. Multi-language auto translation: Use Lingo.dev CLI to translate

import { env } from '@/config/env'

// Parse supported locales from environment configuration
const parsedLocales = env.i18n.supportedLocales.split(',').map(l => l.trim()).filter(Boolean)

// Ensure default locale is in the list
if (!parsedLocales.includes(env.i18n.defaultLocale)) {
  parsedLocales.unshift(env.i18n.defaultLocale)
}

// Export configuration
export const locales = parsedLocales as string[]
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = env.i18n.defaultLocale

// i18n mode configuration
export const i18nConfig = {
  enabled: env.i18n.enabled,
  locales,
  defaultLocale,
  // When i18n is disabled, use 'never' to remove locale prefix from URLs
  // When enabled, use 'as-needed' to show prefix only for non-default locales
  localePrefix: env.i18n.enabled ? ('as-needed' as const) : ('never' as const),
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale)
}
