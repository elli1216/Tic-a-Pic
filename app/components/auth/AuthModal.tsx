import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { Mail, Lock, X, ArrowRight, Loader2, ShieldCheck, Heart } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key press and lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleClose = () => {
    setErrorMessage(null);
    setEmail("");
    setPassword("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await signIn("password", {
        email,
        password,
        flow: step,
      });
      handleClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMessage(
        err?.message ||
          (step === "signIn"
            ? "Invalid email or password. Please try again."
            : "Could not create account. Email might already be registered.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[100] w-screen h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md my-auto bg-zinc-900/95 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-pink-950/50 flex flex-col gap-6"
      >
        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close sign in modal"
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 pr-4 pl-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mt-1">
            {step === "signIn" ? "Welcome Back to Tic-a-Pic" : "Join Tic-a-Pic"}
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs">
            {step === "signIn"
              ? "Sign in to access your permanent Cloud Vault and synced photo strips."
              : "Create an account to save high-res photostrips permanently in the cloud."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-950/80 p-1 rounded-2xl border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setStep("signIn");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              step === "signIn"
                ? "bg-pink-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("signUp");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              step === "signUp"
                ? "bg-pink-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium text-center">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-pink-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-pink-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{step === "signIn" ? "Sign In to Cloud Vault" : "Create My Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Clear Close / Cancel Button */}
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 font-semibold text-xs transition cursor-pointer"
            >
              Close & Continue as Guest
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted sessions powered by Convex Auth</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
