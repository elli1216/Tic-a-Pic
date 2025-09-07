# API Endpoints (Next.js App Router)

All under `app/api/`

## POST /api/session/create

- Generates random 12-char session ID (e.g., `A1B2-C3D4-E5F6`)
- Saves to `sessions` table
- Returns: `{ session_id: string }`

## POST /api/layout/free

- Returns list of free layouts from `layouts` table
- Returns: `Layout[]`

## POST /api/layout/premium

- Body: `{ premium_code: string }`
- Validates code via `/api/check-code`
- If valid → returns premium layouts
- Returns: `Layout[]`

## POST /api/check-code

- Body: `{ code: string }`
- Checks `premium_codes` table
- Returns: `{ valid: boolean, expires_at?: string }`

## POST /api/layout/save

- Body: `{ session_id, name, config_json }`
- Saves to `user_layouts`
- Returns: `{ success: boolean }`

## POST /api/feedback

- Body: `{ type, message, session_id }`
- Saves to `feedback` table with device info
- Returns: `{ success: boolean }`

## GET /api/visitor-count

- Returns: `{ total_visitors: number, active_now: number }`
- Optional: use Supabase Realtime for live updates

## POST /api/webhook/stripe

- Handles Stripe payment success (GCash)
- On successful payment:
  - Generate random `premium_code` (e.g., `TAP-7X9K-P2MN`)
  - Save to `premium_codes`
  - (Optional) Send email
- No response needed (webhook)

## POST /api/email/subscribe

- Body: `{ email, source }`
- Saves to `email_subscribers`
- Returns: `{ success: boolean }`

## GET /api/sticker/list

- Returns list of stickers from:
  - `/stickers/default/`
  - `/stickers/uploaded/` (if any)
- Returns: `Sticker[]`
