/**
 * Credits System Configuration
 * Centralized configuration for the credits/metering system
 */

import { env } from '@/config/env'

export const creditsConfig = {
  // Default credits for new users
  defaultCredits: env.credits.defaultFree,

  // Credits consumed per AI generation
  creditPerGeneration: 1,

  // Anonymous user daily quota
  anonymousQuota: {
    dailyLimit: env.credits.anonymousQuota,
  },

  // Credit operation types
  operationTypes: {
    initial: 'initial',
    purchase: 'purchase',
    bonus: 'bonus',
    deduction: 'deduction',
    refund: 'refund',
    adjustment: 'adjustment',
    expiry: 'expiry',
  } as const,

  // Credit packages for purchase (future use)
  packages: [
    { id: 'credits_100', amount: 100, price: 499, currency: 'USD' },
    { id: 'credits_500', amount: 500, price: 1999, currency: 'USD' },
    { id: 'credits_1000', amount: 1000, price: 3499, currency: 'USD' },
  ],
} as const

export type CreditOperationType = typeof creditsConfig.operationTypes[keyof typeof creditsConfig.operationTypes]
