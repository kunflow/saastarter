# 运营指南

生产环境最佳实践、成本护栏和常见坑。

## 成本防护（默认开启）

### 匿名配额

未认证用户的访问限制：

- **默认值**：每 IP 每天 3 次生成
- **配置位置**：`system_config` 表 → `anonymous_daily_quota`

```sql
-- 调整匿名配额
UPDATE system_config
SET value = '5'
WHERE key = 'anonymous_daily_quota';
```

### 速率限制

通过用户级速率限制防止滥用：

| 方案 | 默认限制 |
|------|---------|
| Free | 5 次/分钟 |
| Pro | 20 次/分钟 |

在 `plan_entitlements` 表中配置。

### Credits 系统

每次 AI 生成都消耗 credits：

- **免费用户**：注册时获得 100 credits
- **专业用户**：每月 1000 credits
- **每次生成**：1 credit（可配置）

当 credits 为 0 时，生成被阻止并显示明确提示。

## 监控建议

### 关键指标

1. **每小时 credit 扣减量** - 检测异常峰值
2. **生成失败率** - 质量问题
3. **匿名/认证用户比例** - 潜在滥用
4. **API 响应时间** - 性能问题

### Supabase 控制台

在 Supabase 中监控：
- 数据库连接数
- RLS 策略命中率
- 函数执行时间

### Vercel Analytics

启用 Vercel Analytics 监控：
- 页面加载时间
- API 延迟
- 错误率

## 常见坑

### 1. 忘记禁用 Mock 模式

**问题**：生产环境返回模拟数据

**解决方案**：确保生产环境 `.env`：
```env
AI_MOCK_MODE=false
ENABLE_MOCK=false
```

### 2. 缺少 Service Role Key

**问题**：服务端操作失败

**解决方案**：在生产环境设置 `SUPABASE_SERVICE_ROLE_KEY`

### 3. Base URL 错误

**问题**：SEO 和 OAuth 回调失败

**解决方案**：设置正确的 `NEXT_PUBLIC_APP_URL`：
```env
NEXT_PUBLIC_APP_URL=https://your-actual-domain.com
```

### 4. 速率限制太宽松

**问题**：单个用户耗尽 API 配额

**解决方案**：在数据库中收紧速率限制：
```sql
UPDATE plan_entitlements
SET rate_limit_per_minute = 3
WHERE plan_id = (SELECT id FROM plans WHERE slug = 'free');
```

### 5. 没有 Credit 监控

**问题**：用户在没有警告的情况下耗尽 credits

**解决方案**：
- 在 UI 中醒目显示余额
- 在余额低时发送通知（按需实现）

## 安全检查清单

- [ ] 环境变量不在 git 中
- [ ] Service role key 仅在服务端
- [ ] 所有表都启用了 RLS
- [ ] 生产环境禁用 `/readme` 路由
- [ ] API 路由验证认证状态
- [ ] 客户端包中无敏感数据

## 扩展考虑

### 何时升级

| 指标 | 免费版限制 | 操作 |
|------|-----------|------|
| 数据库行数 | 500MB | 升级 Supabase |
| 月 API 调用 | 500K | 升级 Vercel |
| 并发用户 | ~100 | 添加缓存 |

### 性能优化

1. **启用 Vercel Edge 缓存** - 用于静态路由
2. **使用 Supabase 连接池** - 用于高流量
3. **实现响应缓存** - 用于重复的 AI 查询

## 备份策略

### 数据库备份

Supabase 提供：
- 每日备份（Pro 方案）
- 时间点恢复（Pro 方案）

对于免费版，定期导出数据：
```sql
-- 导出 credits 账本
COPY credit_ledger TO '/tmp/ledger_backup.csv' CSV HEADER;
```

### 代码备份

- 使用 git 管理所有代码
- 标记版本：`git tag v1.0.0`
- 保持迁移历史完整

## 故障排除

### 生成静默失败

1. 检查浏览器控制台错误
2. 检查 Vercel 函数日志
3. 验证 AI 提供商 API key 有效
4. 检查 credits 余额

### 用户无法登录

1. 验证 Supabase Auth 已配置
2. 检查回调 URL 与生产环境匹配
3. 验证邮箱确认设置

### Credits 未扣减

1. 检查 `deduct_credits` 函数是否存在
2. 验证 RLS 允许该操作
3. 检查 `credit_ledger` 中的失败记录

## 支持升级路径

1. **自助服务**：查看 `/readme` 路由
2. **文档**：查阅 `docs/` 文件夹
3. **社区**：提交 GitHub issue
4. **直接联系**：发送邮件到支持邮箱
