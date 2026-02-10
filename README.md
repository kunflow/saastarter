<div align="center">
  
<!-- SCREENSHOT: hero banner -->

# 🚀 Next-AI SaaS Starter

### Ship your AI SaaS in hours, not weeks.

The **AI-first** SaaS boilerplate built for indie developers and small teams.  
Next.js 16 · Supabase · Tailwind CSS · TypeScript

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/kunflow/saastarter?style=social)](https://github.com/kunflow/saastarter/stargazers)

[**Live Demo**](https://saastarter.profilelift.pro) · [**Get Pro Version**](https://kunflow.gumroad.com/l/saastarter-pro) · [**Documentation**](./docs/) · [中文文档](./README-zh.md)

<!-- SCREENSHOT: demo gif or hero screenshot -->

</div>

---

## ⭐ Why Next-AI SaaS Starter?

Stop building auth, billing, and AI plumbing from scratch. **Next-AI SaaS Starter** gives you a production-grade foundation so you can focus on what makes your product unique.

> **💡 Used by indie hackers and small teams to launch AI products faster.**

<!-- SCREENSHOT: product overview -->

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🤖 | **AI Streaming** | Real-time streaming output with Server-Sent Events |
| 💰 | **Credits System** | Usage tracking, balance management, and transaction ledger |
| 🔐 | **Auth Ready** | Login, signup, session management via Supabase Auth |
| 💳 | **Billing Structure** | Free/Pro plans with entitlement mapping |
| 🛡️ | **Abuse Protection** | Rate limiting, anonymous quotas, cost guardrails |
| 🌍 | **i18n Support** | English & Chinese out of the box, easily extensible |
| 🔍 | **SEO Optimized** | Dynamic sitemap, robots.txt, OpenGraph metadata |
| 🎨 | **Zero-Code Branding** | Configure everything via environment variables |
| 📱 | **Responsive UI** | Beautiful, mobile-first design with Tailwind CSS |
| ⚡ | **Next.js 16** | Latest App Router with React 19 and Turbopack |

---

## 🆓 Open Source vs 💎 Pro

| Feature | Open Source | Pro |
|:--------|:----------:|:---:|
| Next.js 16 App Router Architecture | ✅ | ✅ |
| Supabase Auth Integration | ✅ | ✅ |
| Database Schema & Migrations | ✅ | ✅ |
| UI Component Library | ✅ | ✅ |
| i18n Multi-language System | ✅ | ✅ |
| SEO (Sitemap, Robots, Metadata) | ✅ | ✅ |
| Real AI Provider Integration | 🔸 Demo Mode | ✅ OpenAI / Anthropic |
| Credits System (Full Deduction) | 🔸 Bypassed | ✅ Full Implementation |
| Payment Integration | ❌ | ✅ Stripe / LemonSqueezy |
| AI Gateway (Multi-provider) | ❌ | ✅ Built-in |
| Production Support | Community | ⚡ Priority |

<div align="center">

**Want the full production experience?**

[🛒 **Get Pro Version →**](https://kunflow.gumroad.com/l/saastarter-pro)

</div>

---

## 🚀 Quick Start (10 Minutes)

### Prerequisites

- **Node.js** 18+ &nbsp;·&nbsp; **pnpm** 9+ &nbsp;·&nbsp; **Supabase** account ([free tier](https://supabase.com/) works)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/kunflow/saastarter.git my-saas
cd my-saas
pnpm install
```

### 2️⃣ Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Supabase (leave as-is for demo mode)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Branding — make it yours!
NEXT_PUBLIC_APP_NAME=Your Product Name
NEXT_PUBLIC_APP_LOGO=🚀
NEXT_PUBLIC_APP_TAGLINE=Your catchy tagline
```

### 3️⃣ Setup Database

Run the migration files in order in the Supabase SQL Editor:

```
database/supabase/migrations/
├── 20260204100001_create_enums.sql
├── 20260204100002_create_config_tables.sql
├── 20260204100003_create_user_tables.sql
├── 20260204100004_create_ledger_tables.sql
├── 20260204100005_create_triggers.sql
├── 20260204100006_create_functions.sql
├── 20260204100007_create_rls_policies.sql
└── 20260204100008_seed_initial_data.sql
```

### 4️⃣ Launch

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — your AI SaaS is running! 🎉

### 5️⃣ Test the Golden Path

1. **Sign Up** → Create an account
2. **Try the Demo** → Use the Text-to-Emoji AI feature
3. **Watch Streaming** → See real-time AI output
4. **Check Credits** → Balance decreases after usage
5. **Dashboard** → View your account status

---

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Locale-based routing (en, zh)
│   │   ├── (auth)/        # Login, Signup pages
│   │   ├── (marketing)/   # Pricing, FAQ, Legal
│   │   └── dashboard/     # User dashboard
│   └── api/               # API routes
├── components/            # React components
├── config/                # Configuration files
│   ├── site.ts           # Site & brand config
│   ├── seo.ts            # SEO & metadata
│   ├── credits.ts        # Credits & usage rules
│   └── plans.ts          # Subscription plans
└── lib/                   # Utilities
    ├── supabase/         # Supabase clients
    ├── ai/               # AI Gateway
    └── i18n/             # Internationalization

messages/                  # Translation files (en.json, zh.json)
database/                  # SQL migrations & schema
docs/                      # Documentation
```

---

## 🌐 Internationalization (i18n)

| Mode | Config | URL Pattern |
|------|--------|-------------|
| Single Language | `NEXT_PUBLIC_I18N_ENABLED=false` | `/pricing` |
| Multi-language | `NEXT_PUBLIC_I18N_ENABLED=true` | `/en/pricing`, `/zh/pricing` |

Add new languages by creating translation files in `messages/` and updating the i18n config.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| **Auth & Database** | [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **i18n** | [next-intl](https://next-intl-docs.vercel.app/) |
| **Validation** | [Zod 4](https://zod.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) (recommended) |

---

## 📖 Documentation

| Guide | Description |
|-------|-------------|
| [Make It Yours](./docs/MAKE-IT-YOURS.md) | Customize branding, colors, and content (~2 hours) |
| [Environment Variables](./docs/env-variables.md) | Complete configuration reference |
| [Operating Guide](./docs/OPERATING-GUIDE.md) | Production deployment best practices |
| [Licensing](./docs/LICENSING.md) | License terms and usage rights |

---

## 🤝 Contributing

We love contributions! Whether it's bug fixes, new features, or documentation improvements — all are welcome.

Please read our [**Contributing Guide**](./CONTRIBUTING.md) before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

Free to use for personal and commercial projects. Attribution appreciated but not required.

---

<div align="center">

## ⭐ Star This Repo

If this project helped you, **please consider giving it a star!**  
It helps others discover it and motivates us to keep improving.

[![Star History Chart](https://api.star-history.com/svg?repos=kunflow/saastarter&type=Date)](https://star-history.com/#kunflow/saastarter&Date)

**[⭐ Star on GitHub](https://github.com/kunflow/saastarter)** &nbsp;·&nbsp; **[🛒 Get Pro Version](https://kunflow.gumroad.com/l/saastarter-pro)** &nbsp;·&nbsp; **[🌐 Live Demo](https://saastarter.profilelift.pro)**

---

Built with ❤️ by [Kunflow](https://github.com/kunflow)

</div>
