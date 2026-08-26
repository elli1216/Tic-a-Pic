import { Link, useNavigate } from "react-router";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import {
  Camera,
  Users,
  ArrowRight,
  Zap,
  Layers,
  ShieldCheck,
  Sparkles,
  Heart,
  Image as ImageIcon,
  Sliders,
  Download,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { useBoothStore } from "../stores/useBoothStore";

export function meta() {
  return [
    { title: "Tic-a-Pic — Retro AI Photobooth for Duos & Couples" },
    {
      name: "description",
      content:
        "Retro-modern web photobooth with real-time AI background segmentation and long-distance duo WebRTC sessions.",
    },
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

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">
          {/* Live Feature Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-pink-500/30 text-xs font-semibold text-pink-300 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
            <span>Real-time AI Matting & Long-Distance WebRTC</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] max-w-4xl">
            Strike a Pose. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500">
              Keep the Magic Forever.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-zinc-400 font-normal leading-relaxed">
            The retro web photobooth designed for couples, duos, and best friends. 
            Client-side AI automatically isolates your foreground and transports you to aesthetic scenes in real time.
          </p>

          {/* Primary CTA Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mt-2">
            <Link
              to="/photobooth"
              className="w-full sm:w-auto px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-black text-base shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>Launch Photobooth</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/dashboard/photoStrips"
              className="w-full sm:w-auto px-7 py-4 sm:py-5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-pink-400" />
              <span>Explore Saved Strips</span>
            </Link>
          </div>

          {/* Mode Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-4">
            {/* Solo / In-Person Mode */}
            <button
              type="button"
              onClick={() => handleStartMode("solo")}
              className="group relative p-6 rounded-3xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-pink-500/60 transition-all duration-300 flex flex-col items-start text-left shadow-xl hover:shadow-pink-500/10 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Camera className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="text-base font-bold text-white">In-Person Session</h3>
                <ArrowRight className="w-4 h-4 text-pink-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Single webcam session with live AI background removal, custom scenes, and 4-shot automated burst.
              </p>
            </button>

            {/* Long-Distance Duo Mode */}
            <button
              type="button"
              onClick={() => handleStartMode("duo_remote")}
              className="group relative p-6 rounded-3xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/60 transition-all duration-300 flex flex-col items-start text-left shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="text-base font-bold text-white">Long-Distance Duo</h3>
                <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Connect 2 webcams from different cities over WebRTC and merge side-by-side onto a shared backdrop.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Visual Photostrip Showcase */}
      <section className="py-16 px-4 sm:px-6 bg-zinc-950/60 border-y border-zinc-800/80 relative">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 text-xs font-semibold w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic 4-Shot Film Aesthetics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Authentic Vintage Strips. <br />
              <span className="text-pink-400">Zero App Downloads.</span>
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every shoot produces an ultra high-resolution 4-frame printable card. 
              Featuring customizable border frames, date stamps, film grain, and mechanical camera sound effects.
            </p>

            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant local browser storage & high-res PNG download</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Client-side AI segmentation runs 100% in your browser</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Optional Cloud Vault sync when logged in</span>
              </div>
            </div>
          </div>

          {/* Interactive Visual Strip Mockup */}
          <div className="relative">
            <div className="w-64 p-3 bg-zinc-100 text-zinc-900 rounded-2xl shadow-2xl shadow-pink-500/20 transform rotate-2 hover:rotate-0 transition duration-300 flex flex-col gap-2.5 border-4 border-white">
              {/* 4 Mock Photos */}
              <div className="h-28 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-400 overflow-hidden relative flex items-center justify-center text-white font-bold text-xs shadow-inner">
                <span>Pose #1 ✨</span>
              </div>
              <div className="h-28 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 overflow-hidden relative flex items-center justify-center text-white font-bold text-xs shadow-inner">
                <span>Pose #2 ✌️</span>
              </div>
              <div className="h-28 rounded-lg bg-gradient-to-tr from-amber-500 to-pink-500 overflow-hidden relative flex items-center justify-center text-white font-bold text-xs shadow-inner">
                <span>Pose #3 💖</span>
              </div>
              <div className="h-28 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 overflow-hidden relative flex items-center justify-center text-white font-bold text-xs shadow-inner">
                <span>Pose #4 📸</span>
              </div>

              {/* Strip Footer Stamp */}
              <div className="pt-2 border-t border-zinc-300 flex items-center justify-between px-1 text-[10px] font-mono uppercase font-bold text-zinc-500">
                <span>TIC-A-PIC</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works (3 Steps) */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center flex flex-col items-center gap-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              Step into the studio and print your memories in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-400 font-black text-sm flex items-center justify-center border border-pink-500/20">
                01
              </div>
              <h3 className="font-bold text-base text-white">Pick Your Backdrop</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Choose from preset gradients, studio colors, aesthetic scenes, or upload your own image. AI removes your background live.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 font-black text-sm flex items-center justify-center border border-purple-500/20">
                02
              </div>
              <h3 className="font-bold text-base text-white">Strike 4 Poses</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click start! The automated 3-2-1 audio countdown triggers consecutive snapshots with authentic mechanical flash sounds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 font-black text-sm flex items-center justify-center border border-rose-500/20">
                03
              </div>
              <h3 className="font-bold text-base text-white">Export & Keep</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Download your composed PNG photostrip directly to your device or sync to the Cloud Vault for sharing anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ready To Shoot Callout */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-zinc-900 border border-pink-500/30 p-8 sm:p-12 text-center flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div className="flex flex-col gap-2 max-w-lg">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready for Your Next Session?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              No account required to start. Jump straight into the booth and capture unforgettable moments with your favorite person.
            </p>
          </div>
          <Link
            to="/photobooth"
            className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-black text-sm shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Enter Studio Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
