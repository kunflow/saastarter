'use client'

import { useTranslation } from '@/lib/i18n'

export default function LegalContent() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold">{t('legal.title')}</h1>
      </div>

      <div className="space-y-12">
        {/* Terms of Service */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">{t('legal.termsTitle')}</h2>
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              By accessing and using this service, you agree to be bound by these Terms of Service.
            </p>
            <p>
              <strong>1. Acceptable Use</strong><br />
              You agree to use this service only for lawful purposes and in accordance with these terms.
            </p>
            <p>
              <strong>2. Account Responsibility</strong><br />
              You are responsible for maintaining the confidentiality of your account credentials.
            </p>
            <p>
              <strong>3. Service Availability</strong><br />
              We strive to provide uninterrupted service but do not guarantee 100% uptime.
            </p>
            <p>
              <strong>4. Modifications</strong><br />
              We reserve the right to modify these terms at any time.
            </p>
          </div>
        </section>

        {/* Privacy Policy */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">{t('legal.privacyTitle')}</h2>
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              This Privacy Policy describes how we collect, use, and protect your personal information.
            </p>
            <p>
              <strong>1. Information We Collect</strong><br />
              We collect information you provide directly, such as email address and usage data.
            </p>
            <p>
              <strong>2. How We Use Your Information</strong><br />
              We use your information to provide and improve our services, and to communicate with you.
            </p>
            <p>
              <strong>3. Data Security</strong><br />
              We implement appropriate security measures to protect your personal information.
            </p>
            <p>
              <strong>4. Data Retention</strong><br />
              We retain your data only as long as necessary to provide our services.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
