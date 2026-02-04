-- Migration: Create Enum Types
-- Description: Define all enum types used across the database
-- Created: 2026-02-04

-- Plan slug enum (Free/Pro)
CREATE TYPE plan_slug AS ENUM ('free', 'pro');

-- Subscription status enum
CREATE TYPE subscription_status AS ENUM (
  'active',      -- Currently active subscription
  'canceled',    -- Canceled but still valid until period end
  'expired',     -- Subscription has expired
  'past_due',    -- Payment failed, grace period
  'trialing'     -- In trial period
);

-- Credit operation type enum
CREATE TYPE credit_operation_type AS ENUM (
  'initial',     -- Initial credits on signup
  'purchase',    -- Purchased credits
  'bonus',       -- Bonus credits (promotion, referral, etc.)
  'deduction',   -- Credits used for AI generation
  'refund',      -- Refunded credits (failed generation, etc.)
  'adjustment',  -- Manual adjustment by admin
  'expiry'       -- Credits expired
);

-- Webhook event status enum
CREATE TYPE webhook_event_status AS ENUM (
  'pending',     -- Received but not processed
  'processing',  -- Currently being processed
  'completed',   -- Successfully processed
  'failed',      -- Processing failed
  'ignored'      -- Intentionally ignored (duplicate, etc.)
);

COMMENT ON TYPE plan_slug IS 'Available subscription plan types';
COMMENT ON TYPE subscription_status IS 'Possible states for a user subscription';
COMMENT ON TYPE credit_operation_type IS 'Types of credit balance operations';
COMMENT ON TYPE webhook_event_status IS 'Processing status for webhook events';
