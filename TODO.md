# Tic a Pic – Development Roadmap

## Phase 1: MVP (Core Photobooth)

- [ ] Set up Next.js + Tailwind + DaisyUI
- [ ] Create `README.md`, `ARCHITECTURE.md`, etc.
- [ ] Implement camera capture (`<CameraPreview />`)
- [ ] Build `PhotoStripCanvas` with 4-slot layout
- [ ] Add free layout gallery
- [ ] Implement `session_id` generation
- [ ] Save layouts to `localStorage`

## Phase 2: Backend & Payments

- [ ] Set up Supabase project
- [ ] Create all tables (`layouts`, `premium_codes`, etc.)
- [ ] Build API routes (`/api/session/create`, `/api/layout/free`, etc.)
- [ ] Integrate Stripe for GCash QR
- [ ] Create `/success` page with code display
- [ ] Webhook: generate `premium_code` on payment

## Phase 3: Premium & UI

- [ ] Add QR watermark (toggle for premium)
- [ ] Implement `PremiumGate` component
- [ ] Add email subscription
- [ ] Add feedback buttons
- [ ] Show real-time visitor count

## Phase 4: Advanced Features

- [ ] DIY Layout Creator
- [ ] Custom sticker upload
- [ ] Split-layout support
- [ ] Downloadable print guide (PDF/Word)
- [ ] GIF/live photo support

## Phase 5: AI (Future)

- [ ] AI background removal
- [ ] AI photo merging (remote group photos)
- [ ] AI-generated high-angle photobooth images

## Phase 6: Launch

- [ ] Optimize for mobile
- [ ] Deploy on Vercel (`ticapic.com`)
- [ ] Promote via Darl Ellison & classmates
- [ ] Add "Sponsored by Darl Ellison" badge (optional)
