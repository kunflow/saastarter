'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

interface SectionProps {
  id: string
  title: string
  icon: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function Section({ id, title, icon, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div id={id} className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
        </div>
        <svg
          className={`h-5 w-5 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-zinc-200 px-6 py-5 dark:border-zinc-800">
          {children}
        </div>
      )}
    </div>
  )
}

// 步骤卡片组件
interface StepCardProps {
  step: number
  title: string
  children: React.ReactNode
}

function StepCard({ step, title, children }: StepCardProps) {
  return (
    <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
          {step}
        </span>
        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{title}</h4>
      </div>
      <div className="ml-10 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        {children}
      </div>
    </div>
  )
}

// 代码标签组件
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs font-mono text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">
      {children}
    </code>
  )
}

// 列表项组件
function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
      <span>{children}</span>
    </div>
  )
}

interface NavItem {
  id: string
  title: string
  icon: string
}

function TableOfContents({ items, locale }: { items: NavItem[]; locale: string }) {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        {locale === 'zh' ? '目录导航' : 'Navigation'}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <span>{item.icon}</span>
            <span>{item.title}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export function ReadmeContent() {
  const { locale } = useTranslation()

  const navItemsEN: NavItem[] = [
    { id: 'quick-start', title: 'Quick Start', icon: '🚀' },
    { id: 'branding', title: 'Make It Yours', icon: '🎨' },
    { id: 'guardrails', title: 'Guardrails', icon: '🛡️' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' },
    { id: 'docs', title: 'Documentation', icon: '📚' },
  ]

  const navItemsZH: NavItem[] = [
    { id: 'quick-start', title: '快速上手', icon: '🚀' },
    { id: 'branding', title: '品牌定制', icon: '🎨' },
    { id: 'guardrails', title: '运营护栏', icon: '🛡️' },
    { id: 'troubleshooting', title: '问题排障', icon: '🔧' },
    { id: 'docs', title: '文档索引', icon: '📚' },
  ]

  const navItems = locale === 'zh' ? navItemsZH : navItemsEN

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {locale === 'zh' ? '开发者指南' : 'Developer Guide'}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {locale === 'zh'
            ? '快速上手并定制你的 AI SaaS 产品'
            : 'Get started and customize your AI SaaS product'}
        </p>
      </div>

      {/* Warning Banner */}
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <span>⚠️</span>
          <span>
            {locale === 'zh'
              ? '这是开发者指南页面，默认不会出现在导航中，也不会被搜索引擎收录。'
              : 'This is the developer guide page. It is not shown in navigation and is not indexed by search engines.'}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <TableOfContents items={navItems} locale={locale} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="space-y-4">
          {locale === 'zh' ? <ContentZH /> : <ContentEN />}
        </main>
      </div>
    </div>
  )
}

function ContentEN() {
  return (
    <>
      <Section id="quick-start" title="Quick Start" icon="🚀" defaultOpen={true}>
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">
          Experience the complete flow: login → generate → credits deducted → insufficient credits prompt.
        </p>

        <div className="space-y-4">
          <StepCard step={1} title="Set Up Environment">
            <ListItem>Copy <Code>.env.example</Code> to <Code>.env</Code></ListItem>
            <ListItem>Get Supabase project URL and keys from dashboard</ListItem>
            <ListItem>Fill in <Code>NEXT_PUBLIC_*</Code> variables for branding</ListItem>
          </StepCard>

          <StepCard step={2} title="Set Up Database">
            <ListItem>Go to Supabase SQL editor</ListItem>
            <ListItem>Run 8 migration files in order</ListItem>
            <ListItem>Verify tables: system_config, plans, user_profiles, credits</ListItem>
          </StepCard>

          <StepCard step={3} title="Start and Test">
            <ListItem>Run <Code>pnpm install</Code> then <Code>pnpm dev</Code></ListItem>
            <ListItem>Register a new account on homepage</ListItem>
            <ListItem>Use Text-to-Emoji demo, watch credits change</ListItem>
            <ListItem>Generate until credits run out to see block message</ListItem>
          </StepCard>
        </div>
      </Section>

      <Section id="branding" title="Make It Your Product" icon="🎨">
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">
          All branding via <Code>.env</Code> - no code changes required.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">App & Brand</h4>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Code>APP_NAME</Code>
                <span className="text-zinc-500">Product name</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>APP_LOGO</Code>
                <span className="text-zinc-500">Logo emoji/path</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>APP_TAGLINE</Code>
                <span className="text-zinc-500">Tagline</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>COMPANY_NAME</Code>
                <span className="text-zinc-500">Footer company</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>CONTACT_EMAIL</Code>
                <span className="text-zinc-500">Support email</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">SEO</h4>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Code>SEO_TITLE</Code>
                <span className="text-zinc-500">Page title</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>SEO_DESCRIPTION</Code>
                <span className="text-zinc-500">Meta description</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>SEO_KEYWORDS</Code>
                <span className="text-zinc-500">Keywords</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">Config Files (Advanced)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Code>src/config/site.ts</Code>
                <span className="text-zinc-500">Brand, contact, legal</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>src/config/seo.ts</Code>
                <span className="text-zinc-500">SEO, OpenGraph</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>src/config/plans.ts</Code>
                <span className="text-zinc-500">Plan definitions</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>src/config/credits.ts</Code>
                <span className="text-zinc-500">Credits rules</span>
              </div>
            </div>
          </div>

          <StepCard step={1} title="Replace Homepage Demo">
            <ListItem>Demo in <Code>src/components/demo/</Code></ListItem>
            <ListItem>Call <Code>/api/ai/generate</Code> endpoint</ListItem>
            <ListItem>Handle streaming responses</ListItem>
            <ListItem>Show credits before and after</ListItem>
          </StepCard>
        </div>
      </Section>

      <Section id="guardrails" title="Operational Guardrails" icon="🛡️">
        <div className="space-y-4">
          <div>
            <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">Rate Limiting</h4>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-zinc-100 p-3 text-center dark:bg-zinc-800">
                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">3/day</div>
                <div className="text-xs text-zinc-500">Anonymous</div>
              </div>
              <div className="rounded-lg bg-zinc-100 p-3 text-center dark:bg-zinc-800">
                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">5/min</div>
                <div className="text-xs text-zinc-500">Free Users</div>
              </div>
              <div className="rounded-lg bg-zinc-100 p-3 text-center dark:bg-zinc-800">
                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">20/min</div>
                <div className="text-xs text-zinc-500">Pro Users</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">Credits Policy</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                <span className="text-2xl">🎁</span>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">100 credits</div>
                  <div className="text-xs text-zinc-500">Free signup bonus</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <span className="text-2xl">💎</span>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">1000 credits</div>
                  <div className="text-xs text-zinc-500">Pro monthly</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <h4 className="mb-2 flex items-center gap-2 font-medium text-amber-800 dark:text-amber-200">
              <span>⚠️</span> Anonymous Abuse Risk
            </h4>
            <div className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
              <ListItem>Reduce <Code>ANONYMOUS_QUOTA</Code> to 1 or 0</ListItem>
              <ListItem>Require registration for AI features</ListItem>
              <ListItem>Monitor anonymous_quotas table</ListItem>
            </div>
          </div>
        </div>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting" icon="🔧">
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
              <span>🔐</span> Login Issues
            </h4>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <ListItem><strong>Can&apos;t log in:</strong> Check Supabase URL and anon key</ListItem>
              <ListItem><strong>Session lost:</strong> Verify cookies enabled</ListItem>
              <ListItem><strong>Stuck loading:</strong> Check network tab for errors</ListItem>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
              <span>💰</span> Credits Issues
            </h4>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <ListItem><strong>Balance unchanged:</strong> Check user status API calls</ListItem>
              <ListItem><strong>Wrong balance:</strong> Clear browser cache</ListItem>
              <ListItem><strong>No credits:</strong> Check signup trigger fired</ListItem>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
              <span>⚡</span> Generation Failures
            </h4>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <ListItem><strong>Insufficient credits:</strong> Check credits table</ListItem>
              <ListItem><strong>DB not configured:</strong> Check env variables</ListItem>
              <ListItem><strong>Quota exceeded:</strong> Anonymous limit hit, register</ListItem>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
              <span>🗄️</span> Database Issues
            </h4>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <ListItem><strong>Tables not found:</strong> Run migrations in order</ListItem>
              <ListItem><strong>Permission denied:</strong> Check RLS policies</ListItem>
              <ListItem><strong>Function missing:</strong> Run functions migration</ListItem>
            </div>
          </div>
        </div>
      </Section>

      <Section id="docs" title="Documentation" icon="📚">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/readme/docs/readme" className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
            <span className="text-2xl">📖</span>
            <div>
              <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">README.md</div>
              <div className="text-xs text-zinc-500">Quick start guide</div>
            </div>
          </Link>
          <Link href="/readme/docs/env-variables" className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
            <span className="text-2xl">⚙️</span>
            <div>
              <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">env-variables.md</div>
              <div className="text-xs text-zinc-500">Environment reference</div>
            </div>
          </Link>
          <Link href="/readme/docs/database" className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
            <span className="text-2xl">🗄️</span>
            <div>
              <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">supabase/README.md</div>
              <div className="text-xs text-zinc-500">Database schema</div>
            </div>
          </Link>
        </div>
      </Section>
    </>
  )
}

function ContentZH() {
  return (
    <>
      <Section id="quick-start" title="快速上手" icon="🚀" defaultOpen={true}>
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">
          体验完整流程：登录 → 生成 → 额度扣减 → 额度不足提示。
        </p>

        <div className="space-y-4">
          <StepCard step={1} title="配置环境">
            <ListItem>复制 <Code>.env.example</Code> 为 <Code>.env</Code></ListItem>
            <ListItem>从 Supabase 控制台获取项目 URL 和密钥</ListItem>
            <ListItem>填写 <Code>NEXT_PUBLIC_*</Code> 变量配置品牌信息</ListItem>
          </StepCard>

          <StepCard step={2} title="初始化数据库">
            <ListItem>进入 Supabase SQL 编辑器</ListItem>
            <ListItem>按顺序执行 8 个迁移文件</ListItem>
            <ListItem>验证表已创建：system_config、plans、user_profiles、credits</ListItem>
          </StepCard>

          <StepCard step={3} title="启动并测试">
            <ListItem>运行 <Code>pnpm install</Code> 然后 <Code>pnpm dev</Code></ListItem>
            <ListItem>在首页注册新账号</ListItem>
            <ListItem>使用文字转表情演示，观察额度变化</ListItem>
            <ListItem>持续生成直到额度耗尽，观察拦截提示</ListItem>
          </StepCard>
        </div>
      </Section>

      <Section id="branding" title="品牌定制" icon="🎨">
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">
          所有品牌设置通过 <Code>.env</Code> 配置，无需修改代码。
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">应用与品牌</h4>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Code>APP_NAME</Code>
                <span className="text-zinc-500">产品名称</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>APP_LOGO</Code>
                <span className="text-zinc-500">Logo 表情/路径</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>APP_TAGLINE</Code>
                <span className="text-zinc-500">品牌标语</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>COMPANY_NAME</Code>
                <span className="text-zinc-500">页脚公司名</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>CONTACT_EMAIL</Code>
                <span className="text-zinc-500">联系邮箱</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">SEO 配置</h4>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Code>SEO_TITLE</Code>
                <span className="text-zinc-500">页面标题</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>SEO_DESCRIPTION</Code>
                <span className="text-zinc-500">Meta 描述</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>SEO_KEYWORDS</Code>
                <span className="text-zinc-500">关键词</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">配置文件（高级）</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Code>src/config/site.ts</Code>
                <span className="text-zinc-500">品牌、联系方式、法律</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>src/config/seo.ts</Code>
                <span className="text-zinc-500">SEO、OpenGraph</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>src/config/plans.ts</Code>
                <span className="text-zinc-500">方案定义</span>
              </div>
              <div className="flex items-center gap-2">
                <Code>src/config/credits.ts</Code>
                <span className="text-zinc-500">额度规则</span>
              </div>
            </div>
          </div>

          <StepCard step={1} title="替换首页演示">
            <ListItem>演示组件在 <Code>src/components/demo/</Code></ListItem>
            <ListItem>调用 <Code>/api/ai/generate</Code> 接口</ListItem>
            <ListItem>处理流式响应</ListItem>
            <ListItem>生成前后显示额度</ListItem>
          </StepCard>
        </div>
      </Section>

      <Section id="guardrails" title="运营护栏" icon="🛡️">
        <div className="space-y-4">
          <div>
            <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">限流策略</h4>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-zinc-100 p-3 text-center dark:bg-zinc-800">
                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">3次/天</div>
                <div className="text-xs text-zinc-500">匿名用户</div>
              </div>
              <div className="rounded-lg bg-zinc-100 p-3 text-center dark:bg-zinc-800">
                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">5次/分钟</div>
                <div className="text-xs text-zinc-500">免费用户</div>
              </div>
              <div className="rounded-lg bg-zinc-100 p-3 text-center dark:bg-zinc-800">
                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">20次/分钟</div>
                <div className="text-xs text-zinc-500">Pro 用户</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">额度策略</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                <span className="text-2xl">🎁</span>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">100 额度</div>
                  <div className="text-xs text-zinc-500">免费注册赠送</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <span className="text-2xl">💎</span>
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">1000 额度</div>
                  <div className="text-xs text-zinc-500">Pro 每月</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <h4 className="mb-2 flex items-center gap-2 font-medium text-amber-800 dark:text-amber-200">
              <span>⚠️</span> 匿名滥用风险
            </h4>
            <div className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
              <ListItem>将 <Code>ANONYMOUS_QUOTA</Code> 减少到 1 或 0</ListItem>
              <ListItem>要求所有 AI 功能必须注册</ListItem>
              <ListItem>监控 anonymous_quotas 表</ListItem>
            </div>
          </div>
        </div>
      </Section>

      <Section id="troubleshooting" title="问题排障" icon="🔧">
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
              <span>🔐</span> 登录问题
            </h4>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <ListItem><strong>无法登录：</strong>检查 Supabase URL 和 anon key</ListItem>
              <ListItem><strong>会话丢失：</strong>确认 Cookie 已启用</ListItem>
              <ListItem><strong>卡在加载：</strong>检查网络请求标签页</ListItem>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
              <span>💰</span> 额度问题
            </h4>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <ListItem><strong>余额不变：</strong>检查用户状态 API 调用</ListItem>
              <ListItem><strong>余额错误：</strong>清除浏览器缓存</ListItem>
              <ListItem><strong>没有额度：</strong>检查注册触发器是否执行</ListItem>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
              <span>⚡</span> 生成失败
            </h4>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <ListItem><strong>额度不足：</strong>检查 credits 表</ListItem>
              <ListItem><strong>数据库未配置：</strong>检查环境变量</ListItem>
              <ListItem><strong>配额超限：</strong>匿名用户达到限制，注册账号</ListItem>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
              <span>🗄️</span> 数据库问题
            </h4>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <ListItem><strong>找不到表：</strong>按顺序执行迁移文件</ListItem>
              <ListItem><strong>权限被拒绝：</strong>检查 RLS 策略</ListItem>
              <ListItem><strong>函数缺失：</strong>执行函数迁移文件</ListItem>
            </div>
          </div>
        </div>
      </Section>

      <Section id="docs" title="文档索引" icon="📚">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/readme/docs/readme-zh" className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
            <span className="text-2xl">📖</span>
            <div>
              <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">README-zh.md</div>
              <div className="text-xs text-zinc-500">快速上手指南</div>
            </div>
          </Link>
          <Link href="/readme/docs/env-variables" className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
            <span className="text-2xl">⚙️</span>
            <div>
              <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">env-variables.md</div>
              <div className="text-xs text-zinc-500">环境变量参考</div>
            </div>
          </Link>
          <Link href="/readme/docs/database" className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
            <span className="text-2xl">🗄️</span>
            <div>
              <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">supabase/README.md</div>
              <div className="text-xs text-zinc-500">数据库结构</div>
            </div>
          </Link>
        </div>
      </Section>
    </>
  )
}
