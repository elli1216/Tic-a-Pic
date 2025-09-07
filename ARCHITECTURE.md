# System Architecture

## High-Level Flow

1. User opens `ticapic.com`
2. (Optional) Prompt: "Enter a nickname or code" → generates `session_id` (e.g., `PHX9-M2LQ-7TZR`)
3. User takes photos → applies free layouts
4. To unlock premium:
   - Click "Go Premium"
   - See GCash QR code
   - After payment → webhook triggers code generation
   - User receives unique `premium_code` (e.g., `TAP-7X9K-P2MN`)
5. Enter code → unlocks premium layouts, removes watermark, enables AI tools

## Data Flow

- Frontend (Next.js) ↔ API Routes (Edge) ↔ Supabase DB + Storage
- No user accounts. All tied to `session_id` or `premium_code`

## Folder Structure

app/
page.tsx → Main photobooth (camera, capture, preview)
create/page.tsx → DIY Layout Creator
success/page.tsx → Payment success (shows premium code)
prints/guide/page.tsx → Download print guide
api/
session/create → POST: generates session_id
layout/free → POST: get free layouts
layout/premium → POST: get premium if code valid
check-code → POST: validate premium_code
feedback → POST: bug/feature
visitor-count → GET: real-time count
email/subscribe → POST: save email
webhook/stripe → POST: handle payment → generate code
sticker/list → GET: list stickers

components/
`CameraPreview`
`PhotoStripCanvas`
`StickerDragger`
`LayoutGallery`
`PremiumGate`
`SuggestFeatureButton`
`ReportBugButton`

## State Management

- `localStorage`: save session preferences (selected layout, stickers)
- `sessionStorage`: temporary photo preview
- `cookies`: optional `premium_code` or `session_id`

## Security

- `premium_code` is checked server-side
- All API routes validate input
- Supabase RLS (Row Level Security) disabled (no auth), but tables are protected via backend checks
