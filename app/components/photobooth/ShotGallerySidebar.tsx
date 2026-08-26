import { useBoothStore } from "../../stores/useBoothStore";
import { Camera, Trash2, Sparkles, CheckCircle2, Film } from "lucide-react";

interface ShotGallerySidebarProps {
  onProceedToCustomize?: () => void;
}

export function ShotGallerySidebar({ onProceedToCustomize }: ShotGallerySidebarProps) {
  const { capturedShots, clearShots } = useBoothStore();
  const totalSlots = 4;
  const isComplete = capturedShots.length === totalSlots;

  return (
    <div className="flex flex-col h-full bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 p-4 shadow-xl text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-pink-500/10 flex items-center justify-center">
            <Film className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-200">
              Photostrip Slots
            </h3>
            <span className="text-[10px] text-zinc-400">
              {capturedShots.length} of {totalSlots} captured
            </span>
          </div>
        </div>

        {capturedShots.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset all captured shots and start fresh?")) {
                clearShots();
              }
            }}
            title="Reset strip"
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 4-Slot Vertical Strip Container */}
      <div className="flex-1 flex flex-col gap-2.5 justify-between min-h-[280px]">
        {Array.from({ length: totalSlots }).map((_, index) => {
          const shot = capturedShots[index];
          const isNext = capturedShots.length === index;

          return (
            <div
              key={index}
              className={`group relative flex-1 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-zinc-950 ${
                shot
                  ? "border-pink-500/60 shadow-md shadow-pink-500/10"
                  : isNext
                  ? "border-pink-500/50 border-dashed animate-pulse bg-pink-950/20"
                  : "border-zinc-800 border-dashed opacity-40"
              }`}
            >
              {shot ? (
                <>
                  <img
                    src={shot.dataUrl}
                    alt={`Shot ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-sm text-[9px] font-black text-pink-300 shadow">
                    #{index + 1}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-600 gap-1">
                  <span className="text-xs font-bold text-zinc-500">#{index + 1}</span>
                  {isNext && (
                    <span className="text-[10px] text-pink-400 font-semibold bg-pink-950/40 px-2 py-0.5 rounded-full border border-pink-500/30">
                      Next Pose
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action CTA Button */}
      <div className="pt-3 mt-3 border-t border-zinc-800/80">
        {isComplete ? (
          <button
            type="button"
            onClick={onProceedToCustomize}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-black shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 transition transform hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Save & Print Strip</span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-xs py-2">
            <Camera className="w-3.5 h-3.5 text-pink-400" />
            <span>Take {totalSlots - capturedShots.length} more {totalSlots - capturedShots.length === 1 ? "shot" : "shots"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
