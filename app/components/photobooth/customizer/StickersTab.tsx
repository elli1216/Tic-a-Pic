import { Trash2 } from "lucide-react";
import { useCustomizerStore } from "../../../stores/useCustomizerStore";
import { STICKER_PRESETS } from "../../../lib/stickers";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "romance", label: "Romance 💖" },
  { id: "y2k", label: "Y2K ✨" },
  { id: "cute", label: "Cute 🎀" },
  { id: "words", label: "Badges 💬" },
];

export function StickersTab() {
  const stickers = useCustomizerStore((s) => s.customization.stickers);
  const stickerCategory = useCustomizerStore((s) => s.stickerCategory);
  const selectedStickerId = useCustomizerStore((s) => s.selectedStickerId);
  const setStickerCategory = useCustomizerStore((s) => s.setStickerCategory);
  const addSticker = useCustomizerStore((s) => s.addSticker);
  const setSelectedStickerId = useCustomizerStore((s) => s.setSelectedStickerId);
  const updateSelectedSticker = useCustomizerStore((s) => s.updateSelectedSticker);
  const deleteSelectedSticker = useCustomizerStore((s) => s.deleteSelectedSticker);

  const selectedSticker = stickers.find(
    (s) => s.id === selectedStickerId
  );

  const filteredStickers = STICKER_PRESETS.filter((s) => {
    if (stickerCategory === "all") return true;
    return s.category === stickerCategory;
  });

  return (
    <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setStickerCategory(cat.id)}
            className={`px-3 py-1 rounded-xl font-medium transition cursor-pointer ${
              stickerCategory === cat.id
                ? "bg-pink-600 text-white font-bold"
                : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sticker Presets Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 bg-zinc-950/60 rounded-2xl border border-zinc-800 max-h-40 overflow-y-auto scrollbar-thin">
        {filteredStickers.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            onClick={() => addSticker(sticker)}
            title={`Add ${sticker.label}`}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 hover:border-pink-500/60 text-xl flex items-center justify-center transition transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm"
          >
            {sticker.type === "emoji" ? (
              <span>{sticker.content}</span>
            ) : (
              <span className="text-[9px] font-bold text-pink-300 bg-black/80 px-1 py-0.5 rounded">
                {sticker.content}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Selected Sticker Manipulator Controls */}
      {selectedSticker ? (
        <div className="p-3 bg-zinc-950/80 rounded-2xl border border-pink-500/40 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
              Selected Sticker: {selectedSticker.content}
            </span>
            <button
              type="button"
              onClick={deleteSelectedSticker}
              className="p-1 text-rose-400 hover:bg-rose-950/60 rounded-lg transition text-xs flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-400 font-semibold">
                Scale ({selectedSticker.scale}x)
              </label>
              <input
                type="range"
                min="0.5"
                max="2.2"
                step="0.1"
                value={selectedSticker.scale}
                onChange={(e) =>
                  updateSelectedSticker({ scale: parseFloat(e.target.value) })
                }
                className="w-full accent-pink-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-400 font-semibold">
                Rotate ({selectedSticker.rotation}°)
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={selectedSticker.rotation}
                onChange={(e) =>
                  updateSelectedSticker({ rotation: parseInt(e.target.value) })
                }
                className="w-full accent-pink-500"
              />
            </div>
          </div>
        </div>
      ) : (
        stickers.length > 0 && (
          <div className="text-[11px] text-zinc-500 text-center py-1">
            Click a sticker on the list below to edit its size or angle:
            <div className="flex flex-wrap gap-1.5 justify-center mt-1.5">
              {stickers.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStickerId(s.id)}
                  className="px-2 py-0.5 rounded-lg bg-zinc-800 text-xs border border-zinc-700 hover:border-pink-500 text-zinc-300 cursor-pointer"
                >
                  #{idx + 1} {s.content}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
