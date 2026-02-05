# Next-AI SaaS Starter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/kunflow/saastarter)](https://github.com/kunflow/saastarter/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/kunflow/saastarter)](https://github.com/kunflow/saastarter/network/members)

面向独立开发者和小团队的生产级 AI SaaS 模板。让你的 AI SaaS 产品在数小时内上线，而不是数周。

[English](./README.md)

## 你将获得

- **AI 流式输出** - 基于 Server-Sent Events 的实时流式响应
- **Credits 系统** - 用量追踪、余额管理、账本记录
- **开箱即用的认证** - 登录、注册、会话管理（Supabase Auth）
- **计费结构** - Free/Pro 方案与权益映射
- **滥用防护** - 速率限制、匿名配额、成本护栏
- **国际化支持** - 内置中英文
- **SEO 就绪** - 动态 sitemap、robots.txt、元数据
- **零代码品牌定制** - 通过环境变量配置一切

## 快速开始（10 分钟）

### 前置条件

- Node.js 18+
- pnpm 9+
- Supabase 账号（免费版即可）

### 第一步：克隆并安装

```bash
git clone https://github.com/kunflow/saastarter.git my-saas
cd my-saas
pnpm install
```

### 第二步：配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，填入你的设置：

```env
# Supabase（可选 - 保持占位符值即可在 Mock 模式下运行）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 品牌（请自定义！）
NEXT_PUBLIC_APP_NAME=你的产品名称
NEXT_PUBLIC_APP_LOGO=🚀
NEXT_PUBLIC_APP_TAGLINE=你的产品标语
NEXT_PUBLIC_COMPANY_NAME=你的公司名称
NEXT_PUBLIC_CONTACT_EMAIL=support@your-domain.com

# SEO
NEXT_PUBLIC_SEO_TITLE=你的产品标题
NEXT_PUBLIC_SEO_DESCRIPTION=你的产品描述
NEXT_PUBLIC_SEO_KEYWORDS=你的,关键词,列表
```

### 第三步：初始化数据库

在 Supabase SQL Editor 中按顺序执行迁移文件：

1. `database/supabase/migrations/20260204100001_create_enums.sql`
2. `database/supabase/migrations/20260204100002_create_config_tables.sql`
3. `database/supabase/migrations/20260204100003_create_user_tables.sql`
4. `database/supabase/migrations/20260204100004_create_ledger_tables.sql`
5. `database/supabase/migrations/20260204100005_create_triggers.sql`
6. `database/supabase/migrations/20260204100006_create_functions.sql`
7. `database/supabase/migrations/20260204100007_create_rls_policies.sql`
8. `database/supabase/migrations/20260204100008_seed_initial_data.sql`

### 第四步：启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)，你应该能看到演示页面。

### 第五步：测试黄金路径

1. 点击"注册"创建账号
2. 返回首页尝试 Text-to-Emoji 演示
3. 观察流式输出效果
4. 检查 credits 余额是否减少
5. 访问 Dashboard 查看你的状态

**恭喜！** 你的 AI SaaS 已经运行起来了。

## 配置说明

### 环境变量

所有品牌和设置都可以通过 `.env` 配置：

| 类别 | 变量 | 说明 |
|------|------|------|
| **应用** | `NEXT_PUBLIC_APP_URL` | 应用 URL |
| | `NEXT_PUBLIC_APP_NAME` | 品牌名称 |
| | `NEXT_PUBLIC_APP_LOGO` | Logo（emoji 或路径） |
| | `NEXT_PUBLIC_APP_TAGLINE` | 品牌标语 |
| **品牌** | `NEXT_PUBLIC_COMPANY_NAME` | 法律主体名称 |
| | `NEXT_PUBLIC_CONTACT_EMAIL` | 联系邮箱 |
| | `NEXT_PUBLIC_CONTACT_TWITTER` | Twitter 账号 |
| | `NEXT_PUBLIC_CONTACT_GITHUB` | GitHub URL |
| **SEO** | `NEXT_PUBLIC_SEO_TITLE` | 默认页面标题 |
| | `NEXT_PUBLIC_SEO_DESCRIPTION` | Meta 描述 |
| | `NEXT_PUBLIC_SEO_KEYWORDS` | 关键词（逗号分隔） |
| | `NEXT_PUBLIC_TWITTER_SITE` | Twitter 网站账号 |

完整列表请查看 [docs/env-variables.md](./docs/env-variables.md)。

### 配置文件

如需高级自定义，可编辑 `src/config/` 下的配置文件：

| 文件 | 用途 |
|------|------|
| `site.ts` | 品牌、联系方式、法律、功能开关 |
| `seo.ts` | SEO、OpenGraph、Twitter、页面元数据 |
| `env.ts` | 环境变量（Supabase、AI、应用设置） |
| `credits.ts` | 默认额度、扣减规则 |
| `plans.ts` | Free/Pro 方案定义 |

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # 基于语言的路由 (en, zh)
│   │   ├── (auth)/        # 登录、注册页面
│   │   ├── (marketing)/   # 定价、FAQ、法律条款
│   │   ├── dashboard/     # 用户仪表板
│   │   └── readme/        # 开发者指南（隐藏）
│   └── api/               # API 路由
├── components/            # React 组件
├── config/                # 配置文件
│   ├── site.ts           # 网站配置
│   ├── seo.ts            # SEO 配置
│   ├── env.ts            # 环境变量
│   ├── credits.ts        # Credits 配置
│   └── plans.ts          # Plans 配置
└── lib/                   # 工具函数
    ├── supabase/         # Supabase 客户端
    ├── ai/               # AI Gateway
    └── i18n/             # 国际化配置

messages/                  # 翻译文件
├── en.json               # 英文翻译
└── zh.json               # 中文翻译
```

## 国际化 (i18n)

应用支持英文 (en) 和中文 (zh)，使用基于 URL 的路由：
- `/` 或 `/en/*` - 英文页面（默认）
- `/zh/*` - 中文页面

**i18n 模式：**

| 模式 | 配置 | URL 结构 |
|------|------|----------|
| 单语言 | `NEXT_PUBLIC_I18N_ENABLED=false` | `/pricing` |
| 多语言 | `NEXT_PUBLIC_I18N_ENABLED=true` | `/en/pricing`, `/zh/pricing` |

**翻译文件：**
- 位置：`messages/en.json`, `messages/zh.json`
- 格式：语义化键（如 `home.title`, `nav.pricing`）

**自动翻译（可选）：**
1. 安装：`pnpm add -D @lingo.dev/cli`
2. 配置 `lingo.config.json`
3. 运行：`LINGODOTDEV_API_KEY=xxx npx lingo translate`

## 下一步

- [改造成你的产品](./docs/MAKE-IT-YOURS-zh.md) - 2 小时定制化指南
- [环境变量](./docs/env-variables.md) - 完整配置参考
- [运营指南](./docs/OPERATING-GUIDE.md) - 生产环境最佳实践
- [授权说明](./docs/LICENSING.md) - 许可条款

## 技术栈

- **框架**: Next.js 16.x (App Router)
- **数据库**: Supabase (PostgreSQL + Auth)
- **样式**: Tailwind CSS 4.x
- **语言**: TypeScript 5.x
- **部署**: Vercel

## 支持

- 文档：开发模式下访问 `/readme` 路由
- 问题：[提交 GitHub Issue](https://github.com/kunflow/saastarter/issues)

## 贡献

欢迎贡献代码！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件。
