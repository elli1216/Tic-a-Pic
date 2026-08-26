import { useCustomizerStore } from "../../../stores/useCustomizerStore";

const FONT_OPTIONS: {
  id: "mono" | "handwritten" | "sans" | "serif";
  label: string;
  font: string;
}[] = [
  { id: "mono", label: "Mono", font: "font-mono" },
  { id: "handwritten", label: "Cursive", font: "italic" },
  { id: "sans", label: "Modern", font: "font-sans" },
  { id: "serif", label: "Vintage", font: "font-serif" },
];

export function TextDateTab() {
  const customText = useCustomizerStore((s) => s.customization.customText);
  const fontFamily = useCustomizerStore((s) => s.customization.fontFamily);
  const includeDateStamp = useCustomizerStore((s) => s.customization.includeDateStamp);
  const setCustomText = useCustomizerStore((s) => s.setCustomText);
  const setFontFamily = useCustomizerStore((s) => s.setFontFamily);
  const setIncludeDateStamp = useCustomizerStore((s) => s.setIncludeDateStamp);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-150">
      {/* Caption Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Custom Footer Caption
        </label>
        <input
          type="text"
          maxLength={35}
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="TIC-A-PIC ♡ BESTIES"
          className="w-full bg-zinc-950 border border-zinc-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition"
        />
      </div>

      {/* Typography Style */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Font Style
        </label>
        <div className="grid grid-cols-4 gap-2">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFontFamily(f.id)}
              className={`py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                fontFamily === f.id
                  ? "bg-pink-600 text-white border-pink-500 shadow-sm"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200"
              } ${f.font}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Stamp Toggle */}
      <div className="flex items-center justify-between p-3.5 bg-zinc-950/80 rounded-2xl border border-zinc-800 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-200">Include Date Stamp</span>
          <span className="text-[10px] text-zinc-500">
            Renders today's date ({new Date().toLocaleDateString()}) on the strip footer.
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIncludeDateStamp(!includeDateStamp)}
          className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
            includeDateStamp ? "bg-pink-600" : "bg-zinc-800"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              includeDateStamp ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
