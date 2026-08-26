import { Check } from "lucide-react";
import { useCustomizerStore } from "../../../stores/useCustomizerStore";
import { STRIP_THEMES, type StripLayout } from "../../../types/strip";

const LAYOUT_OPTIONS: { id: StripLayout; name: string; desc: string }[] = [
  { id: "classic_strip_4x1", name: "2x6 Film Strip", desc: "4 vertical frames" },
  { id: "grid_2x2", name: "4x6 Postcard", desc: "2x2 photo grid" },
  { id: "twin_strip", name: "Twin Cutout", desc: "2 matching strips" },
];

export function ThemeLayoutTab() {
  const currentLayout = useCustomizerStore((s) => s.customization.layout);
  const currentThemeId = useCustomizerStore((s) => s.customization.themeId);
  const setLayout = useCustomizerStore((s) => s.setLayout);
  const setThemeId = useCustomizerStore((s) => s.setThemeId);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-150">
      {/* Layout Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Photocard Layout
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {LAYOUT_OPTIONS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLayout(l.id)}
              className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                currentLayout === l.id
                  ? "bg-pink-950/40 border-pink-500 text-white ring-2 ring-pink-500/30"
                  : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <span className="text-xs font-bold">{l.name}</span>
              <span className="text-[10px] text-zinc-500">{l.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Frame Color Themes */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Frame Theme
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {STRIP_THEMES.map((theme) => {
            const isSelected = currentThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setThemeId(theme.id, theme.textColor)}
                className={`group p-3 rounded-2xl border flex flex-col gap-2 transition cursor-pointer text-left ${
                  isSelected
                    ? "border-pink-500 bg-zinc-800 ring-2 ring-pink-500/30 shadow-md"
                    : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
                }`}
              >
                {/* Color Swatch */}
                <div
                  className="w-full h-8 rounded-lg border border-zinc-700/50 shadow-inner flex items-center justify-center"
                  style={{
                    background: theme.background,
                  }}
                >
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-pink-600 text-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-zinc-300 truncate">
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
