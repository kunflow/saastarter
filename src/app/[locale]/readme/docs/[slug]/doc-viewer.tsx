'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'

interface DocViewerProps {
  content: string
  title: string
  titleZh: string
  locale: string
}

// 自定义 Markdown 组件
const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-6 mt-8 border-b border-zinc-200 pb-3 text-2xl font-bold text-zinc-900 first:mt-0 dark:border-zinc-700 dark:text-zinc-100">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-8 border-b border-zinc-100 pb-2 text-xl font-semibold text-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-6 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-4 text-base font-semibold text-zinc-700 dark:text-zinc-300">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-4 leading-7 text-zinc-600 dark:text-zinc-400">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="my-4 ml-6 list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 text-zinc-600 dark:text-zinc-400">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-7">
      {children}
    </li>
  ),
  code: ({ className, children }) => {
    const isCodeBlock = className?.includes('language-')
    if (isCodeBlock) {
      return (
        <code className="text-zinc-100">
          {children}
        </code>
      )
    }
    return (
      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-zinc-50 dark:bg-zinc-800">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr>
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-zinc-300 bg-zinc-50 py-2 pl-4 pr-4 italic text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => {
    let finalHref = href || ''

    // 处理文档内部链接 - 将 .md 文件链接转换为 /readme/docs/ 路由
    // README 文件链接
    if (finalHref.includes('README-zh.md')) {
      finalHref = '/readme/docs/readme'
    } else if (finalHref.includes('README.md') && !finalHref.includes('supabase')) {
      finalHref = '/readme/docs/readme'
    }
    // docs 目录下的文档链接
    else if (finalHref.includes('env-variables.md') || finalHref.includes('env-variables-zh.md')) {
      finalHref = '/readme/docs/env-variables'
    }
    else if (finalHref.includes('MAKE-IT-YOURS.md') || finalHref.includes('MAKE-IT-YOURS-zh.md')) {
      finalHref = '/readme/docs/make-it-yours'
    }
    else if (finalHref.includes('OPERATING-GUIDE.md') || finalHref.includes('OPERATING-GUIDE-zh.md')) {
      finalHref = '/readme/docs/operating-guide'
    }
    else if (finalHref.includes('LICENSING.md') || finalHref.includes('LICENSING-zh.md')) {
      finalHref = '/readme/docs/licensing'
    }
    // database 目录下的文档链接
    else if (finalHref.includes('database/supabase/README.md') || finalHref.includes('supabase/README.md')) {
      finalHref = '/readme/docs/database'
    }
    else if (finalHref.includes('database/README.md')) {
      finalHref = '/readme/docs/database-config'
    }

    const isExternal = finalHref.startsWith('http')
    return (
      <a
        href={finalHref}
        className="text-blue-600 hover:underline dark:text-blue-400"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  },
  hr: () => (
    <hr className="my-8 border-zinc-200 dark:border-zinc-700" />
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
      {children}
    </strong>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ''}
      className="my-4 max-w-full rounded-lg"
    />
  ),
}

export function DocViewer({ content, title, titleZh, locale }: DocViewerProps) {
  // 多语言文本
  const texts = {
    backToGuide: locale === 'zh' ? '返回开发者指南' : 'Back to Developer Guide',
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 返回导航 */}
      <Link
        href={`/${locale}/readme`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {texts.backToGuide}
      </Link>

      {/* 文档卡片 */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* 标题栏 */}
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {locale === 'zh' ? titleZh : title}
          </h1>
        </div>

        {/* 文档内容 */}
        <div className="px-6 py-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
