/**
 * Environment Configuration
 * Centralized environment variable management
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (!value && defaultValue === undefined) {
    return ''
  }
  return value || defaultValue || ''
}

function getEnvVarBool(key: string, defaultValue = false): boolean {
  const value = process.env[key]
  if (!value) return defaultValue
  return value.toLowerCase() === 'true' || value === '1'
}

function getEnvVarInt(key: string, defaultValue: number): number {
  const value = process.env[key]
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

// Supabase config
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL', '')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY', '')
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY', '')

export const env = {
  // App
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Next-AI SaaS'),
    mode: getEnvVar('APP_MODE', 'development') as 'development' | 'production' | 'test' | 'mock',
    enableMock: getEnvVarBool('ENABLE_MOCK', false),
  },

  // Supabase
  supabase: {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    serviceRoleKey: supabaseServiceKey,
    isConfigured: !!(supabaseUrl && supabaseAnonKey),
    isServiceConfigured: !!(supabaseUrl && supabaseServiceKey),
  },

  // AI
  ai: {
    provider: getEnvVar('AI_PROVIDER', 'mock'),
    model: getEnvVar('AI_MODEL', 'gpt-4o-mini'),
    timeout: getEnvVarInt('AI_TIMEOUT', 30000),
    maxRetries: getEnvVarInt('AI_MAX_RETRIES', 3),
    mockMode: getEnvVarBool('AI_MOCK_MODE', true),
    rateLimitPerMinute: getEnvVarInt('AI_RATE_LIMIT_PER_MINUTE', 10),
    openaiApiKey: getEnvVar('OPENAI_API_KEY', ''),
  },

  // Credits
  credits: {
    defaultFree: getEnvVarInt('DEFAULT_FREE_CREDITS', 100),
    defaultPro: getEnvVarInt('DEFAULT_PRO_CREDITS', 1000),
    anonymousQuota: getEnvVarInt('ANONYMOUS_QUOTA', 3),
  },

  // Features
  features: {
    // /readme page: only enabled in development by default
    enableReadmePage: getEnvVarBool('ENABLE_README_PAGE', getEnvVar('APP_MODE', 'development') === 'development'),
  },
} as const

// Type for environment config
export type EnvConfig = typeof env
