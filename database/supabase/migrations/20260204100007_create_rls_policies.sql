-- Migration: Create RLS Policies
-- Description: Row Level Security policies for all tables
-- Created: 2026-02-04

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- system_config: Public read, service_role write
-- ============================================================================
CREATE POLICY "system_config_select_all"
  ON system_config FOR SELECT
  USING (true);

CREATE POLICY "system_config_service_role_all"
  ON system_config FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- plans: Public read, service_role write
-- ============================================================================
CREATE POLICY "plans_select_active"
  ON plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "plans_service_role_all"
  ON plans FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- plan_entitlements: Public read (via plan), service_role write
-- ============================================================================
CREATE POLICY "plan_entitlements_select_all"
  ON plan_entitlements FOR SELECT
  USING (true);

CREATE POLICY "plan_entitlements_service_role_all"
  ON plan_entitlements FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- user_profiles: Users can read/update own profile
-- ============================================================================
CREATE POLICY "user_profiles_select_own"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "user_profiles_update_own"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_service_role_all"
  ON user_profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- subscriptions: Users can read own subscription
-- ============================================================================
CREATE POLICY "subscriptions_select_own"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "subscriptions_service_role_all"
  ON subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- credits: Users can read own credits
-- ============================================================================
CREATE POLICY "credits_select_own"
  ON credits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "credits_service_role_all"
  ON credits FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- credit_ledger: Users can read own ledger
-- ============================================================================
CREATE POLICY "credit_ledger_select_own"
  ON credit_ledger FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "credit_ledger_service_role_all"
  ON credit_ledger FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- anonymous_quotas: Service role only
-- ============================================================================
CREATE POLICY "anonymous_quotas_service_role_all"
  ON anonymous_quotas FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- webhook_events: Service role only
-- ============================================================================
CREATE POLICY "webhook_events_service_role_all"
  ON webhook_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- Grant execute permissions on functions
-- ============================================================================
GRANT EXECUTE ON FUNCTION get_user_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_status(UUID) TO service_role;

GRANT EXECUTE ON FUNCTION deduct_credits(UUID, INTEGER, TEXT, TEXT, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION add_credits(UUID, INTEGER, credit_operation_type, TEXT, TEXT, JSONB) TO service_role;

GRANT EXECUTE ON FUNCTION check_anonymous_quota(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION check_anonymous_quota(TEXT, TEXT) TO service_role;

GRANT EXECUTE ON FUNCTION get_credit_history(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_credit_history(UUID, INTEGER, INTEGER) TO service_role;

GRANT EXECUTE ON FUNCTION reset_expired_anonymous_quotas() TO service_role;
