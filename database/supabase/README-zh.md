# Supabase 数据库文档

> 最后更新: 2026-02-04

## 概述

本目录包含 Next-AI SaaS Starter 项目的所有 Supabase 相关配置和数据库迁移。

## 目录结构

```
supabase/
├── migrations/          # 数据库迁移文件
│   ├── 20260204100001_create_enums.sql
│   ├── 20260204100002_create_config_tables.sql
│   ├── 20260204100003_create_user_tables.sql
│   ├── 20260204100004_create_ledger_tables.sql
│   ├── 20260204100005_create_triggers.sql
│   ├── 20260204100006_create_functions.sql
│   ├── 20260204100007_create_rls_policies.sql
│   └── 20260204100008_seed_initial_data.sql
└── README.md           # 英文文档
└── README-zh.md        # 本文件
```

## 迁移命名规范

所有迁移文件遵循格式：`YYYYMMDDHHMMSS_description.sql`

示例：`20260204100001_create_enums.sql`

---

## 枚举类型

### plan_slug
可用的订阅计划类型。
| 值 | 描述 |
|----|------|
| `free` | 免费计划 |
| `pro` | Pro/付费计划 |

### subscription_status
用户订阅的可能状态。
| 值 | 描述 |
|----|------|
| `active` | 当前活跃的订阅 |
| `canceled` | 已取消但在周期结束前仍有效 |
| `expired` | 订阅已过期 |
| `past_due` | 支付失败，在宽限期内 |
| `trialing` | 试用期内 |

### credit_operation_type
积分余额操作类型。
| 值 | 描述 |
|----|------|
| `initial` | 注册时的初始积分 |
| `purchase` | 购买的积分 |
| `bonus` | 奖励积分（促销、推荐等） |
| `deduction` | AI 生成使用的积分 |
| `refund` | 退还的积分（生成失败等） |
| `adjustment` | 管理员手动调整 |
| `expiry` | 过期的积分 |

### webhook_event_status
Webhook 事件的处理状态。
| 值 | 描述 |
|----|------|
| `pending` | 已接收但未处理 |
| `processing` | 正在处理中 |
| `completed` | 处理成功 |
| `failed` | 处理失败 |
| `ignored` | 故意忽略（重复等） |

---

## 数据表

### system_config
系统级配置参数（键值存储）。

| 列 | 类型 | 描述 |
|----|------|------|
| `key` | TEXT | 唯一配置键（主键） |
| `value` | JSONB | JSON 格式的配置值 |
| `description` | TEXT | 人类可读的描述 |
| `created_at` | TIMESTAMPTZ | 记录创建时间戳 |
| `updated_at` | TIMESTAMPTZ | 最后更新时间戳 |

**RLS 策略**：公开读取，service_role 写入

---

### plans
可用的订阅计划。

| 列 | 类型 | 描述 |
|----|------|------|
| `id` | UUID | 主键 |
| `slug` | plan_slug | 唯一计划标识符（free/pro） |
| `name` | TEXT | 计划显示名称 |
| `description` | TEXT | 计划描述 |
| `price_monthly` | INTEGER | 月价格（分，免费为 0） |
| `price_yearly` | INTEGER | 年价格（分，免费为 0） |
| `is_active` | BOOLEAN | 是否可用于新订阅 |
| `display_order` | INTEGER | UI 显示顺序 |
| `features` | JSONB | 功能描述数组 |
| `created_at` | TIMESTAMPTZ | 记录创建时间戳 |
| `updated_at` | TIMESTAMPTZ | 最后更新时间戳 |

**RLS 策略**：公开读取（仅活跃计划），service_role 写入

---

### plan_entitlements
计划到能力的映射。

| 列 | 类型 | 描述 |
|----|------|------|
| `id` | UUID | 主键 |
| `plan_id` | UUID | 引用 plans 表 |
| `entitlement_key` | TEXT | 权益标识符 |
| `entitlement_value` | JSONB | 值（数字、布尔或对象） |
| `description` | TEXT | 人类可读的描述 |
| `created_at` | TIMESTAMPTZ | 记录创建时间戳 |
| `updated_at` | TIMESTAMPTZ | 最后更新时间戳 |

**权益键**：
| 键 | 类型 | 描述 |
|----|------|------|
| `monthly_credits` | number | 每月获得的积分 |
| `rate_limit_per_minute` | number | 每分钟最大请求数 |
| `rate_limit_per_hour` | number | 每小时最大请求数 |
| `concurrent_requests` | number | 最大并发请求数 |
| `max_input_length` | number | 最大输入字符数 |
| `max_output_length` | number | 最大输出字符数 |
| `api_access` | boolean | API 访问是否启用 |
| `priority_queue` | boolean | 优先处理队列 |
| `advanced_models` | boolean | 访问高级 AI 模型 |

