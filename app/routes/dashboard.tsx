import { Link } from "react-router";
import { Navbar } from "../components/layout/Navbar";
import { Camera, Film, Sparkles, Heart, Users, Cloud, ArrowRight, ShieldCheck, Download } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function meta() {
  return [
    { title: "Tic-a-Pic — Studio Dashboard" },
    { name: "description", content: "Manage your saved photostrips and cloud photobooth sessions." },
  ];
}

export default function DashboardPage() {
  // Query public or user photo strips from Convex if available
  const publicStrips = useQuery(api.photoStrips.listPublicPhotoStrips, { limit: 6 });

  return (
    <div className="min-h-screen bg-[#0d0c11] text-zinc-100 flex flex-col film-grain">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-zinc-900 border border-pink-500/20 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 max-w-2xl flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-semibold text-pink-300 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Cloud Vault</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Your Photobooth Hub
            </h1>
            <p className="text-sm sm:text-base text-zinc-400">
              Launch instant single-camera or long-distance duo sessions, access your rendered photo strips, and share memories forever.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Link
                to="/photobooth"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Enter Photobooth</span>
              </Link>

              <Link
                to="/dashboard/photoStrips"
                className="px-5 py-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 text-zinc-200 font-semibold text-xs transition flex items-center gap-2"
              >
                <Film className="w-4 h-4 text-pink-400" />
                <span>View All Saved Strips</span>
              </Link>
            </div>
          </div>

          <div className="absolute right-8 bottom-0 translate-y-1/4 opacity-10 sm:opacity-20 pointer-events-none">
            <Camera className="w-72 h-72 text-pink-400" />
          </div>
        </div>

        {/* Quick Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">In-Person Session</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Snap 4 shots in rapid sequence with real-time AI background removal.
            </p>
            <Link
              to="/photobooth"
              className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 mt-auto pt-2"
            >
              Start Session <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Long-Distance Duo</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              WebRTC dual stream syncs both cameras on a single virtual canvas.
            </p>
            <Link
              to="/photobooth"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-auto pt-2"
            >
              Start Duo Room <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Cloud Storage Sync</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Strips are stored in Convex file storage and accessible anywhere.
            </p>
            <Link
              to="/dashboard/photoStrips"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-auto pt-2"
            >
              Explore Vault <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Gallery Preview Section */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-bold text-white">Recent Photostrips</h2>
            </div>

            <Link
              to="/dashboard/photoStrips"
              className="text-xs font-medium text-pink-400 hover:text-pink-300 flex items-center gap-1"
            >
              View Full Gallery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {publicStrips === undefined ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800" />
              ))}
            </div>
          ) : publicStrips.length === 0 ? (
            <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center flex flex-col items-center gap-3">
              <Film className="w-10 h-10 text-zinc-600" />
              <p className="text-sm text-zinc-400">No saved photostrips yet.</p>
              <Link
                to="/photobooth"
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-full text-xs font-bold transition"
              >
                Create Your First Strip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {publicStrips.map((strip) => (
                <div
                  key={strip._id}
                  className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-pink-500/50 transition shadow-lg"
                >
                  <img
                    src={strip.thumbnailUrl || strip.url || ""}
                    alt="Photo Strip"
                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                    {strip.url && (
                      <a
                        href={strip.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-full bg-white text-zinc-900 text-xs font-bold flex items-center gap-1.5 shadow"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
