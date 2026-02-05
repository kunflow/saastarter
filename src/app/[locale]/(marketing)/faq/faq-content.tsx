'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface FAQItemProps {
  questionKey: string
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ questionKey, isOpen, onToggle }: FAQItemProps) {
  const t = useTranslations(`faq.items.${questionKey}`)

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-4 text-left"
      >
        <span className="font-medium">{t('question')}</span>
        <span className="text-zinc-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="border-t border-zinc-200 px-4 py-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          {t('answer')}
        </div>
      )}
    </div>
  )
}

const faqKeys = ['whatIs', 'credits', 'upgrade', 'privacy', 'outOfCredits']

export default function FAQContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const t = useTranslations('faq')

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t('subtitle')}</p>
      </div>

      <div className="space-y-4">
        {faqKeys.map((key, index) => (
          <FAQItem
            key={key}
            questionKey={key}
            isOpen={openIndex === index}
            onToggle={() => toggle(index)}
          />
        ))}
      </div>
    </div>
  )
}
