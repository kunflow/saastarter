-- PostgreSQL Migration: Seed Initial Data
-- Description: Insert default configuration, plans, and entitlements
-- Created: 2026-02-05

-- ============================================================================
-- System Configuration
-- ============================================================================
INSERT INTO system_config (key, value, description) VALUES
  ('default_credits', '{"amount": 100}', 'Default credits for new users'),
  ('anonymous_quota', '{"daily_limit": 3}', 'Daily quota for anonymous users'),
  ('credit_per_generation', '{"amount": 1}', 'Credits consumed per AI generation'),
  ('rate_limit', '{"requests_per_minute": 10, "requests_per_hour": 100}', 'Default rate limiting settings'),
  ('cost_circuit_breaker', '{"daily_limit_usd": 100, "enabled": true}', 'Cost circuit breaker settings')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- Plans
-- ============================================================================
INSERT INTO plans (slug, name, description, price_monthly, price_yearly, is_active, display_order, features) VALUES
  (
    'free',
    'Free',
    'Get started with basic features',
    0,
    0,
    true,
    1,
    '["100 credits on signup", "5 requests per minute", "Basic AI models", "Community support"]'::jsonb
  ),
  (
    'pro',
    'Pro',
    'Unlock full potential with premium features',
    1900,
    15900,
    true,
    2,
    '["1000 credits per month", "20 requests per minute", "Advanced AI models", "Priority support", "API access"]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Plan Entitlements - Free Plan
-- ============================================================================
INSERT INTO plan_entitlements (plan_id, entitlement_key, entitlement_value, description)
SELECT
  p.id,
  e.key,
  e.value,
  e.description
FROM plans p
CROSS JOIN (VALUES
  ('monthly_credits', '100'::jsonb, 'Credits received monthly'),
  ('rate_limit_per_minute', '5'::jsonb, 'Max requests per minute'),
  ('rate_limit_per_hour', '50'::jsonb, 'Max requests per hour'),
  ('concurrent_requests', '1'::jsonb, 'Max concurrent requests'),
  ('max_input_length', '1000'::jsonb, 'Max input characters'),
  ('max_output_length', '2000'::jsonb, 'Max output characters'),
  ('api_access', 'false'::jsonb, 'API access enabled'),
  ('priority_queue', 'false'::jsonb, 'Priority processing queue'),
  ('advanced_models', 'false'::jsonb, 'Access to advanced AI models')
) AS e(key, value, description)
WHERE p.slug = 'free'
ON CONFLICT (plan_id, entitlement_key) DO NOTHING;

-- ============================================================================
-- Plan Entitlements - Pro Plan
-- ============================================================================
INSERT INTO plan_entitlements (plan_id, entitlement_key, entitlement_value, description)
SELECT
  p.id,
  e.key,
  e.value,
  e.description
FROM plans p
CROSS JOIN (VALUES
  ('monthly_credits', '1000'::jsonb, 'Credits received monthly'),
  ('rate_limit_per_minute', '20'::jsonb, 'Max requests per minute'),
  ('rate_limit_per_hour', '500'::jsonb, 'Max requests per hour'),
  ('concurrent_requests', '3'::jsonb, 'Max concurrent requests'),
  ('max_input_length', '5000'::jsonb, 'Max input characters'),
  ('max_output_length', '10000'::jsonb, 'Max output characters'),
  ('api_access', 'true'::jsonb, 'API access enabled'),
  ('priority_queue', 'true'::jsonb, 'Priority processing queue'),
  ('advanced_models', 'true'::jsonb, 'Access to advanced AI models')
) AS e(key, value, description)
WHERE p.slug = 'pro'
ON CONFLICT (plan_id, entitlement_key) DO NOTHING;
