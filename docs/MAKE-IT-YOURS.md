# Make It Yours

Transform this template into your own product in about 2 hours.

## Overview

This guide walks you through customizing the template for your specific AI product. By the end, you'll have a fully branded, functional AI SaaS.

## Step 1: Brand & SEO Configuration (5 min)

All brand and SEO settings can be configured via environment variables in `.env`:

### 1.1 App & Brand Settings

```env
# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Your Product Name
NEXT_PUBLIC_APP_LOGO=🚀
NEXT_PUBLIC_APP_TAGLINE=Your catchy tagline

# Brand & Contact
NEXT_PUBLIC_COMPANY_NAME=Your Company Name
NEXT_PUBLIC_CONTACT_EMAIL=support@your-domain.com
NEXT_PUBLIC_CONTACT_TWITTER=@yourhandle
NEXT_PUBLIC_CONTACT_GITHUB=https://github.com/your-repo
```

### 1.2 SEO Settings

```env
# SEO
NEXT_PUBLIC_SEO_TITLE=Your Product Title
NEXT_PUBLIC_SEO_DESCRIPTION=Your product description for search engines
NEXT_PUBLIC_SEO_KEYWORDS=your,keywords,here
NEXT_PUBLIC_OG_LOCALE=en_US

# Twitter Cards
NEXT_PUBLIC_TWITTER_SITE=@yourhandle
NEXT_PUBLIC_TWITTER_CREATOR=@yourhandle
```

### 1.3 Configuration Files (Optional)

For advanced customization, you can also edit the config files directly:
- `src/config/site.ts` - Brand, contact, legal, feature toggles
- `src/config/seo.ts` - SEO, OpenGraph, Twitter, page metadata

## Step 2: Replace the Demo (45 min)

### 2.1 Understand the Demo Structure

Current demo: `src/components/demo/text-to-emoji.tsx`

The demo component:
1. Takes user input
2. Calls `/api/ai/generate`
3. Displays streaming response
4. Shows credits deduction

### 2.2 Create Your Own Demo

Create `src/components/demo/your-demo.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/ui'

export default function YourDemo() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)
    setOutput('')

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          type: 'your-type', // Define your generation type
        }),
      })

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        // Parse SSE data
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            if (data.content) {
              setOutput(prev => prev + data.content)
            }
          }
        }
      }
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your input..."
      />
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
      {output && (
        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          {output}
        </div>
      )}
    </div>
  )
}
```

### 2.3 Update API Route

Edit `src/app/api/ai/generate/route.ts` to handle your generation type:

```typescript
// Add your generation logic
if (type === 'your-type') {
  // Your AI logic here
  // Use env.ai.provider and env.ai.model for configuration
}
```

### 2.4 Update Home Page

Edit `src/app/[locale]/page.tsx` to use your demo:

```typescript
import YourDemo from '@/components/demo/your-demo'

export default function HomePage() {
  return (
    <main>
      <YourDemo />
    </main>
  )
}
```

## Step 3: Configure AI Provider (15 min)

### 3.1 Set API Key

```env
OPENAI_API_KEY=sk-your-api-key
# Or other provider keys
```

### 3.2 Configure Model

```env
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
AI_TIMEOUT=30000
AI_MAX_RETRIES=3
```

### 3.3 Disable Mock Mode

```env
AI_MOCK_MODE=false
```

## Step 4: Customize Plans (15 min)

### 4.1 Edit Plan Definitions

Edit `src/config/plans.ts`:

```typescript
export const plans = {
  free: {
    name: 'Free',
    description: 'For trying out',
    price: '$0',
    period: '/month',
    features: [
      'Your feature 1',
      'Your feature 2',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'For power users',
    price: '$9',
    period: '/month',
    features: [
      'Everything in Free',
      'Your pro feature 1',
      'Your pro feature 2',
    ],
  },
}
```

### 4.2 Update Database Plans

Create a new migration or update seed data in Supabase:

```sql
UPDATE plans SET
  name = 'Your Free Plan',
  description = 'Your description'
WHERE slug = 'free';

UPDATE plan_entitlements SET
  monthly_credits = 50,  -- Adjust as needed
  rate_limit_per_minute = 10
WHERE plan_id = (SELECT id FROM plans WHERE slug = 'free');
```

## Step 5: Update Marketing Pages (15 min)

### 5.1 Pricing Page

Edit `src/app/[locale]/(marketing)/pricing/pricing-content.tsx`:
- Update plan features
- Adjust pricing display

### 5.2 FAQ Page

Edit `src/app/[locale]/(marketing)/faq/faq-content.tsx`:
- Replace questions with your product-specific FAQs

### 5.3 Legal Page

