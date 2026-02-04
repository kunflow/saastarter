'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQContent() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: 'What is Next-AI SaaS?',
      answer: 'Next-AI SaaS is a platform that provides AI-powered text transformation services. You can convert text into emojis and more.',
    },
    {
      question: 'How do credits work?',
      answer: 'Each AI generation consumes 1 credit. Free users receive 100 credits on signup. Pro users receive 1000 credits monthly.',
    },
    {
      question: 'Can I upgrade my plan anytime?',
      answer: 'Yes, you can upgrade from Free to Pro at any time. Your new benefits will be available immediately.',
    },
    {
      question: 'How is my data protected?',
      answer: 'We take data privacy seriously. Your data is encrypted in transit and at rest, and never shared with third parties.',
    },
    {
      question: 'What happens when I run out of credits?',
      answer: 'When your credits reach zero, you will not be able to generate new content until you receive more credits or upgrade your plan.',
    },
  ]

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold">{t('faq.title')}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t('faq.subtitle')}</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-4 py-4 text-left"
            >
              <span className="font-medium">{faq.question}</span>
              <span className="text-zinc-400">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>

            {openIndex === index && (
              <div className="border-t border-zinc-200 px-4 py-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
