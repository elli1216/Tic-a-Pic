# Supabase Database Schema

## Table: `sessions`

- `session_id` (text, primary) → e.g., "PHX9-M2LQ-7TZR"
- `nickname` (text, nullable) → e.g., "Darla's Booth"
- `created_at` (timestamptz)
- `last_used` (timestamptz)

## Table: `layouts`

- `id` (uuid, primary)
- `name` (text)
- `type` (text: 'free' | 'premium')
- `config_json` (text) → JSON string of layout structure
- `thumbnail_url` (text)
- `is_split` (boolean, nullable) → for puzzle layouts (e.g., heart split)

## Table: `user_layouts`

- `id` (uuid, primary)
- `session_id` (text) → references `sessions(session_id)` ON DELETE CASCADE
- `name` (text)
- `config_json` (text)
- `created_at` (timestamptz)

## 🆕 Table: `user_strips`

- `id` (uuid, primary)
- `session_id` (text) → references `sessions(session_id)` ON DELETE CASCADE
- `layout_id` (uuid) → references `layouts(id)` — which layout was used
- `strip_image_url` (text) → Supabase Storage path (e.g., `/strips/PHX9-M2LQ-7TZR/strip-20250405.png`)
- `photo_urls` (jsonb) → array of 4 photo URLs used in strip: `["url1", "url2", "url3", "url4"]`
- `metadata` (jsonb, optional) → { stickers: [], filters: [], taken_at: "ISO string" }
- `created_at` (timestamptz)

> 💡 Why this is better:
>
> - One record = one strip (matches user intent)
> - Easy to display in gallery later
> - Can regenerate/edit if needed (via `photo_urls` + `layout_id`)
> - `strip_image_url` = final rendered image (for download/share)

## Table: `premium_codes`

- `code` (text, primary) → e.g., "TAP-7X9K-P2MN"
- `is_active` (boolean) → can be disabled by admin
- `is_redeemed` (boolean) → whether code has been used (default: false)
- `payment_id` (text) → Stripe Payment Intent ID
- `email` (text, nullable)
- `used_by_session` (text, nullable) → session_id that claimed this code (references `sessions.session_id`)
- `created_at` (timestamptz)
- `expires_at` (timestamptz, nullable)

## Table: `email_subscribers`

- `email` (text, primary)
- `subscribed_at` (timestamptz)
- `source` (text: 'homepage' | 'success-page')

## Table: `feedback`

- `id` (uuid, primary)
- `type` (text: 'bug' | 'feature')
- `message` (text)
- `session_id` (text, nullable) → references `sessions(session_id)` ON DELETE SET NULL
- `created_at` (timestamptz)
- `device_info` (jsonb) → { userAgent, platform }

## Table: `visitor_stats`

- `id` (uuid, primary) → singleton: `'00000000-0000-4000-8000-000000000000'`
- `total_visitors` (bigint) → cumulative count
- `active_now` (int) → currently online
- `updated_at` (timestamptz)
