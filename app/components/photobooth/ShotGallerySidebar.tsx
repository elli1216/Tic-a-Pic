import { useBoothStore } from "../../stores/useBoothStore";
import { Camera, Trash2, Sparkles, CheckCircle2 } from "lucide-react";

interface ShotGallerySidebarProps {
  onProceedToCustomize?: () => void;
}

export function ShotGallerySidebar({ onProceedToCustomize }: ShotGallerySidebarProps) {
  const { capturedShots, clearShots, resetSession } = useBoothStore();
  const totalSlots = 4;
  const isComplete = capturedShots.length === totalSlots;

  return (
    <div className="flex flex-col h-full bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 p-4 shadow-xl text-white">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-pink-400" />
          <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-200">
            Shot Strip ({capturedShots.length}/{totalSlots})
          </h3>
        </div>

        {capturedShots.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Reset all 4 shots and start over?")) {
                clearShots();
              }
            }}
            title="Reset shots"
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 4-panel vertical preview strip */}
      <div className="flex-1 flex flex-col gap-2.5 justify-between">
        {Array.from({ length: totalSlots }).map((_, index) => {
          const shot = capturedShots[index];
          const isNext = capturedShots.length === index;

          return (
            <div
              key={index}
              className={`relative flex-1 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-zinc-950 ${
                shot
                  ? "border-pink-500/60 shadow-md shadow-pink-500/10"
                  : isNext
                  ? "border-pink-500/40 border-dashed animate-pulse bg-pink-950/10"
                  : "border-zinc-800 border-dashed opacity-50"
              }`}
            >
              {shot ? (
                <>
                  <img
                    src={shot.dataUrl}
                    alt={`Shot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-pink-300">
                    #{index + 1}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-600 gap-1">
                  <span className="text-xs font-bold text-zinc-500">#{index + 1}</span>
                  {isNext && <span className="text-[10px] text-pink-400 font-medium">Ready</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action button */}
      <div className="pt-3 mt-3 border-t border-zinc-800/80">
        {isComplete ? (
          <button
            onClick={onProceedToCustomize}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            Design & Print Strip
          </button>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-xs py-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Take {totalSlots - capturedShots.length} more shots</span>
          </div>
        )}
      </div>
    </div>
  );
}
