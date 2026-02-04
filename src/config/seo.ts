/**
 * SEO Configuration
 * Default SEO, OpenGraph, Twitter, and page-specific settings
 *
 * Priority: Environment variables > Config values > Defaults
 */

import { siteConfig } from './site'

// Parse keywords from environment variable (comma-separated)
const defaultKeywords = process.env.NEXT_PUBLIC_SEO_KEYWORDS
  ? process.env.NEXT_PUBLIC_SEO_KEYWORDS.split(',').map(k => k.trim())
  : ['AI', 'SaaS', 'Text to Emoji', 'AI Generation', 'Streaming']

export const seoConfig = {
  // Default SEO
  default: {
    title: process.env.NEXT_PUBLIC_SEO_TITLE || 'AI-Powered Text to Emoji',
    description: process.env.NEXT_PUBLIC_SEO_DESCRIPTION || 'Transform your text into expressive emojis instantly with AI',
    keywords: defaultKeywords,
  },

  // OpenGraph
  openGraph: {
    type: 'website' as const,
    locale: process.env.NEXT_PUBLIC_OG_LOCALE || 'en_US',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image' as const,
    site: process.env.NEXT_PUBLIC_TWITTER_SITE || '', // @handle or empty
    creator: process.env.NEXT_PUBLIC_TWITTER_CREATOR || '', // @handle or empty
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
}

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
