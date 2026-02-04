import { Metadata } from 'next'
import LegalContent from './legal-content'

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Terms of Service and Privacy Policy.',
  openGraph: {
    title: 'Legal',
    description: 'Terms of Service and Privacy Policy.',
  },
}

export default function LegalPage() {
  return <LegalContent />
}
