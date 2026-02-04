# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Next-AI SaaS Starter (NAST)** - A sellable AI-first SaaS boilerplate template for indie developers and small teams.

Core value: Enable buyers to run through the complete loop "Login → AI Generation (streaming) → Credits deduction → Rate limiting/guardrails → Subscription entitlements (Free/Pro)" in minimal time.

## Tech Stack (Planned)

- **Framework**: Next.js (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **Package Manager**: pnpm
- **i18n**: en/zh minimum

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server (port 3000 only)
pnpm dev

# Build for production
pnpm build

# Lint check (must pass before completion)
pnpm lint

# Type check
pnpm typecheck
```

## Project Structure (Target)

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Login/Signup routes
│   ├── (marketing)/       # Home, Pricing, FAQ, Legal
│   ├── dashboard/         # Protected user dashboard
│   └── readme/            # Developer guide (noindex)
├── components/            # React components
├── lib/                   # Core utilities
│   ├── ai/               # AI Gateway (streaming, error handling)
│   ├── credits/          # Credits & Metering system
│   ├── auth/             # Auth utilities
│   └── billing/          # Billing & Entitlements
├── config/               # Centralized configuration
├── locales/              # i18n translation files
├── supabase/
│   └── migrations/       # Database migrations (format: 20251122100001_xxxx.sql)
└── docs/                 # Project documentation
```

## Core Modules

### AI Gateway
- Unified AI call entry point (no scattered direct calls)
- Streaming support for progressive output
- Standardized error handling (timeout/rate-limit/insufficient-credits)
- Centralized model/provider configuration

### Credits & Metering
- Balance read/update operations
- Ledger for tracking all deductions/additions
- Idempotent deduction to prevent duplicate charges
- Clear policy for failed/timeout scenarios

### Abuse Protection (Default ON)
- Anonymous quota limits
- Rate limiting (IP/account based)
- Concurrency limits
- Cost circuit breaker

### Billing & Entitlements
- Plan states: Free/Pro
- Single "user status read entry" for consistent entitlement checks
- Entitlement mapping: plan → capabilities

## Configuration Requirements

All configurable items must be centralized (no repo-wide search-replace needed):
- Brand info (name, description, email, logo)
- AI settings (provider key, model, timeout/retry)
- Credits (default balance, deduction rules, anonymous quota)
- Rate/concurrency limits
- Plan definitions and entitlement mappings

## Golden Path (Must Work)

Register/Login → Home Demo → Input text → AI streaming output → Credits deduction → Balance refresh → Insufficient credits block → (Optional) Pro upgrade restores quota

## 编码模式偏好
* 始终优先选择简单的解决方案
* 尽可能避免代码重复
* 修复问题或漏洞时,在现有实现的所有方案都尝试完毕之前,不要引入新的模式或技术
* 未经事先询问并确认,不得覆盖我的**.env**文件
* 每次新建脚本时,请在脚本最开头简要描述脚本的功能

## 编程工作流偏好
* 专注于与任务相关的代码区域
* 不要修改与任务无关的代码
* 始终考虑代码更改可能影响到的其他方法和代码区域
* 每次遇到问题时都可以先思考一下,规划好之后再进行开发

## 产品需求文档 (PRD)

**重要**: 完整的产品需求文档位于 `docs/PRD.md`

- 需要查阅产品功能、业务规则、数据模型等详细信息时，必须从**docs/PRD.md**加载阅读
- PRD 包含:
  - 完整的产品定位和边界
  - 详细的功能需求规格
  - 数据结构和字段说明
  - 版本规划
- 开发任何功能前，务必先阅读 PRD 中的相关章节确保符合产品定位
- 任何与项目相关的文档，包括但不限于功能、结构、环境、数据库等的文档，在PRD中必须有入口和解释说明(可以采用表格记录的方式，将这些文档作为PRD的补充文档或外链文档)

## Key Documentation

| Document | Purpose |
|----------|---------|
| `docs/PRD.md` | Product requirements and feature specs |
| `docs/SSOT.md` | Single source of truth - core principles |
| `docs/RELEASE-CHECKLIST.md` | Release validation checklist |
| `docs/DOCS-INDEX.md` | Documentation index |

## Database Conventions

- Migrations in `supabase/migrations/` with format `YYYYMMDDHHMMSS_description.sql`
- Never modify existing migration files (create new ones for changes)
- Always verify table structure before operations

## Important Constraints

1. **Public pages** (Home/Pricing/FAQ/Legal) must NOT expose internal plans, roadmaps, or unreleased features
2. **/readme route** must be noindex by default, not in navigation
3. **Environment variables** use `.env` only (not `.env.local`), never tracked by git
4. **Test server** only on port 3000, backend on port 8000
5. **Entitlement checks** must use single unified entry point for consistency
