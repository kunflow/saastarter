import { Metadata } from 'next'
import FAQContent from './faq-content'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about our AI-powered services.',
  openGraph: {
    title: 'FAQ',
    description: 'Frequently asked questions about our AI-powered services.',
  },
}

export default function FAQPage() {
  return <FAQContent />
}
