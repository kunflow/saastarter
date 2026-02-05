import createMiddleware from 'next-intl/middleware'
import { routing } from '@/lib/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - Next.js internals (_next)
    // - Static files (files with extensions)
    '/((?!api|_next|.*\\..*).*)',
  ],
}
