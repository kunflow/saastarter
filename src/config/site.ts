/**
 * Site Configuration
 * Brand, contact, legal, and feature settings
 *
 * Priority: Environment variables > Config values > Defaults
 */

export const siteConfig = {
  // Brand
  brand: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Next-AI SaaS',
    logo: '✨', // emoji or image path (e.g., '/logo.svg')
    tagline: 'AI-Powered SaaS Starter',
  },

  // Contact
  contact: {
    email: 'support@example.com',
    twitter: '', // @handle or empty
    github: '', // repository URL or empty
  },

  // Legal
  legal: {
    companyName: 'Your Company',
    privacyUrl: '/legal#privacy',
    termsUrl: '/legal#terms',
  },

  // Feature toggles
  features: {
    enableDemoOnHome: true,
    showCreditsInHeader: true,
  },
} as const

// Type for site config
export type SiteConfig = typeof siteConfig
