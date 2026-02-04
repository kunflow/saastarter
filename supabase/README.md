# Supabase Database Documentation

> Last updated: 2026-02-04

## Overview

This directory contains all Supabase-related configurations and database migrations for the Next-AI SaaS Starter project.

## Directory Structure

```
supabase/
├── migrations/          # Database migration files
│   └── YYYYMMDDHHMMSS_description.sql
└── README.md           # This file
```

## Migration Naming Convention

All migration files follow the format: `YYYYMMDDHHMMSS_description.sql`

Example: `20260204100001_create_user_profiles.sql`

## Core Tables (Planned)

### User Management
- `user_profiles` - Extended user profile data
- `user_settings` - User preferences and settings

### Billing & Credits
- `subscriptions` - User subscription status (Free/Pro)
- `entitlements` - Plan to capability mappings
- `credits` - User credit balances
- `credit_ledger` - Credit transaction history

### System
- `webhook_events` - Payment webhook event logs
- `rate_limits` - Rate limiting configuration

## Row Level Security (RLS)

All tables implement RLS policies to ensure:
- Users can only access their own data
- Service role can access all data for admin operations
- Anonymous users have limited read access where appropriate

## Running Migrations

Migrations are applied automatically when deploying to Supabase, or can be run manually:

```bash
# Using Supabase CLI
supabase db push

# Or apply specific migration
supabase db reset
```

## Best Practices

1. **Never modify existing migrations** - Create new migrations for changes
2. **Test migrations locally** before deploying
3. **Include rollback logic** in comments when possible
4. **Document breaking changes** clearly
