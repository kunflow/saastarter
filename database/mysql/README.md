# MySQL Database Setup

This directory contains migration files for MySQL database.

## Prerequisites

- MySQL 8.0+
- mysql command-line tool

## Quick Start

### 1. Create Database

```bash
mysql -u root -p -e "CREATE DATABASE your_database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. Run Migrations

```bash
# Run schema migration
mysql -u root -p your_database_name < migrations/01_schema.sql

# Run seed data
mysql -u root -p your_database_name < migrations/02_seed_data.sql
```

### 3. Configure Environment

Update your `.env` file:

```env
DATABASE_URL=mysql://user:password@localhost:3306/your_database_name
```

## Authentication

This schema includes a basic `users` table. You need to implement your own authentication:

### Option A: Use NextAuth.js

```bash
pnpm add next-auth @auth/mysql2-adapter mysql2
```

### Option B: Use Lucia Auth

```bash
pnpm add lucia @lucia-auth/adapter-mysql mysql2
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

Replace Supabase client with MySQL client:

1. Install `mysql2` package:
   ```bash
   pnpm add mysql2
   ```

2. Create database client (`src/lib/db/client.ts`):
   ```typescript
   import mysql from 'mysql2/promise'

   export const pool = mysql.createPool({
     uri: process.env.DATABASE_URL
   })
   ```

3. Update API routes to use the new client

## Key Differences from PostgreSQL

| Feature | PostgreSQL | MySQL |
|---------|------------|-------|
| UUID | `gen_random_uuid()` | `UUID()` |
| JSON | `JSONB` | `JSON` |
| Timestamp | `TIMESTAMPTZ` | `TIMESTAMP` |
| Auto-update | Trigger function | `ON UPDATE CURRENT_TIMESTAMP` |
| Partial index | Supported | Not supported |

## Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts |
| `user_profiles` | Extended user information |
| `plans` | Subscription plans |
| `plan_entitlements` | Plan features/limits |
| `subscriptions` | User subscriptions |
| `credits` | User credit balances |
| `credit_ledger` | Credit transaction history |
| `anonymous_quotas` | Anonymous user rate limiting |
| `webhook_events` | Payment webhook logs |
| `system_config` | System configuration |
