-- Migration: Create Functions
-- Description: Core business logic functions including get_user_status, deduct_credits, add_credits
-- Created: 2026-02-04

-- ============================================================================
-- Function: Get complete user status
-- Returns user info, plan, entitlements, and credits in a single call
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_status(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  user_data JSONB;
  plan_data JSONB;
  entitlements_data JSONB;
  credits_data JSONB;
BEGIN
  -- Get user profile
  SELECT jsonb_build_object(
    'id', up.id,
    'email', up.email,
    'display_name', up.display_name,
    'avatar_url', up.avatar_url,
    'locale', up.locale,
    'timezone', up.timezone
  )
  INTO user_data
  FROM user_profiles up
  WHERE up.id = p_user_id;

  IF user_data IS NULL THEN
    RETURN jsonb_build_object('error', 'User not found');
  END IF;

  -- Get plan info
  SELECT jsonb_build_object(
    'slug', p.slug,
    'name', p.name,
    'status', s.status,
    'current_period_start', s.current_period_start,
    'current_period_end', s.current_period_end,
    'cancel_at_period_end', s.cancel_at_period_end
  )
  INTO plan_data
  FROM subscriptions s
  JOIN plans p ON s.plan_id = p.id
  WHERE s.user_id = p_user_id;

  IF plan_data IS NULL THEN
    plan_data := jsonb_build_object(
      'slug', 'free',
      'name', 'Free',
      'status', 'active'
    );
  END IF;

  -- Get entitlements as key-value object
  SELECT COALESCE(
    jsonb_object_agg(pe.entitlement_key, pe.entitlement_value),
    '{}'::jsonb
  )
  INTO entitlements_data
  FROM subscriptions s
  JOIN plan_entitlements pe ON s.plan_id = pe.plan_id
  WHERE s.user_id = p_user_id;

  -- Get credits
  SELECT jsonb_build_object(
    'balance', c.balance,
    'total_earned', c.total_earned,
    'total_spent', c.total_spent
  )
  INTO credits_data
  FROM credits c
  WHERE c.user_id = p_user_id;

  IF credits_data IS NULL THEN
    credits_data := jsonb_build_object(
      'balance', 0,
      'total_earned', 0,
      'total_spent', 0
    );
  END IF;

  -- Build final result
  result := jsonb_build_object(
    'user', user_data,
    'plan', plan_data,
    'entitlements', entitlements_data,
    'credits', credits_data
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- Function: Deduct credits (idempotent)
-- Returns success/failure with updated balance
-- ============================================================================
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_idempotency_key TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
  existing_ledger_id UUID;
BEGIN
  -- Check for existing operation with same idempotency key
  SELECT id INTO existing_ledger_id
  FROM credit_ledger
  WHERE idempotency_key = p_idempotency_key;

  IF existing_ledger_id IS NOT NULL THEN
    -- Return existing result (idempotent)
    SELECT jsonb_build_object(
      'success', true,
      'idempotent', true,
      'ledger_id', cl.id,
      'balance', c.balance
    )
    INTO STRICT current_balance
    FROM credit_ledger cl
    JOIN credits c ON cl.user_id = c.user_id
    WHERE cl.id = existing_ledger_id;

    RETURN jsonb_build_object(
      'success', true,
      'idempotent', true,
      'ledger_id', existing_ledger_id,
      'message', 'Operation already processed'
    );
  END IF;

  -- Lock the credits row for update
  SELECT balance INTO current_balance
  FROM credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF current_balance IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User credits not found'
    );
  END IF;

  -- Check sufficient balance
  IF current_balance < p_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient credits',
      'balance', current_balance,
      'required', p_amount
    );
  END IF;

  -- Calculate new balance
  new_balance := current_balance - p_amount;

  -- Update credits
  UPDATE credits
  SET
    balance = new_balance,
    total_spent = total_spent + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Create ledger entry
  INSERT INTO credit_ledger (
    user_id,
    operation_type,
    amount,
    balance_before,
    balance_after,
    idempotency_key,
    description,
    metadata
  )
  VALUES (
    p_user_id,
    'deduction',
    -p_amount,
    current_balance,
    new_balance,
    p_idempotency_key,
    COALESCE(p_description, 'Credit deduction'),
    p_metadata
  )
  RETURNING id INTO existing_ledger_id;

  RETURN jsonb_build_object(
    'success', true,
    'idempotent', false,
    'ledger_id', existing_ledger_id,
    'balance_before', current_balance,
    'balance_after', new_balance,
    'amount_deducted', p_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Function: Add credits (idempotent)
-- Returns success/failure with updated balance
-- ============================================================================
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_operation_type credit_operation_type,
  p_idempotency_key TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
  existing_ledger_id UUID;
BEGIN
  -- Validate operation type (only allow additive types)
  IF p_operation_type NOT IN ('purchase', 'bonus', 'refund', 'adjustment') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid operation type for adding credits'
    );
  END IF;

  -- Check for existing operation with same idempotency key
  SELECT id INTO existing_ledger_id
  FROM credit_ledger
  WHERE idempotency_key = p_idempotency_key;

  IF existing_ledger_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'idempotent', true,
      'ledger_id', existing_ledger_id,
      'message', 'Operation already processed'
    );
  END IF;

  -- Lock the credits row for update
  SELECT balance INTO current_balance
  FROM credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF current_balance IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User credits not found'
    );
  END IF;

  -- Calculate new balance
  new_balance := current_balance + p_amount;

  -- Update credits
  UPDATE credits
  SET
    balance = new_balance,
    total_earned = total_earned + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Create ledger entry
  INSERT INTO credit_ledger (
    user_id,
    operation_type,
    amount,
    balance_before,
    balance_after,
    idempotency_key,
    description,
    metadata
  )
  VALUES (
    p_user_id,
    p_operation_type,
    p_amount,
    current_balance,
    new_balance,
    p_idempotency_key,
    COALESCE(p_description, 'Credit addition'),
    p_metadata
  )
  RETURNING id INTO existing_ledger_id;

  RETURN jsonb_build_object(
    'success', true,
    'idempotent', false,
    'ledger_id', existing_ledger_id,
    'balance_before', current_balance,
    'balance_after', new_balance,
    'amount_added', p_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Function: Check and use anonymous quota
-- Returns whether the anonymous user can proceed
-- ============================================================================
CREATE OR REPLACE FUNCTION check_anonymous_quota(
  p_identifier TEXT,
  p_identifier_type TEXT DEFAULT 'ip'
)
RETURNS JSONB AS $$
DECLARE
  quota_record anonymous_quotas%ROWTYPE;
  default_limit INTEGER;
BEGIN
  -- Get default limit from config
  SELECT COALESCE((value->>'daily_limit')::INTEGER, 3)
  INTO default_limit
  FROM system_config
  WHERE key = 'anonymous_quota';

  IF default_limit IS NULL THEN
    default_limit := 3;
  END IF;

  -- Get or create quota record
  INSERT INTO anonymous_quotas (identifier, identifier_type, daily_limit)
  VALUES (p_identifier, p_identifier_type, default_limit)
  ON CONFLICT (identifier, identifier_type) DO UPDATE
  SET updated_at = NOW()
  RETURNING * INTO quota_record;

  -- Check if quota needs reset
  IF quota_record.reset_at <= NOW() THEN
    UPDATE anonymous_quotas
    SET
      usage_count = 0,
      reset_at = CURRENT_DATE + INTERVAL '1 day',
      updated_at = NOW()
    WHERE id = quota_record.id
    RETURNING * INTO quota_record;
  END IF;

  -- Check if quota exceeded
  IF quota_record.usage_count >= quota_record.daily_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'usage_count', quota_record.usage_count,
      'daily_limit', quota_record.daily_limit,
      'reset_at', quota_record.reset_at,
      'message', 'Daily quota exceeded'
    );
  END IF;

  -- Increment usage
  UPDATE anonymous_quotas
  SET
    usage_count = usage_count + 1,
    last_used_at = NOW(),
    updated_at = NOW()
  WHERE id = quota_record.id
  RETURNING * INTO quota_record;

  RETURN jsonb_build_object(
    'allowed', true,
    'usage_count', quota_record.usage_count,
    'daily_limit', quota_record.daily_limit,
    'remaining', quota_record.daily_limit - quota_record.usage_count,
    'reset_at', quota_record.reset_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Function: Get user's credit history
-- ============================================================================
CREATE OR REPLACE FUNCTION get_credit_history(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSONB AS $$
DECLARE
  history JSONB;
  total_count INTEGER;
BEGIN
  -- Get total count
  SELECT COUNT(*) INTO total_count
  FROM credit_ledger
  WHERE user_id = p_user_id;

  -- Get history
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', cl.id,
        'operation_type', cl.operation_type,
        'amount', cl.amount,
        'balance_before', cl.balance_before,
        'balance_after', cl.balance_after,
        'description', cl.description,
        'created_at', cl.created_at
      ) ORDER BY cl.created_at DESC
    ),
    '[]'::jsonb
  )
  INTO history
  FROM (
    SELECT *
    FROM credit_ledger
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  ) cl;

  RETURN jsonb_build_object(
    'items', history,
    'total', total_count,
    'limit', p_limit,
    'offset', p_offset
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION get_user_status(UUID) IS 'Get complete user status including profile, plan, entitlements, and credits';
COMMENT ON FUNCTION deduct_credits(UUID, INTEGER, TEXT, TEXT, JSONB) IS 'Idempotent credit deduction';
COMMENT ON FUNCTION add_credits(UUID, INTEGER, credit_operation_type, TEXT, TEXT, JSONB) IS 'Idempotent credit addition';
COMMENT ON FUNCTION check_anonymous_quota(TEXT, TEXT) IS 'Check and use anonymous user quota';
COMMENT ON FUNCTION get_credit_history(UUID, INTEGER, INTEGER) IS 'Get paginated credit history for a user';
