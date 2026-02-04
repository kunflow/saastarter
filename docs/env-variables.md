# Environment Variables Documentation

> Last updated: 2026-02-04

## Overview

This document describes all environment variables used in the Next-AI SaaS Starter project.

All environment variables are centrally managed through configuration files in `src/config/`. This ensures:
- Single source of truth for all configuration
- Type-safe access to environment variables
- Default values for optional variables
- No scattered `process.env` calls throughout the codebase

## Quick Start

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials from [Supabase Dashboard](https://supabase.com/dashboard)

3. Customize your branding (all `NEXT_PUBLIC_*` variables)

4. Start developing!

## Environment Variables Reference

### Supabase Configuration (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/public key | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | `eyJhbGciOiJIUzI1NiIs...` |

> **Note**: If Supabase is not configured, the app will run in mock mode.

### App & Branding

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Brand/product name (shown in header, footer, SEO) | `Next-AI SaaS` |
| `NEXT_PUBLIC_APP_LOGO` | Logo emoji or image path (e.g., `/logo.svg`) | `✨` |
| `NEXT_PUBLIC_APP_TAGLINE` | Brand tagline | `AI-Powered SaaS Starter` |

### Brand & Contact

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_COMPANY_NAME` | Legal company name (shown in footer copyright) | `Your Company` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Support email address | `support@example.com` |
| `NEXT_PUBLIC_CONTACT_TWITTER` | Twitter handle (e.g., `@yourhandle`) | (empty) |
| `NEXT_PUBLIC_CONTACT_GITHUB` | GitHub repository URL | (empty) |

### SEO Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SEO_TITLE` | Default page title (combined with brand name) | `AI-Powered Text to Emoji` |
| `NEXT_PUBLIC_SEO_DESCRIPTION` | Meta description for search engines | `Transform your text into...` |
| `NEXT_PUBLIC_SEO_KEYWORDS` | SEO keywords (comma-separated) | `AI,SaaS,Text to Emoji,...` |
| `NEXT_PUBLIC_OG_LOCALE` | OpenGraph locale | `en_US` |
| `NEXT_PUBLIC_TWITTER_SITE` | Twitter site handle for Twitter Cards | (empty) |
| `NEXT_PUBLIC_TWITTER_CREATOR` | Twitter creator handle for Twitter Cards | (empty) |

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

## Configuration Files

Environment variables are organized into configuration files:

| File | Purpose | Variables Used |
|------|---------|----------------|
| `src/config/site.ts` | Brand, contact, legal, features | `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_LOGO`, `NEXT_PUBLIC_APP_TAGLINE`, `NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_CONTACT_*` |
| `src/config/seo.ts` | SEO, OpenGraph, Twitter | `NEXT_PUBLIC_SEO_*`, `NEXT_PUBLIC_OG_*`, `NEXT_PUBLIC_TWITTER_*` |
| `src/config/env.ts` | Environment, Supabase, AI, Credits | All other variables |
| `src/config/credits.ts` | Credits system rules | (uses `src/config/env.ts`) |
| `src/config/plans.ts` | Plans and entitlements | (code-based configuration) |

## Usage in Code

```typescript
// Site configuration
import { siteConfig } from '@/config/site'
const brandName = siteConfig.brand.name
const logo = siteConfig.brand.logo

// SEO configuration
import { seoConfig } from '@/config/seo'
const title = seoConfig.default.title
const description = seoConfig.default.description

// Environment configuration
import { env } from '@/config/env'
const isSupabaseConfigured = env.supabase.isConfigured
const aiModel = env.ai.model
```

## Priority

Configuration values follow this priority (highest to lowest):
1. Environment variables
2. Config file values
3. Default values

## Security Notes

- **Never commit `.env` file** to version control
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` should only be used server-side
- Keep API keys and secrets secure

## Related Documentation

| Document | Purpose |
|----------|---------|
| `.env.example` | Template for environment variables |
| `docs/MAKE-IT-YOURS.md` | Customization guide |
| `supabase/README.md` | Database documentation |
