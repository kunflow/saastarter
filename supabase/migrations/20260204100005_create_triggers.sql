-- Migration: Create Triggers
-- Description: Auto-initialization triggers for new users
-- Created: 2026-02-04

-- ============================================================================
-- Function: Initialize new user data
-- Called when a new user is created in auth.users
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id UUID;
  default_credits INTEGER;
BEGIN
  -- Get the free plan ID
  SELECT id INTO free_plan_id FROM plans WHERE slug = 'free' LIMIT 1;

  -- Get default credits from system_config, fallback to 100
  SELECT COALESCE((value->>'amount')::INTEGER, 100)
  INTO default_credits
  FROM system_config
  WHERE key = 'default_credits';

  IF default_credits IS NULL THEN
    default_credits := 100;
  END IF;

  -- Create user_profiles record
  INSERT INTO user_profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Create subscriptions record (default to free plan)
  IF free_plan_id IS NOT NULL THEN
    INSERT INTO subscriptions (user_id, plan_id, status)
    VALUES (NEW.id, free_plan_id, 'active');
  END IF;

  -- Create credits record with default balance
  INSERT INTO credits (user_id, balance, total_earned, total_spent)
  VALUES (NEW.id, default_credits, default_credits, 0);

  -- Create initial credit ledger entry
  INSERT INTO credit_ledger (
    user_id,
    operation_type,
    amount,
    balance_before,
    balance_after,
    description,
    idempotency_key
  )
  VALUES (
    NEW.id,
    'initial',
    default_credits,
    0,
    default_credits,
    'Initial credits on signup',
    'initial_' || NEW.id::TEXT
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Trigger: Auto-create user data on signup
-- ============================================================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- Function: Sync user profile on auth.users update
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user_profiles when auth.users is updated
  UPDATE user_profiles
  SET
    email = NEW.email,
    display_name = COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      user_profiles.display_name
    ),
    avatar_url = COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      user_profiles.avatar_url
    ),
    updated_at = NOW()
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Trigger: Sync profile on user update
-- ============================================================================
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_update();

-- ============================================================================
-- Function: Reset anonymous quotas daily
-- Can be called by a cron job or scheduled function
-- ============================================================================
CREATE OR REPLACE FUNCTION reset_expired_anonymous_quotas()
RETURNS INTEGER AS $$
DECLARE
  reset_count INTEGER;
BEGIN
  UPDATE anonymous_quotas
  SET
    usage_count = 0,
    reset_at = CURRENT_DATE + INTERVAL '1 day',
    updated_at = NOW()
  WHERE reset_at <= NOW();

  GET DIAGNOSTICS reset_count = ROW_COUNT;
  RETURN reset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION handle_new_user() IS 'Auto-initialize user data on signup';
COMMENT ON FUNCTION handle_user_update() IS 'Sync user profile when auth.users is updated';
COMMENT ON FUNCTION reset_expired_anonymous_quotas() IS 'Reset expired anonymous quotas (call via cron)';
