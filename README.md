# Next-AI SaaS Starter

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

## Quick Start (10 Minutes)

### Prerequisites

- Node.js 18+
- pnpm 9+
- Supabase account (free tier works)

### Step 1: Clone and Install

```bash
git clone <your-repo-url> my-saas
cd my-saas
pnpm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 3: Setup Database

Run migrations in Supabase SQL Editor (in order):

1. `supabase/migrations/20260204100001_create_enums.sql`
2. `supabase/migrations/20260204100002_create_config_tables.sql`
3. `supabase/migrations/20260204100003_create_user_tables.sql`
4. `supabase/migrations/20260204100004_create_ledger_tables.sql`
5. `supabase/migrations/20260204100005_create_triggers.sql`
6. `supabase/migrations/20260204100006_create_functions.sql`
7. `supabase/migrations/20260204100007_create_rls_policies.sql`
8. `supabase/migrations/20260204100008_seed_initial_data.sql`

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

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login, Signup pages
│   ├── (marketing)/       # Pricing, FAQ, Legal
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   └── readme/            # Developer guide (hidden)
├── components/            # React components
├── config/                # Configuration files
│   ├── env.ts            # Environment variables
│   ├── credits.ts        # Credits configuration
│   └── plans.ts          # Plans configuration
├── lib/                   # Utilities
└── locales/               # i18n translations
```

## Configuration

All configuration is centralized in `src/config/`:

| File | Purpose |
|------|---------|
| `env.ts` | Environment variables (Supabase, AI, App settings) |
| `credits.ts` | Default credits, deduction rules |
| `plans.ts` | Free/Pro plan definitions |

## Next Steps

- [Make It Yours](./docs/MAKE-IT-YOURS.md) - Customize for your product (2 hours)
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
- Issues: Open a GitHub issue

## License

See [LICENSING.md](./docs/LICENSING.md) for details.
