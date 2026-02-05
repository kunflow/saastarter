# 数据库配置

本目录包含不同数据库系统的迁移文件。

## 项目如何知道使用哪个数据库

项目包含一个**内置的数据库抽象层**（`src/lib/db/`），它会根据环境变量自动选择正确的数据库适配器：

```bash
# .env 文件
DATABASE_TYPE=supabase    # 选项: supabase | postgresql | mysql
```

### 数据库抽象层

项目使用统一的数据库接口，适用于所有支持的数据库：

```typescript
import { db } from '@/lib/db'

// 认证操作（所有数据库使用相同的 API）
const { data: user } = await db.auth.getUser()
await db.auth.signIn(email, password)
await db.auth.signUp(email, password)
await db.auth.signOut()

// 数据库操作（所有数据库使用相同的 API）
const status = await db.getUserStatus(userId)
const quota = await db.checkAnonymousQuota(ip, 'ip')
const result = await db.deductCredits(userId, amount, key, desc, metadata)
```

### 按数据库类型配置

| DATABASE_TYPE | 必需变量 | 认证系统 | 额外设置 |
|---------------|----------|----------|----------|
| `supabase` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase Auth（内置） | 无 |
| `postgresql` | `DATABASE_URL` | NextAuth.js（必需） | 无（pg 包已预装） |
| `mysql` | `DATABASE_URL` | NextAuth.js（必需） | 无（mysql2 包已预装） |

### 配置示例

**Supabase（默认 - 推荐）：**
```env
DATABASE_TYPE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**自托管 PostgreSQL：**
```env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
```

**MySQL：**
```env
DATABASE_TYPE=mysql
DATABASE_URL=mysql://user:password@localhost:3306/your_database
```

## 支持的数据库

| 数据库 | 目录 | 状态 |
|--------|------|------|
| Supabase | `supabase/` | 默认，生产就绪 |
| PostgreSQL | `postgresql/` | 自托管，生产就绪 |
| MySQL | `mysql/` | 自托管，生产就绪 |

## 快速开始

### Supabase（默认 - 推荐）

1. 在 [supabase.com](https://supabase.com) 创建 Supabase 项目
2. 在 SQL 编辑器中按顺序运行迁移：
   ```
   supabase/migrations/20260204100001_create_enums.sql
   supabase/migrations/20260204100002_create_config_tables.sql
   supabase/migrations/20260204100003_create_user_tables.sql
   supabase/migrations/20260204100004_create_ledger_tables.sql
   supabase/migrations/20260204100005_create_triggers.sql
   supabase/migrations/20260204100006_create_functions.sql
   supabase/migrations/20260204100007_create_rls_policies.sql
   supabase/migrations/20260204100008_seed_initial_data.sql
   ```
3. 配置 `.env`：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 自托管 PostgreSQL

1. 创建数据库：
   ```bash
   createdb your_database
   ```
2. 运行迁移：
   ```bash
   psql -d your_database -f postgresql/migrations/01_schema.sql
   psql -d your_database -f postgresql/migrations/02_seed_data.sql
   ```
3. 配置 `.env`：
   ```env
   DATABASE_TYPE=postgresql
   DATABASE_URL=postgresql://user:password@localhost:5432/your_database
   ```
4. 设置 NextAuth.js 进行认证（见下文）

### MySQL

1. 创建数据库：
   ```bash
   mysql -u root -p -e "CREATE DATABASE your_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```
2. 运行迁移：
   ```bash
   mysql -u root -p your_database < mysql/migrations/01_schema.sql
   mysql -u root -p your_database < mysql/migrations/02_seed_data.sql
   ```
3. 配置 `.env`：
   ```env
   DATABASE_TYPE=mysql
   DATABASE_URL=mysql://user:password@localhost:3306/your_database
   ```
4. 设置 NextAuth.js 进行认证（见下文）

## PostgreSQL/MySQL 的认证（NextAuth.js 设置）

使用 PostgreSQL 或 MySQL 而不是 Supabase 时，您需要设置 NextAuth.js 进行认证。本节提供完整的分步指南。

### 概述

| 组件 | 用途 |
|------|------|
| NextAuth.js | 认证框架 |
| bcrypt | 密码哈希 |
| JWT | 会话管理 |

### 步骤 1：安装必需的包

```bash
pnpm add next-auth bcrypt
pnpm add -D @types/bcrypt
```

### 步骤 2：添加环境变量

将以下内容添加到您的 `.env` 文件：

```env
# NextAuth.js 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-at-least-32-characters-long

# 使用以下命令生成密钥: openssl rand -base64 32
```

**重要**：为生产环境生成安全的密钥：
```bash
openssl rand -base64 32
```

### 步骤 3：创建 NextAuth 配置

创建 `src/lib/auth/config.ts`：

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { env } from '@/config/env'

// 根据数据库类型导入正确的查询函数
async function queryUser(email: string) {
  if (env.database.type === 'postgresql') {
    const { Pool } = await import('pg')
    const pool = new Pool({ connectionString: env.database.url })
    const result = await pool.query(
      'SELECT id, email, password_hash, display_name FROM users WHERE email = $1',
      [email]
    )
    await pool.end()
    return result.rows[0]
  } else if (env.database.type === 'mysql') {
    const mysql = await import('mysql2/promise')
    const pool = mysql.createPool({ uri: env.database.url })
    const [rows] = await pool.execute(
      'SELECT id, email, password_hash, display_name FROM users WHERE email = ?',
      [email]
    )
    await pool.end()
    return (rows as any[])[0]
  }
  return null
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await queryUser(credentials.email)

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.display_name || user.email.split('@')[0],
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
      }
      return session
    },
  },
}
```

### 步骤 4：创建 NextAuth API 路由

创建 `src/app/api/auth/[...nextauth]/route.ts`：

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/config'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### 步骤 5：创建用户注册函数

创建 `src/lib/auth/register.ts`：

```typescript
import bcrypt from 'bcrypt'
import { env } from '@/config/env'
import { v4 as uuidv4 } from 'uuid'

