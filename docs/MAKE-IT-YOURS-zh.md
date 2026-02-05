# 改造成你的产品

用约 2 小时将此模板改造成你自己的产品。

## 概述

本指南将引导你针对特定 AI 产品定制模板。完成后，你将拥有一个完全品牌化、功能齐全的 AI SaaS。

## 第一步：品牌与 SEO 配置（5 分钟）

所有品牌和 SEO 设置都可以通过 `.env` 环境变量配置：

### 1.1 应用和品牌设置

```env
# 应用
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=你的产品名称
NEXT_PUBLIC_APP_LOGO=🚀
NEXT_PUBLIC_APP_TAGLINE=你的产品标语

# 品牌与联系方式
NEXT_PUBLIC_COMPANY_NAME=你的公司名称
NEXT_PUBLIC_CONTACT_EMAIL=support@your-domain.com
NEXT_PUBLIC_CONTACT_TWITTER=@yourhandle
NEXT_PUBLIC_CONTACT_GITHUB=https://github.com/your-repo
```

### 1.2 SEO 设置

```env
# SEO
NEXT_PUBLIC_SEO_TITLE=你的产品标题
NEXT_PUBLIC_SEO_DESCRIPTION=你的产品描述，用于搜索引擎
NEXT_PUBLIC_SEO_KEYWORDS=你的,关键词,列表
NEXT_PUBLIC_OG_LOCALE=zh_CN

# Twitter 卡片
NEXT_PUBLIC_TWITTER_SITE=@yourhandle
NEXT_PUBLIC_TWITTER_CREATOR=@yourhandle
```

### 1.3 配置文件（可选）

如需高级自定义，也可以直接编辑配置文件：
- `src/config/site.ts` - 品牌、联系方式、法律、功能开关
- `src/config/seo.ts` - SEO、OpenGraph、Twitter、页面元数据

## 第二步：替换演示功能（45 分钟）

### 2.1 了解演示结构

当前演示：`src/components/demo/text-to-emoji.tsx`

演示组件的工作流程：
1. 接收用户输入
2. 调用 `/api/ai/generate`
3. 显示流式响应
4. 显示 credits 扣减

### 2.2 创建你自己的演示

创建 `src/components/demo/your-demo.tsx`：

```typescript
'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/ui'

export default function YourDemo() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)
    setOutput('')

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          type: 'your-type', // 定义你的生成类型
        }),
      })

      // 处理流式响应
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        // 解析 SSE 数据
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            if (data.content) {
              setOutput(prev => prev + data.content)
            }
          }
        }
      }
    } catch (error) {
      console.error('生成失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入内容..."
      />
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? '生成中...' : '生成'}
      </Button>
      {output && (
        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          {output}
        </div>
      )}
    </div>
  )
}
```

### 2.3 更新 API 路由

编辑 `src/app/api/ai/generate/route.ts` 处理你的生成类型：

```typescript
// 添加你的生成逻辑
if (type === 'your-type') {
  // 你的 AI 逻辑
  // 使用 env.ai.provider 和 env.ai.model 进行配置
}
```

### 2.4 更新首页

编辑 `src/app/[locale]/page.tsx` 使用你的演示：

```typescript
import YourDemo from '@/components/demo/your-demo'

export default function HomePage() {
  return (
    <main>
      <YourDemo />
    </main>
  )
}
```

## 第三步：配置 AI 提供商（15 分钟）

### 3.1 设置 API Key

```env
OPENAI_API_KEY=sk-your-api-key
# 或其他提供商的 key
```

### 3.2 配置模型

```env
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
AI_TIMEOUT=30000
AI_MAX_RETRIES=3
```

### 3.3 禁用 Mock 模式

```env
AI_MOCK_MODE=false
```

## 第四步：自定义方案（15 分钟）

### 4.1 编辑方案定义

编辑 `src/config/plans.ts`：

```typescript
export const plans = {
  free: {
    name: '免费版',
    description: '体验试用',
    price: '¥0',
    period: '/月',
    features: [
      '你的功能 1',
      '你的功能 2',
    ],
  },
  pro: {
    name: '专业版',
    description: '高级用户',
    price: '¥29',
    period: '/月',
    features: [
      '包含免费版所有功能',
      '你的专业功能 1',
      '你的专业功能 2',
    ],
  },
}
```

### 4.2 更新数据库方案

在 Supabase 中创建新迁移或更新种子数据：

```sql
UPDATE plans SET
  name = '你的免费方案',
  description = '你的描述'
WHERE slug = 'free';

UPDATE plan_entitlements SET
  monthly_credits = 50,  -- 按需调整
  rate_limit_per_minute = 10
WHERE plan_id = (SELECT id FROM plans WHERE slug = 'free');
```

## 第五步：更新营销页面（15 分钟）

### 5.1 定价页面

编辑 `src/app/[locale]/(marketing)/pricing/pricing-content.tsx`：
- 更新方案功能
- 调整价格显示

### 5.2 FAQ 页面

编辑 `src/app/[locale]/(marketing)/faq/faq-content.tsx`：
- 替换为你的产品相关的常见问题

### 5.3 法律条款页面

编辑 `src/app/[locale]/(marketing)/legal/legal-content.tsx`：
- 更新服务条款
- 更新隐私政策

