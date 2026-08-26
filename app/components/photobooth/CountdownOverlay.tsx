import { useEffect } from "react";
import { soundFx } from "../../lib/utils";
import { Camera } from "lucide-react";

interface CountdownOverlayProps {
  remainingSeconds: number | null;
}

export function CountdownOverlay({ remainingSeconds }: CountdownOverlayProps) {
  useEffect(() => {
    if (remainingSeconds !== null && remainingSeconds > 0) {
      soundFx.playBeep(880, 0.1);
    } else if (remainingSeconds === 0) {
      soundFx.playBeep(1320, 0.2);
    }
  }, [remainingSeconds]);

  if (remainingSeconds === null) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-black/40 backdrop-blur-[3px] animate-in fade-in duration-150">
      <div
        key={remainingSeconds}
        className="flex flex-col items-center justify-center transform animate-in zoom-in-50 duration-300"
      >
        {remainingSeconds > 0 ? (
          <div className="relative flex items-center justify-center">
            {/* Pulsing circular glow */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-pink-600/30 via-rose-500/20 to-purple-600/30 border-2 border-pink-500/60 animate-ping absolute" />
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-zinc-950/80 backdrop-blur-md border border-pink-500/80 flex items-center justify-center shadow-2xl shadow-pink-500/50">
              <span className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-200 to-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)] tracking-tighter">
                {remainingSeconds}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-8 py-6 rounded-3xl bg-zinc-950/90 border border-pink-500/80 shadow-2xl shadow-pink-500/60 animate-bounce">
            <Camera className="w-12 h-12 text-pink-400 animate-spin" />
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(244,63,94,0.9)]">
              CHEESE! 📸
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
