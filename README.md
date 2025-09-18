# Tic a Pic – Instant Photobooth Website   ![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)

## 🎯 Overview

A no-login, mobile-first photobooth web app where users can:

- Take instant photos using their camera
- Use **free layouts** or unlock **premium layouts** via GCash/Maya payment
- Receive a **unique access code** after payment for premium access
- Customize photo strips with stickers, DIY layouts, and AI enhancements

No accounts. No login. Just instant fun.

## 💡 Key Features

- ✅ Free & premium photobooth layouts
- ✅ GCash/Maya QR payment → auto-generated unique code
- ✅ Optional random session ID (no login, just a string)
- ✅ QR code watermark on photo strips (removable for premium)
- ✅ AI photo merging (future): group photos even when not together
- ✅ AI-generated "high-angle photobooth" style images
- ✅ Live photos / GIFs
- ✅ Heart-split layouts (merge two strips into one)
- ✅ Email subscription for promotions
- ✅ Suggest feature / report bug buttons
- ✅ Real-time visitor count
- ✅ DIY layout creator + custom stickers
- ✅ Downloadable print guide (PDF/Word) for accurate printing

## 💰 Monetization

- One-time GCash/Maya payment → generates unique code
- Optional donations to sustain the site
- Witty payment note: _"Just Gcash my location, sir 😹"_

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, DaisyUI
- **Hosting**: Vercel (Edge Functions enabled)
- **Backend**: Next.js API Routes (Edge)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (stickers, templates, guides)
- **Payments**: Stripe (GCash via QR) → Webhook generates code
- **AI (Future)**: Cloudflare Workers AI or external API for background removal, face alignment, merging

## 📁 How to Use This in Cursor

This project uses **no authentication**. All state is tied to:

- `session_id` (random string, optional prompt on load)
- `premium_code` (after payment)
- `localStorage` / `sessionStorage` for UI preferences

Refer to:

- `ARCHITECTURE.md` for data flow
- `FEATURES.md` for feature logic
- `TYPES.ts` for shared types
- `API_ROUTES.md` for backend endpoints
- `DATA_MODEL.md` for database schema

Always generate code consistent with these.
