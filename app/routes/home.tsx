import { Link, useNavigate } from "react-router";
import { Navbar } from "../components/layout/Navbar";
import { Camera, Users, Sparkles, Heart, Zap, Layers, ArrowRight, ShieldCheck, Film } from "lucide-react";
import { useBoothStore } from "../stores/useBoothStore";

export function meta() {
  return [
    { title: "Tic-a-Pic — Retro AI Couples Photobooth" },
    { name: "description", content: "Retro-modern web photobooth with client-side AI background segmentation and long-distance duo sessions." },
  ];
}

export default function HomePage() {
  const navigate = useNavigate();
  const { setMode } = useBoothStore();

  const handleStartMode = (mode: "solo" | "duo_local" | "duo_remote") => {
    setMode(mode);
    navigate("/photobooth");
  };

  return (
    <div className="min-h-screen bg-[#0d0c11] text-zinc-100 flex flex-col film-grain">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-pink-500/30 text-xs font-semibold text-pink-300 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>AI Background Matting & Long-Distance Duo WebRTC</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Strike a Pose. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500">
              Keep the Magic.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            The retro-modern web photobooth designed for couples, besties, and long-distance duos. 
            Real-time client-side AI matting isolates your foreground and transports you anywhere. No login required.
          </p>

          {/* Quick Action Mode Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mt-4">
            {/* Solo / In-Person Mode */}
            <button
              onClick={() => handleStartMode("solo")}
              className="group relative p-6 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-pink-500/60 transition-all duration-300 flex flex-col items-start text-left shadow-xl hover:shadow-pink-500/10 transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                In-Person Booth
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Single camera shoot with friends or your partner on the same screen with live AI background removal.
              </p>
            </button>

            {/* Long-Distance Duo Mode */}
            <button
              onClick={() => handleStartMode("duo_remote")}
              className="group relative p-6 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/60 transition-all duration-300 flex flex-col items-start text-left shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                Long-Distance Duo
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Join from different cities! Connect 2 webcams over WebRTC and merge side-by-side on the same virtual scene.
              </p>
            </button>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            <Link
              to="/photobooth"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-bold text-sm shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 transition transform hover:scale-105 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Photobooth Now</span>
            </Link>

            <Link
              to="/dashboard/photoStrips"
              className="px-6 py-4 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white font-semibold text-sm transition flex items-center gap-2"
            >
              <Film className="w-4 h-4 text-pink-400" />
              <span>View Gallery</span>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <section className="max-w-5xl mx-auto w-full mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Client-Side AI Matting</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No slow server uploads for video. MediaPipe segmentation runs locally in your browser at smooth 30–60 FPS.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">4-Shot Strip Generator</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automatic 3-2-1 countdown shutter with mechanical SFX, film filters, date stamps, and instant high-res PNG export.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Private & Zero-Friction</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Take and download photos immediately without creating an account. Optionally save to your Convex cloud vault.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
