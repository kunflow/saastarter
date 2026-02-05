# Database Configuration

This directory contains database migration files for different database systems.

## How the Project Knows Which Database to Use

The project includes a **built-in database abstraction layer** (`src/lib/db/`) that automatically selects the correct database adapter based on environment variables:

```bash
# .env file
DATABASE_TYPE=supabase    # Options: supabase | postgresql | mysql
```

### Database Abstraction Layer

The project uses a unified database interface that works with all supported databases:

```typescript
import { db } from '@/lib/db'

// Auth operations (same API for all databases)
const { data: user } = await db.auth.getUser()
await db.auth.signIn(email, password)
await db.auth.signUp(email, password)
await db.auth.signOut()

// Database operations (same API for all databases)
const status = await db.getUserStatus(userId)
const quota = await db.checkAnonymousQuota(ip, 'ip')
const result = await db.deductCredits(userId, amount, key, desc, metadata)
```

### Configuration by Database Type

| DATABASE_TYPE | Required Variables | Auth System | Additional Setup |
|---------------|-------------------|-------------|------------------|
| `supabase` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase Auth (built-in) | None |
| `postgresql` | `DATABASE_URL` | NextAuth.js (required) | None (pg package pre-installed) |
| `mysql` | `DATABASE_URL` | NextAuth.js (required) | None (mysql2 package pre-installed) |

### Example Configurations

**Supabase (Default - Recommended):**
```env
DATABASE_TYPE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Self-Hosted PostgreSQL:**
```env
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
```

**MySQL:**
```env
DATABASE_TYPE=mysql
DATABASE_URL=mysql://user:password@localhost:3306/your_database
```

## Supported Databases

| Database | Directory | Status |
|----------|-----------|--------|
| Supabase | `supabase/` | Default, production-ready |
| PostgreSQL | `postgresql/` | Self-hosted, production-ready |
| MySQL | `mysql/` | Self-hosted, production-ready |

## Quick Start

### Supabase (Default - Recommended)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run migrations in SQL Editor (in order):
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
3. Configure `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### Self-Hosted PostgreSQL

1. Create database:
   ```bash
   createdb your_database
   ```
2. Run migrations:
   ```bash
   psql -d your_database -f postgresql/migrations/01_schema.sql
   psql -d your_database -f postgresql/migrations/02_seed_data.sql
   ```
3. Configure `.env`:
   ```env
   DATABASE_TYPE=postgresql
   DATABASE_URL=postgresql://user:password@localhost:5432/your_database
   ```
4. Set up NextAuth.js for authentication (see below)

### MySQL

1. Create database:
   ```bash
   mysql -u root -p -e "CREATE DATABASE your_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```
2. Run migrations:
   ```bash
   mysql -u root -p your_database < mysql/migrations/01_schema.sql
   mysql -u root -p your_database < mysql/migrations/02_seed_data.sql
   ```
3. Configure `.env`:
   ```env
   DATABASE_TYPE=mysql
   DATABASE_URL=mysql://user:password@localhost:3306/your_database
   ```
4. Set up NextAuth.js for authentication (see below)

## Authentication for PostgreSQL/MySQL (NextAuth.js Setup)

When using PostgreSQL or MySQL instead of Supabase, you need to set up NextAuth.js for authentication. This section provides a complete step-by-step guide.

### Overview

| Component | Purpose |
|-----------|---------|
| NextAuth.js | Authentication framework |
| bcrypt | Password hashing |
| JWT | Session management |

### Step 1: Install Required Packages

```bash
pnpm add next-auth bcrypt
pnpm add -D @types/bcrypt
```

### Step 2: Add Environment Variables

Add the following to your `.env` file:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-at-least-32-characters-long

