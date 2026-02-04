# Next-AI SaaS Starter

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

## 快速开始（10 分钟）

### 前置条件

- Node.js 18+
- pnpm 9+
- Supabase 账号（免费版即可）

### 第一步：克隆并安装

```bash
git clone <your-repo-url> my-saas
cd my-saas
pnpm install
```

### 第二步：配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，填入你的 Supabase 凭据：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 第三步：初始化数据库

在 Supabase SQL Editor 中按顺序执行迁移文件：

1. `supabase/migrations/20260204100001_create_enums.sql`
2. `supabase/migrations/20260204100002_create_config_tables.sql`
3. `supabase/migrations/20260204100003_create_user_tables.sql`
4. `supabase/migrations/20260204100004_create_ledger_tables.sql`
5. `supabase/migrations/20260204100005_create_triggers.sql`
6. `supabase/migrations/20260204100006_create_functions.sql`
7. `supabase/migrations/20260204100007_create_rls_policies.sql`
8. `supabase/migrations/20260204100008_seed_initial_data.sql`

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

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 登录、注册页面
│   ├── (marketing)/       # 定价、FAQ、法律条款
│   ├── api/               # API 路由
│   ├── dashboard/         # 用户仪表板
│   └── readme/            # 开发者指南（隐藏）
├── components/            # React 组件
├── config/                # 配置文件
│   ├── env.ts            # 环境变量
│   ├── credits.ts        # Credits 配置
│   └── plans.ts          # Plans 配置
├── lib/                   # 工具函数
└── locales/               # i18n 翻译文件
```

## 配置说明

所有配置集中在 `src/config/`：

| 文件 | 用途 |
|------|------|
| `env.ts` | 环境变量（Supabase、AI、应用设置） |
| `credits.ts` | 默认额度、扣减规则 |
| `plans.ts` | Free/Pro 方案定义 |

## 下一步

- [改造成你的产品](./docs/MAKE-IT-YOURS.md) - 2 小时定制化指南
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
- 问题：提交 GitHub Issue

## 许可

详见 [LICENSING.md](./docs/LICENSING.md)。
