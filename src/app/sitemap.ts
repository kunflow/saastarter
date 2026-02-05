import { MetadataRoute } from 'next'
import { env } from '@/config/env'
import { locales, defaultLocale } from '@/lib/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.app.url
  const now = new Date()

  // Public routes that should be indexed
  const routes = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/pricing', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/faq', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/legal', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: '/login', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/signup', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  // Generate sitemap entries for all locales
  const sitemapEntries: MetadataRoute.Sitemap = routes.flatMap(route => {
    return locales.map(locale => {
      const url = `${baseUrl}/${locale}${route.path}`

      // Generate alternates for hreflang
      const alternates: { languages: Record<string, string> } = {
        languages: {},
      }

      locales.forEach(l => {
        alternates.languages[l] = `${baseUrl}/${l}${route.path}`
      })

      // Add x-default pointing to default locale
      alternates.languages['x-default'] = `${baseUrl}/${defaultLocale}${route.path}`

      return {
        url,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates,
      }
    })
  })

  return sitemapEntries
}