**RLS 策略**：公开读取，service_role 写入

---

### user_profiles
扩展的用户资料信息。

| 列 | 类型 | 描述 |
|----|------|------|
| `id` | UUID | 引用 auth.users.id（主键） |
| `email` | TEXT | 用户邮箱（从 auth.users 缓存） |
| `display_name` | TEXT | 用户显示名称 |
| `avatar_url` | TEXT | 用户头像图片 URL |
| `locale` | TEXT | 用户首选语言（默认：'en'） |
| `timezone` | TEXT | 用户时区（默认：'UTC'） |
| `metadata` | JSONB | 额外的用户元数据 |
| `created_at` | TIMESTAMPTZ | 记录创建时间戳 |
| `updated_at` | TIMESTAMPTZ | 最后更新时间戳 |

**RLS 策略**：用户可读取/更新自己的资料，service_role 完全访问

---

### subscriptions
用户订阅记录。

| 列 | 类型 | 描述 |
|----|------|------|
| `id` | UUID | 主键 |
| `user_id` | UUID | 引用 auth.users（唯一） |
| `plan_id` | UUID | 引用 plans 表 |
| `status` | subscription_status | 当前订阅状态 |
| `current_period_start` | TIMESTAMPTZ | 当前计费周期开始 |
| `current_period_end` | TIMESTAMPTZ | 当前计费周期结束 |
| `cancel_at_period_end` | BOOLEAN | 是否在周期结束时取消 |
| `canceled_at` | TIMESTAMPTZ | 订阅取消时间 |
| `external_subscription_id` | TEXT | Stripe/Creem 订阅 ID |
| `external_customer_id` | TEXT | Stripe/Creem 客户 ID |
| `metadata` | JSONB | 额外的订阅元数据 |
| `created_at` | TIMESTAMPTZ | 记录创建时间戳 |
| `updated_at` | TIMESTAMPTZ | 最后更新时间戳 |

**RLS 策略**：用户可读取自己的订阅，service_role 完全访问

---

### credits
用户积分余额。

| 列 | 类型 | 描述 |
|----|------|------|
| `id` | UUID | 主键 |
| `user_id` | UUID | 引用 auth.users（唯一） |
| `balance` | INTEGER | 当前可用积分余额（≥0） |
| `total_earned` | INTEGER | 总共获得的积分 |
| `total_spent` | INTEGER | 总共花费的积分 |
| `created_at` | TIMESTAMPTZ | 记录创建时间戳 |
| `updated_at` | TIMESTAMPTZ | 最后更新时间戳 |

**RLS 策略**：用户可读取自己的积分，service_role 完全访问

---

### credit_ledger
积分交易历史（不可变审计日志）。

| 列 | 类型 | 描述 |
|----|------|------|
| `id` | UUID | 主键 |
| `user_id` | UUID | 引用 auth.users |
| `operation_type` | credit_operation_type | 积分操作类型 |
| `amount` | INTEGER | 变更金额（+增加，-扣除） |
| `balance_before` | INTEGER | 操作前余额 |
| `balance_after` | INTEGER | 操作后余额 |
| `idempotency_key` | TEXT | 防止重复的唯一键 |
| `description` | TEXT | 人类可读的描述 |
| `metadata` | JSONB | 额外的操作元数据 |
| `created_at` | TIMESTAMPTZ | 记录创建时间戳 |

**RLS 策略**：用户可读取自己的账本，service_role 完全访问

---

### anonymous_quotas
匿名用户的速率限制。

| 列 | 类型 | 描述 |
|----|------|------|
| `id` | UUID | 主键 |
| `identifier` | TEXT | IP 地址或浏览器指纹 |
| `identifier_type` | TEXT | 标识符类型（'ip'/'fingerprint'） |
| `usage_count` | INTEGER | 当前周期的使用次数 |
| `daily_limit` | INTEGER | 每日最大使用次数 |
| `last_used_at` | TIMESTAMPTZ | 最后使用时间戳 |
| `reset_at` | TIMESTAMPTZ | 配额重置时间 |
| `created_at` | TIMESTAMPTZ | 记录创建时间戳 |
| `updated_at` | TIMESTAMPTZ | 最后更新时间戳 |

**RLS 策略**：仅 service role

---

### webhook_events
支付 webhook 事件日志。

