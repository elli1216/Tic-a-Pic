import { Loader2 } from "lucide-react";
import { useCustomizerStore } from "../../../stores/useCustomizerStore";

export function CustomizerPreview() {
  const previewDataUrl = useCustomizerStore((s) => s.previewDataUrl);
  const isRendering = useCustomizerStore((s) => s.isRendering);
  const layout = useCustomizerStore((s) => s.customization.layout);
  const themeId = useCustomizerStore((s) => s.customization.themeId);

  return (
    <div className="lg:col-span-5 flex flex-col items-center justify-center bg-zinc-950/80 rounded-2xl border border-zinc-800/80 p-4 min-h-[380px] relative overflow-hidden">
      {isRendering && (
        <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-700 text-[10px] text-zinc-300 flex items-center gap-1.5 backdrop-blur-sm shadow-md">
          <Loader2 className="w-3 h-3 text-pink-400 animate-spin" />
          <span>Rendering...</span>
        </div>
      )}

      {previewDataUrl ? (
        <div className="relative max-h-[60vh] max-w-full flex items-center justify-center group shadow-2xl rounded-xl overflow-hidden">
          <img
            src={previewDataUrl}
            alt="Customized Photostrip Preview"
            className="max-h-[56vh] w-auto object-contain rounded-lg shadow-2xl transition duration-200"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-zinc-500 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
          <span className="text-xs">Compositing photostrip...</span>
        </div>
      )}

      {/* Quick Layout Badge */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
          {layout.replace(/_/g, " ")} • {themeId.replace(/-/g, " ")}
        </span>
      </div>
    </div>
  );
}