# Generate a secret with: openssl rand -base64 32
```

**Important**: Generate a secure secret for production:
```bash
openssl rand -base64 32
```

### Step 3: Create NextAuth Configuration

Create `src/lib/auth/config.ts`:

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { env } from '@/config/env'

// Import the correct query function based on database type
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
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

### Step 4: Create NextAuth API Route

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/config'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### Step 5: Create User Registration Function

Create `src/lib/auth/register.ts`:

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

      // Create user
      await pool.query(
        `INSERT INTO users (id, email, password_hash, display_name, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, email, passwordHash, name]
      )

      // Create user profile
      await pool.query(
        `INSERT INTO user_profiles (user_id, display_name, locale, timezone)
         VALUES ($1, $2, 'en', 'UTC')`,
        [userId, name]
      )

      // Initialize credits
      await pool.query(
        `INSERT INTO credits (user_id, balance, total_earned, total_spent)
         VALUES ($1, $2, $2, 0)`,
        [userId, env.credits.defaultFree]
      )

      // Create free subscription
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

      if (error.code === '23505') { // Unique violation
        return { success: false, error: 'Email already exists' }
      }
      throw error
    }
  } else if (env.database.type === 'mysql') {
    const mysql = await import('mysql2/promise')
    const pool = mysql.createPool({ uri: env.database.url })
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // Create user
      await connection.execute(
        `INSERT INTO users (id, email, password_hash, display_name, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [userId, email, passwordHash, name]
      )

      // Create user profile
      await connection.execute(
        `INSERT INTO user_profiles (user_id, display_name, locale, timezone)
         VALUES (?, ?, 'en', 'UTC')`,
        [userId, name]
      )

      // Initialize credits
      await connection.execute(
        `INSERT INTO credits (user_id, balance, total_earned, total_spent)
         VALUES (?, ?, ?, 0)`,
        [userId, env.credits.defaultFree, env.credits.defaultFree]
      )

      // Create free subscription
      const [plans] = await connection.execute(
        `SELECT id FROM plans WHERE slug = 'free' LIMIT 1`
      )
      if ((plans as any[])[0]) {
        await connection.execute(
          `INSERT INTO subscriptions (user_id, plan_id, status)
           VALUES (?, ?, 'active')`,
          [userId, (plans as any[])[0].id]
        )
      }

      await connection.commit()
      connection.release()
      await pool.end()

      return { success: true, userId }
    } catch (error: any) {
      await connection.rollback()
      connection.release()
      await pool.end()

      if (error.code === 'ER_DUP_ENTRY') {
        return { success: false, error: 'Email already exists' }
      }
      throw error
    }
  }

  return { success: false, error: 'Database not configured' }
}
```

### Step 6: Update Signup API Route

Update `src/app/api/auth/signup/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/config/env'

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For Supabase, use the existing db adapter
    if (env.database.type === 'supabase') {
      const { db } = await import('@/lib/db')
      const { data, error } = await db.auth.signUp(email, password)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        user: data?.user ? { id: data.user.id, email: data.user.email } : null,
        message: 'Please check your email to confirm your account',
      })
    }

    // For PostgreSQL/MySQL, use the register function
    const { registerUser } = await import('@/lib/auth/register')
    const result = await registerUser(email, password, displayName)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: { id: result.userId, email },
      message: 'Account created successfully',
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Step 7: Update Login API Route

Update `src/app/api/auth/login/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/config/env'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For Supabase, use the existing db adapter
    if (env.database.type === 'supabase') {
      const { db } = await import('@/lib/db')
      const { data, error } = await db.auth.signIn(email, password)

      if (error || !data) {
        return NextResponse.json(
          { error: error?.message || 'Login failed' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        success: true,
        user: { id: data.user.id, email: data.user.email },
        session: {
          access_token: data.session.access_token,
          expires_at: data.session.expires_at,
        },
      })
    }

    // For PostgreSQL/MySQL, redirect to NextAuth
    // The actual authentication is handled by NextAuth.js
    // This endpoint can be used for API-based login
    return NextResponse.json({
      success: true,
      message: 'Please use NextAuth.js signIn for authentication',
      redirectUrl: '/api/auth/signin',
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Step 8: Update Auth Provider Component

Update `src/components/auth/auth-provider.tsx` to support NextAuth:

```typescript
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { env } from '@/config/env'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // For PostgreSQL/MySQL, use NextAuth session
  if (env.database.type !== 'supabase') {
    return <NextAuthProvider>{children}</NextAuthProvider>
  }

  // For Supabase, use existing implementation
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
}

function NextAuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const user = session?.user ? {
    id: (session.user as any).id,
    email: session.user.email!,
    name: session.user.name || undefined,
  } : null

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { error: 'Invalid email or password' }
    }
    return {}
  }

  const handleSignUp = async (email: string, password: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'Signup failed' }
    }

    // Auto sign in after signup
    return handleSignIn(email, password)
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Keep existing SupabaseAuthProvider implementation...
function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  // ... existing Supabase implementation
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### Step 9: Wrap App with SessionProvider

Update `src/app/providers.tsx`:

```typescript
'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/components/auth/auth-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  )
}
```

### Step 10: Update Database Adapter Auth Methods

Update `src/lib/db/adapters/postgresql.ts` (and similarly for mysql.ts):

```typescript
// In the auth object, update getUser to use NextAuth session
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

auth = {
  async getUser(): Promise<AuthResult<DbUser>> {
    try {
      const session = await getServerSession(authOptions)

      if (!session?.user) {
        return { data: null, error: null }
      }

      // Query full user data from database
      const rows = await query<DbUser>(
        `SELECT id, email, display_name, avatar_url, locale, timezone, created_at
         FROM users WHERE id = $1`,
        [(session.user as any).id]
      )

      if (rows.length === 0) {
        return { data: null, error: { message: 'User not found' } }
      }

      return { data: rows[0], error: null }
    } catch (error) {
      console.error('getUser error:', error)
      return { data: null, error: { message: 'Failed to get user' } }
    }
  },
  // ... other methods
}
```

### Complete File Structure

After setup, your auth-related files should look like:

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts      # NextAuth handler
│   │       ├── login/
│   │       │   └── route.ts      # Login API
│   │       ├── signup/
│   │       │   └── route.ts      # Signup API
│   │       └── logout/
│   │           └── route.ts      # Logout API
│   └── providers.tsx             # SessionProvider wrapper
├── components/
│   └── auth/
│       └── auth-provider.tsx     # Auth context provider
└── lib/
    └── auth/
        ├── config.ts             # NextAuth configuration
        └── register.ts           # User registration function
```

### Testing the Setup

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Test registration:
   - Go to `/signup`
   - Create a new account
   - Check database for new user record

3. Test login:
   - Go to `/login`
   - Login with created account
   - Verify session is created

4. Test protected routes:
   - Access `/dashboard`
   - Verify redirect to login if not authenticated

### Architecture Comparison

| Feature | Supabase | PostgreSQL/MySQL |
|---------|----------|------------------|
| Database | ✅ Included | ✅ Self-managed |
| Authentication | ✅ Built-in | ❌ Need NextAuth/Lucia |
| Row Level Security | ✅ Built-in | ❌ Implement in code |
| Realtime | ✅ Built-in | ❌ Need WebSocket server |
| Storage | ✅ Built-in | ❌ Need S3/local storage |
| Edge Functions | ✅ Built-in | ❌ Use API routes |

## Directory Structure

```
database/
├── README.md              # This file
├── supabase/              # Supabase (default)
│   ├── migrations/        # 8 SQL migration files
│   └── README.md          # Supabase-specific docs
├── postgresql/            # Self-hosted PostgreSQL
│   ├── migrations/        # 2 SQL migration files
│   └── README.md          # PostgreSQL-specific docs
└── mysql/                 # MySQL
    ├── migrations/        # 2 SQL migration files
    └── README.md          # MySQL-specific docs
```

## Schema Overview

All databases share the same logical schema:

| Table | Purpose |
|-------|---------|
| `users` | User accounts (Supabase uses `auth.users`) |
| `user_profiles` | Extended user information |
| `plans` | Subscription plans (Free/Pro) |
| `plan_entitlements` | Plan features and limits |
| `subscriptions` | User subscription status |
| `credits` | User credit balances |
| `credit_ledger` | Credit transaction history |
| `anonymous_quotas` | Anonymous user rate limiting |
| `webhook_events` | Payment webhook logs |
| `system_config` | System configuration |
