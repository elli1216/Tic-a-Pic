import { useBoothStore } from "../../stores/useBoothStore";
import { FILTER_PRESETS } from "../../types/booth";
import { Sliders, Sparkles, Check } from "lucide-react";

export function FilterSelector() {
  const { selectedFilterId, setSelectedFilterId } = useBoothStore();

  const getFilterColorPreview = (id: string) => {
    switch (id) {
      case "vintage_film":
        return "from-amber-600 to-rose-700";
      case "cyber_glow":
        return "from-cyan-500 to-pink-500";
      case "warm_sunset":
        return "from-orange-500 to-rose-600";
      case "noir_bw":
        return "from-zinc-400 to-zinc-800";
      case "golden_hour":
        return "from-amber-400 to-yellow-600";
      default:
        return "from-zinc-600 to-zinc-700";
    }
  };

  return (
    <div className="flex flex-col gap-2.5 p-4 bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 text-white shadow-xl">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-200">
          Color Aesthetics & Film Presets
        </h3>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {FILTER_PRESETS.map((filter) => {
          const isSelected = selectedFilterId === filter.id;
          const gradient = getFilterColorPreview(filter.id);

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setSelectedFilterId(filter.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25 font-bold ring-2 ring-pink-500/30"
                  : "bg-zinc-950/70 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {/* Mini color swatch dot */}
              <div
                className={`w-3 h-3 rounded-full bg-gradient-to-tr ${gradient} shadow-inner flex items-center justify-center`}
              >
                {isSelected && <Check className="w-2 h-2 text-white stroke-[3]" />}
              </div>
              <span>{filter.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