## 第六步：配置国际化（可选，10 分钟）

### 6.1 i18n 模式

模板支持三种国际化模式：

| 模式 | 配置 | URL 结构 | 语言切换器 |
|------|------|----------|-----------|
| 单语言 | `NEXT_PUBLIC_I18N_ENABLED=false` | `/pricing` | 隐藏 |
| 多语言（手动翻译） | `NEXT_PUBLIC_I18N_ENABLED=true` | `/en/pricing`, `/zh/pricing` | 显示 |
| 多语言（自动翻译） | 同上 + Lingo.dev CLI | 同上 | 显示 |

### 6.2 配置环境变量

```env
# 启用/禁用多语言支持
NEXT_PUBLIC_I18N_ENABLED=true

# 默认语言
NEXT_PUBLIC_DEFAULT_LOCALE=en

# 支持的语言（逗号分隔）
NEXT_PUBLIC_SUPPORTED_LOCALES=en,zh
```

### 6.3 翻译文件

翻译文件位于 `messages/` 目录：
- `messages/en.json` - 英文翻译
- `messages/zh.json` - 中文翻译

直接编辑这些文件来自定义翻译。

### 6.4 使用 Lingo.dev CLI 自动翻译（可选）

1. 安装 CLI：
   ```bash
   pnpm add -D @lingo.dev/cli
   ```

2. 创建 `lingo.config.json`：
   ```json
   {
     "version": 1,
     "locale": { "source": "en", "targets": ["zh"] },
     "buckets": {
       "json": { "include": ["messages/[locale].json"] }
     }
   }
   ```

3. 运行翻译：
   ```bash
   LINGODOTDEV_API_KEY=your-api-key npx lingo translate
   ```

## 第七步：部署（15 分钟）

### 方式一：部署到 Vercel（推荐）

```bash
vercel
```

在 Vercel 控制台设置环境变量：
- `.env.example` 中的所有变量
- `NEXT_PUBLIC_APP_URL` = 你的生产环境 URL
- `LINGODOTDEV_API_KEY` = 你的 Lingo.dev API key（如需翻译）

### 方式二：自托管部署

#### 7.2.1 构建生产版本

```bash
# 安装依赖
pnpm install

# 构建（会自动生成翻译）
pnpm build
```

#### 7.2.2 使用 Node.js 运行

```bash
# 启动生产服务器
pnpm start
```

默认监听 3000 端口，可通过 `PORT` 环境变量修改：

```bash
PORT=8080 pnpm start
```

#### 7.2.3 使用 PM2 管理进程

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "my-saas" -- start

# 查看状态
pm2 status

# 查看日志
pm2 logs my-saas

# 设置开机自启
pm2 startup
pm2 save
```

#### 7.2.4 使用 Docker 部署

创建 `Dockerfile`：

```dockerfile
FROM node:20-alpine AS base

# 安装 pnpm
RUN npm install -g pnpm

# 依赖阶段
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# 运行阶段
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

构建并运行：

```bash
# 构建镜像
docker build -t my-saas .

# 运行容器
docker run -p 3000:3000 --env-file .env my-saas
```

#### 7.2.5 Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7.3 执行数据库迁移

在你的生产 Supabase 项目中执行所有迁移文件。

## 环境变量汇总

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NEXT_PUBLIC_APP_URL` | 应用 URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | 品牌名称 | `Next-AI SaaS` |
| `NEXT_PUBLIC_APP_LOGO` | Logo（emoji 或路径） | `✨` |
| `NEXT_PUBLIC_APP_TAGLINE` | 品牌标语 | `AI-Powered SaaS Starter` |
| `NEXT_PUBLIC_COMPANY_NAME` | 法律主体名称 | `Your Company` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 联系邮箱 | `support@example.com` |
| `NEXT_PUBLIC_CONTACT_TWITTER` | Twitter 账号 | （空） |
| `NEXT_PUBLIC_CONTACT_GITHUB` | GitHub URL | （空） |
| `NEXT_PUBLIC_SEO_TITLE` | 默认页面标题 | `AI-Powered Text to Emoji` |
| `NEXT_PUBLIC_SEO_DESCRIPTION` | Meta 描述 | （见 .env.example） |
| `NEXT_PUBLIC_SEO_KEYWORDS` | SEO 关键词（逗号分隔） | `AI,SaaS,...` |
| `NEXT_PUBLIC_OG_LOCALE` | OpenGraph 语言 | `en_US` |
| `NEXT_PUBLIC_TWITTER_SITE` | Twitter 网站账号 | （空） |
| `NEXT_PUBLIC_TWITTER_CREATOR` | Twitter 创作者账号 | （空） |

## 检查清单

- [ ] 在 `.env` 中配置环境变量
- [ ] 演示已替换为你的功能
- [ ] AI 提供商已配置
- [ ] Mock 模式已禁用
- [ ] 方案已自定义
- [ ] 营销页面已更新
- [ ] 国际化已配置（可选）
- [ ] 已部署到生产环境
- [ ] 生产环境变量已设置
- [ ] 数据库迁移已执行

## 需要帮助？

- 在开发模式下查看 `/readme` 路由
- 查阅 `docs/env-variables.md` 了解所有配置选项
- 查阅 `database/supabase/README.md` 了解数据库文档
