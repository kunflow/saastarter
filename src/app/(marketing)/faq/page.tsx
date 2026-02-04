import { Metadata } from 'next'
import FAQContent from './faq-content'
import { seoConfig } from '@/config/seo'

const { title, description } = seoConfig.pages.faq

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
}

export default function FAQPage() {
  return <FAQContent />
}
