import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { env } from '@/config/env'
import fs from 'fs'
import path from 'path'
import { DocViewer } from './doc-viewer'

// 文档配置 - 支持多语言
const docs: Record<string, {
  pathEn: string
  pathZh: string
  title: string
  titleZh: string
}> = {
  'readme': {
    pathEn: 'README.md',
    pathZh: 'README-zh.md',
    title: 'Quick Start Guide',
    titleZh: '快速上手指南',
  },
  'env-variables': {
    pathEn: 'docs/env-variables.md',
    pathZh: 'docs/env-variables-zh.md',
    title: 'Environment Variables',
    titleZh: '环境变量参考',
  },
  'database': {
    pathEn: 'database/supabase/README.md',
    pathZh: 'database/supabase/README-zh.md',
    title: 'Database Schema (Supabase)',
    titleZh: '数据库结构 (Supabase)',
  },
  'database-config': {
    pathEn: 'database/README.md',
    pathZh: 'database/README-zh.md',
    title: 'Database Configuration',
    titleZh: '数据库配置指南',
  },
  'make-it-yours': {
    pathEn: 'docs/MAKE-IT-YOURS.md',
    pathZh: 'docs/MAKE-IT-YOURS-zh.md',
    title: 'Make It Yours',
    titleZh: '改造成你的产品',
  },
  'operating-guide': {
    pathEn: 'docs/OPERATING-GUIDE.md',
    pathZh: 'docs/OPERATING-GUIDE-zh.md',
    title: 'Operating Guide',
    titleZh: '运营指南',
  },
  'licensing': {
    pathEn: 'docs/LICENSING.md',
    pathZh: 'docs/LICENSING-zh.md',
    title: 'Licensing',
    titleZh: '授权说明',
  },
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = docs[slug]

  return {
    title: doc?.title || 'Documentation',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function DocPage({ params }: PageProps) {
  // 检查是否启用 readme 页面
  if (!env.features.enableReadmePage) {
    notFound()
  }

  const { locale, slug } = await params
  const doc = docs[slug]

  if (!doc) {
    notFound()
  }

  // 根据 locale 选择对应语言的文档路径
  const docPath = locale === 'zh' ? doc.pathZh : doc.pathEn
  const filePath = path.join(process.cwd(), docPath)

  let content = ''
  try {
    content = fs.readFileSync(filePath, 'utf-8')
  } catch {
    // 如果中文文档不存在，回退到英文文档
    if (locale === 'zh') {
      try {
        const fallbackPath = path.join(process.cwd(), doc.pathEn)
        content = fs.readFileSync(fallbackPath, 'utf-8')
      } catch {
        notFound()
      }
    } else {
      notFound()
    }
  }

  return (
    <DocViewer
      content={content}
      title={doc.title}
      titleZh={doc.titleZh}
      locale={locale}
    />
  )
}

export function generateStaticParams() {
  const locales = ['en', 'zh']
  const slugs = Object.keys(docs)

  return locales.flatMap(locale =>
    slugs.map(slug => ({ locale, slug }))
  )
}
