import { Metadata } from 'next'
import PricingContent from './pricing-content'
import { seoConfig } from '@/config/seo'

const { title, description } = seoConfig.pages.pricing

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
}

export default function PricingPage() {
  return <PricingContent />
}
