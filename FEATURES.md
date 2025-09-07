# Features

## 1. No Login System

- On page load, show optional prompt: "Want to save your session? Enter a nickname (e.g., 'Darla')"
- Generate a random 12-character `session_id` (e.g., `A1B2-C3D4-E5F6`)
- Store in `localStorage` and `session_id` param
- Used to save DIY layouts and preferences

## 2. Free vs Premium Layouts

- Free: unlimited access
- Premium: unlocked via `premium_code`
  - More layouts
  - Remove QR watermark
  - Access AI tools
  - Download print guide

## 3. Payment Flow (GCash/Maya via Stripe)

- Show QR code on "Go Premium" modal
- Payment note: _"Just Gcash my location, sir 😹"_
- On successful payment:
  - Stripe webhook → `/api/webhook/stripe`
  - Generate unique `premium_code` (e.g., `TAP-7X9K-P2MN`)
  - Save to `premium_codes` table
  - Email code to user (optional)
  - Show code on `/success` page

## 4. QR Watermark

- Small QR code in corner of every photo strip
- Links to `ticapic.com`
- Text: "Made with Tic a Pic"
- Premium users can remove it (toggle in UI)

## 5. AI Photo Merging (Future)

- Upload multiple photos (e.g., from different users)
- AI removes background, adjusts lighting, aligns faces
- Merges into one photobooth strip as if they were together
- Powered by Cloudflare Workers AI or external API

## 6. AI-Generated "High-Angle" Photos

- Upload selfie → AI generates photobooth-style image
  - High-angle view
  - Solid color background
  - Professional lighting
- Result looks like `google.com/search?q=high+angled+photobooth`

## 7. Live Photos / GIFs

- Capture 3-sec burst → generate animated GIF
- Use `gif.js` or `gif-encoder-2`
- Downloadable or shareable

## 8. Split Layouts (e.g., Heart Puzzle)

- Layout 1: left half of heart
- Layout 2: right half
- When printed and placed side-by-side → heart completes
- Great for couples, friends, prom

## 9. Email Subscription

- Checkbox: "Notify me when we launch on social media!"
- On submit → save email to `email_subscribers`
- Later: send official FB/IG/TikTok links

## 10. Feedback System

- "Suggest a Feature" → saves to `feedback` table (type: 'feature')
- "Report a Bug" → saves with device info (userAgent)

## 11. Real-Time Visitor Count

- Display: "🎉 1,247 people using Tic a Pic right now!"
- Updated via Supabase Realtime or cron job

## 12. DIY Layout Creator

- Drag & drop elements: photo slots, text, stickers
- Save to `user_layouts` (tied to `session_id`)
- Export as JSON

## 13. Custom Stickers

- Upload PNG (transparent background)
- Saved to Supabase Storage `/stickers/uploaded/`
- Draggable on photo strip

## 14. Print Guide

- Downloadable PDF or Word file
- Shows exact dimensions for 2x2, 4x6, etc.
- Ensures no cropping when printed
