# Operating Guide

Production best practices, cost guardrails, and common pitfalls to avoid.

## Cost Protection (Enabled by Default)

### Anonymous Quota

Unauthenticated users have limited access:

- **Default**: 3 generations per day per IP
- **Configuration**: `system_config` table → `anonymous_daily_quota`

```sql
-- Adjust anonymous quota
UPDATE system_config
SET value = '5'
WHERE key = 'anonymous_daily_quota';
```

### Rate Limiting

Prevent abuse with per-user rate limits:

| Plan | Default Limit |
|------|--------------|
| Free | 5 requests/minute |
| Pro | 20 requests/minute |

Configuration in `plan_entitlements` table.

### Credits System

Every AI generation costs credits:

- **Free users**: 100 credits on signup
- **Pro users**: 1000 credits monthly
- **Per generation**: 1 credit (configurable)

When credits reach 0, generation is blocked with clear messaging.

## Monitoring Recommendations

### Key Metrics to Track

1. **Credit deductions per hour** - Spike detection
2. **Failed generation rate** - Quality issues
3. **Anonymous vs authenticated ratio** - Potential abuse
4. **API response times** - Performance issues

### Supabase Dashboard

Monitor in Supabase:
- Database connections
- Row-level security policy hits
- Function execution times

### Vercel Analytics

Enable Vercel Analytics for:
- Page load times
- API latency
- Error rates

## Common Pitfalls

### 1. Forgetting to Disable Mock Mode

**Problem**: AI returns mock data in production

**Solution**: Ensure in production `.env`:
```env
AI_MOCK_MODE=false
ENABLE_MOCK=false
```

### 2. Missing Service Role Key

**Problem**: Server-side operations fail

**Solution**: Set `SUPABASE_SERVICE_ROLE_KEY` in production

### 3. Wrong Base URL

**Problem**: SEO and OAuth callbacks fail

**Solution**: Set correct `NEXT_PUBLIC_APP_URL`:
```env
NEXT_PUBLIC_APP_URL=https://your-actual-domain.com
```

### 4. Rate Limit Too Loose

**Problem**: Single user exhausts API quota

**Solution**: Tighten rate limits in database:
```sql
UPDATE plan_entitlements
SET rate_limit_per_minute = 3
WHERE plan_id = (SELECT id FROM plans WHERE slug = 'free');
```

### 5. No Credit Monitoring

**Problem**: Users run out of credits without warning

**Solution**:
- Show balance prominently in UI
- Send notifications at low balance (implement as needed)

## Security Checklist

- [ ] Environment variables NOT in git
- [ ] Service role key only on server
- [ ] RLS enabled on all tables
- [ ] `/readme` route disabled in production
- [ ] API routes validate authentication
- [ ] No sensitive data in client bundle

## Scaling Considerations

### When to Upgrade

| Metric | Free Tier Limit | Action |
|--------|----------------|--------|
| Database rows | 500MB | Upgrade Supabase |
| Monthly API calls | 500K | Upgrade Vercel |
| Concurrent users | ~100 | Add caching |

### Performance Optimization

1. **Enable Vercel Edge Caching** for static routes
2. **Use Supabase connection pooling** for high traffic
3. **Implement response caching** for repeated AI queries

## Backup Strategy

### Database Backups

Supabase provides:
- Daily backups (Pro plan)
- Point-in-time recovery (Pro plan)

For Free tier, export data periodically:
```sql
-- Export credits ledger
COPY credit_ledger TO '/tmp/ledger_backup.csv' CSV HEADER;
```

### Code Backups

- Use git for all code
- Tag releases: `git tag v1.0.0`
- Keep migration history intact

## Troubleshooting

### Generation Fails Silently

1. Check browser console for errors
2. Check Vercel function logs
3. Verify AI provider API key is valid
4. Check credits balance

### User Can't Login

1. Verify Supabase Auth is configured
2. Check callback URL matches production
3. Verify email confirmation settings

### Credits Not Deducting

1. Check `deduct_credits` function exists
2. Verify RLS allows the operation
3. Check `credit_ledger` for failed attempts

## Support Escalation

1. **Self-service**: Check `/readme` route
2. **Documentation**: Review `docs/` folder
3. **Community**: Open GitHub issue
4. **Direct**: Contact support email
