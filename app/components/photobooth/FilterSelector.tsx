import { useBoothStore } from "../../stores/useBoothStore";
import { FILTER_PRESETS } from "../../types/booth";
import { Sliders } from "lucide-react";

export function FilterSelector() {
  const { selectedFilterId, setSelectedFilterId } = useBoothStore();

  return (
    <div className="flex flex-col gap-2 p-3 bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 text-white shadow-xl">
      <div className="flex items-center gap-2 px-1">
        <Sliders className="w-3.5 h-3.5 text-purple-400" />
        <h3 className="text-xs font-semibold tracking-wide uppercase text-zinc-300">
          Color Aesthetics
        </h3>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {FILTER_PRESETS.map((filter) => {
          const isSelected = selectedFilterId === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedFilterId(filter.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-500/20 font-semibold"
                  : "bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60 hover:text-white"
              }`}
            >
              {filter.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
