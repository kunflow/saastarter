-- Migration: Create User Tables
-- Description: User profiles and subscriptions tables
-- Created: 2026-02-04

-- ============================================================================
-- user_profiles: Extended user profile data
-- ============================================================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_profiles IS 'Extended user profile information';
COMMENT ON COLUMN user_profiles.id IS 'References auth.users.id';
COMMENT ON COLUMN user_profiles.email IS 'User email (cached from auth.users)';
COMMENT ON COLUMN user_profiles.display_name IS 'User display name';
COMMENT ON COLUMN user_profiles.avatar_url IS 'URL to user avatar image';
COMMENT ON COLUMN user_profiles.locale IS 'User preferred locale (e.g., en, zh)';
COMMENT ON COLUMN user_profiles.timezone IS 'User timezone';
COMMENT ON COLUMN user_profiles.metadata IS 'Additional user metadata';

-- ============================================================================
-- subscriptions: User subscription status
-- ============================================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMPTZ,
  external_subscription_id TEXT,  -- Stripe/Creem subscription ID
  external_customer_id TEXT,      -- Stripe/Creem customer ID
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)  -- One active subscription per user
);

COMMENT ON TABLE subscriptions IS 'User subscription records';
COMMENT ON COLUMN subscriptions.user_id IS 'Reference to the user';
COMMENT ON COLUMN subscriptions.plan_id IS 'Reference to the subscribed plan';
COMMENT ON COLUMN subscriptions.status IS 'Current subscription status';
COMMENT ON COLUMN subscriptions.current_period_start IS 'Start of current billing period';
COMMENT ON COLUMN subscriptions.current_period_end IS 'End of current billing period';
COMMENT ON COLUMN subscriptions.cancel_at_period_end IS 'Whether to cancel at period end';
COMMENT ON COLUMN subscriptions.canceled_at IS 'When the subscription was canceled';
COMMENT ON COLUMN subscriptions.external_subscription_id IS 'External payment provider subscription ID';
COMMENT ON COLUMN subscriptions.external_customer_id IS 'External payment provider customer ID';

-- Create indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_external_subscription_id ON subscriptions(external_subscription_id);
CREATE INDEX idx_subscriptions_external_customer_id ON subscriptions(external_customer_id);

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
