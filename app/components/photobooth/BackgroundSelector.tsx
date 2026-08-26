import { useRef } from "react";
import { useBoothStore } from "../../stores/useBoothStore";
import { BACKGROUND_PRESETS } from "../../types/booth";
import { Sparkles, Upload, Eye, EyeOff } from "lucide-react";

export function BackgroundSelector() {
  const {
    selectedBackgroundId,
    setSelectedBackgroundId,
    customBackgroundUrl,
    setCustomBackgroundUrl,
    isSegmentationActive,
    setIsSegmentationActive,
  } = useBoothStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomBackgroundUrl(result);
        setSelectedBackgroundId("custom");
        setIsSegmentationActive(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-300">
            Virtual Backgrounds
          </h3>
        </div>

        {/* Toggle Segmentation */}
        <button
          onClick={() => setIsSegmentationActive(!isSegmentationActive)}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition ${
            isSegmentationActive
              ? "bg-pink-600/30 text-pink-300 border border-pink-500/50"
              : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200"
          }`}
        >
          {isSegmentationActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{isSegmentationActive ? "AI Active" : "Original Cam"}</span>
        </button>
      </div>

      {/* Background Options Scrolling Row */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {BACKGROUND_PRESETS.map((bg) => {
          const isSelected = selectedBackgroundId === bg.id && !customBackgroundUrl;
          return (
            <button
              key={bg.id}
              onClick={() => {
                setCustomBackgroundUrl(null);
                setSelectedBackgroundId(bg.id);
                if (bg.id !== "none") {
                  setIsSegmentationActive(true);
                }
              }}
              title={bg.name}
              className={`group relative flex-shrink-0 w-12 h-12 rounded-xl border-2 transition-all transform hover:scale-105 flex items-center justify-center overflow-hidden ${
                isSelected
                  ? "border-pink-500 ring-2 ring-pink-500/40 scale-105 shadow-md shadow-pink-500/20"
                  : "border-zinc-700/80 hover:border-zinc-500 opacity-80 hover:opacity-100"
              }`}
              style={{
                background:
                  bg.category === "gradient" || bg.category === "color"
                    ? bg.value
                    : bg.category === "scene"
                    ? `url(${bg.value}) center/cover no-repeat`
                    : "#27272a",
              }}
            >
              {bg.id === "none" && (
                <span className="text-[10px] font-bold text-zinc-300 bg-zinc-900/80 px-1 rounded">
                  RAW
                </span>
              )}
            </button>
          );
        })}

        {/* Custom Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Upload custom background"
          className={`flex-shrink-0 w-12 h-12 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 ${
            selectedBackgroundId === "custom"
              ? "border-pink-500 bg-pink-950/40 text-pink-300 ring-2 ring-pink-500/40"
              : "border-zinc-700 hover:border-zinc-500 bg-zinc-800/60 text-zinc-400 hover:text-white"
          }`}
        >
          <Upload className="w-4 h-4" />
          <span className="text-[9px] font-medium leading-none">Upload</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}
