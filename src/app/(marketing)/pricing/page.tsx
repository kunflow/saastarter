import { Metadata } from 'next'
import PricingContent from './pricing-content'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing. Choose the plan that works for you.',
  openGraph: {
    title: 'Pricing',
    description: 'Simple, transparent pricing. Choose the plan that works for you.',
  },
}

export default function PricingPage() {
  return <PricingContent />
}
