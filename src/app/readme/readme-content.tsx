'use client'

import { useTranslation } from '@/lib/i18n'

export function ReadmeContent() {
  const { locale } = useTranslation()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
        {locale === 'zh'
          ? '这是开发者指南页面，默认不会出现在导航中，也不会被搜索引擎收录。'
          : 'This is the developer guide page. It is not shown in navigation and is not indexed by search engines.'}
      </div>

      {locale === 'zh' ? <ContentZH /> : <ContentEN />}
    </div>
  )
}

function ContentEN() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Getting Started Guide</h1>

      {/* Section 1: Quick Start */}
      <section>
        <h2>1. Three-Minute Quick Start</h2>
        <p>
          Follow these steps to experience the complete flow: login, generate content, see credits deducted, and trigger the insufficient credits prompt.
        </p>

        <h3>Step 1: Set Up Environment</h3>
        <ol>
          <li>Copy the environment template file and rename it to the local config file</li>
          <li>Get your Supabase project URL and keys from the Supabase dashboard</li>
          <li>Fill in the Supabase URL and anon key in the config file</li>
          <li>Fill in the service role key (for server-side operations)</li>
        </ol>

        <h3>Step 2: Set Up Database</h3>
        <ol>
          <li>Go to your Supabase project SQL editor</li>
          <li>Run the migration files in order (there are 8 files in the migrations folder)</li>
          <li>Verify the tables are created: system_config, plans, user_profiles, credits, etc.</li>
        </ol>

        <h3>Step 3: Start and Test</h3>
        <ol>
          <li>Install dependencies using pnpm</li>
          <li>Start the development server</li>
          <li>Open the homepage in your browser</li>
          <li>Register a new account</li>
          <li>Use the Text-to-Emoji demo on the homepage</li>
          <li>Check the dashboard to see your credits balance change</li>
          <li>Keep generating until credits run out to see the block message</li>
        </ol>
      </section>

      {/* Section 2: Make It Yours */}
      <section>
        <h2>2. Make It Your Product (2-Hour Guide)</h2>

        <h3>Brand Configuration</h3>
        <p>All brand settings are centralized in the environment config file:</p>
        <ul>
          <li><strong>App Name</strong>: Change the NEXT_PUBLIC_APP_NAME variable</li>
          <li><strong>App URL</strong>: Update NEXT_PUBLIC_APP_URL for production</li>
          <li><strong>Logo</strong>: Replace the emoji in the Header component or add your own logo file</li>
        </ul>

        <h3>Replace the Homepage Demo</h3>
        <p>The demo component is located in the components/demo folder:</p>
        <ol>
          <li>The current demo is Text-to-Emoji, which is a good reference for structure</li>
          <li>Create your own demo component following the same pattern</li>
          <li>Your demo should call the AI generation API endpoint</li>
          <li>Handle streaming responses and display progress</li>
          <li>Show credits status before and after generation</li>
          <li>Replace the demo component import on the homepage</li>
        </ol>

        <h3>Add a New Business Route</h3>
        <ol>
          <li>Create a new folder under src/app with your route name</li>
          <li>Add a page file inside the folder</li>
          <li>If the page needs authentication, check for user status and redirect if needed</li>
          <li>If the page needs credits, use the AI generate API which handles deduction</li>
          <li>Add translations for your new page in both locale files</li>
        </ol>

        <h3>Adjust Plans and Entitlements</h3>
        <p>Plan definitions are in two places:</p>
        <ul>
          <li><strong>Database</strong>: The plans and plan_entitlements tables contain the source of truth</li>
          <li><strong>Config file</strong>: The plans config file provides client-side type definitions</li>
        </ul>
        <p>To add a new plan or modify entitlements, update both the database seed data and the config file.</p>
      </section>

      {/* Section 3: Operational Guardrails */}
      <section>
        <h2>3. Operational Guardrails</h2>

        <h3>Default Rate Limiting Strategy</h3>
        <ul>
          <li><strong>Anonymous users</strong>: 3 requests per day (configurable via ANONYMOUS_QUOTA)</li>
          <li><strong>Free users</strong>: 5 requests per minute, 50 per hour</li>
          <li><strong>Pro users</strong>: 20 requests per minute, 500 per hour</li>
        </ul>

        <h3>Default Credits Policy</h3>
        <ul>
          <li>New free users receive 100 credits on signup</li>
          <li>Pro users receive 1000 credits monthly</li>
          <li>Each AI generation consumes 1 credit</li>
          <li>When balance reaches zero, generation is blocked</li>
        </ul>

        <h3>Anonymous Abuse Risk</h3>
        <p>
          Anonymous users can test the demo without registering. This is intentional for conversion,
          but carries abuse risk. The default 3-per-day limit is conservative. If you see abuse:
        </p>
        <ul>
          <li>Reduce ANONYMOUS_QUOTA to 1 or 0</li>
          <li>Consider requiring registration for all AI features</li>
          <li>Monitor the anonymous_quotas table for suspicious patterns</li>
        </ul>

        <h3>Adjusting Default Credits</h3>
        <p>To change the default credits for new users:</p>
        <ul>
          <li>Update DEFAULT_FREE_CREDITS in your environment config</li>
          <li>Also update the system_config table in the database (key: default_credits)</li>
          <li>Existing users are not affected; only new signups get the new amount</li>
        </ul>
      </section>

      {/* Section 4: Troubleshooting */}
      <section>
        <h2>4. Troubleshooting Common Issues</h2>

        <h3>Login/Session Problems</h3>
        <ul>
          <li><strong>Cannot log in</strong>: Check if Supabase URL and anon key are correctly set</li>
          <li><strong>Session not persisting</strong>: Verify cookies are enabled; check browser console for errors</li>
          <li><strong>Stuck on loading</strong>: The AuthProvider might be waiting for Supabase; check network tab</li>
        </ul>

        <h3>Credits Not Refreshing</h3>
        <ul>
          <li><strong>Balance unchanged after generation</strong>: The user status API should be called; check dashboard network requests</li>
          <li><strong>Shows wrong balance</strong>: Clear browser cache; the credits table might have stale data</li>
          <li><strong>New user has no credits</strong>: Check if the signup trigger fired; look at the credit_ledger table</li>
        </ul>

        <h3>Generation Failures</h3>
        <ul>
          <li><strong>Error: Insufficient credits</strong>: Check the credits table for the user; balance might be zero</li>
          <li><strong>Error: Database not configured</strong>: Supabase environment variables are missing or invalid</li>
          <li><strong>Error: Daily quota exceeded</strong>: Anonymous user hit the limit; try registering</li>
          <li><strong>No response</strong>: Check if the AI mock mode is enabled; check server console for errors</li>
        </ul>

        <h3>Streaming Output Not Showing</h3>
        <ul>
          <li><strong>Text appears all at once</strong>: The SSE stream might not be parsing correctly; check the response content type</li>
          <li><strong>Nothing appears</strong>: The fetch request might be failing silently; check browser console</li>
          <li><strong>Partial output</strong>: The stream might be closing early; check server logs for errors</li>
        </ul>

        <h3>Database Issues</h3>
        <ul>
          <li><strong>Tables not found</strong>: Run all migration files in order</li>
          <li><strong>Permission denied</strong>: Check RLS policies; service role key might be needed for admin operations</li>
          <li><strong>Function not found</strong>: The functions migration file might not have run; check for get_user_status</li>
        </ul>
      </section>
    </article>
  )
}