| 列 | 类型 | 描述 |
|----|------|------|
| `id` | UUID | 主键 |
| `provider` | TEXT | 支付提供商（'stripe'/'creem'） |
| `event_type` | TEXT | Webhook 事件类型 |
| `event_id` | TEXT | 提供商的外部事件 ID |
| `payload` | JSONB | 完整的 webhook 负载 |
| `status` | webhook_event_status | 处理状态 |
| `error_message` | TEXT | 处理失败时的错误消息 |
| `processed_at` | TIMESTAMPTZ | 事件处理时间 |
| `created_at` | TIMESTAMPTZ | 记录创建时间戳 |
| `updated_at` | TIMESTAMPTZ | 最后更新时间戳 |

**RLS 策略**：仅 service role

---

## 函数

### get_user_status(p_user_id UUID)
获取完整的用户状态，包括资料、计划、权益和积分。

**返回**：JSONB
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "display_name": "用户名",
    "avatar_url": "https://...",
    "locale": "en",
    "timezone": "UTC"
  },
  "plan": {
    "slug": "free",
    "name": "Free",
    "status": "active",
    "current_period_start": null,
    "current_period_end": null,
    "cancel_at_period_end": false
  },
  "entitlements": {
    "monthly_credits": 100,
    "rate_limit_per_minute": 5,
    ...
  },
  "credits": {
    "balance": 100,
    "total_earned": 100,
    "total_spent": 0
  }
}
```

**权限**：authenticated, service_role

---

### deduct_credits(p_user_id, p_amount, p_idempotency_key, p_description, p_metadata)
幂等的积分扣除。

**参数**：
- `p_user_id` UUID - 用户 ID
- `p_amount` INTEGER - 扣除金额
- `p_idempotency_key` TEXT - 幂等性唯一键
- `p_description` TEXT（可选）- 描述
- `p_metadata` JSONB（可选）- 额外元数据

**返回**：包含成功状态和余额信息的 JSONB

**权限**：仅 service_role

---

### add_credits(p_user_id, p_amount, p_operation_type, p_idempotency_key, p_description, p_metadata)
幂等的积分添加。

**参数**：
- `p_user_id` UUID - 用户 ID
- `p_amount` INTEGER - 添加金额
- `p_operation_type` credit_operation_type - 类型（purchase/bonus/refund/adjustment）
- `p_idempotency_key` TEXT - 幂等性唯一键
- `p_description` TEXT（可选）- 描述
- `p_metadata` JSONB（可选）- 额外元数据

**返回**：包含成功状态和余额信息的 JSONB

**权限**：仅 service_role

---

### check_anonymous_quota(p_identifier, p_identifier_type)
检查并使用匿名用户配额。

**参数**：
- `p_identifier` TEXT - IP 地址或指纹
- `p_identifier_type` TEXT（默认：'ip'）- 标识符类型

**返回**：包含允许状态和配额信息的 JSONB

**权限**：anon, service_role

---

### get_credit_history(p_user_id, p_limit, p_offset)
获取用户的分页积分历史。

**参数**：
- `p_user_id` UUID - 用户 ID
- `p_limit` INTEGER（默认：20）- 页面大小
- `p_offset` INTEGER（默认：0）- 偏移量

**返回**：包含项目数组和分页信息的 JSONB

**权限**：authenticated, service_role

---

## 触发器

### on_auth_user_created
当新用户注册时，自动创建 user_profiles、subscriptions（免费计划）、credits 和初始账本条目。

### on_auth_user_updated
当 auth.users 更新时同步 user_profiles（邮箱、名称、头像）。

---

## 行级安全（RLS）

所有表都启用了 RLS，具有以下通用策略：

| 表 | 匿名 | 已认证 | Service Role |
|----|------|--------|--------------|
| system_config | 读取 | 读取 | 完全 |
| plans | 读取（活跃） | 读取（活跃） | 完全 |
| plan_entitlements | 读取 | 读取 | 完全 |
| user_profiles | - | 仅自己 | 完全 |
| subscriptions | - | 仅自己 | 完全 |
| credits | - | 仅自己 | 完全 |
| credit_ledger | - | 仅自己 | 完全 |
| anonymous_quotas | - | - | 完全 |
| webhook_events | - | - | 完全 |

---

## 运行迁移

迁移在部署到 Supabase 时自动应用，或可以手动运行：

```bash
# 使用 Supabase CLI
supabase db push

# 或重置并应用所有迁移
supabase db reset
```

## 最佳实践

1. **永远不要修改现有迁移** - 为更改创建新迁移
2. **在本地测试迁移**后再部署
3. **在注释中包含回滚逻辑**（如果可能）
4. **清楚地记录破坏性更改**
5. **对所有积分操作使用幂等性键**
