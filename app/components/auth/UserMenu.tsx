import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AuthModal } from "./AuthModal";
import { User, LogOut, LogIn, Cloud, Sparkles } from "lucide-react";

export function UserMenu() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.viewer);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-8 w-20 bg-zinc-800/60 animate-pulse rounded-full" />
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-purple-500/30 rounded-full pl-2.5 pr-1 py-1 shadow-md">
            <div className="flex items-center gap-1.5 text-xs text-purple-300 font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="max-w-[110px] truncate text-[11px]">
                {user?.email || user?.name || "Logged In"}
              </span>
            </div>

            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-pink-500/20 transition transform hover:scale-105"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