Edit `src/app/[locale]/(marketing)/legal/legal-content.tsx`:
- Update Terms of Service
- Update Privacy Policy

## Step 6: Configure i18n (Optional, 10 min)

### 6.1 i18n Modes

The template supports three i18n modes:

| Mode | Configuration | URL Structure | Language Switcher |
|------|---------------|---------------|-------------------|
| Single Language | `NEXT_PUBLIC_I18N_ENABLED=false` | `/pricing` | Hidden |
| Multi-language (Manual) | `NEXT_PUBLIC_I18N_ENABLED=true` | `/en/pricing`, `/zh/pricing` | Visible |
| Multi-language (Auto) | Same + Lingo.dev CLI | Same | Visible |

### 6.2 Configure Environment

```env
# Enable/disable multi-language support
NEXT_PUBLIC_I18N_ENABLED=true

# Default locale
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Supported locales (comma-separated)
NEXT_PUBLIC_SUPPORTED_LOCALES=en,zh
```

### 6.3 Translation Files

Translation files are located in `messages/` directory:
- `messages/en.json` - English translations
- `messages/zh.json` - Chinese translations

Edit these files directly to customize translations.

### 6.4 Auto Translation with Lingo.dev CLI (Optional)

1. Install CLI:
   ```bash
   pnpm add -D @lingo.dev/cli
   ```

2. Create `lingo.config.json`:
   ```json
   {
     "version": 1,
     "locale": { "source": "en", "targets": ["zh"] },
     "buckets": {
       "json": { "include": ["messages/[locale].json"] }
     }
   }
   ```

3. Run translation:
   ```bash
   LINGODOTDEV_API_KEY=your-api-key npx lingo translate
   ```

## Step 7: Deploy (15 min)

### Option 1: Deploy to Vercel (Recommended)

```bash
vercel
```

Set environment variables in Vercel dashboard:
- All variables from `.env.example`
- `NEXT_PUBLIC_APP_URL` = your production URL
- `LINGODOTDEV_API_KEY` = your Lingo.dev API key (if using translations)

### Option 2: Self-Hosted Deployment

#### 7.2.1 Build for Production

```bash
# Install dependencies
pnpm install

# Build (translations are auto-generated)
pnpm build
```

#### 7.2.2 Run with Node.js

```bash
# Start production server
pnpm start
```

Default port is 3000, change with `PORT` environment variable:

```bash
PORT=8080 pnpm start
```

#### 7.2.3 Use PM2 for Process Management

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "my-saas" -- start

# Check status
pm2 status

# View logs
pm2 logs my-saas

# Enable startup on boot
pm2 startup
pm2 save
```

#### 7.2.4 Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Runner stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:

```bash
# Build image
docker build -t my-saas .

# Run container
docker run -p 3000:3000 --env-file .env my-saas
```

#### 7.2.5 Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7.3 Run Database Migrations

Execute all migration files in your production Supabase project.

## Environment Variables Summary

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Brand name | `Next-AI SaaS` |
| `NEXT_PUBLIC_APP_LOGO` | Logo (emoji or path) | `✨` |
| `NEXT_PUBLIC_APP_TAGLINE` | Brand tagline | `AI-Powered SaaS Starter` |
| `NEXT_PUBLIC_COMPANY_NAME` | Legal company name | `Your Company` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Support email | `support@example.com` |
| `NEXT_PUBLIC_CONTACT_TWITTER` | Twitter handle | (empty) |
| `NEXT_PUBLIC_CONTACT_GITHUB` | GitHub URL | (empty) |
| `NEXT_PUBLIC_SEO_TITLE` | Default page title | `AI-Powered Text to Emoji` |
| `NEXT_PUBLIC_SEO_DESCRIPTION` | Meta description | (see .env.example) |
| `NEXT_PUBLIC_SEO_KEYWORDS` | SEO keywords (comma-separated) | `AI,SaaS,...` |
| `NEXT_PUBLIC_OG_LOCALE` | OpenGraph locale | `en_US` |
| `NEXT_PUBLIC_TWITTER_SITE` | Twitter site handle | (empty) |
| `NEXT_PUBLIC_TWITTER_CREATOR` | Twitter creator handle | (empty) |

## Checklist

- [ ] Environment variables configured in `.env`
- [ ] Demo replaced with your feature
- [ ] AI provider configured
- [ ] Mock mode disabled
- [ ] Plans customized
- [ ] Marketing pages updated
- [ ] i18n configured (optional)
- [ ] Deployed to production
- [ ] Production environment variables set
- [ ] Database migrations run

## Need Help?

- Check the `/readme` route in development mode
- Review `docs/env-variables.md` for all configuration options
- Check `database/supabase/README.md` for database documentation
