# Next-AI SaaS Starter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/kunflow/saastarter)](https://github.com/kunflow/saastarter/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/kunflow/saastarter)](https://github.com/kunflow/saastarter/network/members)

A production-ready AI-first SaaS boilerplate for indie developers and small teams. Get your AI SaaS product live in hours, not weeks.

[中文文档](./README-zh.md)

## What You Get

- **AI Streaming** - Real-time streaming output with Server-Sent Events
- **Credits System** - Usage tracking, balance management, and ledger
- **Auth Ready** - Login, signup, session management with Supabase Auth
- **Billing Structure** - Free/Pro plans with entitlement mapping
- **Abuse Protection** - Rate limiting, anonymous quotas, cost guardrails
- **i18n Support** - English and Chinese out of the box
- **SEO Ready** - Dynamic sitemap, robots.txt, and metadata
- **Zero-Code Branding** - Configure everything via environment variables

## Quick Start (10 Minutes)

### Prerequisites

- Node.js 18+
- pnpm 9+
- Supabase account (free tier works)

### Step 1: Clone and Install

```bash
git clone https://github.com/kunflow/saastarter.git my-saas
cd my-saas
pnpm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Supabase (Optional - leave as-is for mock mode)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Branding (Customize these!)
NEXT_PUBLIC_APP_NAME=Your Product Name
NEXT_PUBLIC_APP_LOGO=🚀
NEXT_PUBLIC_APP_TAGLINE=Your catchy tagline
NEXT_PUBLIC_COMPANY_NAME=Your Company
NEXT_PUBLIC_CONTACT_EMAIL=support@your-domain.com

# SEO
NEXT_PUBLIC_SEO_TITLE=Your Product Title
NEXT_PUBLIC_SEO_DESCRIPTION=Your product description
NEXT_PUBLIC_SEO_KEYWORDS=your,keywords,here
```

### Step 3: Setup Database

Run migrations in Supabase SQL Editor (in order):

1. `database/supabase/migrations/20260204100001_create_enums.sql`
2. `database/supabase/migrations/20260204100002_create_config_tables.sql`
3. `database/supabase/migrations/20260204100003_create_user_tables.sql`
4. `database/supabase/migrations/20260204100004_create_ledger_tables.sql`
5. `database/supabase/migrations/20260204100005_create_triggers.sql`
6. `database/supabase/migrations/20260204100006_create_functions.sql`
7. `database/supabase/migrations/20260204100007_create_rls_policies.sql`
8. `database/supabase/migrations/20260204100008_seed_initial_data.sql`

### Step 4: Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) - you should see the demo page.

### Step 5: Test the Golden Path

1. Click "Sign Up" and create an account
2. Return to Home and try the Text-to-Emoji demo
3. Watch the streaming output
4. Check your credits balance decreased
5. Visit Dashboard to see your status

**Congratulations!** Your AI SaaS is running.

## Configuration

### Environment Variables

All branding and settings can be configured via `.env`:

| Category | Variable | Description |
|----------|----------|-------------|
| **App** | `NEXT_PUBLIC_APP_URL` | Application URL |
| | `NEXT_PUBLIC_APP_NAME` | Brand name |
| | `NEXT_PUBLIC_APP_LOGO` | Logo (emoji or path) |
| | `NEXT_PUBLIC_APP_TAGLINE` | Brand tagline |
| **Brand** | `NEXT_PUBLIC_COMPANY_NAME` | Legal company name |
| | `NEXT_PUBLIC_CONTACT_EMAIL` | Support email |
| | `NEXT_PUBLIC_CONTACT_TWITTER` | Twitter handle |
| | `NEXT_PUBLIC_CONTACT_GITHUB` | GitHub URL |
| **SEO** | `NEXT_PUBLIC_SEO_TITLE` | Default page title |
| | `NEXT_PUBLIC_SEO_DESCRIPTION` | Meta description |
| | `NEXT_PUBLIC_SEO_KEYWORDS` | Keywords (comma-separated) |
| | `NEXT_PUBLIC_TWITTER_SITE` | Twitter site handle |

See [docs/env-variables.md](./docs/env-variables.md) for the complete list.

### Configuration Files

For advanced customization, edit the config files in `src/config/`:

| File | Purpose |
|------|---------|
| `site.ts` | Brand, contact, legal, feature toggles |
| `seo.ts` | SEO, OpenGraph, Twitter, page metadata |
| `env.ts` | Environment variables (Supabase, AI, App settings) |
| `credits.ts` | Default credits, deduction rules |
| `plans.ts` | Free/Pro plan definitions |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Locale-based routing (en, zh)
│   │   ├── (auth)/        # Login, Signup pages
│   │   ├── (marketing)/   # Pricing, FAQ, Legal
│   │   ├── dashboard/     # User dashboard
│   │   └── readme/        # Developer guide (hidden)
│   └── api/               # API routes
├── components/            # React components
├── config/                # Configuration files
│   ├── site.ts           # Site configuration
│   ├── seo.ts            # SEO configuration
│   ├── env.ts            # Environment variables
│   ├── credits.ts        # Credits configuration
│   └── plans.ts          # Plans configuration
└── lib/                   # Utilities
    ├── supabase/         # Supabase clients
    ├── ai/               # AI Gateway
    └── i18n/             # i18n configuration

messages/                  # Translation files
├── en.json               # English translations
└── zh.json               # Chinese translations
```

## i18n (Internationalization)

The app supports English (en) and Chinese (zh) with URL-based routing:
- `/` or `/en/*` - English pages (default)
- `/zh/*` - Chinese pages

**i18n Modes:**

| Mode | Configuration | URL Structure |
|------|---------------|---------------|
| Single Language | `NEXT_PUBLIC_I18N_ENABLED=false` | `/pricing` |
| Multi-language | `NEXT_PUBLIC_I18N_ENABLED=true` | `/en/pricing`, `/zh/pricing` |

**Translation Files:**
- Location: `messages/en.json`, `messages/zh.json`
- Format: Semantic keys (e.g., `home.title`, `nav.pricing`)

**Auto Translation (Optional):**
1. Install: `pnpm add -D @lingo.dev/cli`
2. Configure `lingo.config.json`
3. Run: `LINGODOTDEV_API_KEY=xxx npx lingo translate`

## Next Steps

- [Make It Yours](./docs/MAKE-IT-YOURS.md) - Customize for your product (2 hours)
- [Environment Variables](./docs/env-variables.md) - Complete configuration reference
- [Operating Guide](./docs/OPERATING-GUIDE.md) - Production best practices
- [Licensing](./docs/LICENSING.md) - License terms

## Tech Stack

- **Framework**: Next.js 16.x (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 4.x
- **Language**: TypeScript 5.x
- **Deployment**: Vercel

## Support

- Documentation: Check `/readme` route in development mode
- Issues: [Open a GitHub issue](https://github.com/kunflow/saastarter/issues)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
