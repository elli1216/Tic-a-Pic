import { type ReactNode, useMemo } from "react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://placeholder.convex.cloud";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    return new ConvexReactClient(convexUrl);
  }, []);

  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
