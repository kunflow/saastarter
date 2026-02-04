import { MetadataRoute } from 'next'
import { env } from '@/config/env'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.app.url

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/readme/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
