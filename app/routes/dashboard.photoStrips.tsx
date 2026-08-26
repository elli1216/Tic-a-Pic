import { useState } from "react";
import { Link } from "react-router";
import { Navbar } from "../components/layout/Navbar";
import { Film, Download, Share2, Sparkles, Camera, Heart, Eye, ExternalLink, Check } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function meta() {
  return [
    { title: "Tic-a-Pic — Saved Photo Strips" },
    { name: "description", content: "View and download your saved retro photo strips." },
  ];
}

export default function PhotoStripsGalleryPage() {
  const strips = useQuery(api.photoStrips.listPublicPhotoStrips, { limit: 50 });
  const [selectedStripUrl, setSelectedStripUrl] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d0c11] text-zinc-100 flex flex-col film-grain">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <Film className="w-6 h-6 text-pink-400" />
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Saved Photo Strips
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Browse, download, and share high-resolution photostrips saved from your sessions.
            </p>
          </div>

          <Link
            to="/photobooth"
            className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>New Photo Session</span>
          </Link>
        </div>

        {/* Gallery Grid */}
        {strips === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800"
              />
            ))}
          </div>
        ) : strips.length === 0 ? (
          <div className="p-16 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center flex flex-col items-center justify-center gap-4 my-8">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Film className="w-8 h-8" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-lg font-bold text-white mb-1">No Saved Strips Yet</h3>
              <p className="text-xs text-zinc-400">
                Snap photos in the photobooth and click "Save to Cloud Vault" to view them here.
              </p>
            </div>
            <Link
              to="/photobooth"
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-xs font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition"
            >
              Start Your First Shoot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {strips.map((strip) => {
              const url = strip.url || "";
              return (
                <div
                  key={strip._id}
                  className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-pink-500/50 transition-all duration-300 shadow-xl flex flex-col"
                >
                  {/* Image Preview */}
                  <div
                    onClick={() => url && setSelectedStripUrl(url)}
                    className="relative w-full h-80 overflow-hidden cursor-pointer bg-zinc-950 flex items-center justify-center"
                  >
                    <img
                      src={strip.thumbnailUrl || url}
                      alt="Photostrip"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Metadata & Actions */}
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
                            onClick={() => handleCopyLink(url, strip._id)}
                            title="Copy image link"
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
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
                            className="p-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white shadow-sm transition"
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
                  className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow"
                >
                  <Download className="w-4 h-4" /> Download High-Res PNG
                </a>
                <button
                  onClick={() => setSelectedStripUrl(null)}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
