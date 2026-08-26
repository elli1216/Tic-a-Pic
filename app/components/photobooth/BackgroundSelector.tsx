import { useRef, useState } from "react";
import { useBoothStore } from "../../stores/useBoothStore";
import { BACKGROUND_PRESETS, type BackgroundPreset } from "../../types/booth";
import { Sparkles, Upload, Eye, EyeOff, Check, Image as ImageIcon } from "lucide-react";

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
  const [activeCategory, setActiveCategory] = useState<"all" | "scene" | "gradient" | "color">("all");

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

  const filteredPresets = BACKGROUND_PRESETS.filter((bg) => {
    if (activeCategory === "all") return true;
    return bg.category === activeCategory;
  });

  return (
    <div className="flex flex-col gap-3 p-4 bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 text-white shadow-xl">
      {/* Top Title & AI Matting Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-pink-500/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-200">
            Virtual Backdrops
          </h3>
        </div>

        {/* Toggle AI Segmentation */}
        <button
          type="button"
          onClick={() => setIsSegmentationActive(!isSegmentationActive)}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition cursor-pointer ${
            isSegmentationActive
              ? "bg-pink-600/30 text-pink-300 border border-pink-500/50 shadow-sm shadow-pink-500/20"
              : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200"
          }`}
        >
          {isSegmentationActive ? <Eye className="w-3.5 h-3.5 text-pink-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{isSegmentationActive ? "AI Matting ON" : "Original Cam"}</span>
        </button>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-1 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80 text-[11px]">
        {(
          [
            { id: "all", label: "All" },
            { id: "scene", label: "Scenes" },
            { id: "gradient", label: "Gradients" },
            { id: "color", label: "Solid Colors" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`flex-1 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeCategory === tab.id
                ? "bg-zinc-800 text-white font-bold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Background Presets Scrolling Row */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
        {/* Custom Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload custom background image"
          className={`group flex-shrink-0 w-13 h-13 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 cursor-pointer transform hover:scale-105 ${
            selectedBackgroundId === "custom"
              ? "border-pink-500 bg-pink-950/40 text-pink-300 ring-2 ring-pink-500/30"
              : "border-zinc-700 hover:border-pink-500/60 bg-zinc-800/60 text-zinc-400 hover:text-pink-300"
          }`}
        >
          <Upload className="w-4 h-4" />
          <span className="text-[9px] font-semibold leading-none">Upload</span>
        </button>

        {filteredPresets.map((bg) => {
          const isSelected = selectedBackgroundId === bg.id && !customBackgroundUrl;
          return (
            <button
              key={bg.id}
              type="button"
              onClick={() => {
                setCustomBackgroundUrl(null);
                setSelectedBackgroundId(bg.id);
                if (bg.id !== "none") {
                  setIsSegmentationActive(true);
                }
              }}
              title={bg.name}
              className={`group relative flex-shrink-0 w-13 h-13 rounded-xl border-2 transition-all transform hover:scale-105 flex items-center justify-center overflow-hidden cursor-pointer ${
                isSelected
                  ? "border-pink-500 ring-2 ring-pink-500/40 scale-105 shadow-lg shadow-pink-500/25"
                  : "border-zinc-700/80 hover:border-zinc-500 opacity-85 hover:opacity-100"
              }`}
              style={{
                background:
                  bg.category === "gradient" || bg.category === "color"
                    ? bg.value
                    : bg.category === "scene"
                    ? `url(${bg.value}) center/cover no-repeat`
                    : "#18181b",
              }}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="p-0.5 rounded-full bg-pink-600 text-white">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              )}

              {bg.id === "none" && (
                <span className="text-[9px] font-bold text-zinc-300 bg-zinc-900/90 px-1.5 py-0.5 rounded border border-zinc-700">
                  RAW
                </span>
              )}
            </button>
          );
        })}

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
