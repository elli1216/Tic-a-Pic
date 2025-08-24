"use client";

import dynamic from "next/dynamic";
const Header = dynamic(() => import("@/features/home/components/Header"));
const HomeLayout = dynamic(() => import("./layout"));

/**
 * Home page component for the photobooth application.
 */
export default function Home(): React.JSX.Element {
  return (
    <HomeLayout>
      <Header />
      <h1>Main</h1>
    </HomeLayout>
  );
}
