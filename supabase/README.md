# Supabase Database Documentation

> Last updated: 2026-02-04

## Overview

This directory contains all Supabase-related configurations and database migrations for the Next-AI SaaS Starter project.

## Directory Structure

```
supabase/
├── migrations/          # Database migration files
│   ├── 20260204100001_create_enums.sql
│   ├── 20260204100002_create_config_tables.sql
│   ├── 20260204100003_create_user_tables.sql
│   ├── 20260204100004_create_ledger_tables.sql
│   ├── 20260204100005_create_triggers.sql
│   ├── 20260204100006_create_functions.sql
│   ├── 20260204100007_create_rls_policies.sql
│   └── 20260204100008_seed_initial_data.sql
└── README.md           # This file
```

## Migration Naming Convention

All migration files follow the format: `YYYYMMDDHHMMSS_description.sql`

Example: `20260204100001_create_enums.sql`

---

## Enum Types

### plan_slug
Available subscription plan types.
| Value | Description |
|-------|-------------|
| `free` | Free tier plan |
| `pro` | Pro/paid plan |

### subscription_status
Possible states for a user subscription.
| Value | Description |
|-------|-------------|
| `active` | Currently active subscription |
| `canceled` | Canceled but still valid until period end |
| `expired` | Subscription has expired |
| `past_due` | Payment failed, in grace period |
| `trialing` | In trial period |

### credit_operation_type
Types of credit balance operations.
| Value | Description |
|-------|-------------|
| `initial` | Initial credits on signup |
| `purchase` | Purchased credits |
| `bonus` | Bonus credits (promotion, referral, etc.) |
| `deduction` | Credits used for AI generation |
| `refund` | Refunded credits (failed generation, etc.) |
| `adjustment` | Manual adjustment by admin |
| `expiry` | Credits expired |

### webhook_event_status
Processing status for webhook events.
| Value | Description |
|-------|-------------|
| `pending` | Received but not processed |
| `processing` | Currently being processed |
| `completed` | Successfully processed |
| `failed` | Processing failed |
| `ignored` | Intentionally ignored (duplicate, etc.) |

---

## Tables

### system_config
System-wide configuration parameters (key-value store).

| Column | Type | Description |
|--------|------|-------------|
| `key` | TEXT | Unique configuration key (PK) |
| `value` | JSONB | Configuration value in JSON format |
| `description` | TEXT | Human-readable description |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**RLS Policy**: Public read, service_role write

---

### plans
Available subscription plans.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `slug` | plan_slug | Unique plan identifier (free/pro) |
| `name` | TEXT | Display name of the plan |
| `description` | TEXT | Plan description |
| `price_monthly` | INTEGER | Monthly price in cents (0 for free) |
| `price_yearly` | INTEGER | Yearly price in cents (0 for free) |
| `is_active` | BOOLEAN | Whether available for new subscriptions |
| `display_order` | INTEGER | Order for displaying in UI |
| `features` | JSONB | Array of feature descriptions |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**RLS Policy**: Public read (active plans only), service_role write

---

### plan_entitlements
Plan to capability mappings.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `plan_id` | UUID | Reference to plans table |
| `entitlement_key` | TEXT | Entitlement identifier |
| `entitlement_value` | JSONB | Value (number, boolean, or object) |
| `description` | TEXT | Human-readable description |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Entitlement Keys**:
| Key | Type | Description |
|-----|------|-------------|
| `monthly_credits` | number | Credits received monthly |
| `rate_limit_per_minute` | number | Max requests per minute |
| `rate_limit_per_hour` | number | Max requests per hour |
| `concurrent_requests` | number | Max concurrent requests |
| `max_input_length` | number | Max input characters |
| `max_output_length` | number | Max output characters |
| `api_access` | boolean | API access enabled |
| `priority_queue` | boolean | Priority processing queue |
| `advanced_models` | boolean | Access to advanced AI models |

**RLS Policy**: Public read, service_role write

---

### user_profiles
Extended user profile information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | References auth.users.id (PK) |
| `email` | TEXT | User email (cached from auth.users) |
| `display_name` | TEXT | User display name |
| `avatar_url` | TEXT | URL to user avatar image |
| `locale` | TEXT | User preferred locale (default: 'en') |
| `timezone` | TEXT | User timezone (default: 'UTC') |
| `metadata` | JSONB | Additional user metadata |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**RLS Policy**: Users can read/update own profile, service_role full access

---

### subscriptions
User subscription records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Reference to auth.users (unique) |
| `plan_id` | UUID | Reference to plans table |
| `status` | subscription_status | Current subscription status |
| `current_period_start` | TIMESTAMPTZ | Start of current billing period |
| `current_period_end` | TIMESTAMPTZ | End of current billing period |
| `cancel_at_period_end` | BOOLEAN | Whether to cancel at period end |
| `canceled_at` | TIMESTAMPTZ | When the subscription was canceled |
| `external_subscription_id` | TEXT | Stripe/Creem subscription ID |
| `external_customer_id` | TEXT | Stripe/Creem customer ID |
| `metadata` | JSONB | Additional subscription metadata |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**RLS Policy**: Users can read own subscription, service_role full access

---

### credits
User credit balances.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Reference to auth.users (unique) |
| `balance` | INTEGER | Current available credit balance (≥0) |
| `total_earned` | INTEGER | Total credits ever earned |
| `total_spent` | INTEGER | Total credits ever spent |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**RLS Policy**: Users can read own credits, service_role full access

