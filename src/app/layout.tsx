import React from 'react';
import "@/styles/globals.css";

/**
 * Root layout component for the application.
 * Imports global styles and provides the base HTML structure.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}