function ContentZH() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>快速上手指南</h1>

      {/* Section 1: Quick Start */}
      <section>
        <h2>1. 三分钟快速跑通</h2>
        <p>
          按照以下步骤体验完整流程：登录、生成内容、看到额度扣减、触发额度不足提示。
        </p>

        <h3>步骤一：配置环境</h3>
        <ol>
          <li>复制环境变量模板文件，重命名为本地配置文件</li>
          <li>从 Supabase 控制台获取项目 URL 和密钥</li>
          <li>在配置文件中填入 Supabase URL 和 anon key</li>
          <li>填入 service role key（用于服务端操作）</li>
        </ol>

        <h3>步骤二：初始化数据库</h3>
        <ol>
          <li>进入 Supabase 项目的 SQL 编辑器</li>
          <li>按顺序执行迁移文件（migrations 目录下共 8 个文件）</li>
          <li>验证表已创建：system_config、plans、user_profiles、credits 等</li>
        </ol>

        <h3>步骤三：启动并测试</h3>
        <ol>
          <li>使用 pnpm 安装依赖</li>
          <li>启动开发服务器</li>
          <li>在浏览器中打开首页</li>
          <li>注册新账号</li>
          <li>在首页使用文字转表情演示</li>
          <li>查看控制台确认额度变化</li>
          <li>持续生成直到额度耗尽，观察拦截提示</li>
        </ol>
      </section>

      {/* Section 2: Make It Yours */}
      <section>
        <h2>2. 改成你的产品（2 小时指南）</h2>

        <h3>品牌配置</h3>
        <p>所有品牌设置都集中在环境配置文件中：</p>
        <ul>
          <li><strong>应用名称</strong>：修改 NEXT_PUBLIC_APP_NAME 变量</li>
          <li><strong>应用地址</strong>：生产环境更新 NEXT_PUBLIC_APP_URL</li>
          <li><strong>Logo</strong>：替换 Header 组件中的表情符号，或添加自己的 Logo 文件</li>
        </ul>

        <h3>替换首页演示</h3>
        <p>演示组件位于 components/demo 目录：</p>
        <ol>
          <li>当前演示是文字转表情，可作为结构参考</li>
          <li>按照相同模式创建你自己的演示组件</li>
          <li>演示应调用 AI 生成接口</li>
          <li>处理流式响应并显示进度</li>
          <li>在生成前后显示额度状态</li>
          <li>在首页替换演示组件的引入</li>
        </ol>

        <h3>添加新业务路由</h3>
        <ol>
          <li>在 src/app 下创建新的路由文件夹</li>
          <li>在文件夹内添加页面文件</li>
          <li>如需登录验证，检查用户状态并在未登录时重定向</li>
          <li>如需消耗额度，使用 AI 生成接口（会自动扣减）</li>
          <li>在两个语言文件中添加新页面的翻译</li>
        </ol>

        <h3>调整方案和权益</h3>
        <p>方案定义在两个地方：</p>
        <ul>
          <li><strong>数据库</strong>：plans 和 plan_entitlements 表是真实数据源</li>
          <li><strong>配置文件</strong>：plans 配置文件提供客户端类型定义</li>
        </ul>
        <p>添加新方案或修改权益时，需同时更新数据库种子数据和配置文件。</p>
      </section>

      {/* Section 3: Operational Guardrails */}
      <section>
        <h2>3. 运营护栏</h2>

        <h3>默认限流策略</h3>
        <ul>
          <li><strong>匿名用户</strong>：每天 3 次请求（通过 ANONYMOUS_QUOTA 配置）</li>
          <li><strong>免费用户</strong>：每分钟 5 次，每小时 50 次</li>
          <li><strong>Pro 用户</strong>：每分钟 20 次，每小时 500 次</li>
        </ul>

        <h3>默认额度策略</h3>
        <ul>
          <li>新免费用户注册时获得 100 额度</li>
          <li>Pro 用户每月获得 1000 额度</li>
          <li>每次 AI 生成消耗 1 额度</li>
          <li>余额为零时，生成被拦截</li>
        </ul>

        <h3>匿名滥用风险</h3>
        <p>
          匿名用户无需注册即可试用演示。这是为了提高转化率，但存在滥用风险。
          默认每天 3 次的限制比较保守。如果发现滥用：
        </p>
        <ul>
          <li>将 ANONYMOUS_QUOTA 减少到 1 或 0</li>
          <li>考虑要求所有 AI 功能必须注册</li>
          <li>监控 anonymous_quotas 表中的可疑模式</li>
        </ul>

        <h3>调整默认额度</h3>
        <p>修改新用户默认额度：</p>
        <ul>
          <li>更新环境配置中的 DEFAULT_FREE_CREDITS</li>
          <li>同时更新数据库 system_config 表（key: default_credits）</li>
          <li>现有用户不受影响，只有新注册用户获得新额度</li>
        </ul>
      </section>

      {/* Section 4: Troubleshooting */}
      <section>
        <h2>4. 常见问题排障</h2>

        <h3>登录/会话问题</h3>
        <ul>
          <li><strong>无法登录</strong>：检查 Supabase URL 和 anon key 是否正确设置</li>
          <li><strong>会话不保持</strong>：确认 Cookie 已启用；检查浏览器控制台是否有错误</li>
          <li><strong>卡在加载中</strong>：AuthProvider 可能在等待 Supabase；检查网络请求标签页</li>
        </ul>

        <h3>额度不刷新</h3>
        <ul>
          <li><strong>生成后余额不变</strong>：用户状态接口应被调用；检查控制台网络请求</li>
          <li><strong>显示错误余额</strong>：清除浏览器缓存；credits 表可能有过时数据</li>
          <li><strong>新用户没有额度</strong>：检查注册触发器是否执行；查看 credit_ledger 表</li>
        </ul>

        <h3>生成失败</h3>
        <ul>
          <li><strong>错误：额度不足</strong>：检查用户的 credits 表；余额可能为零</li>
          <li><strong>错误：数据库未配置</strong>：Supabase 环境变量缺失或无效</li>
          <li><strong>错误：每日配额超限</strong>：匿名用户达到限制；尝试注册账号</li>
          <li><strong>无响应</strong>：检查 AI mock 模式是否启用；检查服务器控制台错误</li>
        </ul>

        <h3>流式输出不显示</h3>
        <ul>
          <li><strong>文字一次性出现</strong>：SSE 流可能解析不正确；检查响应 Content-Type</li>
          <li><strong>什么都不显示</strong>：fetch 请求可能静默失败；检查浏览器控制台</li>
          <li><strong>只有部分输出</strong>：流可能提前关闭；检查服务器日志错误</li>
        </ul>

        <h3>数据库问题</h3>
        <ul>
          <li><strong>找不到表</strong>：按顺序执行所有迁移文件</li>
          <li><strong>权限被拒绝</strong>：检查 RLS 策略；管理操作可能需要 service role key</li>
          <li><strong>找不到函数</strong>：函数迁移文件可能未执行；检查 get_user_status 是否存在</li>
        </ul>
      </section>
    </article>
  )
}
