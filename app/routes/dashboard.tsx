import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Camera, Film, Sparkles, Users, Cloud, ArrowRight, HardDrive, Download, Eye } from "lucide-react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getLocalPhotoStrips, type LocalPhotoStrip } from "../lib/localPhotoStorage";

export function meta() {
  return [
    { title: "Tic-a-Pic — Studio Dashboard" },
    { name: "description", content: "Manage your saved photostrips and cloud photobooth sessions." },
  ];
}

export default function DashboardPage() {
  const { isAuthenticated } = useConvexAuth();

  const userCloudStrips = useQuery(
    api.photoStrips.listMyPhotoStrips,
    isAuthenticated ? {} : "skip"
  );
  const [localStrips, setLocalStrips] = useState<LocalPhotoStrip[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocalStrips(getLocalPhotoStrips().slice(0, 4));
    }
  }, [isAuthenticated]);

  const stripsCount = isAuthenticated
    ? (userCloudStrips?.length ?? 0)
    : localStrips.length;

  return (
    <div className="min-h-screen bg-[#0d0c11] text-zinc-100 flex flex-col film-grain">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-zinc-900 border border-pink-500/20 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 max-w-2xl flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-semibold text-pink-300 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio {isAuthenticated ? "Cloud Vault" : "Local Hub"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Your Photobooth Hub
            </h1>
            <p className="text-sm sm:text-base text-zinc-400">
              Launch instant single-camera or long-distance duo sessions, access your saved photo strips, and manage your {isAuthenticated ? "cloud" : "local"} memories.
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
                <span>View Saved Strips ({stripsCount})</span>
              </Link>
            </div>
          </div>

          <div className="absolute right-8 bottom-0 translate-y-1/4 opacity-10 sm:opacity-20 pointer-events-none">
            <Camera className="w-72 h-72 text-pink-400" />
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">In-Person Session</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Snap 4 shots in rapid sequence with real-time AI background removal. Saves directly to {isAuthenticated ? "Cloud Vault" : "browser storage"}.
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
              WebRTC dual stream syncs both cameras on a single virtual canvas across long distances.
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
            <h3 className="font-bold text-base text-white">
              {isAuthenticated ? "Cloud Vault Synced" : "Cloud Storage"}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAuthenticated
                ? "Your high-resolution strips are backed up to your encrypted Convex Cloud Vault (Max 5 photos per user)."
                : "Log in to sync up to 5 photo strips permanently across all devices."}
            </p>
            <Link
              to="/dashboard/photoStrips"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-auto pt-2"
            >
              Explore Strips <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Photostrips Preview */}
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
              View All ({stripsCount}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stripsCount === 0 ? (
            <div className="p-12 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center flex flex-col items-center gap-3">
              <Film className="w-10 h-10 text-zinc-600" />
              <p className="text-sm text-zinc-400">No saved photostrips yet.</p>
              <Link
                to="/photobooth"
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-xs font-bold transition"
              >
                Create Your First Strip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Authenticated Mode: Show Cloud strips */}
              {isAuthenticated &&
                userCloudStrips?.slice(0, 4).map((strip) => (
                  <div
                    key={strip._id}
                    className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition shadow-lg flex flex-col"
                  >
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-zinc-950/80 text-[9px] font-bold text-purple-300 flex items-center gap-1">
                      <Cloud className="w-2.5 h-2.5" /> Cloud Vault
                    </div>
                    <img
                      src={strip.thumbnailUrl || strip.url || ""}
                      alt="Photo Strip"
                      className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-zinc-400 capitalize">{strip.frameTheme.replace("-", " ")}</span>
                      {strip.url && (
                        <a
                          href={strip.url}
                          download="strip.png"
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

              {/* Anonymous Mode: Show Local strips */}
              {!isAuthenticated &&
                localStrips.map((strip) => (
                  <div
                    key={strip.id}
                    className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-pink-500/50 transition shadow-lg flex flex-col"
                  >
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-zinc-950/80 text-[9px] font-bold text-pink-300 flex items-center gap-1">
                      <HardDrive className="w-2.5 h-2.5" /> Local
                    </div>
                    <img
                      src={strip.thumbnailDataUrl || strip.dataUrl}
                      alt="Photo Strip"
                      className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-zinc-400 capitalize">{strip.frameTheme.replace("-", " ")}</span>
                      <a
                        href={strip.dataUrl}
                        download="strip.png"
                        className="text-pink-400 hover:text-pink-300"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
