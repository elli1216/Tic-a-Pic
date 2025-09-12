# System Architecture

## High-Level Flow

1. User opens `ticapic.com`
2. Session Modal Prompt:
   - Option 1: Enter existing session code (e.g., `ABCD-EFGH-IJKL`)
     - System validates it via `/api/session/validate`
     - If valid → restore saved photos, layouts, preferences
   - Option 2: Start fresh → generate new random `session_id` (e.g., `PHX9-M2LQ-7TZR`)
   - Optional: Add a nickname (e.g., "Darla's Booth")
3. User takes photos using camera → applies free layouts
4. To unlock premium:
   - Click "Go Premium"
   - Scan GCash/Maya QR code to pay
   - After payment → Stripe webhook triggers → system generates unique `premium_code`
   - Show code on `/success` page (user must save it)
5. User enters `premium_code` in input field:
   - Sent to `/api/check-code`
   - If valid and not yet redeemed:
     - Backend marks `is_redeemed = true`
     - Links `used_by_session = current_session_id`
     - Returns `{ valid: true }`
   - Frontend unlocks premium features:
     - Premium layouts
     - Remove QR watermark
     - AI tools (future)
6. All user data (photos, DIY layouts, settings) tied to `session_id` → recoverable on any device

## Data Flow

- Frontend (Next.js + React) ↔ API Routes (Edge Functions) ↔ Supabase (PostgreSQL + Storage)
- No user authentication
- State persistence:
  - `session_id` stored in `localStorage`
  - Zustand store syncs with `session_id` and backend
  - Photos stored in Supabase Storage + `user_photos` table
  - Layouts stored in `user_layouts` table (tied to `session_id`)

## Folder Structure

app/
page.tsx → Main photobooth UI (camera, capture, preview, strip)
create/page.tsx → DIY Layout Creator
success/page.tsx → Payment success (displays generated premium_code)
prints/guide/page.tsx → Download print guide (PDF/Word)
api/
session/
validate/route.ts → POST: checks if session_id exists in DB
create/route.ts → POST: generates new session_id (optional future use)
layout/
free/route.ts → POST: returns free layouts
premium/route.ts → POST: returns premium layouts if code valid
check-code/route.ts → POST: validates & redeems premium_code (locks to session)
photo/
save/route.ts → POST: saves photo URL to user_photos table
list/route.ts → GET: fetches user's photos by session_id
feedback/route.ts → POST: submits bug report or feature suggestion
visitor-count/route.ts → GET: returns real-time visitor count
email/
subscribe/route.ts → POST: saves email to email_subscribers
webhook/
stripe/route.ts → POST: handles Stripe payment success → generates premium_code
sticker/
list/route.ts → GET: lists default + uploaded stickers

components/
`CameraPreview` → Accesses webcam, captures image
`PhotoStripCanvas` → Renders 4-slot photobooth strip with layout
`StickerDragger` → Draggable stickers on photo
`LayoutGallery` → Grid of free/premium layouts
`PremiumGate` → Blocks premium features unless code is valid
`SuggestFeatureButton` → Opens feedback modal (type: 'feature')
`ReportBugButton` → Opens feedback modal (type: 'bug')
`SessionModal` → Handles session input/generation
`ClearSessionButton` → Clears localStorage and resets state

## State Management

- **Zustand Store (`useAppStore`)**: Single source of truth for:
  - `session_id`
  - `nickname`
  - `photos[]`
  - `activeLayout`
  - `isPremium`
  - Actions: `setSession()`, `addPhoto()`, `setIsPremium()`, `clearSession()`
- **Persistence**:
  - `localStorage`: persist `session_id`, `isPremium`, UI prefs
  - Sync with Supabase via API routes
- **Temporary State**:
  - `sessionStorage`: photo preview before saving
  - Not required after save

## Security

- 🔐 `premium_code` redemption is **server-side only**
  - Checked via `/api/check-code`
  - Once used, `is_redeemed = true` and `used_by_session` locked
- 🛡️ Row Level Security (RLS) enabled on all tables
  - Public: read-only on safe tables (`layouts`, `visitor_stats`)
  - Insert-only: `email_subscribers`, `feedback`
  - Backend-only: `user_photos`, `user_layouts`, `premium_codes` (via `service_role`)
- 🚫 No client-side trust:
  - Never assume user has premium access
  - Always verify via API before unlocking features

## Session Modal Flow (Detailed)

```mermaid
graph TD
  A[Page Load] --> B{Has session_id in localStorage?}
  B -->|Yes| C[Auto-recover session]
  B -->|No| D[Show Session Modal]

  D --> E[Input: Existing session code?]
  E -->|User enters code| F[Call /api/session/validate]
  F --> G{Valid?}
  G -->|Yes| H[Load user's photos/layouts from DB]
  G -->|No| I[Show error: "Session not found"]
  I --> J[Option to generate new session]

  E -->|User skips| K[Generate new session_id]
  K --> L[Format: XXXX-XXXX-XXXX (uppercase)]
  L --> M[Save session_id to localStorage]
  M --> N[Initialize empty Zustand state]

  H & N --> O[Main Photobooth UI]

  P[Settings] --> Q[Clear Session Button]
  Q --> R[Remove session_id from localStorage]
  R --> S[Reset Zustand store]
  S --> T[Reload or redirect to home]
```
