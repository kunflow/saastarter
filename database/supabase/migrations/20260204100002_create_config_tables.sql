-- Migration: Create Config Tables
-- Description: System configuration, plans, and plan entitlements tables
-- Created: 2026-02-04

-- ============================================================================
-- system_config: Key-value store for system-wide configuration
-- ============================================================================
CREATE TABLE system_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE system_config IS 'System-wide configuration parameters';
COMMENT ON COLUMN system_config.key IS 'Unique configuration key';
COMMENT ON COLUMN system_config.value IS 'Configuration value in JSON format';
COMMENT ON COLUMN system_config.description IS 'Human-readable description of the config';

-- ============================================================================
-- plans: Subscription plan definitions
-- ============================================================================
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug plan_slug NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL DEFAULT 0,  -- Price in cents
  price_yearly INTEGER NOT NULL DEFAULT 0,   -- Price in cents
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,        -- Array of feature strings for display
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE plans IS 'Available subscription plans';
COMMENT ON COLUMN plans.slug IS 'Unique plan identifier (free/pro)';
COMMENT ON COLUMN plans.name IS 'Display name of the plan';
COMMENT ON COLUMN plans.price_monthly IS 'Monthly price in cents (0 for free)';
COMMENT ON COLUMN plans.price_yearly IS 'Yearly price in cents (0 for free)';
COMMENT ON COLUMN plans.is_active IS 'Whether the plan is available for new subscriptions';
COMMENT ON COLUMN plans.display_order IS 'Order for displaying plans in UI';
COMMENT ON COLUMN plans.features IS 'Array of feature descriptions for marketing display';

-- ============================================================================
-- plan_entitlements: Capability mappings for each plan
-- ============================================================================
CREATE TABLE plan_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  entitlement_key TEXT NOT NULL,
  entitlement_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(plan_id, entitlement_key)
);

COMMENT ON TABLE plan_entitlements IS 'Plan to capability mappings';
COMMENT ON COLUMN plan_entitlements.plan_id IS 'Reference to the plan';
COMMENT ON COLUMN plan_entitlements.entitlement_key IS 'Entitlement identifier (e.g., monthly_credits, rate_limit)';
COMMENT ON COLUMN plan_entitlements.entitlement_value IS 'Value of the entitlement (number, boolean, or object)';

-- Create indexes
CREATE INDEX idx_plan_entitlements_plan_id ON plan_entitlements(plan_id);
CREATE INDEX idx_plans_slug ON plans(slug);
CREATE INDEX idx_plans_is_active ON plans(is_active);

-- Create updated_at trigger function (reusable)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_system_config_updated_at
  BEFORE UPDATE ON system_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_entitlements_updated_at
  BEFORE UPDATE ON plan_entitlements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
