import { type ReactNode, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    if (!convexUrl) {
      // In development, if Convex URL is not set yet, avoid hard crashing
      console.warn(
        "VITE_CONVEX_URL is not defined in environment variables. Please configure your Convex deployment URL in .env.",
      );
      return null;
    }
    return new ConvexReactClient(convexUrl);
  }, []);

  if (!convex) {
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
