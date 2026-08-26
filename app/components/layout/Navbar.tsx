import { Link } from "react-router";
import { Camera, Sparkles, Heart } from "lucide-react";
import { UserMenu } from "../auth/UserMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Clean Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition">
            <Camera className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
              TIC-A-PIC <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            </span>
            <span className="text-[9px] tracking-widest uppercase font-semibold text-pink-400/90">
              Retro AI Photobooth
            </span>
          </div>
        </Link>

        {/* Right Section: Couples Badge & User Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/30 border border-pink-500/20 text-[11px] font-medium text-pink-300">
            <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
            <span>Couples & Duos</span>
          </div>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
