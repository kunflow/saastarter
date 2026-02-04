# Make It Yours

Transform this template into your own product in about 2 hours.

## Overview

This guide walks you through customizing the template for your specific AI product. By the end, you'll have a fully branded, functional AI SaaS.

## Step 1: Brand & SEO Configuration (10 min)

### 1.1 Site Configuration

Edit `src/config/site.ts`:

```typescript
export const siteConfig = {
  // Brand
  brand: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Your Product Name',
    logo: '🚀', // emoji or image path (e.g., '/logo.svg')
    tagline: 'Your catchy tagline',
  },

  // Contact
  contact: {
    email: 'support@your-domain.com',
    twitter: '@yourhandle', // or empty
    github: 'https://github.com/your-repo', // or empty
  },

  // Legal
  legal: {
    companyName: 'Your Company Name',
    privacyUrl: '/legal#privacy',
    termsUrl: '/legal#terms',
  },

  // Feature toggles
  features: {
    enableDemoOnHome: true,
    showCreditsInHeader: true,
  },
}
```

### 1.2 SEO Configuration

Edit `src/config/seo.ts`:

```typescript
export const seoConfig = {
  // Default SEO
  default: {
    title: 'Your Product Title',
    description: 'Your product description for search engines',
    keywords: ['your', 'keywords', 'here'],
  },

  // OpenGraph
  openGraph: {
    type: 'website',
    locale: 'en_US',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@yourhandle', // or empty
    creator: '@yourhandle', // or empty
  },

  // Page-specific SEO
  pages: {
    pricing: {
      title: 'Pricing',
      description: 'Your pricing page description',
    },
    faq: {
      title: 'FAQ',
      description: 'Your FAQ page description',
    },
    legal: {
      title: 'Legal',
      description: 'Your legal page description',
    },
  },
}
```

### 1.3 Environment Variables (Optional Override)

Set environment variables to override config values:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Your Product Name
```

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

Edit `src/app/page.tsx` to use your demo:

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

Edit `.env`:

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

Edit `src/app/(marketing)/pricing/pricing-content.tsx`:
- Update plan features
- Adjust pricing display

### 5.2 FAQ Page

Edit `src/app/(marketing)/faq/faq-content.tsx`:
- Replace questions with your product-specific FAQs

### 5.3 Legal Page

Edit `src/app/(marketing)/legal/legal-content.tsx`:
- Update Terms of Service
- Update Privacy Policy

## Step 6: Deploy (15 min)

### 6.1 Deploy to Vercel

```bash
vercel
```

### 6.2 Configure Production Environment

Set environment variables in Vercel dashboard:
- All variables from `.env.example`
- `NEXT_PUBLIC_APP_URL` = your production URL

### 6.3 Run Database Migrations

Execute all migration files in your production Supabase project.

## Configuration Files Summary

| File | Purpose |
|------|---------|
| `src/config/site.ts` | Brand, contact, legal, feature toggles |
| `src/config/seo.ts` | SEO, OpenGraph, Twitter, page metadata |
| `src/config/env.ts` | Environment variables (sensitive, runtime) |
| `src/config/credits.ts` | Credits system configuration |
| `src/config/plans.ts` | Plans and entitlements |

## Checklist

- [ ] Brand name and logo configured in `site.ts`
- [ ] SEO metadata updated in `seo.ts`
- [ ] Contact and legal info updated in `site.ts`
- [ ] Demo replaced with your feature
- [ ] AI provider configured
- [ ] Mock mode disabled
- [ ] Plans customized
- [ ] Marketing pages updated
- [ ] Deployed to production
- [ ] Production environment variables set
- [ ] Database migrations run

## Need Help?

- Check the `/readme` route in development mode
- Review `docs/env-variables.md` for all configuration options
- Check `supabase/README.md` for database documentation
