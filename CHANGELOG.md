# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-02-10

### Added
- Next.js 16 App Router architecture with React 19 and Turbopack
- Supabase Auth integration (login, signup, session management)
- Database schema and migrations for PostgreSQL with RLS policies
- AI streaming output with Server-Sent Events (demo mode)
- Credits system with usage tracking, balance management, and transaction ledger
- Free/Pro subscription plan structure with entitlement mapping
- Abuse protection: rate limiting, anonymous quotas, cost guardrails
- i18n multi-language support (English & Chinese) via next-intl
- SEO optimization: dynamic sitemap, robots.txt, OpenGraph metadata
- Zero-code branding via environment variables
- Responsive mobile-first UI with Tailwind CSS 4
- UI component library
- Comprehensive documentation (Make It Yours, Environment Variables, Operating Guide, Licensing)
- Contributing guide and GitHub issue templates
- Product screenshots in README
- MIT open source license

### Changed
- Refactored to Open Core model (free open source base + Pro version)
- Extracted brand and SEO configuration to standalone config files
- All brand and SEO settings configurable via environment variables
- i18n system refactored to use next-intl with locale-based routing
- Database layer restructured for open source release

### Infrastructure
- pnpm package manager
- TypeScript 5 strict mode
- Zod 4 for runtime validation
- Vercel-ready deployment configuration
