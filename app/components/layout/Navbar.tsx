import { Link, useLocation } from "react-router";
import { Camera, Sparkles, Image as ImageIcon, LayoutDashboard, Heart } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight text-white flex items-center gap-1">
              TIC-A-PIC <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-pink-400">
              Retro AI Photobooth
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/photobooth"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              pathname === "/photobooth"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-500/20"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800/80"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photobooth</span>
          </Link>

          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              pathname === "/dashboard"
                ? "bg-zinc-800 text-white border border-zinc-700"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800/80"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/dashboard/photoStrips"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              pathname === "/dashboard/photoStrips"
                ? "bg-zinc-800 text-white border border-zinc-700"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800/80"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>Saved Strips</span>
          </Link>
        </nav>

        {/* Action badge */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/40 border border-pink-500/30 text-[11px] font-medium text-pink-300">
            <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
            <span>Couples & Duos</span>
          </div>
        </div>
      </div>
    </header>
  );
}
