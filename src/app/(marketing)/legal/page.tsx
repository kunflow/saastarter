import { Metadata } from 'next'
import LegalContent from './legal-content'
import { seoConfig } from '@/config/seo'

const { title, description } = seoConfig.pages.legal

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
}

export default function LegalPage() {
  return <LegalContent />
}