---

### credit_ledger
Credit transaction history (immutable audit log).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Reference to auth.users |
| `operation_type` | credit_operation_type | Type of credit operation |
| `amount` | INTEGER | Amount changed (+add, -deduct) |
| `balance_before` | INTEGER | Balance before this operation |
| `balance_after` | INTEGER | Balance after this operation |
| `idempotency_key` | TEXT | Unique key to prevent duplicates |
| `description` | TEXT | Human-readable description |
| `metadata` | JSONB | Additional operation metadata |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

**RLS Policy**: Users can read own ledger, service_role full access

---

### anonymous_quotas
Rate limiting for anonymous users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `identifier` | TEXT | IP address or browser fingerprint |
| `identifier_type` | TEXT | Type of identifier ('ip'/'fingerprint') |
| `usage_count` | INTEGER | Number of uses in current period |
| `daily_limit` | INTEGER | Maximum uses per day |
| `last_used_at` | TIMESTAMPTZ | Last usage timestamp |
| `reset_at` | TIMESTAMPTZ | When the quota resets |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**RLS Policy**: Service role only

---

### webhook_events
Payment webhook event logs.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `provider` | TEXT | Payment provider ('stripe'/'creem') |
| `event_type` | TEXT | Type of webhook event |
| `event_id` | TEXT | External event ID from provider |
| `payload` | JSONB | Full webhook payload |
| `status` | webhook_event_status | Processing status |
| `error_message` | TEXT | Error message if processing failed |
| `processed_at` | TIMESTAMPTZ | When the event was processed |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**RLS Policy**: Service role only

---

## Functions

### get_user_status(p_user_id UUID)
Get complete user status including profile, plan, entitlements, and credits.

**Returns**: JSONB
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "display_name": "User Name",
    "avatar_url": "https://...",
    "locale": "en",
    "timezone": "UTC"
  },
  "plan": {
    "slug": "free",
    "name": "Free",
    "status": "active",
    "current_period_start": null,
    "current_period_end": null,
    "cancel_at_period_end": false
  },
  "entitlements": {
    "monthly_credits": 100,
    "rate_limit_per_minute": 5,
    ...
  },
  "credits": {
    "balance": 100,
    "total_earned": 100,
    "total_spent": 0
  }
}
```

**Permissions**: authenticated, service_role

---

### deduct_credits(p_user_id, p_amount, p_idempotency_key, p_description, p_metadata)
Idempotent credit deduction.

**Parameters**:
- `p_user_id` UUID - User ID
- `p_amount` INTEGER - Amount to deduct
- `p_idempotency_key` TEXT - Unique key for idempotency
- `p_description` TEXT (optional) - Description
- `p_metadata` JSONB (optional) - Additional metadata

**Returns**: JSONB with success status and balance info

**Permissions**: service_role only

---

### add_credits(p_user_id, p_amount, p_operation_type, p_idempotency_key, p_description, p_metadata)
Idempotent credit addition.

**Parameters**:
- `p_user_id` UUID - User ID
- `p_amount` INTEGER - Amount to add
- `p_operation_type` credit_operation_type - Type (purchase/bonus/refund/adjustment)
- `p_idempotency_key` TEXT - Unique key for idempotency
- `p_description` TEXT (optional) - Description
- `p_metadata` JSONB (optional) - Additional metadata

**Returns**: JSONB with success status and balance info

**Permissions**: service_role only

---

### check_anonymous_quota(p_identifier, p_identifier_type)
Check and use anonymous user quota.

**Parameters**:
- `p_identifier` TEXT - IP address or fingerprint
- `p_identifier_type` TEXT (default: 'ip') - Type of identifier

**Returns**: JSONB with allowed status and quota info

**Permissions**: anon, service_role

---

### get_credit_history(p_user_id, p_limit, p_offset)
Get paginated credit history for a user.

**Parameters**:
- `p_user_id` UUID - User ID
- `p_limit` INTEGER (default: 20) - Page size
- `p_offset` INTEGER (default: 0) - Offset

**Returns**: JSONB with items array and pagination info

**Permissions**: authenticated, service_role

---

## Triggers

### on_auth_user_created
Automatically creates user_profiles, subscriptions (Free plan), credits, and initial ledger entry when a new user signs up.

### on_auth_user_updated
Syncs user_profiles when auth.users is updated (email, name, avatar).

---

## Row Level Security (RLS)

All tables have RLS enabled with the following general policies:

| Table | Anonymous | Authenticated | Service Role |
|-------|-----------|---------------|--------------|
| system_config | Read | Read | Full |
| plans | Read (active) | Read (active) | Full |
| plan_entitlements | Read | Read | Full |
| user_profiles | - | Own only | Full |
| subscriptions | - | Own only | Full |
| credits | - | Own only | Full |
| credit_ledger | - | Own only | Full |
| anonymous_quotas | - | - | Full |
| webhook_events | - | - | Full |

---

## Running Migrations

Migrations are applied automatically when deploying to Supabase, or can be run manually:

```bash
# Using Supabase CLI
supabase db push

# Or reset and apply all migrations
supabase db reset
```

## Best Practices

1. **Never modify existing migrations** - Create new migrations for changes
2. **Test migrations locally** before deploying
3. **Include rollback logic** in comments when possible
4. **Document breaking changes** clearly
5. **Use idempotency keys** for all credit operations
