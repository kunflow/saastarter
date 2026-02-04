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
    logo: process.env.NEXT_PUBLIC_APP_LOGO || '✨', // emoji or image path (e.g., '/logo.svg')
    tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || 'AI-Powered SaaS Starter',
  },

  // Contact
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@example.com',
    twitter: process.env.NEXT_PUBLIC_CONTACT_TWITTER || '', // @handle or empty
    github: process.env.NEXT_PUBLIC_CONTACT_GITHUB || '', // repository URL or empty
  },

  // Legal
  legal: {
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Your Company',
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
