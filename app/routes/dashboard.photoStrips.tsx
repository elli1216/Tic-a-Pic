import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import {
  Film,
  Download,
  Share2,
  Camera,
  Eye,
  Trash2,
  HardDrive,
  Cloud,
  Check,
  LayoutDashboard,
  LogIn,
  Sparkles,
} from "lucide-react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getLocalPhotoStrips, deleteLocalPhotoStrip, type LocalPhotoStrip } from "../lib/localPhotoStorage";
import { AuthModal } from "../components/auth/AuthModal";

export function meta() {
  return [
    { title: "Tic-a-Pic — Saved Photo Strips" },
    { name: "description", content: "View and download your saved retro photo strips." },
  ];
}

export default function PhotoStripsGalleryPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();

  // If authenticated, fetch from Convex Cloud DB; otherwise load from local storage
  const userCloudStrips = useQuery(
    api.photoStrips.listMyPhotoStrips,
    isAuthenticated ? {} : "skip"
  );

  const [localStrips, setLocalStrips] = useState<LocalPhotoStrip[]>([]);
  const [selectedStripUrl, setSelectedStripUrl] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load local storage strips ONLY when there is no authenticated user
  useEffect(() => {
    if (!isAuthenticated) {
      setLocalStrips(getLocalPhotoStrips());
    }
  }, [isAuthenticated]);

  const handleDeleteLocal = (id: string) => {
    if (confirm("Delete this saved photostrip from your browser storage?")) {
      deleteLocalPhotoStrip(id);
      setLocalStrips(getLocalPhotoStrips());
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Determine active strip list
  const stripsCount = isAuthenticated
    ? userCloudStrips?.length ?? 0
    : localStrips.length;

  return (
    <div className="min-h-screen bg-[#0d0c11] text-zinc-100 flex flex-col film-grain">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5">
              <Film className="w-6 h-6 text-pink-400" />
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Saved Photo Strips
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              {isAuthenticated
                ? "Your permanent Cloud Vault collection synced across all devices."
                : "Photos stored locally in your browser cache. Log in to sync to the Cloud Vault."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs border border-zinc-700 transition flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/photobooth"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>New Shoot</span>
            </Link>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 w-fit shadow-sm">
            {isAuthenticated ? (
              <>
                <Cloud className="w-4 h-4 text-purple-400" />
                <span>Cloud Vault ({stripsCount})</span>
              </>
            ) : (
              <>
                <HardDrive className="w-4 h-4 text-pink-400" />
                <span>Local Browser Storage ({stripsCount})</span>
              </>
            )}
          </div>

          {/* Sign in banner if not logged in */}
          {!isAuthenticated && (
            <div className="flex items-center gap-2 bg-pink-950/30 border border-pink-500/20 px-3.5 py-1.5 rounded-full text-xs text-pink-300">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Sync strips permanently across devices?</span>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="font-bold underline text-pink-200 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3 h-3" /> Sign In
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {stripsCount === 0 ? (
          <div className="p-16 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center flex flex-col items-center justify-center gap-4 my-8">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Film className="w-8 h-8" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-lg font-bold text-white mb-1">
                {isAuthenticated ? "No Cloud Strips Yet" : "No Local Strips Saved"}
              </h3>
              <p className="text-xs text-zinc-400">
                {isAuthenticated
                  ? "Take shots in the photobooth while logged in to save them to your permanent cloud collection."
                  : "Snap photos in the photobooth! Unregistered sessions are saved directly to this browser."}
              </p>
            </div>
            <Link
              to="/photobooth"
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-xs font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition"
            >
              Start Photobooth Shoot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Authenticated Mode: Show Cloud Database Strips */}
            {isAuthenticated &&
              userCloudStrips?.map((strip) => {
                const url = strip.url || "";
                return (
                  <div
                    key={strip._id}
                    className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 shadow-xl flex flex-col"
                  >
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-purple-500/40 text-[10px] font-bold text-purple-300 flex items-center gap-1 shadow-md">
                      <Cloud className="w-3 h-3 text-purple-400" />
                      <span>Cloud Vault</span>
                    </div>

                    {/* Image Preview */}
                    <div
                      onClick={() => url && setSelectedStripUrl(url)}
                      className="relative w-full h-80 overflow-hidden cursor-pointer bg-zinc-950 flex items-center justify-center"
                    >
                      <img
                        src={strip.thumbnailUrl || url}
                        alt="Cloud photostrip"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 flex items-center justify-between gap-2 border-t border-zinc-800 bg-zinc-900/90">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-200 capitalize">
                          {strip.frameTheme.replace("-", " ")}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {strip.isDuoMode ? "Duo Session" : "Solo / In-Person"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {url && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(url, strip._id)}
                              title="Copy image link"
                              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                            >
                              {copiedId === strip._id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Share2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <a
                              href={url}
                              download="tic-a-pic-strip.png"
                              target="_blank"
                              rel="noreferrer"
                              title="Download PNG"
                              className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow-sm transition"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Anonymous Mode: Show Local Storage Strips */}
            {!isAuthenticated &&
              localStrips.map((strip) => (
                <div
                  key={strip.id}
                  className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 shadow-xl flex flex-col"
                >
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-pink-500/40 text-[10px] font-bold text-pink-300 flex items-center gap-1 shadow-md">
                    <HardDrive className="w-3 h-3 text-pink-400" />
                    <span>Local Storage</span>
                  </div>

                  {/* Image Preview */}
                  <div
                    onClick={() => setSelectedStripUrl(strip.dataUrl)}
                    className="relative w-full h-80 overflow-hidden cursor-pointer bg-zinc-950 flex items-center justify-center"
                  >
                    <img
                      src={strip.thumbnailDataUrl || strip.dataUrl}
                      alt="Local photostrip"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 flex items-center justify-between gap-2 border-t border-zinc-800 bg-zinc-900/90">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-200 capitalize">
                        {strip.frameTheme.replace("-", " ")}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(strip.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDeleteLocal(strip.id)}
                        title="Delete from local storage"
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={strip.dataUrl}
                        download="tic-a-pic-strip.png"
                        title="Download PNG"
                        className="p-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white shadow-sm transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        {selectedStripUrl && (
          <div
            onClick={() => setSelectedStripUrl(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg max-h-[90vh] bg-zinc-900 rounded-3xl border border-zinc-800 p-4 shadow-2xl flex flex-col items-center gap-4"
            >
              <img
                src={selectedStripUrl}
                alt="Full preview"
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-lg"
              />
              <div className="flex items-center gap-3">
                <a
                  href={selectedStripUrl}
                  download="tic-a-pic-strip.png"
                  className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download High-Res PNG
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedStripUrl(null)}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auth Modal Trigger */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </main>

      <Footer />
    </div>
  );
}
