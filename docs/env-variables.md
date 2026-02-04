# Environment Variables Documentation

> Last updated: 2026-02-04

## Overview

This document describes all environment variables used in the Next-AI SaaS Starter project.

All environment variables are centrally managed through `src/config/env.ts`. This ensures:
- Single source of truth for all configuration
- Type-safe access to environment variables
- Default values for optional variables
- No scattered `process.env` calls throughout the codebase

## Configuration File

Environment variables are accessed via the `env` object exported from `src/config/env.ts`:

```typescript
import { env } from '@/config/env'

// Usage examples
const appName = env.app.name
const isSupabaseConfigured = env.supabase.isConfigured
const aiModel = env.ai.model
```

## Required Variables

### Supabase Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/public key | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | `eyJhbGciOiJIUzI1NiIs...` |

> **Note**: If Supabase is not configured, the app will run in mock mode.

### App Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `Next-AI SaaS` |

## Optional Variables

### Mode Configuration

| Variable | Description | Values | Default |
|----------|-------------|--------|---------|
| `APP_MODE` | Application running mode | `development`, `production`, `test`, `mock` | `development` |
| `ENABLE_MOCK` | Enable mock mode (skip real API calls) | `true`, `false` | `false` |

### AI Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `AI_PROVIDER` | AI provider (mock, openai, anthropic) | `mock` |
| `AI_MODEL` | Default AI model | `gpt-4o-mini` |
| `AI_TIMEOUT` | AI request timeout (ms) | `30000` |
| `AI_MAX_RETRIES` | Max retry attempts | `3` |
| `AI_MOCK_MODE` | Use mock AI responses | `true` |
| `AI_RATE_LIMIT_PER_MINUTE` | Rate limit per minute | `10` |
| `OPENAI_API_KEY` | OpenAI API key (if using OpenAI) | - |

### Credits Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `DEFAULT_FREE_CREDITS` | Default credits for free users | `100` |
| `DEFAULT_PRO_CREDITS` | Default credits for pro users | `1000` |
| `ANONYMOUS_QUOTA` | Anonymous user daily quota | `3` |

### Feature Flags

| Variable | Description | Default |
|----------|-------------|---------|
| `ENABLE_README_PAGE` | Enable /readme developer guide page | `true` in development, `false` in production |

## Configuration Structure

The `env` object in `src/config/env.ts` is organized as follows:

```typescript
export const env = {
  app: {
    url: string,
    name: string,
    mode: 'development' | 'production' | 'test' | 'mock',
    enableMock: boolean,
  },
  supabase: {
    url: string,
    anonKey: string,
    serviceRoleKey: string,
    isConfigured: boolean,      // true if url and anonKey are set
    isServiceConfigured: boolean, // true if url and serviceRoleKey are set
  },
  ai: {
    provider: string,
    model: string,
    timeout: number,
    maxRetries: number,
    mockMode: boolean,
    rateLimitPerMinute: number,
    openaiApiKey: string,
  },
  credits: {
    defaultFree: number,
    defaultPro: number,
    anonymousQuota: number,
  },
  features: {
    enableReadmePage: boolean,  // /readme developer guide page
  },
}
```

## Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials from [Supabase Dashboard](https://supabase.com/dashboard)

3. Update other variables as needed

4. For development without Supabase, keep the defaults (mock mode will be used)

## Security Notes

- **Never commit `.env` file** to version control
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` should only be used server-side
- Keep API keys and secrets secure
- The `env.ts` file provides runtime checks but does not expose sensitive values

## Related Files

| File | Purpose |
|------|---------|
| `.env` | Local environment variables (not committed) |
| `.env.example` | Template for environment variables |
| `src/config/env.ts` | Centralized environment configuration |
| `src/config/credits.ts` | Credits system configuration |
| `src/config/plans.ts` | Plans and entitlements configuration |
| `src/lib/ai/config.ts` | AI Gateway configuration |
