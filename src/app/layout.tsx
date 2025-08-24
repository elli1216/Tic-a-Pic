import React from 'react';
import "@/styles/globals.css";

/**
 * Root layout component for the application.
 * Imports global styles and provides the base HTML structure.
 */
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center">
        {children}
      </body>
    </html>
  )
}