# AGENTS.md - Tic a Pic

## Dev Commands

- `pnpm run dev` - Start dev server
- `pnpm run dev:https` - Dev server with HTTPS (required for camera on some browsers)
- `pnpm run build` - Production build
- `pnpm run lint` - ESLint

## Tech Stack

- Next.js 16 (App Router) with React 19, TypeScript
- Tailwind CSS 4 + DaisyUI
- Zustand for state management
- TanStack React Query
- Supabase (PostgreSQL + Storage)
- Stripe for payments

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/features/` - Feature-based components (home, photobooth, common)
- `src/lib/` - Supabase client, session utilities, database types
- `src/shared/types/` - Shared TypeScript types (see TYPES.ts)

## Path Aliases

Use `@/features/*`, `@/lib/*`, `@/shared/*`, `@/styles/*` for imports.

## Key Architecture

- **No authentication** - State tied to `session_id` in localStorage
- **Session Modal** - Critical component (see ARCHITECTURE.md: "DO NOT CHANGE — already perfect")
- **Premium codes** - Redeemed server-side only via `/api/check-code`
- **Zustand store** (`usePhotoboothStore`) - Manages session_id, photos, activeLayout, isPremium
- **API routes** - All in `src/app/api/`, mostly Edge Functions

## Required Env Variables

See `.env.example` for required Supabase and Stripe keys.

## Important Docs

- `ARCHITECTURE.md` - Full system flow, data model, security notes
- `FEATURES.md` - Feature logic details
- `API_ROUTES.md` - Backend endpoints
- `DATA_MODEL.md` - Database schema
- `TYPES.ts` - Shared types
