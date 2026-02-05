import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { env } from '@/config/env'
import fs from 'fs'
import path from 'path'
import { DocViewer } from './doc-viewer'

// 文档配置
const docs: Record<string, { path: string; title: string; titleZh: string }> = {
  'readme': {
    path: 'README.md',
    title: 'Quick Start Guide',
    titleZh: '快速上手指南',
  },
  'readme-zh': {
    path: 'README-zh.md',
    title: 'Quick Start Guide (Chinese)',
    titleZh: '快速上手指南',
  },
  'env-variables': {
    path: 'docs/env-variables.md',
    title: 'Environment Variables',
    titleZh: '环境变量参考',
  },
  'database': {
    path: 'supabase/README.md',
    title: 'Database Schema',
    titleZh: '数据库结构',
  },
}

interface PageProps {
  params: Promise<{ slug: string }>
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

  const { slug } = await params
  const doc = docs[slug]

  if (!doc) {
    notFound()
  }

  // 读取文档内容
  const filePath = path.join(process.cwd(), doc.path)

  let content = ''
  try {
    content = fs.readFileSync(filePath, 'utf-8')
  } catch {
    notFound()
  }

  return (
    <DocViewer
      content={content}
      title={doc.title}
      titleZh={doc.titleZh}
      slug={slug}
    />
  )
}

export function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({ slug }))
}
