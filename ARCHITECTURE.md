# System Architecture

## High-Level Flow

1. User opens `ticapic.com`
2. Session Modal Prompt (DO NOT CHANGE — already perfect):
   - Option 1: Enter existing session code (e.g., `ABCD-EFGH-IJKL`)
     - System validates it via `/api/session/validate`
     - If valid → restore saved photos, layouts, preferences
   - Option 2: Start fresh → generate new random `session_id` (e.g., `PHX9-M2LQ-7TZR`)
   - Optional: Add a nickname (e.g., "Darla's Booth")
3. User selects a layout (free or premium) from gallery
4. Enters unified photobooth experience:
   - Camera preview + photo strip shown together in one view
   - Click “Start Session” → begins auto-capture:
     - Countdown 3 → 2 → 1 → CAPTURE photo 1 → slot 1
     - Wait 3 seconds → auto-capture photo 2 → slot 2
     - Wait 3 seconds → auto-capture photo 3 → slot 3
     - Wait 3 seconds → auto-capture photo 4 → slot 4
   - After 4th photo → show final strip with:
     - “Save Strip” → saves all 4 photos to Supabase + localStorage
     - “Retake All” → restarts countdown from photo 1
     - (Future) “Add Stickers” / “Download”
5. To unlock premium:
   - Click "Go Premium"
   - Scan GCash/Maya QR code to pay
   - After payment → Stripe webhook triggers → system generates unique `premium_code`
   - Show code on `/success` page (user must save it)
6. User enters `premium_code` in input field:
   - Sent to `/api/check-code`
   - If valid and not yet redeemed:
     - Backend marks `is_redeemed = true`
     - Links `used_by_session = current_session_id`
     - Returns `{ valid: true }`
   - Frontend unlocks premium features:
     - Premium layouts
     - Remove QR watermark
     - AI tools (future)
7. All user data (photos, DIY layouts, settings) tied to `session_id` → recoverable on any device

## Data Flow

- Frontend (Next.js + React) ↔ API Routes (Edge Functions) ↔ Supabase (PostgreSQL + Storage)
- No user authentication
- State persistence:
  - `session_id` stored in `localStorage`
  - Zustand store syncs with `session_id` and backend
  - Photos stored in Supabase Storage + `user_photos` table (one record per photo, tied to `session_id`)
  - Layouts stored in `user_layouts` table (tied to `session_id`)

## Folder Structure

app/
page.tsx → 🎯 LANDING PAGE (marketing, CTA, email capture)
booth/page.tsx → 📸 UNIFIED PHOTOOBOOTH (camera + strip + auto-capture)
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

## Components

- `<CameraStripBooth />` → NEW: Unified component that renders:
  - Live camera feed
  - 4-slot photo strip (side-by-side or overlay)
  - Countdown timer
  - “Start Session”, “Save Strip”, “Retake All” buttons
- `<LayoutGallery />` → Grid of free/premium layouts (unchanged)
- `<PremiumGate />` → Blocks premium layouts unless code is valid (unchanged)
- `<SessionModal />` → Handles session input/generation (DO NOT CHANGE — perfect)
- `<ClearSessionButton />` → Clears localStorage and resets state (unchanged)
- `<SuggestFeatureButton />` → Opens feedback modal (type: 'feature')
- `<ReportBugButton />` → Opens feedback modal (type: 'bug')

## State Management (Zustand — DO NOT CHANGE SESSION LOGIC)

- **Zustand Store (`useAppStore`)**: Single source of truth for:

  - `session_id` → preserved from session modal (DO NOT MODIFY)
  - `nickname` → preserved
  - `photos: string[]` → 4 slots for captured photos (new)
  - `activeLayout` → selected layout (preserved)
  - `isPremium` → unlocked via code (preserved)
  - `currentSlot: 0 | 1 | 2 | 3` → NEW: tracks which photo is next
  - `isCapturing: boolean` → NEW: true during countdown/capture
  - `countdown: number` → NEW: 3, 2, 1
  - Actions:
    - `setSession()` → preserved
    - `addPhoto(index, photoUrl)` → NEW
    - `startCapture()` → NEW
    - `retakeAll()` → NEW
    - `setIsPremium()` → preserved
    - `clearSession()` → preserved

- **Persistence**:
  - `localStorage`: persist `session_id`, `isPremium`, `activeLayout`
  - Photos are temporary until “Save Strip” is clicked → then saved to Supabase
  - Sync with Supabase via API routes

## Security (UNCHANGED — already solid)

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

## Unified Photobooth Flow (NEW)

```mermaid
graph TD
  A[User selects layout] --> B[Enter /booth]
  B --> C[Show camera + empty strip + Start Button]
  C --> D[User clicks "Capture"]
  D --> E[Countdown: 3...2...1...CAPTURE! → slot 1]
  E --> F[Wait 3s → auto-capture → slot 2]
  F --> G[Wait 3s → auto-capture → slot 3]
  G --> H[Wait 3s → auto-capture → slot 4]
  H --> I[Show final strip + Save/Retake buttons]
  I --> J{User clicks?}
  J -->|Save Strip| K[Save all 4 photos to Supabase + localStorage]
  J -->|Retake All| L[Reset photos → restart from slot 1]
  K --> M[Show success message + option to take another strip]
  L --> D
```
