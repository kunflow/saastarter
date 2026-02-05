/**
 * Site Configuration
 * Brand, contact, legal, and feature settings
 *
 * Priority: Environment variables > Config values > Defaults
 */

/**
 * Get logo path
 * Logo files are stored in public/logo/ directory
 *
 * Priority:
 * 1. NEXT_PUBLIC_APP_LOGO env var (filename only, e.g., "mylogo.svg")
 * 2. Default: logo.svg
 *
 * Example:
 * - NEXT_PUBLIC_APP_LOGO=mylogo.svg -> /logo/mylogo.svg
 * - NEXT_PUBLIC_APP_LOGO not set -> /logo/logo.svg
 *
 * Supported formats: svg, png, jpg, jpeg, webp, ico
 * Recommended: SVG for best quality at any size
 */
function getLogoPath(): string {
  const envLogo = process.env.NEXT_PUBLIC_APP_LOGO
  const filename = envLogo?.trim() || 'logo.svg'
  return `/logo/${filename}`
}

export const siteConfig = {
  // Brand
  brand: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Next-AI SaaS',
    logo: getLogoPath(),
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
