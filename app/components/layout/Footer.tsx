import { Link } from "react-router";
import { Camera, Sparkles, Heart, Shield, Zap, Film, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-800/80 text-zinc-400 relative overflow-hidden mt-auto">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-pink-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5 w-fit group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition">
                <Camera className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                TIC-A-PIC <Sparkles className="w-4 h-4 text-pink-400" />
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
              The retro-modern web photobooth designed for couples, duos, and friends. 
              Real-time client-side AI background segmentation, long-distance WebRTC dual camera sync, 
              and instant 4-shot print generation.
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Local-first & private: Photos stay in your browser until you choose to sync.</span>
            </div>
          </div>

          {/* Col 2: Studio Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Photobooth Studio
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link
                  to="/photobooth"
                  className="hover:text-pink-400 transition flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-pink-500" />
                  <span>Launch Photobooth</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-pink-400 transition flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <span>Studio Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/photoStrips"
                  className="hover:text-pink-400 transition flex items-center gap-1.5"
                >
                  <Film className="w-3.5 h-3.5 text-rose-400" />
                  <span>Saved Photo Strips</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Technology & Features */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Built With
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                MediaPipe AI Matting
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                WebRTC Peer Sync
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                Convex Backend
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                React Router 8
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Tic-a-Pic. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
            <span>for duos & besties everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
