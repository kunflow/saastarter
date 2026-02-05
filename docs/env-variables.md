# Environment Variables Documentation

> Last updated: 2026-02-05

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

### Database Configuration

| Variable | Description | Values | Default |
|----------|-------------|--------|---------|
| `DATABASE_TYPE` | Database type to use | `supabase`, `postgresql`, `mysql` | `supabase` |
| `DATABASE_URL` | Direct database connection string (for PostgreSQL/MySQL) | See examples below | - |

**Database Type Options:**

| Type | Description | When to Use |
|------|-------------|-------------|
| `supabase` | Supabase (PostgreSQL + Auth + Realtime) | **Recommended** - Quick start, managed service |
| `postgresql` | Self-hosted PostgreSQL | Full control, existing PostgreSQL server |
| `mysql` | Self-hosted MySQL | Existing MySQL server, MySQL preference |

**DATABASE_URL Examples:**

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/database

# MySQL
DATABASE_URL=mysql://user:password@localhost:3306/database
```

> **Important**: When using `postgresql` or `mysql`, you need to implement your own authentication system. See `database/README.md` for code changes required.

### Supabase Configuration (when DATABASE_TYPE=supabase)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/public key | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | `eyJhbGciOiJIUzI1NiIs...` |

> **Note**: Supabase is optional. If not configured (or using placeholder values), the app will run in **mock mode** - perfect for development, demos, or if you want to use a different database.

### App & Branding

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Brand/product name (shown in header, footer, SEO) | `Next-AI SaaS` |
| `NEXT_PUBLIC_APP_LOGO` | Logo filename (leave empty for default) | `logo.svg` |
| `NEXT_PUBLIC_APP_TAGLINE` | Brand tagline | `AI-Powered SaaS Starter` |

#### Logo Configuration

Place your logo file in `public/logo/` directory. The default is `logo.svg`.

**Configuration:**
- Only set the filename in `.env`, not the full path
- Example: `NEXT_PUBLIC_APP_LOGO=mylogo.svg` → loads `/logo/mylogo.svg`
- If using default `logo.svg`, no configuration needed

**Supported Formats:**

| Format | Recommended | Notes |
|--------|-------------|-------|
| SVG | ✅ Best | Vector format, scales perfectly at any size, smallest file size |
| PNG | ✅ Good | Supports transparency, use for complex logos |
| WebP | ✅ Good | Modern format, good compression, supports transparency |
| JPG/JPEG | ⚠️ Okay | No transparency support, avoid for logos with transparent backgrounds |
| ICO | ⚠️ Okay | Legacy format, use only if necessary |

**Recommended Specifications:**

| Spec | Recommendation |
|------|----------------|
| **Dimensions** | Minimum 64×64px, recommended 128×128px or 256×256px |
| **Aspect Ratio** | Square (1:1) works best |
| **File Size** | SVG: <10KB, PNG/WebP: <50KB, avoid >100KB |
| **Background** | Transparent preferred (use SVG or PNG) |
| **Color Mode** | RGB for web display |

**Display Sizes:**
- Header: 28×28px
- Footer: 20×20px
- High-DPI screens automatically use larger source images

**Tips:**
- SVG is strongly recommended for best quality at all sizes
- If using PNG, provide at least 2x resolution (256×256px for best results)
- Keep file size small for faster page loads
- Test your logo in both light and dark modes

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

### i18n / Translations

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_I18N_ENABLED` | Enable multi-language support | `true` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default locale | `en` |
| `NEXT_PUBLIC_SUPPORTED_LOCALES` | Supported locales (comma-separated) | `en,zh` |
| `LINGODOTDEV_API_KEY` | Lingo.dev API key for automatic translations | - |

**i18n Modes:**

| Mode | Configuration | URL Structure | Language Switcher |
|------|---------------|---------------|-------------------|
| Single Language | `NEXT_PUBLIC_I18N_ENABLED=false` | `/pricing` | Hidden |
| Multi-language | `NEXT_PUBLIC_I18N_ENABLED=true` | `/en/pricing`, `/zh/pricing` | Visible |

**Translation Files:**
- Location: `messages/en.json`, `messages/zh.json`
- Format: Semantic keys (e.g., `home.title`, `nav.pricing`)
- Manual translation: Edit JSON files directly
- Auto translation: Use Lingo.dev CLI (see below)

**Lingo.dev CLI Setup (Optional):**
```bash
# Install CLI
pnpm add -D @lingo.dev/cli

# Create lingo.config.json
{
  "version": 1,
  "locale": { "source": "en", "targets": ["zh"] },
  "buckets": {
    "json": { "include": ["messages/[locale].json"] }
  }
}

# Run translation
LINGODOTDEV_API_KEY=xxx npx lingo translate
```

> **Note**: i18n uses URL-based routing with next-intl. The `localePrefix` is set to `as-needed` (default locale has no prefix) when i18n is enabled, or `never` when disabled.

## Configuration Files

Environment variables are organized into configuration files:

| File | Purpose | Variables Used |
|------|---------|----------------|
| `src/config/site.ts` | Brand, contact, legal, features | `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_LOGO`, `NEXT_PUBLIC_APP_TAGLINE`, `NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_CONTACT_*` |
| `src/config/seo.ts` | SEO, OpenGraph, Twitter | `NEXT_PUBLIC_SEO_*`, `NEXT_PUBLIC_OG_*`, `NEXT_PUBLIC_TWITTER_*` |
| `src/config/env.ts` | Environment, Supabase, AI, Credits | All other variables |
| `src/config/credits.ts` | Credits system rules | (uses `src/config/env.ts`) |
| `src/config/plans.ts` | Plans and entitlements | (code-based configuration) |
| `src/lib/i18n/config.ts` | i18n configuration | (uses `src/config/env.ts`) |
| `messages/*.json` | Translation files | (semantic keys: `home.title`, `nav.pricing`) |

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
| `database/supabase/README.md` | Database documentation |
