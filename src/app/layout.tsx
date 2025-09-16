'use client';

import React from 'react';
import { Dancing_Script } from 'next/font/google';
import "@/styles/globals.css";
import Header from '@/features/home/components/Header';
import { Toaster } from 'react-hot-toast';

// Configure the Dancing Script font
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-dancing-script',
});

/**
 * Root layout component for the application.
 * Imports global styles and provides the base HTML structure with header.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en" data-theme="nord" className={dancingScript.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta name="description" content="Take instant photos and create beautiful photo strips with Tic a Pic - no login required!" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="icon" href="/favicon.ico" />
        <title>Tic a Pic - Instant Photobooth</title>
      </head>
      <body className={`min-h-screen bg-base-100 text-base-content ${dancingScript.variable}`}>
        <Header />
        <main className="pt-0">
          {children}
        </main>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--fallback-b1,oklch(var(--b1)))',
              color: 'var(--fallback-bc,oklch(var(--bc)))',
            },
          }}
        />
      </body>
    </html>
  )
}