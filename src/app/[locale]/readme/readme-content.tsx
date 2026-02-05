'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs font-mono text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">
      {children}
    </code>
  )
}

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

function TableOfContents({ items, navigationLabel }: { items: NavItem[], navigationLabel: string }) {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        {navigationLabel}
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
  const params = useParams()
  const locale = params.locale as string

  // Internationalization texts
  const texts = {
    navigation: locale === 'zh' ? '导航' : 'Navigation',
    pageTitle: locale === 'zh' ? '开发者指南' : 'Developer Guide',
    pageSubtitle: locale === 'zh' ? '快速开始并自定义您的 AI SaaS 产品' : 'Get started and customize your AI SaaS product',
    warningBanner: locale === 'zh'
      ? '这是开发者指南页面。它不会显示在导航中，也不会被搜索引擎索引。'
      : 'This is the developer guide page. It is not shown in navigation and is not indexed by search engines.',
    // Section titles
    quickStart: locale === 'zh' ? '快速开始' : 'Quick Start',
    branding: locale === 'zh' ? '品牌定制' : 'Make It Yours',
    i18n: locale === 'zh' ? '国际化' : 'Internationalization',
    guardrails: locale === 'zh' ? '安全防护' : 'Guardrails',
    troubleshooting: locale === 'zh' ? '故障排除' : 'Troubleshooting',
    docs: locale === 'zh' ? '文档' : 'Documentation',
    // Quick Start section
    quickStartDesc: locale === 'zh'
      ? '体验完整流程：登录 → 生成 → 积分扣除 → 积分不足提示。'
      : 'Experience the complete flow: login → generate → credits deducted → insufficient credits prompt.',
    step1Title: locale === 'zh' ? '设置环境' : 'Set Up Environment',
    step1Item1: locale === 'zh' ? '复制' : 'Copy',
    step1Item1End: locale === 'zh' ? '到' : 'to',
    step1Item2: locale === 'zh' ? '从 Supabase 控制台获取项目 URL 和密钥' : 'Get Supabase project URL and keys from dashboard',
    step1Item3: locale === 'zh' ? '填写品牌相关的' : 'Fill in',
    step1Item3End: locale === 'zh' ? '变量' : 'variables for branding',
    step1Item4: locale === 'zh' ? '配置 i18n（可选）：' : 'Configure i18n (optional):',
    step1Item4Desc: locale === 'zh' ? '设为 false 禁用多语言' : 'set to false to disable multi-language',
    step2Title: locale === 'zh' ? '设置数据库' : 'Set Up Database',
    step2Desc: locale === 'zh' ? '选择以下数据库之一：' : 'Choose one of the following databases:',
    step2Supabase: locale === 'zh' ? 'Supabase（推荐）' : 'Supabase (recommended)',
    step2SupabasePath: 'database/supabase/migrations/',
    step2Postgresql: 'PostgreSQL',
    step2PostgresqlPath: 'database/postgresql/migrations/',
    step2Mysql: 'MySQL',
    step2MysqlPath: 'database/mysql/migrations/',
    step2Item1: locale === 'zh' ? '在 SQL 编辑器中按顺序运行迁移文件' : 'Run migration files in order in SQL editor',
    step2Item2: locale === 'zh' ? '设置环境变量' : 'Set environment variable',
    step2Item3: locale === 'zh' ? '验证表：system_config, plans, user_profiles, credits' : 'Verify tables: system_config, plans, user_profiles, credits',
    step3Title: locale === 'zh' ? '启动并测试' : 'Start and Test',
    step3Item1: locale === 'zh' ? '运行' : 'Run',
    step3Item1Mid: locale === 'zh' ? '然后' : 'then',
    step3Item2: locale === 'zh' ? '在首页注册新账户' : 'Register a new account on homepage',
    step3Item3: locale === 'zh' ? '使用文字转表情演示，观察积分变化' : 'Use Text-to-Emoji demo, watch credits change',
    step3Item4: locale === 'zh' ? '持续生成直到积分耗尽，查看阻止消息' : 'Generate until credits run out to see block message',
    quickStartTip: locale === 'zh'
      ? '默认启用多语言模式（en/zh）。如需单语言模式，设置 NEXT_PUBLIC_I18N_ENABLED=false'
      : 'Multi-language mode (en/zh) is enabled by default. For single-language mode, set NEXT_PUBLIC_I18N_ENABLED=false',
    // Branding section
    brandingTitle: locale === 'zh' ? '打造您的产品' : 'Make It Your Product',
    brandingDesc: locale === 'zh'
      ? '通过文件和环境变量自定义品牌 - 只需最少的代码修改。'
      : 'Customize branding via files and .env - minimal code changes required.',
    logoConfig: locale === 'zh' ? 'Logo 配置' : 'Logo Configuration',
    logoDesc1: locale === 'zh'
      ? '将您的 logo 放在目录中。默认：'
      : 'Place your logo in directory. Default:',
    logoDesc2: locale === 'zh'
      ? '只需在环境变量中设置文件名（不是完整路径）：'
      : 'Only set filename in .env (not full path):',
    logoLoads: locale === 'zh' ? '→ 加载' : '→ loads',
    supportedFormats: locale === 'zh' ? '支持的格式' : 'Supported Formats',
    recommendedSpecs: locale === 'zh' ? '推荐规格' : 'Recommended Specs',
    bestChoice: locale === 'zh' ? '最佳选择，完美缩放' : 'Best choice, scales perfectly',
    goodTransparency: locale === 'zh' ? '良好，支持透明' : 'Good, supports transparency',
    goodModern: locale === 'zh' ? '良好，现代格式' : 'Good, modern format',
    okayNoTransparency: locale === 'zh' ? '可用，无透明' : 'Okay, no transparency',
    size: locale === 'zh' ? '尺寸' : 'Size',
    ratio: locale === 'zh' ? '比例' : 'Ratio',
    file: locale === 'zh' ? '文件' : 'File',
    background: locale === 'zh' ? '背景' : 'Background',
    transparent: locale === 'zh' ? '透明' : 'Transparent',
    logoTip: locale === 'zh'
      ? '推荐使用 SVG 以获得最佳质量。显示尺寸：页头 28×28px，页脚 20×20px。'
      : 'SVG recommended for best quality. Display sizes: Header 28×28px, Footer 20×20px.',
    appBrand: locale === 'zh' ? '应用与品牌 (.env)' : 'App & Brand (.env)',
    productName: locale === 'zh' ? '产品名称' : 'Product name',
    tagline: locale === 'zh' ? '标语' : 'Tagline',
    footerCompany: locale === 'zh' ? '页脚公司名' : 'Footer company',
    supportEmail: locale === 'zh' ? '支持邮箱' : 'Support email',
    pageTitle2: locale === 'zh' ? '页面标题' : 'Page title',
    metaDescription: locale === 'zh' ? '元描述' : 'Meta description',
    keywords: locale === 'zh' ? '关键词' : 'Keywords',
    // i18n section
    i18nTitle: locale === 'zh' ? '国际化 (i18n)' : 'Internationalization (i18n)',
    i18nDesc: locale === 'zh'
      ? '基于 next-intl 的 URL 路由，支持单语言和多语言模式，可选 Lingo.dev CLI 自动翻译。'
      : 'URL-based routing with next-intl, supports single/multi-language modes, optional Lingo.dev CLI for auto-translation.',
    urlStructure: locale === 'zh' ? 'URL 结构' : 'URL Structure',
    englishPages: locale === 'zh' ? '英文页面' : 'English pages',
    chinesePages: locale === 'zh' ? '中文页面' : 'Chinese pages',
    redirectsTo: locale === 'zh' ? '重定向到默认语言' : 'Redirects to default locale',
    apiRoutes: locale === 'zh' ? 'API 路由（无语言前缀）' : 'API routes (no locale prefix)',
    keyFiles: locale === 'zh' ? '关键文件' : 'Key Files',
    localeDetection: locale === 'zh' ? '语言检测与重定向' : 'Locale detection & redirect',
    localesConfig: locale === 'zh' ? '语言配置（读取环境变量）' : 'Locales configuration (reads env)',
    localePages: locale === 'zh' ? '基于语言的页面' : 'Locale-based pages',
    translationFiles: locale === 'zh' ? '翻译文件（语义化键）' : 'Translation files (semantic keys)',
    nextIntlConfig: locale === 'zh' ? 'next-intl 请求配置' : 'next-intl request config',
    enableAutoTranslations: locale === 'zh' ? '启用自动翻译（可选）' : 'Enable Automatic Translations (Optional)',
    getApiKey: locale === 'zh' ? '从获取 API 密钥' : 'Get API key from',
    addToEnv: locale === 'zh' ? '添加到' : 'Add',
    toEnv: locale === 'zh' ? '' : 'to',
    runTranslate: locale === 'zh' ? '运行以生成翻译' : 'to generate translations',
    i18nModes: locale === 'zh' ? 'i18n 模式' : 'i18n Modes',
    singleLangMode: locale === 'zh' ? '单语言模式：' : 'Single language:',
    singleLangDesc: locale === 'zh' ? 'URL 无语言前缀，隐藏语言切换器' : 'No locale prefix in URL, language switcher hidden',
    multiLangMode: locale === 'zh' ? '多语言模式：' : 'Multi-language:',
    multiLangDesc: locale === 'zh' ? 'URL 有语言前缀，显示语言切换器' : 'Locale prefix in URL, language switcher visible',
    envConfig: locale === 'zh' ? '环境变量配置' : 'Environment Configuration',
    enableI18n: locale === 'zh' ? '启用/禁用多语言' : 'Enable/disable i18n',
    defaultLang: locale === 'zh' ? '默认语言' : 'Default locale',
    supportedLangs: locale === 'zh' ? '支持的语言列表' : 'Supported locales',
    languageSwitching: locale === 'zh' ? '语言切换' : 'Language Switching',
    headerToggle: locale === 'zh' ? '页头包含语言切换（多语言模式下显示）' : 'Header includes language toggle (visible in multi-language mode)',
    cookiePersistence: locale === 'zh' ? '偏好保存到 cookie 以持久化' : 'Preference saved to cookie for persistence',
    urlReflects: locale === 'zh' ? 'URL 变化反映当前语言' : 'URL changes reflect current locale',
    // Guardrails section
    guardrailsTitle: locale === 'zh' ? '运营防护' : 'Operational Guardrails',
    rateLimiting: locale === 'zh' ? '速率限制' : 'Rate Limiting',
    anonymous: locale === 'zh' ? '匿名用户' : 'Anonymous',
    freeUsers: locale === 'zh' ? '免费用户' : 'Free Users',
    proUsers: locale === 'zh' ? 'Pro 用户' : 'Pro Users',
    creditsPolicy: locale === 'zh' ? '积分策略' : 'Credits Policy',
    credits: locale === 'zh' ? '积分' : 'credits',
    freeSignupBonus: locale === 'zh' ? '免费注册奖励' : 'Free signup bonus',
    proMonthly: locale === 'zh' ? 'Pro 月度' : 'Pro monthly',
    anonymousAbuseRisk: locale === 'zh' ? '匿名滥用风险' : 'Anonymous Abuse Risk',
    reduceQuota: locale === 'zh' ? '将减少到 1 或 0' : 'to 1 or 0',
    requireRegistration: locale === 'zh' ? '要求注册才能使用 AI 功能' : 'Require registration for AI features',
    monitorTable: locale === 'zh' ? '监控 anonymous_quotas 表' : 'Monitor anonymous_quotas table',
    // Troubleshooting section
    loginIssues: locale === 'zh' ? '登录问题' : 'Login Issues',
    cantLogin: locale === 'zh' ? '无法登录：' : "Can't log in:",
    checkSupabase: locale === 'zh' ? '检查 Supabase URL 和 anon key' : 'Check Supabase URL and anon key',
    sessionLost: locale === 'zh' ? '会话丢失：' : 'Session lost:',
    verifyCookies: locale === 'zh' ? '验证 cookies 已启用' : 'Verify cookies enabled',
    stuckLoading: locale === 'zh' ? '加载卡住：' : 'Stuck loading:',
    checkNetwork: locale === 'zh' ? '检查网络标签页的错误' : 'Check network tab for errors',
    creditsIssues: locale === 'zh' ? '积分问题' : 'Credits Issues',
    balanceUnchanged: locale === 'zh' ? '余额未变：' : 'Balance unchanged:',
    checkUserStatus: locale === 'zh' ? '检查用户状态 API 调用' : 'Check user status API calls',
    wrongBalance: locale === 'zh' ? '余额错误：' : 'Wrong balance:',
    clearCache: locale === 'zh' ? '清除浏览器缓存' : 'Clear browser cache',
    noCredits: locale === 'zh' ? '无积分：' : 'No credits:',
    checkTrigger: locale === 'zh' ? '检查注册触发器是否执行' : 'Check signup trigger fired',
    i18nIssues: locale === 'zh' ? 'i18n 问题' : 'i18n Issues',
    noTranslations: locale === 'zh' ? '无翻译：' : 'No translations:',
    checkMessagesFiles: locale === 'zh' ? '检查 messages/*.json 文件是否存在' : 'Check messages/*.json files exist',
    wrongLocale: locale === 'zh' ? '语言错误：' : 'Wrong locale:',
    checkCookie: locale === 'zh' ? '检查 cookie 或 URL 前缀' : 'Check cookie or URL prefix',
    redirectLoop: locale === 'zh' ? '重定向循环：' : 'Redirect loop:',
    clearCookiesMiddleware: locale === 'zh' ? '清除 cookies，检查 middleware' : 'Clear cookies, check middleware',
    switcherNotShown: locale === 'zh' ? '语言切换器不显示：' : 'Language switcher not shown:',
    checkI18nEnabled: locale === 'zh' ? '检查 NEXT_PUBLIC_I18N_ENABLED=true' : 'Check NEXT_PUBLIC_I18N_ENABLED=true',
    databaseIssues: locale === 'zh' ? '数据库问题' : 'Database Issues',
    tablesNotFound: locale === 'zh' ? '找不到表：' : 'Tables not found:',
    runMigrations: locale === 'zh' ? '按顺序运行迁移' : 'Run migrations in order',
    permissionDenied: locale === 'zh' ? '权限被拒绝：' : 'Permission denied:',
    checkRLS: locale === 'zh' ? '检查 RLS 策略' : 'Check RLS policies',
    functionMissing: locale === 'zh' ? '函数缺失：' : 'Function missing:',
    runFunctionsMigration: locale === 'zh' ? '运行函数迁移' : 'Run functions migration',
    // Documentation section
    quickStartGuide: locale === 'zh' ? '快速开始指南' : 'Quick start guide',
    envReference: locale === 'zh' ? '环境变量参考' : 'Environment reference',
    databaseConfig: locale === 'zh' ? '数据库配置' : 'Database Configuration',
    multiDbSetup: locale === 'zh' ? '多数据库设置 & NextAuth.js' : 'Multi-database setup & NextAuth.js',
    databaseSchema: locale === 'zh' ? '数据库架构' : 'Database Schema',
    supabaseTables: locale === 'zh' ? 'Supabase 表与迁移' : 'Supabase tables & migrations',
    makeItYours: locale === 'zh' ? '改造成你的产品' : 'Make It Yours',
    customizationGuide: locale === 'zh' ? '定制化指南' : 'Customization guide',
    operatingGuide: locale === 'zh' ? '运营指南' : 'Operating Guide',
    productionBestPractices: locale === 'zh' ? '生产环境最佳实践' : 'Production best practices',
    licensing: locale === 'zh' ? '授权说明' : 'Licensing',
    licenseTerms: locale === 'zh' ? '许可条款' : 'License terms',
  }

  const navItems: NavItem[] = [
    { id: 'quick-start', title: texts.quickStart, icon: '🚀' },
    { id: 'branding', title: texts.branding, icon: '🎨' },
    { id: 'i18n', title: texts.i18n, icon: '🌍' },
    { id: 'guardrails', title: texts.guardrails, icon: '🛡️' },
    { id: 'troubleshooting', title: texts.troubleshooting, icon: '🔧' },
    { id: 'docs', title: texts.docs, icon: '📚' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {texts.pageTitle}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {texts.pageSubtitle}
        </p>
      </div>

      {/* Warning Banner */}
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <span>⚠️</span>
          <span>
            {texts.warningBanner}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <TableOfContents items={navItems} navigationLabel={texts.navigation} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="space-y-4">
          <Section id="quick-start" title={texts.quickStart} icon="🚀" defaultOpen={true}>
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              {texts.quickStartDesc}
            </p>

            <div className="space-y-4">
              <StepCard step={1} title={texts.step1Title}>
                <ListItem>{texts.step1Item1} <Code>.env.example</Code> {texts.step1Item1End} <Code>.env</Code></ListItem>
                <ListItem>{texts.step1Item2}</ListItem>
                <ListItem>{texts.step1Item3} <Code>NEXT_PUBLIC_*</Code> {texts.step1Item3End}</ListItem>
                <ListItem>{texts.step1Item4} <Code>NEXT_PUBLIC_I18N_ENABLED</Code> {texts.step1Item4Desc}</ListItem>
              </StepCard>

              <StepCard step={2} title={texts.step2Title}>
                <p className="mb-2 text-zinc-600 dark:text-zinc-400">{texts.step2Desc}</p>
                <div className="mb-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">●</span>
                    <strong>{texts.step2Supabase}</strong>
                    <Code>{texts.step2SupabasePath}</Code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">●</span>
                    <strong>{texts.step2Postgresql}</strong>
                    <Code>{texts.step2PostgresqlPath}</Code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600">●</span>
                    <strong>{texts.step2Mysql}</strong>
                    <Code>{texts.step2MysqlPath}</Code>
                  </div>
                </div>
                <ListItem>{texts.step2Item1}</ListItem>
                <ListItem>{texts.step2Item2} <Code>DATABASE_TYPE</Code></ListItem>
                <ListItem>{texts.step2Item3}</ListItem>
              </StepCard>

              <StepCard step={3} title={texts.step3Title}>
                <ListItem>{texts.step3Item1} <Code>pnpm install</Code> {texts.step3Item1Mid} <Code>pnpm dev</Code></ListItem>
                <ListItem>{texts.step3Item2}</ListItem>
                <ListItem>{texts.step3Item3}</ListItem>
                <ListItem>{texts.step3Item4}</ListItem>
              </StepCard>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                <span className="font-medium">💡 i18n:</span> {texts.quickStartTip}
              </div>
            </div>
          </Section>

          <Section id="branding" title={texts.brandingTitle} icon="🎨">
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              {texts.brandingDesc}
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">{texts.logoConfig}</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="mb-2 text-zinc-600 dark:text-zinc-400">
                      {texts.logoDesc1} <Code>public/logo/</Code> {locale === 'zh' ? '' : 'directory. Default:'} <Code>logo.svg</Code>
                    </p>
                    <p className="mb-2 text-zinc-600 dark:text-zinc-400">
                      {texts.logoDesc2}
                    </p>
                    <div className="rounded bg-zinc-100 p-2 font-mono text-xs dark:bg-zinc-800">
                      NEXT_PUBLIC_APP_LOGO=mylogo.svg {texts.logoLoads} /logo/mylogo.svg
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 font-medium text-zinc-700 dark:text-zinc-300">{texts.supportedFormats}</p>
                      <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
                        <ListItem><strong>SVG</strong> - {texts.bestChoice}</ListItem>
                        <ListItem><strong>PNG</strong> - {texts.goodTransparency}</ListItem>
                        <ListItem><strong>WebP</strong> - {texts.goodModern}</ListItem>
                        <ListItem><strong>JPG</strong> - {texts.okayNoTransparency}</ListItem>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 font-medium text-zinc-700 dark:text-zinc-300">{texts.recommendedSpecs}</p>
                      <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
                        <ListItem><strong>{texts.size}</strong>: 128×128px or 256×256px</ListItem>
                        <ListItem><strong>{texts.ratio}</strong>: {locale === 'zh' ? '正方形 (1:1)' : 'Square (1:1)'}</ListItem>
                        <ListItem><strong>{texts.file}</strong>: SVG &lt;10KB, PNG &lt;50KB</ListItem>
                        <ListItem><strong>{texts.background}</strong>: {texts.transparent}</ListItem>
                      </div>
                    </div>
                  </div>

                  <div className="rounded bg-blue-50 p-2 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                    💡 <strong>{locale === 'zh' ? '提示：' : 'Tip:'}</strong> {texts.logoTip}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">{texts.appBrand}</h4>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Code>APP_NAME</Code>
                    <span className="text-zinc-500">{texts.productName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code>APP_TAGLINE</Code>
                    <span className="text-zinc-500">{texts.tagline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code>COMPANY_NAME</Code>
                    <span className="text-zinc-500">{texts.footerCompany}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code>CONTACT_EMAIL</Code>
                    <span className="text-zinc-500">{texts.supportEmail}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">SEO (.env)</h4>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Code>SEO_TITLE</Code>
                    <span className="text-zinc-500">{texts.pageTitle2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code>SEO_DESCRIPTION</Code>
                    <span className="text-zinc-500">{texts.metaDescription}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code>SEO_KEYWORDS</Code>
                    <span className="text-zinc-500">{texts.keywords}</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="i18n" title={texts.i18nTitle} icon="🌍">
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              {texts.i18nDesc}
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <h4 className="mb-2 flex items-center gap-2 font-medium text-blue-800 dark:text-blue-200">
                  <span>💡</span> {texts.i18nModes}
                </h4>
                <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <ListItem><strong>{texts.singleLangMode}</strong> {texts.singleLangDesc}</ListItem>
                  <ListItem><strong>{texts.multiLangMode}</strong> {texts.multiLangDesc}</ListItem>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">{texts.envConfig}</h4>
                <div className="space-y-2 text-sm">
                  <ListItem><Code>NEXT_PUBLIC_I18N_ENABLED=true</Code> - {texts.enableI18n}</ListItem>
                  <ListItem><Code>NEXT_PUBLIC_DEFAULT_LOCALE=en</Code> - {texts.defaultLang}</ListItem>
                  <ListItem><Code>NEXT_PUBLIC_SUPPORTED_LOCALES=en,zh</Code> - {texts.supportedLangs}</ListItem>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">{texts.urlStructure}</h4>
                <div className="space-y-2 text-sm">
                  <ListItem><Code>/en/*</Code> - {texts.englishPages}</ListItem>
                  <ListItem><Code>/zh/*</Code> - {texts.chinesePages}</ListItem>
                  <ListItem><Code>/</Code> - {texts.redirectsTo}</ListItem>
                  <ListItem><Code>/api/*</Code> - {texts.apiRoutes}</ListItem>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">{texts.keyFiles}</h4>
                <div className="space-y-2 text-sm">
                  <ListItem><Code>src/middleware.ts</Code> - {texts.localeDetection}</ListItem>
                  <ListItem><Code>src/lib/i18n/config.ts</Code> - {texts.localesConfig}</ListItem>
                  <ListItem><Code>src/app/[locale]/</Code> - {texts.localePages}</ListItem>
                  <ListItem><Code>messages/*.json</Code> - {texts.translationFiles}</ListItem>
                  <ListItem><Code>src/lib/i18n/request.ts</Code> - {texts.nextIntlConfig}</ListItem>
                </div>
              </div>

              <StepCard step={1} title={texts.enableAutoTranslations}>
                <ListItem>{texts.getApiKey} <a href="https://lingo.dev" className="text-blue-600 hover:underline">lingo.dev</a></ListItem>
                <ListItem>{locale === 'zh' ? '安装 CLI：' : 'Install CLI:'} <Code>pnpm add -D @lingo.dev/cli</Code></ListItem>
                <ListItem>{texts.addToEnv} <Code>LINGODOTDEV_API_KEY=your_key</Code> {texts.toEnv} <Code>.env</Code></ListItem>
                <ListItem>{locale === 'zh' ? '运行翻译：' : 'Run translation:'} <Code>npx lingo translate</Code></ListItem>
              </StepCard>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">{texts.languageSwitching}</h4>
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <ListItem>{texts.headerToggle}</ListItem>
                  <ListItem>{texts.cookiePersistence}</ListItem>
                  <ListItem>{texts.urlReflects}</ListItem>
                </div>
              </div>
            </div>
          </Section>

          <Section id="guardrails" title={texts.guardrailsTitle} icon="🛡️">
            <div className="space-y-4">
              <div>
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">{texts.rateLimiting}</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-zinc-100 p-3 text-center dark:bg-zinc-800">
                    <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">3/{locale === 'zh' ? '天' : 'day'}</div>
                    <div className="text-xs text-zinc-500">{texts.anonymous}</div>
                  </div>
                  <div className="rounded-lg bg-zinc-100 p-3 text-center dark:bg-zinc-800">
                    <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">5/{locale === 'zh' ? '分钟' : 'min'}</div>
                    <div className="text-xs text-zinc-500">{texts.freeUsers}</div>
                  </div>
                  <div className="rounded-lg bg-zinc-100 p-3 text-center dark:bg-zinc-800">
                    <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">20/{locale === 'zh' ? '分钟' : 'min'}</div>
                    <div className="text-xs text-zinc-500">{texts.proUsers}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-medium text-zinc-900 dark:text-zinc-100">{texts.creditsPolicy}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">100 {texts.credits}</div>
                      <div className="text-xs text-zinc-500">{texts.freeSignupBonus}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <span className="text-2xl">💎</span>
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">1000 {texts.credits}</div>
                      <div className="text-xs text-zinc-500">{texts.proMonthly}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <h4 className="mb-2 flex items-center gap-2 font-medium text-amber-800 dark:text-amber-200">
                  <span>⚠️</span> {texts.anonymousAbuseRisk}
                </h4>
                <div className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  <ListItem>{locale === 'zh' ? '将' : 'Reduce'} <Code>ANONYMOUS_QUOTA</Code> {texts.reduceQuota}</ListItem>
                  <ListItem>{texts.requireRegistration}</ListItem>
                  <ListItem>{texts.monitorTable}</ListItem>
                </div>
              </div>
            </div>
          </Section>

          <Section id="troubleshooting" title={texts.troubleshooting} icon="🔧">
            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                  <span>🔐</span> {texts.loginIssues}
                </h4>
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <ListItem><strong>{texts.cantLogin}</strong> {texts.checkSupabase}</ListItem>
                  <ListItem><strong>{texts.sessionLost}</strong> {texts.verifyCookies}</ListItem>
                  <ListItem><strong>{texts.stuckLoading}</strong> {texts.checkNetwork}</ListItem>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                  <span>💰</span> {texts.creditsIssues}
                </h4>
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <ListItem><strong>{texts.balanceUnchanged}</strong> {texts.checkUserStatus}</ListItem>
                  <ListItem><strong>{texts.wrongBalance}</strong> {texts.clearCache}</ListItem>
                  <ListItem><strong>{texts.noCredits}</strong> {texts.checkTrigger}</ListItem>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                  <span>🌍</span> {texts.i18nIssues}
                </h4>
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <ListItem><strong>{texts.noTranslations}</strong> {texts.checkMessagesFiles}</ListItem>
                  <ListItem><strong>{texts.wrongLocale}</strong> {texts.checkCookie}</ListItem>
                  <ListItem><strong>{texts.redirectLoop}</strong> {texts.clearCookiesMiddleware}</ListItem>
                  <ListItem><strong>{texts.switcherNotShown}</strong> {texts.checkI18nEnabled}</ListItem>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h4 className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                  <span>🗄️</span> {texts.databaseIssues}
                </h4>
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <ListItem><strong>{texts.tablesNotFound}</strong> {texts.runMigrations}</ListItem>
                  <ListItem><strong>{texts.permissionDenied}</strong> {texts.checkRLS}</ListItem>
                  <ListItem><strong>{texts.functionMissing}</strong> {texts.runFunctionsMigration}</ListItem>
                </div>
              </div>
            </div>
          </Section>

          <Section id="docs" title={texts.docs} icon="📚">
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href={`/${locale}/readme/docs/readme`} className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
                <span className="text-2xl">📖</span>
                <div>
                  <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">README.md</div>
                  <div className="text-xs text-zinc-500">{texts.quickStartGuide}</div>
                </div>
              </Link>
              <Link href={`/${locale}/readme/docs/env-variables`} className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
                <span className="text-2xl">⚙️</span>
                <div>
                  <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">env-variables.md</div>
                  <div className="text-xs text-zinc-500">{texts.envReference}</div>
                </div>
              </Link>
              <Link href={`/${locale}/readme/docs/make-it-yours`} className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
                <span className="text-2xl">🎨</span>
                <div>
                  <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">{texts.makeItYours}</div>
                  <div className="text-xs text-zinc-500">{texts.customizationGuide}</div>
                </div>
              </Link>
              <Link href={`/${locale}/readme/docs/operating-guide`} className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
                <span className="text-2xl">📋</span>
                <div>
                  <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">{texts.operatingGuide}</div>
                  <div className="text-xs text-zinc-500">{texts.productionBestPractices}</div>
                </div>
              </Link>
              <Link href={`/${locale}/readme/docs/database-config`} className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
                <span className="text-2xl">🔧</span>
                <div>
                  <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">{texts.databaseConfig}</div>
                  <div className="text-xs text-zinc-500">{texts.multiDbSetup}</div>
                </div>
              </Link>
              <Link href={`/${locale}/readme/docs/database`} className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
                <span className="text-2xl">🗄️</span>
                <div>
                  <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">{texts.databaseSchema}</div>
                  <div className="text-xs text-zinc-500">{texts.supabaseTables}</div>
                </div>
              </Link>
              <Link href={`/${locale}/readme/docs/licensing`} className="group flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
                <span className="text-2xl">📜</span>
                <div>
                  <div className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100">{texts.licensing}</div>
                  <div className="text-xs text-zinc-500">{texts.licenseTerms}</div>
                </div>
              </Link>
            </div>
          </Section>
        </main>
      </div>
    </div>
  )
}
