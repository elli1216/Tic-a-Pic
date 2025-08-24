"use client";

import dynamic from "next/dynamic";
const ThemeToggle = dynamic(() => import("features/common/components/ThemeToggle"));

/**
 * Home page component for the photobooth application.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1>Photobooth</h1>
      <ThemeToggle />
    </div>
  );
}
