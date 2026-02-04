-- Migration: Create Ledger Tables
-- Description: Credits, credit ledger, anonymous quotas, and webhook events tables
-- Created: 2026-02-04

-- ============================================================================
-- credits: User credit balances
-- ============================================================================
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

COMMENT ON TABLE credits IS 'User credit balances';
COMMENT ON COLUMN credits.user_id IS 'Reference to the user';
COMMENT ON COLUMN credits.balance IS 'Current available credit balance';
COMMENT ON COLUMN credits.total_earned IS 'Total credits ever earned';
COMMENT ON COLUMN credits.total_spent IS 'Total credits ever spent';

-- ============================================================================
-- credit_ledger: Credit transaction history
-- ============================================================================
CREATE TABLE credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_type credit_operation_type NOT NULL,
  amount INTEGER NOT NULL,  -- Positive for additions, negative for deductions
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  idempotency_key TEXT,  -- For preventing duplicate operations
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE credit_ledger IS 'Credit transaction history (immutable audit log)';
COMMENT ON COLUMN credit_ledger.user_id IS 'Reference to the user';
COMMENT ON COLUMN credit_ledger.operation_type IS 'Type of credit operation';
COMMENT ON COLUMN credit_ledger.amount IS 'Amount changed (positive=add, negative=deduct)';
COMMENT ON COLUMN credit_ledger.balance_before IS 'Balance before this operation';
COMMENT ON COLUMN credit_ledger.balance_after IS 'Balance after this operation';
COMMENT ON COLUMN credit_ledger.idempotency_key IS 'Unique key to prevent duplicate operations';
COMMENT ON COLUMN credit_ledger.description IS 'Human-readable description of the operation';
COMMENT ON COLUMN credit_ledger.metadata IS 'Additional operation metadata (e.g., generation_id)';

-- ============================================================================
-- anonymous_quotas: Anonymous user rate limiting
-- ============================================================================
CREATE TABLE anonymous_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,  -- IP address or fingerprint
  identifier_type TEXT NOT NULL DEFAULT 'ip',  -- 'ip' or 'fingerprint'
  usage_count INTEGER NOT NULL DEFAULT 0,
  daily_limit INTEGER NOT NULL DEFAULT 3,
  last_used_at TIMESTAMPTZ,
  reset_at TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 day'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(identifier, identifier_type)
);

COMMENT ON TABLE anonymous_quotas IS 'Rate limiting for anonymous users';
COMMENT ON COLUMN anonymous_quotas.identifier IS 'IP address or browser fingerprint';
COMMENT ON COLUMN anonymous_quotas.identifier_type IS 'Type of identifier (ip/fingerprint)';
COMMENT ON COLUMN anonymous_quotas.usage_count IS 'Number of uses in current period';
COMMENT ON COLUMN anonymous_quotas.daily_limit IS 'Maximum uses per day';
COMMENT ON COLUMN anonymous_quotas.last_used_at IS 'Last usage timestamp';
COMMENT ON COLUMN anonymous_quotas.reset_at IS 'When the quota resets';

-- ============================================================================
-- webhook_events: Payment webhook event logs
-- ============================================================================
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,  -- 'stripe', 'creem', etc.
  event_type TEXT NOT NULL,
  event_id TEXT NOT NULL,  -- External event ID
  payload JSONB NOT NULL,
  status webhook_event_status NOT NULL DEFAULT 'pending',
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider, event_id)
);

COMMENT ON TABLE webhook_events IS 'Payment webhook event logs';
COMMENT ON COLUMN webhook_events.provider IS 'Payment provider (stripe/creem)';
COMMENT ON COLUMN webhook_events.event_type IS 'Type of webhook event';
COMMENT ON COLUMN webhook_events.event_id IS 'External event ID from provider';
COMMENT ON COLUMN webhook_events.payload IS 'Full webhook payload';
COMMENT ON COLUMN webhook_events.status IS 'Processing status';
COMMENT ON COLUMN webhook_events.error_message IS 'Error message if processing failed';
COMMENT ON COLUMN webhook_events.processed_at IS 'When the event was processed';

-- Create indexes
CREATE INDEX idx_credits_user_id ON credits(user_id);
CREATE INDEX idx_credit_ledger_user_id ON credit_ledger(user_id);
CREATE INDEX idx_credit_ledger_created_at ON credit_ledger(created_at DESC);
CREATE INDEX idx_credit_ledger_idempotency_key ON credit_ledger(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX idx_credit_ledger_operation_type ON credit_ledger(operation_type);
CREATE INDEX idx_anonymous_quotas_identifier ON anonymous_quotas(identifier, identifier_type);
CREATE INDEX idx_anonymous_quotas_reset_at ON anonymous_quotas(reset_at);
CREATE INDEX idx_webhook_events_provider_event_id ON webhook_events(provider, event_id);
CREATE INDEX idx_webhook_events_status ON webhook_events(status);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at DESC);

-- Apply updated_at triggers
CREATE TRIGGER update_credits_updated_at
  BEFORE UPDATE ON credits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_anonymous_quotas_updated_at
  BEFORE UPDATE ON anonymous_quotas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhook_events_updated_at
  BEFORE UPDATE ON webhook_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
