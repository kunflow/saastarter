# Environment Variables Documentation

> Last updated: 2026-02-04

## Overview

This document describes all environment variables used in the Next-AI SaaS Starter project.

## Required Variables

### Supabase Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase publishable key (public) | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | `eyJhbGciOiJIUzI1NiIs...` |

### App Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `Next-AI SaaS Starter` |

## Optional Variables

### Mode Configuration

| Variable | Description | Values | Default |
|----------|-------------|--------|---------|
| `APP_MODE` | Application running mode | `development`, `production`, `test`, `mock` | `development` |
| `ENABLE_MOCK` | Enable mock mode (skip real API calls) | `true`, `false` | `false` |

### AI Configuration (Future)

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | - |
| `AI_MODEL` | Default AI model | `gpt-4o-mini` |
| `AI_TIMEOUT` | AI request timeout (ms) | `30000` |
| `AI_MAX_RETRIES` | Max retry attempts | `3` |

### Credits Configuration (Future)

| Variable | Description | Default |
|----------|-------------|---------|
| `DEFAULT_FREE_CREDITS` | Default credits for free users | `100` |
| `DEFAULT_PRO_CREDITS` | Default credits for pro users | `1000` |
| `ANONYMOUS_QUOTA` | Anonymous user quota | `5` |

## Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials from [Supabase Dashboard](https://supabase.com/dashboard)

3. Update other variables as needed

## Security Notes

- **Never commit `.env` file** to version control
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` should only be used server-side
- Keep API keys and secrets secure
