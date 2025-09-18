'use client';

import React from 'react';
import "@/styles/globals.css";
import Header from '@/features/home/components/Header';
import SessionModal from '@/features/photobooth/components/modal/SessionModal';
import SessionInitializer from '@/features/photobooth/components/session/SessionInitializer';
import { Toaster } from 'react-hot-toast';
import useThemeStore from '@/features/common/store/useThemeStore';
import { QueryProvider } from '@/features/common/providers/QueryProvider';

/**
 * Root layout component for the application.
 * Imports global styles and provides the base HTML structure with header.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const theme = useThemeStore((state) => state.theme);

  return (
    <QueryProvider>
      <html lang="en" data-theme={theme} suppressHydrationWarning={true}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
          <meta name="description" content="Take instant photos and create beautiful photo strips with Tic a Pic - no login required!" />
          <meta name="theme-color" content="#7c3aed" />
          <link rel="icon" href="/favicon.ico" />
          <title>Tic a Pic - Instant Photobooth</title>
        </head>
        <body className={`min-h-screen bg-base-100 text-base-content`} suppressHydrationWarning={true}>
          <SessionInitializer />
          <Header />
          <main className="pt-0">
            {children}
          </main>
          <SessionModal />
          {theme === `nord` ? (
            <Toaster
              position="top-left"
              toastOptions={{
                duration: 3000,
              }}
            />
          ) : (
            <Toaster
              position="top-left"
              toastOptions={{
                duration: 3000,
                style: {
                  background: `#333333`,
                  color: `#ffffff`,
                },
              }}
            />
          )}
        </body>
      </html>
    </QueryProvider>
  )
}