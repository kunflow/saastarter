'use client'

import { useTranslations } from 'next-intl'

export default function LegalContent() {
  const t = useTranslations('legal')

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </div>

      <div className="space-y-12">
        {/* Terms of Service */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">{t('terms.title')}</h2>
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>{t('terms.intro')}</p>
            <p>
              <strong>{t('terms.acceptableUse.title')}</strong><br />
              {t('terms.acceptableUse.content')}
            </p>
            <p>
              <strong>{t('terms.accountResponsibility.title')}</strong><br />
              {t('terms.accountResponsibility.content')}
            </p>
            <p>
              <strong>{t('terms.serviceAvailability.title')}</strong><br />
              {t('terms.serviceAvailability.content')}
            </p>
            <p>
              <strong>{t('terms.modifications.title')}</strong><br />
              {t('terms.modifications.content')}
            </p>
          </div>
        </section>

        {/* Privacy Policy */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">{t('privacy.title')}</h2>
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>{t('privacy.intro')}</p>
            <p>
              <strong>{t('privacy.collection.title')}</strong><br />
              {t('privacy.collection.content')}
            </p>
            <p>
              <strong>{t('privacy.usage.title')}</strong><br />
              {t('privacy.usage.content')}
            </p>
            <p>
              <strong>{t('privacy.security.title')}</strong><br />
              {t('privacy.security.content')}
            </p>
            <p>
              <strong>{t('privacy.retention.title')}</strong><br />
              {t('privacy.retention.content')}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
