# 改造成你的产品

用约 2 小时将此模板改造成你自己的产品。

## 概述

本指南将引导你针对特定 AI 产品定制模板。完成后，你将拥有一个完全品牌化、功能齐全的 AI SaaS。

## 第一步：品牌配置（15 分钟）

### 1.1 应用名称和 URL

编辑 `src/config/env.ts`：

```typescript
app: {
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com',
  name: process.env.NEXT_PUBLIC_APP_NAME || '你的产品名称',
  // ...
}
```

或设置环境变量：

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=你的产品名称
```

### 1.2 SEO 元数据

编辑 `src/app/layout.tsx`：

```typescript
const appName = env.app.name
const description = '你的产品描述'
const keywords = ['你的', '关键词', '列表']
```

### 1.3 翻译文件

更新 `src/locales/en.json` 和 `src/locales/zh.json`：

```json
{
  "app": {
    "name": "你的产品名称",
    "tagline": "你的产品标语"
  }
}
```

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

编辑 `src/app/page.tsx` 使用你的演示：

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

编辑 `.env`：

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

编辑 `src/app/(marketing)/pricing/pricing-content.tsx`：
- 更新方案功能
- 调整价格显示

### 5.2 FAQ 页面

编辑 `src/app/(marketing)/faq/faq-content.tsx`：
- 替换为你的产品相关的常见问题

### 5.3 法律条款页面

编辑 `src/app/(marketing)/legal/legal-content.tsx`：
- 更新服务条款
- 更新隐私政策

## 第六步：部署（15 分钟）

### 6.1 部署到 Vercel

```bash
vercel
```

### 6.2 配置生产环境

在 Vercel 控制台设置环境变量：
- `.env.example` 中的所有变量
- `NEXT_PUBLIC_APP_URL` = 你的生产环境 URL

### 6.3 执行数据库迁移

在你的生产 Supabase 项目中执行所有迁移文件。

## 检查清单

- [ ] 品牌名称和 URL 已配置
- [ ] SEO 元数据已更新
- [ ] 演示已替换为你的功能
- [ ] AI 提供商已配置
- [ ] Mock 模式已禁用
- [ ] 方案已自定义
- [ ] 营销页面已更新
- [ ] 已部署到生产环境
- [ ] 生产环境变量已设置
- [ ] 数据库迁移已执行

## 需要帮助？

- 在开发模式下查看 `/readme` 路由
- 查阅 `docs/env-variables.md` 了解所有配置选项
- 查阅 `supabase/README.md` 了解数据库文档