export async function registerUser(email: string, password: string, displayName?: string) {
  const passwordHash = await bcrypt.hash(password, 12)
  const userId = uuidv4()
  const name = displayName || email.split('@')[0]

  if (env.database.type === 'postgresql') {
    const { Pool } = await import('pg')
    const pool = new Pool({ connectionString: env.database.url })

    try {
      await pool.query('BEGIN')

      // 创建用户
      await pool.query(
        `INSERT INTO users (id, email, password_hash, display_name, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, email, passwordHash, name]
      )

      // 创建用户资料
      await pool.query(
        `INSERT INTO user_profiles (user_id, display_name, locale, timezone)
         VALUES ($1, $2, 'en', 'UTC')`,
        [userId, name]
      )

      // 初始化积分
      await pool.query(
        `INSERT INTO credits (user_id, balance, total_earned, total_spent)
         VALUES ($1, $2, $2, 0)`,
        [userId, env.credits.defaultFree]
      )

      // 创建免费订阅
      const freePlanResult = await pool.query(
        `SELECT id FROM plans WHERE slug = 'free' LIMIT 1`
      )
      if (freePlanResult.rows[0]) {
        await pool.query(
          `INSERT INTO subscriptions (user_id, plan_id, status)
           VALUES ($1, $2, 'active')`,
          [userId, freePlanResult.rows[0].id]
        )
      }

      await pool.query('COMMIT')
      await pool.end()

      return { success: true, userId }
    } catch (error: any) {
      await pool.query('ROLLBACK')
      await pool.end()

      if (error.code === '23505') { // 唯一约束冲突
        return { success: false, error: '邮箱已存在' }
      }
      throw error
    }
  } else if (env.database.type === 'mysql') {
    // MySQL 实现类似...
  }

  return { success: false, error: '数据库未配置' }
}
```

### 步骤 6-10：更新 API 路由和组件

请参阅英文文档中的详细代码示例，包括：
- 更新注册 API 路由
- 更新登录 API 路由
- 更新 Auth Provider 组件
- 用 SessionProvider 包装应用
- 更新数据库适配器认证方法

### 完整文件结构

设置完成后，您的认证相关文件应如下所示：

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts      # NextAuth 处理器
│   │       ├── login/
│   │       │   └── route.ts      # 登录 API
│   │       ├── signup/
│   │       │   └── route.ts      # 注册 API
│   │       └── logout/
│   │           └── route.ts      # 登出 API
│   └── providers.tsx             # SessionProvider 包装器
├── components/
│   └── auth/
│       └── auth-provider.tsx     # Auth 上下文提供者
└── lib/
    └── auth/
        ├── config.ts             # NextAuth 配置
        └── register.ts           # 用户注册函数
```

### 测试设置

1. 启动开发服务器：
   ```bash
   pnpm dev
   ```

2. 测试注册：
   - 访问 `/signup`
   - 创建新账户
   - 检查数据库中的新用户记录

3. 测试登录：
   - 访问 `/login`
   - 使用创建的账户登录
   - 验证会话已创建

4. 测试受保护的路由：
   - 访问 `/dashboard`
   - 验证未认证时重定向到登录页

### 架构对比

| 功能 | Supabase | PostgreSQL/MySQL |
|------|----------|------------------|
| 数据库 | ✅ 包含 | ✅ 自管理 |
| 认证 | ✅ 内置 | ❌ 需要 NextAuth/Lucia |
| 行级安全 | ✅ 内置 | ❌ 在代码中实现 |
| 实时功能 | ✅ 内置 | ❌ 需要 WebSocket 服务器 |
| 存储 | ✅ 内置 | ❌ 需要 S3/本地存储 |
| 边缘函数 | ✅ 内置 | ❌ 使用 API 路由 |

## 目录结构

```
database/
├── README.md              # 英文文档
├── README-zh.md           # 本文件（中文文档）
├── supabase/              # Supabase（默认）
│   ├── migrations/        # 8 个 SQL 迁移文件
│   └── README.md          # Supabase 专用文档
├── postgresql/            # 自托管 PostgreSQL
│   ├── migrations/        # 2 个 SQL 迁移文件
│   └── README.md          # PostgreSQL 专用文档
└── mysql/                 # MySQL
    ├── migrations/        # 2 个 SQL 迁移文件
    └── README.md          # MySQL 专用文档
```

## 数据库架构概述

所有数据库共享相同的逻辑架构：

| 表 | 用途 |
|----|------|
| `users` | 用户账户（Supabase 使用 `auth.users`） |
| `user_profiles` | 扩展用户信息 |
| `plans` | 订阅计划（免费/Pro） |
| `plan_entitlements` | 计划功能和限制 |
| `subscriptions` | 用户订阅状态 |
| `credits` | 用户积分余额 |
| `credit_ledger` | 积分交易历史 |
| `anonymous_quotas` | 匿名用户速率限制 |
| `webhook_events` | 支付 webhook 日志 |
| `system_config` | 系统配置 |
