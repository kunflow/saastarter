-- MySQL Migration: Complete Schema
-- Description: All tables for MySQL database
-- Created: 2026-02-05
--
-- This is a MySQL schema. You need to implement your own authentication system.
-- Run this file in MySQL: mysql -u user -p database < 01_schema.sql

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SYSTEM CONFIG
-- ============================================================================

CREATE TABLE system_config (
  `key` VARCHAR(255) PRIMARY KEY,
  value JSON NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PLANS
-- ============================================================================

CREATE TABLE plans (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  slug ENUM('free', 'pro') NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_monthly INT NOT NULL DEFAULT 0,
  price_yearly INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  features JSON DEFAULT ('[]'),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_plans_slug (slug),
  INDEX idx_plans_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- PLAN ENTITLEMENTS
-- ============================================================================

CREATE TABLE plan_entitlements (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  plan_id CHAR(36) NOT NULL,
  entitlement_key VARCHAR(255) NOT NULL,
  entitlement_value JSON NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_plan_entitlement (plan_id, entitlement_key),
  INDEX idx_plan_entitlements_plan_id (plan_id),
  FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- USER PROFILES
-- ============================================================================

CREATE TABLE user_profiles (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255),
  display_name VARCHAR(255),
  avatar_url TEXT,
  locale VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  metadata JSON DEFAULT ('{}'),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_profiles_email (email),
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SUBSCRIPTIONS
-- ============================================================================

CREATE TABLE subscriptions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL UNIQUE,
  plan_id CHAR(36) NOT NULL,
  status ENUM('active', 'canceled', 'expired', 'past_due', 'trialing') NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP NULL,
  current_period_end TIMESTAMP NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at TIMESTAMP NULL,
  external_subscription_id VARCHAR(255),
  external_customer_id VARCHAR(255),
  metadata JSON DEFAULT ('{}'),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_subscriptions_user_id (user_id),
  INDEX idx_subscriptions_plan_id (plan_id),
  INDEX idx_subscriptions_status (status),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES plans(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CREDITS
-- ============================================================================

CREATE TABLE credits (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL UNIQUE,
  balance INT NOT NULL DEFAULT 0,
  total_earned INT NOT NULL DEFAULT 0,
  total_spent INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_credits_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_balance_positive CHECK (balance >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CREDIT LEDGER
-- ============================================================================

CREATE TABLE credit_ledger (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  operation_type ENUM('initial', 'purchase', 'bonus', 'deduction', 'refund', 'adjustment', 'expiry') NOT NULL,
  amount INT NOT NULL,
  balance_before INT NOT NULL,
  balance_after INT NOT NULL,
  idempotency_key VARCHAR(255),
  description TEXT,
  metadata JSON DEFAULT ('{}'),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_credit_ledger_user_id (user_id),
  INDEX idx_credit_ledger_created_at (created_at DESC),
  INDEX idx_credit_ledger_idempotency_key (idempotency_key),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ANONYMOUS QUOTAS
-- ============================================================================

CREATE TABLE anonymous_quotas (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  identifier VARCHAR(255) NOT NULL,
  identifier_type VARCHAR(50) NOT NULL DEFAULT 'ip',
  usage_count INT NOT NULL DEFAULT 0,
  daily_limit INT NOT NULL DEFAULT 3,
  last_used_at TIMESTAMP NULL,
  reset_at TIMESTAMP NOT NULL DEFAULT (CURRENT_DATE + INTERVAL 1 DAY),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_identifier (identifier, identifier_type),
  INDEX idx_anonymous_quotas_identifier (identifier, identifier_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- WEBHOOK EVENTS
-- ============================================================================

CREATE TABLE webhook_events (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  provider VARCHAR(50) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  event_id VARCHAR(255) NOT NULL,
  payload JSON NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'failed', 'ignored') NOT NULL DEFAULT 'pending',
  error_message TEXT,
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_provider_event (provider, event_id),
  INDEX idx_webhook_events_status (status),
  INDEX idx_webhook_events_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
