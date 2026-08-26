import { useEffect } from "react";
import { soundFx } from "../../lib/utils";

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
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-black/20 backdrop-blur-[2px]">
      <div
        key={remainingSeconds}
        className="transform animate-ping duration-500 flex flex-col items-center justify-center"
      >
        <span className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 via-rose-300 to-white drop-shadow-[0_10px_25px_rgba(244,63,94,0.75)] tracking-tighter">
          {remainingSeconds > 0 ? remainingSeconds : "CHEESE! 📸"}
        </span>
      </div>
    </div>
  );
}
