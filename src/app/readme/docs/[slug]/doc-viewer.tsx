'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'

interface DocViewerProps {
  content: string
  title: string
  titleZh: string
  slug: string
}

// 自定义 Markdown 组件
const components: Components = {
  // 标题样式
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

  // 段落
  p: ({ children }) => (
    <p className="my-4 leading-7 text-zinc-600 dark:text-zinc-400">
      {children}
    </p>
  ),

  // 列表
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

  // 行内代码
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

  // 代码块
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950">
      {children}
    </pre>
  ),

  // 表格
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

  // 引用块
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-zinc-300 bg-zinc-50 py-2 pl-4 pr-4 italic text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
      {children}
    </blockquote>
  ),

  // 链接
  a: ({ href, children }) => {
    // 处理文档内的相对链接
    let finalHref = href || ''
    if (finalHref === './README-zh.md' || finalHref === 'README-zh.md') {
      finalHref = '/readme/docs/readme-zh'
    } else if (finalHref === './README.md' || finalHref === 'README.md') {
      finalHref = '/readme/docs/readme'
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

  // 分割线
  hr: () => (
    <hr className="my-8 border-zinc-200 dark:border-zinc-700" />
  ),

  // 强调
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
      {children}
    </strong>
  ),

  // 图片
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ''}
      className="my-4 max-w-full rounded-lg"
    />
  ),
}

export function DocViewer({ content, title, titleZh, slug }: DocViewerProps) {
  const { locale } = useTranslation()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 返回导航 */}
      <Link
        href="/readme"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {locale === 'zh' ? '返回开发者指南' : 'Back to Developer Guide'}
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

      {/* 文档切换 */}
      {slug === 'readme' && (
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {locale === 'zh' ? '查看中文版本：' : 'View Chinese version: '}
            <Link href="/readme/docs/readme-zh" className="text-blue-600 hover:underline dark:text-blue-400">
              README-zh.md
            </Link>
          </p>
        </div>
      )}
      {slug === 'readme-zh' && (
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {locale === 'zh' ? '查看英文版本：' : 'View English version: '}
            <Link href="/readme/docs/readme" className="text-blue-600 hover:underline dark:text-blue-400">
              README.md
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
