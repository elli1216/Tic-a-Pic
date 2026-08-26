import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles } from "lucide-react";
import { renderStripToDataUrl } from "../../lib/stripRenderer";
import { useCustomizerStore } from "../../stores/useCustomizerStore";

// Sub-components
import { CustomizerPreview } from "./customizer/CustomizerPreview";
import { CustomizerTabNavigation } from "./customizer/CustomizerTabNavigation";
import { ThemeLayoutTab } from "./customizer/ThemeLayoutTab";
import { StickersTab } from "./customizer/StickersTab";
import { TextDateTab } from "./customizer/TextDateTab";
import { ExportTab } from "./customizer/ExportTab";

interface StripCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  shots: string[]; // 4 data URLs
  isDuoMode?: boolean;
}

export function StripCustomizerModal({
  isOpen,
  onClose,
  shots,
  isDuoMode = false,
}: StripCustomizerModalProps) {
  const [mounted, setMounted] = useState(false);

  const customization = useCustomizerStore((s) => s.customization);
  const activeTab = useCustomizerStore((s) => s.activeTab);
  const setPreviewDataUrl = useCustomizerStore((s) => s.setPreviewDataUrl);
  const setIsRendering = useCustomizerStore((s) => s.setIsRendering);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update preview canvas whenever customization or shots change
  const updatePreview = useCallback(async () => {
    if (shots.length === 0) return;
    setIsRendering(true);
    try {
      const dataUrl = await renderStripToDataUrl({
        shots,
        customization,
        scaleFactor: 1.5,
      });
      setPreviewDataUrl(dataUrl);
    } catch (err) {
      console.error("Error rendering strip preview:", err);
    } finally {
      setIsRendering(false);
    }
  }, [shots, customization, setIsRendering, setPreviewDataUrl]);

  useEffect(() => {
    if (isOpen) {
      updatePreview();
    }
  }, [isOpen, updatePreview]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleClose = () => {
    onClose();
  };

  return createPortal(
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[100] w-screen h-screen bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl my-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[95vh] overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-md shadow-pink-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                Design & Decorate Strip Studio
              </h2>
              <p className="text-[11px] text-zinc-400">
                Customize frames, add Y2K stickers, captions, and export
                high-res PNG or animated GIF.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close customizer"
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Grid: Left Live Preview + Right Modular Toolkit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto">
          {/* Left: Preview Canvas Module */}
          <CustomizerPreview />

          {/* Right: Customizer Toolkit Modules */}
          <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-thin">
            <CustomizerTabNavigation />

            {activeTab === "theme" && <ThemeLayoutTab />}
            {activeTab === "stickers" && <StickersTab />}
            {activeTab === "text" && <TextDateTab />}
            {activeTab === "export" && (
              <ExportTab shots={shots} isDuoMode={isDuoMode} />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
