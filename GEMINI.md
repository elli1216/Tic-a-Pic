# Project: Tic-a-Pic - Instant Photobooth Website

## Project Overview

This is a Next.js (App Router) photobooth web application that allows users to take photos, customize them with layouts and stickers, and save or download the results. The application is designed to be mobile-first and does not require user authentication. Instead, it uses a session-based approach to persist user data. It includes features like free and premium content, payment integration with Stripe (for GCash/Maya), and a DIY layout creator. The backend is built with Next.js API Routes running on Vercel Edge Functions, and it uses Supabase for the database and storage.

## Building and Running

### Development

To run the application in development mode, use the following command:

```bash
pnpm run dev
```

To run with HTTPS, which may be required for camera access in some browsers:

```bash
pnpm run dev:https
```

### Build

To build the application for production, use the following command:

```bash
pnpm run build
```

### Start

To start the production server, use the following command:

```bash
pnpm run start
```

### Linting

To run the linter, use the following command:

```bash
pnpm run lint
```

## Development Conventions

The project follows standard conventions for a Next.js application. Key points include:

- **State Management:** The application uses Zustand for global state management and React Query for server state. The main Zustand store is located in `src/features/common/store/usePhotoboothStore.ts`.
- **API Routes:** Backend logic is handled through Next.js API Routes, which are located in the `src/app/api` directory.
- **Database:** The project uses Supabase for its PostgreSQL database. The database schema is documented in `DATA_MODEL.md`.
- **Types:** Shared TypeScript types are located in `src/shared/types/TYPES.ts`.
- **Styling:** The project uses Tailwind CSS for styling, with custom styles in `src/styles/globals.css`.
- **Architecture:** A detailed explanation of the architecture, data flow, and component structure is available in `ARCHITECTURE.md`.
- **Features:** A list of current and future features is documented in `FEATURES.md`.
- **No Authentication:** The application is designed to work without user accounts. All user-specific data is tied to a `session_id` that is generated for each user and stored in `localStorage`.
