# 环境变量文档

> 最后更新: 2026-02-05

## 概述

本文档描述了 Next-AI SaaS Starter 项目中使用的所有环境变量。

所有环境变量通过 `src/config/` 中的配置文件集中管理。这确保了：
- 所有配置的单一数据源
- 类型安全的环境变量访问
- 可选变量的默认值
- 代码库中没有分散的 `process.env` 调用

## 快速开始

1. 复制 `.env.example` 到 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 从 [Supabase 控制台](https://supabase.com/dashboard) 填入您的 Supabase 凭证

3. 自定义您的品牌（所有 `NEXT_PUBLIC_*` 变量）

4. 开始开发！

## 环境变量参考

### 数据库配置

| 变量 | 描述 | 可选值 | 默认值 |
|------|------|--------|--------|
| `DATABASE_TYPE` | 使用的数据库类型 | `supabase`, `postgresql`, `mysql` | `supabase` |
| `DATABASE_URL` | 直接数据库连接字符串（用于 PostgreSQL/MySQL） | 见下方示例 | - |

**数据库类型选项：**

| 类型 | 描述 | 使用场景 |
|------|------|----------|
| `supabase` | Supabase (PostgreSQL + Auth + Realtime) | **推荐** - 快速启动，托管服务 |
| `postgresql` | 自托管 PostgreSQL | 完全控制，现有 PostgreSQL 服务器 |
| `mysql` | 自托管 MySQL | 现有 MySQL 服务器，MySQL 偏好 |

**DATABASE_URL 示例：**

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/database

# MySQL
DATABASE_URL=mysql://user:password@localhost:3306/database
```

> **重要**：使用 `postgresql` 或 `mysql` 时，您需要实现自己的认证系统。请参阅 `database/README.md` 了解所需的代码更改。

### Supabase 配置（当 DATABASE_TYPE=supabase 时）

| 变量 | 描述 | 示例 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/public 密钥 | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role 密钥（仅服务端） | `eyJhbGciOiJIUzI1NiIs...` |

> **注意**：Supabase 是可选的。如果未配置（或使用占位符值），应用将以 **mock 模式** 运行 - 非常适合开发、演示或使用其他数据库。

### 应用与品牌

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `NEXT_PUBLIC_APP_URL` | 应用基础 URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | 品牌/产品名称（显示在页头、页脚、SEO） | `Next-AI SaaS` |
| `NEXT_PUBLIC_APP_LOGO` | Logo 文件名（留空使用默认） | `logo.svg` |
| `NEXT_PUBLIC_APP_TAGLINE` | 品牌标语 | `AI-Powered SaaS Starter` |

#### Logo 配置

将您的 logo 文件放在 `public/logo/` 目录中。默认是 `logo.svg`。

**配置方式：**
- 只在 `.env` 中设置文件名，不是完整路径
- 示例：`NEXT_PUBLIC_APP_LOGO=mylogo.svg` → 加载 `/logo/mylogo.svg`
- 如果使用默认的 `logo.svg`，无需配置

**支持的格式：**

| 格式 | 推荐度 | 说明 |
|------|--------|------|
| SVG | ✅ 最佳 | 矢量格式，任何尺寸都能完美缩放，文件最小 |
| PNG | ✅ 良好 | 支持透明，适用于复杂 logo |
| WebP | ✅ 良好 | 现代格式，压缩好，支持透明 |
| JPG/JPEG | ⚠️ 可用 | 不支持透明，避免用于透明背景的 logo |
| ICO | ⚠️ 可用 | 传统格式，仅在必要时使用 |

**推荐规格：**

| 规格 | 建议 |
|------|------|
| **尺寸** | 最小 64×64px，推荐 128×128px 或 256×256px |
| **宽高比** | 正方形 (1:1) 效果最佳 |
| **文件大小** | SVG: <10KB, PNG/WebP: <50KB, 避免 >100KB |
| **背景** | 推荐透明（使用 SVG 或 PNG） |
| **颜色模式** | RGB 用于网页显示 |

**显示尺寸：**
- 页头：28×28px
- 页脚：20×20px
- 高 DPI 屏幕自动使用更大的源图像

**提示：**
- 强烈推荐 SVG 以获得所有尺寸的最佳质量
- 如果使用 PNG，请提供至少 2 倍分辨率（256×256px 效果最佳）
- 保持文件小以加快页面加载
- 在浅色和深色模式下测试您的 logo

### 品牌与联系方式

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `NEXT_PUBLIC_COMPANY_NAME` | 法律公司名称（显示在页脚版权） | `Your Company` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 支持邮箱地址 | `support@example.com` |
| `NEXT_PUBLIC_CONTACT_TWITTER` | Twitter 账号（如 `@yourhandle`） | (空) |
| `NEXT_PUBLIC_CONTACT_GITHUB` | GitHub 仓库 URL | (空) |

### SEO 配置

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `NEXT_PUBLIC_SEO_TITLE` | 默认页面标题（与品牌名称组合） | `AI-Powered Text to Emoji` |
| `NEXT_PUBLIC_SEO_DESCRIPTION` | 搜索引擎的元描述 | `Transform your text into...` |
| `NEXT_PUBLIC_SEO_KEYWORDS` | SEO 关键词（逗号分隔） | `AI,SaaS,Text to Emoji,...` |
| `NEXT_PUBLIC_OG_LOCALE` | OpenGraph 语言区域 | `en_US` |
| `NEXT_PUBLIC_TWITTER_SITE` | Twitter Cards 的网站账号 | (空) |
| `NEXT_PUBLIC_TWITTER_CREATOR` | Twitter Cards 的创作者账号 | (空) |

### 模式配置

| 变量 | 描述 | 可选值 | 默认值 |
|------|------|--------|--------|
| `APP_MODE` | 应用运行模式 | `development`, `production`, `test`, `mock` | `development` |
| `ENABLE_MOCK` | 启用 mock 模式（跳过真实 API 调用） | `true`, `false` | `false` |

### AI 配置

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `AI_PROVIDER` | AI 提供商 (mock, openai, anthropic) | `mock` |
| `AI_MODEL` | 默认 AI 模型 | `gpt-4o-mini` |
| `AI_TIMEOUT` | AI 请求超时（毫秒） | `30000` |
| `AI_MAX_RETRIES` | 最大重试次数 | `3` |
| `AI_MOCK_MODE` | 使用 mock AI 响应 | `true` |
| `AI_RATE_LIMIT_PER_MINUTE` | 每分钟速率限制 | `10` |
| `OPENAI_API_KEY` | OpenAI API 密钥（如果使用 OpenAI） | - |

### 积分配置

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `DEFAULT_FREE_CREDITS` | 免费用户默认积分 | `100` |
| `DEFAULT_PRO_CREDITS` | Pro 用户默认积分 | `1000` |
| `ANONYMOUS_QUOTA` | 匿名用户每日配额 | `3` |

### 功能开关

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `ENABLE_README_PAGE` | 启用 /readme 开发者指南页面 | 开发环境 `true`，生产环境 `false` |

### 国际化 / 翻译

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `NEXT_PUBLIC_I18N_ENABLED` | 启用多语言支持 | `true` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | 默认语言 | `en` |
| `NEXT_PUBLIC_SUPPORTED_LOCALES` | 支持的语言（逗号分隔） | `en,zh` |
| `LINGODOTDEV_API_KEY` | Lingo.dev API 密钥用于自动翻译 | - |

**i18n 模式：**

| 模式 | 配置 | URL 结构 | 语言切换器 |
|------|------|----------|-----------|
| 单语言 | `NEXT_PUBLIC_I18N_ENABLED=false` | `/pricing` | 隐藏 |
| 多语言 | `NEXT_PUBLIC_I18N_ENABLED=true` | `/en/pricing`, `/zh/pricing` | 显示 |

**翻译文件：**
- 位置：`messages/en.json`, `messages/zh.json`
- 格式：语义化键（如 `home.title`, `nav.pricing`）
- 手动翻译：直接编辑 JSON 文件
- 自动翻译：使用 Lingo.dev CLI（见下方）

**Lingo.dev CLI 设置（可选）：**
```bash
# 安装 CLI
pnpm add -D @lingo.dev/cli

# 创建 lingo.config.json
{
  "version": 1,
  "locale": { "source": "en", "targets": ["zh"] },
  "buckets": {
    "json": { "include": ["messages/[locale].json"] }
  }
}

# 运行翻译
LINGODOTDEV_API_KEY=xxx npx lingo translate
```

> **注意**：国际化使用 next-intl 的基于 URL 的路由。启用 i18n 时 `localePrefix` 设置为 `as-needed`（默认语言无前缀），禁用时设置为 `never`。

## 配置文件

环境变量组织在配置文件中：

| 文件 | 用途 | 使用的变量 |
|------|------|-----------|
| `src/config/site.ts` | 品牌、联系方式、法律、功能 | `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_LOGO`, `NEXT_PUBLIC_APP_TAGLINE`, `NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_CONTACT_*` |
| `src/config/seo.ts` | SEO、OpenGraph、Twitter | `NEXT_PUBLIC_SEO_*`, `NEXT_PUBLIC_OG_*`, `NEXT_PUBLIC_TWITTER_*` |
| `src/config/env.ts` | 环境、Supabase、AI、积分 | 所有其他变量 |
| `src/config/credits.ts` | 积分系统规则 | (使用 `src/config/env.ts`) |
| `src/config/plans.ts` | 计划和权益 | (基于代码的配置) |
| `src/lib/i18n/config.ts` | 国际化配置 | (使用 `src/config/env.ts`) |
| `messages/*.json` | 翻译文件 | (语义化键: `home.title`, `nav.pricing`) |

## 代码中的使用

```typescript
// 站点配置
import { siteConfig } from '@/config/site'
const brandName = siteConfig.brand.name
const logo = siteConfig.brand.logo

// SEO 配置
import { seoConfig } from '@/config/seo'
const title = seoConfig.default.title
const description = seoConfig.default.description

// 环境配置
import { env } from '@/config/env'
const isSupabaseConfigured = env.supabase.isConfigured
const aiModel = env.ai.model
```

## 优先级

配置值遵循以下优先级（从高到低）：
1. 环境变量
2. 配置文件值
3. 默认值

## 安全注意事项

- **永远不要将 `.env` 文件**提交到版本控制
- `NEXT_PUBLIC_*` 变量会暴露给浏览器
- `SUPABASE_SERVICE_ROLE_KEY` 只应在服务端使用
- 保护好 API 密钥和机密信息

## 相关文档

| 文档 | 用途 |
|------|------|
| `.env.example` | 环境变量模板 |
| `docs/MAKE-IT-YOURS.md` | 自定义指南 |
| `database/supabase/README.md` | 数据库文档 |
