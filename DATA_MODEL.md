# Supabase Database Schema

## Table: `sessions`

- `session_id` (text, primary) → e.g., "PHX9-M2LQ-7TZR"
- `created_at` (timestamptz)
- `device_info` (jsonb) → { userAgent, platform }
- `nickname` (text)

## Table: `layouts`

- `id` (uuid)
- `name` (text)
- `type` (text: 'free' | 'premium')
- `config_json` (text) → JSON string of layout structure
- `thumbnail_url` (text)
- `is_split` (boolean, nullable) → for puzzle layouts

## Table: `user_layouts`

- `id` (uuid)
- `session_id` (text) → references `sessions`
- `name` (text)
- `config_json` (text)
- `created_at` (timestamptz)

## Table: `premium_codes`

- `code` (text, primary) → e.g., "TAP-7X9K-P2MN"
- `is_active` (boolean)
- `payment_id` (text) → Stripe payment ID
- `email` (text, nullable)
- `created_at` (timestamptz)
- `expires_at` (timestamptz, nullable)

## Table: `email_subscribers`

- `email` (text, primary)
- `subscribed_at` (timestamptz)
- `source` (text: 'homepage' | 'success-page')

## Table: `feedback`

- `id` (uuid)
- `type` (text: 'bug' | 'feature')
- `message` (text)
- `session_id` (text, nullable)
- `created_at` (timestamptz)
- `device_info` (jsonb) → { userAgent, platform }

## Table: `visitor_stats`

- `id` (uuid, singleton)
- `total_visitors` (int)
- `active_now` (int)
