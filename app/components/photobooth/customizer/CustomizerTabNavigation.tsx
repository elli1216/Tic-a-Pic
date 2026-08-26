import { Palette, Smile, Type, Download } from "lucide-react";
import { useCustomizerStore, type CustomizerTab } from "../../../stores/useCustomizerStore";

export function CustomizerTabNavigation() {
  const activeTab = useCustomizerStore((s) => s.activeTab);
  const setActiveTab = useCustomizerStore((s) => s.setActiveTab);
  const stickersCount = useCustomizerStore((s) => s.customization.stickers.length);

  const tabs: { id: CustomizerTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "theme", label: "Frames & Layout", icon: Palette },
    { id: "stickers", label: `Stickers (${stickersCount})`, icon: Smile },
    { id: "text", label: "Text & Date", icon: Type },
    { id: "export", label: "Export", icon: Download },
  ];

  return (
    <div className="flex items-center bg-zinc-950/80 p-1 rounded-2xl border border-zinc-800 shadow-inner">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isExport = tab.id === "export";

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              isActive
                ? isExport
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
                  : "bg-pink-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">
              {tab.id === "theme"
                ? "Layout"
                : tab.id === "stickers"
                ? `✨(${stickersCount})`
                : tab.id === "text"
                ? "Text"
                : "Export"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
