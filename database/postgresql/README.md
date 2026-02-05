# PostgreSQL Database Setup

This directory contains migration files for self-hosted PostgreSQL (without Supabase).

## Prerequisites

- PostgreSQL 14+
- psql command-line tool

## Quick Start

### 1. Create Database

```bash
createdb your_database_name
```

### 2. Run Migrations

```bash
# Run schema migration
psql -d your_database_name -f migrations/01_schema.sql

# Run seed data
psql -d your_database_name -f migrations/02_seed_data.sql
```

### 3. Configure Environment

Update your `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/your_database_name
```

## Authentication

This schema includes a basic `users` table. You need to implement your own authentication:

### Option A: Use NextAuth.js

```bash
pnpm add next-auth @auth/pg-adapter
```

### Option B: Use Lucia Auth

```bash
pnpm add lucia @lucia-auth/adapter-postgresql
```

### Option C: Custom Implementation

Implement password hashing with bcrypt:

```typescript
import bcrypt from 'bcrypt'

// Hash password
const hash = await bcrypt.hash(password, 10)

// Verify password
const valid = await bcrypt.compare(password, hash)
```

## Code Changes Required

Replace Supabase client with PostgreSQL client:

1. Install `pg` package:
   ```bash
   pnpm add pg
   ```

2. Create database client (`src/lib/db/client.ts`):
   ```typescript
   import { Pool } from 'pg'

   export const pool = new Pool({
     connectionString: process.env.DATABASE_URL
   })
   ```

3. Update API routes to use the new client

## Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts (replaces Supabase auth.users) |
| `user_profiles` | Extended user information |
| `plans` | Subscription plans |
| `plan_entitlements` | Plan features/limits |
| `subscriptions` | User subscriptions |
| `credits` | User credit balances |
| `credit_ledger` | Credit transaction history |
| `anonymous_quotas` | Anonymous user rate limiting |
| `webhook_events` | Payment webhook logs |
| `system_config` | System configuration |
