import { MetadataRoute } from 'next'
import { env } from '@/config/env'
import { locales } from '@/lib/i18n/config'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.app.url

  // Generate disallow rules for all locales
  const disallowRules = locales.flatMap(locale => [
    `/${locale}/dashboard/`,
    `/${locale}/readme/`,
  ])

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          ...disallowRules,
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
