/**
 * SEO Configuration
 * Default SEO, OpenGraph, Twitter, and page-specific settings
 */

import { siteConfig } from './site'

export const seoConfig = {
  // Default SEO
  default: {
    title: 'AI-Powered Text to Emoji',
    description: 'Transform your text into expressive emojis instantly with AI',
    keywords: ['AI', 'SaaS', 'Text to Emoji', 'AI Generation', 'Streaming'],
  },

  // OpenGraph
  openGraph: {
    type: 'website' as const,
    locale: 'en_US',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image' as const,
    site: '', // @handle or empty
    creator: '', // @handle or empty
  },

  // Page-specific SEO
  pages: {
    pricing: {
      title: 'Pricing',
      description: 'Simple, transparent pricing. Choose the plan that works for you.',
    },
    faq: {
      title: 'FAQ',
      description: 'Frequently asked questions about our AI-powered services.',
    },
    legal: {
      title: 'Legal',
      description: 'Terms of Service and Privacy Policy.',
    },
  },
} as const

// Helper to generate full title
export function getFullTitle(pageTitle?: string): string {
  const brandName = siteConfig.brand.name
  if (!pageTitle) {
    return `${brandName} - ${seoConfig.default.title}`
  }
  return `${pageTitle} | ${brandName}`
}

// Type for SEO config
export type SeoConfig = typeof seoConfig
