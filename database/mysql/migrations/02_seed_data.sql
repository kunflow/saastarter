-- MySQL Migration: Seed Initial Data
-- Description: Insert default configuration, plans, and entitlements
-- Created: 2026-02-05

-- ============================================================================
-- System Configuration
-- ============================================================================
INSERT IGNORE INTO system_config (`key`, value, description) VALUES
  ('default_credits', '{"amount": 100}', 'Default credits for new users'),
  ('anonymous_quota', '{"daily_limit": 3}', 'Daily quota for anonymous users'),
  ('credit_per_generation', '{"amount": 1}', 'Credits consumed per AI generation'),
  ('rate_limit', '{"requests_per_minute": 10, "requests_per_hour": 100}', 'Default rate limiting settings'),
  ('cost_circuit_breaker', '{"daily_limit_usd": 100, "enabled": true}', 'Cost circuit breaker settings');

-- ============================================================================
-- Plans
-- ============================================================================
INSERT IGNORE INTO plans (id, slug, name, description, price_monthly, price_yearly, is_active, display_order, features) VALUES
  (
    UUID(),
    'free',
    'Free',
    'Get started with basic features',
    0,
    0,
    TRUE,
    1,
    '["100 credits on signup", "5 requests per minute", "Basic AI models", "Community support"]'
  ),
  (
    UUID(),
    'pro',
    'Pro',
    'Unlock full potential with premium features',
    1900,
    15900,
    TRUE,
    2,
    '["1000 credits per month", "20 requests per minute", "Advanced AI models", "Priority support", "API access"]'
  );

-- ============================================================================
-- Plan Entitlements - Free Plan
-- ============================================================================
INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'monthly_credits', '100', 'Credits received monthly' FROM plans p WHERE p.slug = 'free';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'rate_limit_per_minute', '5', 'Max requests per minute' FROM plans p WHERE p.slug = 'free';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'rate_limit_per_hour', '50', 'Max requests per hour' FROM plans p WHERE p.slug = 'free';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'concurrent_requests', '1', 'Max concurrent requests' FROM plans p WHERE p.slug = 'free';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'max_input_length', '1000', 'Max input characters' FROM plans p WHERE p.slug = 'free';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'max_output_length', '2000', 'Max output characters' FROM plans p WHERE p.slug = 'free';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'api_access', 'false', 'API access enabled' FROM plans p WHERE p.slug = 'free';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'priority_queue', 'false', 'Priority processing queue' FROM plans p WHERE p.slug = 'free';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'advanced_models', 'false', 'Access to advanced AI models' FROM plans p WHERE p.slug = 'free';

-- ============================================================================
-- Plan Entitlements - Pro Plan
-- ============================================================================
INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'monthly_credits', '1000', 'Credits received monthly' FROM plans p WHERE p.slug = 'pro';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'rate_limit_per_minute', '20', 'Max requests per minute' FROM plans p WHERE p.slug = 'pro';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'rate_limit_per_hour', '500', 'Max requests per hour' FROM plans p WHERE p.slug = 'pro';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'concurrent_requests', '3', 'Max concurrent requests' FROM plans p WHERE p.slug = 'pro';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'max_input_length', '5000', 'Max input characters' FROM plans p WHERE p.slug = 'pro';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'max_output_length', '10000', 'Max output characters' FROM plans p WHERE p.slug = 'pro';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'api_access', 'true', 'API access enabled' FROM plans p WHERE p.slug = 'pro';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'priority_queue', 'true', 'Priority processing queue' FROM plans p WHERE p.slug = 'pro';

INSERT IGNORE INTO plan_entitlements (id, plan_id, entitlement_key, entitlement_value, description)
SELECT UUID(), p.id, 'advanced_models', 'true', 'Access to advanced AI models' FROM plans p WHERE p.slug = 'pro';
