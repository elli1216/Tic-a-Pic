import { useState } from "react";
import { Sparkles, Sliders, Image as ImageIcon } from "lucide-react";
import { BackgroundSelector } from "./BackgroundSelector";
import { FilterSelector } from "./FilterSelector";

interface StudioSidebarProps {
  className?: string;
  defaultTab?: "backdrops" | "filters" | "all";
}

export function StudioSidebar({
  className = "",
  defaultTab = "all",
}: StudioSidebarProps) {
  const [activeTab, setActiveTab] = useState<"all" | "backdrops" | "filters">(
    defaultTab,
  );

  return (
    <aside
      aria-label="Studio Effects & Backgrounds"
      className={`flex flex-col h-full bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 p-3.5 shadow-xl text-white overflow-hidden ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
        {/* Tab Switcher Pills */}
        <div className="flex items-center bg-zinc-950/80 p-0.5 rounded-xl border border-zinc-800 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
              activeTab === "all"
                ? "bg-pink-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("backdrops")}
            className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
              activeTab === "backdrops"
                ? "bg-pink-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Backdrops
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("filters")}
            className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
              activeTab === "filters"
                ? "bg-pink-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Filters
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1 scrollbar-thin">
        {(activeTab === "all" || activeTab === "backdrops") && (
          <div className="flex flex-col gap-2">
            <BackgroundSelector />
          </div>
        )}

        {(activeTab === "all" || activeTab === "filters") && (
          <div className="flex flex-col gap-2">
            <FilterSelector />
          </div>
        )}
      </div>
    </aside>
  );
}
