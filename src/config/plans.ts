/**
 * Plans Configuration
 * Centralized configuration for subscription plans and entitlements
 */

export const plansConfig = {
  // Available plan slugs
  slugs: {
    free: 'free',
    pro: 'pro',
  } as const,

  // Plan definitions
  plans: {
    free: {
      slug: 'free',
      name: 'Free',
      description: 'Get started with basic features',
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        '100 credits on signup',
        '5 requests per minute',
        'Basic AI models',
        'Community support',
      ],
    },
    pro: {
      slug: 'pro',
      name: 'Pro',
      description: 'Unlock full potential with premium features',
      priceMonthly: 1900, // $19.00
      priceYearly: 15900, // $159.00
      features: [
        '1000 credits per month',
        '20 requests per minute',
        'Advanced AI models',
        'Priority support',
        'API access',
      ],
    },
  } as const,

  // Entitlement keys
  entitlementKeys: {
    monthlyCredits: 'monthly_credits',
    rateLimitPerMinute: 'rate_limit_per_minute',
    rateLimitPerHour: 'rate_limit_per_hour',
    concurrentRequests: 'concurrent_requests',
    maxInputLength: 'max_input_length',
    maxOutputLength: 'max_output_length',
    apiAccess: 'api_access',
    priorityQueue: 'priority_queue',
    advancedModels: 'advanced_models',
  } as const,

  // Default entitlements by plan
  entitlements: {
    free: {
      monthly_credits: 100,
      rate_limit_per_minute: 5,
      rate_limit_per_hour: 50,
      concurrent_requests: 1,
      max_input_length: 1000,
      max_output_length: 2000,
      api_access: false,
      priority_queue: false,
      advanced_models: false,
    },
    pro: {
      monthly_credits: 1000,
      rate_limit_per_minute: 20,
      rate_limit_per_hour: 500,
      concurrent_requests: 3,
      max_input_length: 5000,
      max_output_length: 10000,
      api_access: true,
      priority_queue: true,
      advanced_models: true,
    },
  } as const,

  // Subscription statuses
  statuses: {
    active: 'active',
    canceled: 'canceled',
    expired: 'expired',
    pastDue: 'past_due',
    trialing: 'trialing',
  } as const,
} as const

export type PlanSlug = typeof plansConfig.slugs[keyof typeof plansConfig.slugs]
export type SubscriptionStatus = typeof plansConfig.statuses[keyof typeof plansConfig.statuses]
export type EntitlementKey = typeof plansConfig.entitlementKeys[keyof typeof plansConfig.entitlementKeys]
