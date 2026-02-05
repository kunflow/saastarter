import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { env } from '@/config/env'
import { ReadmeContent } from './readme-content'

// noindex by default - prevent search engine indexing
export const metadata: Metadata = {
  title: 'Getting Started - Developer Guide',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ReadmePage() {
  // Only show page if enabled (development mode by default)
  if (!env.features.enableReadmePage) {
    notFound()
  }

  return <ReadmeContent />
}
