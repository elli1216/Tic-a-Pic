import {
  Download,
  Printer,
  Film,
  HardDrive,
  Cloud,
  Loader2,
} from "lucide-react";
import { useCustomizerStore } from "../../../stores/useCustomizerStore";
import { renderStripToDataUrl } from "../../../lib/stripRenderer";
import { generateAnimatedGif } from "../../../lib/gifGenerator";
import { saveLocalPhotoStrip } from "../../../lib/localPhotoStorage";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import confetti from "canvas-confetti";

interface ExportTabProps {
  shots: string[];
  isDuoMode?: boolean;
}

export function ExportTab({ shots, isDuoMode = false }: ExportTabProps) {
  const { isAuthenticated } = useConvexAuth();
  const generateUploadUrl = useMutation(api.photoStrips.generateUploadUrl);
  const savePhotoStripMutation = useMutation(api.photoStrips.savePhotoStrip);
  const customization = useCustomizerStore((s) => s.customization);
  const isGeneratingGif = useCustomizerStore((s) => s.isGeneratingGif);
  const setIsGeneratingGif = useCustomizerStore((s) => s.setIsGeneratingGif);
  const gifProgress = useCustomizerStore((s) => s.gifProgress);
  const setGifProgress = useCustomizerStore((s) => s.setGifProgress);
  const generatedGifUrl = useCustomizerStore((s) => s.generatedGifUrl);
  const setGeneratedGifUrl = useCustomizerStore((s) => s.setGeneratedGifUrl);
  const saveStatus = useCustomizerStore((s) => s.saveStatus);
  const setSaveStatus = useCustomizerStore((s) => s.setSaveStatus);
  const errorMessage = useCustomizerStore((s) => s.errorMessage);
  const setErrorMessage = useCustomizerStore((s) => s.setErrorMessage);

  // High-Res PNG Download
  const handleDownloadPng = async () => {
    try {
      const fullResDataUrl = await renderStripToDataUrl({
        shots,
        customization,
        scaleFactor: 3, // Ultra crisp 300+ DPI
      });

      const a = document.createElement("a");
      a.href = fullResDataUrl;
      a.download = `tic-a-pic-strip-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  // Animated GIF Generation
  const handleGenerateGif = async () => {
    if (shots.length === 0 || isGeneratingGif) return;
    setIsGeneratingGif(true);
    setGifProgress(0);
    setGeneratedGifUrl(null);

    try {
      const gifUrl = await generateAnimatedGif({
        images: shots,
        width: 480,
        height: 360,
        interval: 0.4,
        progressCallback: (progress) => setGifProgress(progress),
      });

      setGeneratedGifUrl(gifUrl);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error("GIF generation error:", err);
    } finally {
      setIsGeneratingGif(false);
    }
  };

  // Save to Storage / Cloud Vault
  const handleSaveStrip = async () => {
    if (shots.length === 0 || saveStatus === "saving") return;
    setSaveStatus("saving");
    setErrorMessage(null);

    try {
      const fullResDataUrl = await renderStripToDataUrl({
        shots,
        customization,
        scaleFactor: 2.5,
      });

      // 1. Save locally in browser storage
      saveLocalPhotoStrip({
        dataUrl: fullResDataUrl,
        cardLayout: customization.layout,
        frameTheme: customization.themeId,
        isDuoMode,
      });

      // 2. If logged in, upload & save to Convex Cloud Vault (Max 5 quota)
      if (isAuthenticated) {
        const res = await fetch(fullResDataUrl);
        const blob = await res.blob();

        const uploadUrl = await generateUploadUrl();
        const uploadResult = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": "image/png" },
          body: blob,
        });
        const { storageId } = await uploadResult.json();

        await savePhotoStripMutation({
          storageId,
          cardLayout: customization.layout,
          frameTheme: customization.themeId,
          isDuoMode,
          isPublic: true,
        });

        setSaveStatus("cloud_saved");
      } else {
        setSaveStatus("local_saved");
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      console.error("Save error:", err);
      const msg = err?.message || "Failed to save photo strip.";
      setErrorMessage(msg);
      setSaveStatus("idle");
      return;
    }

    setTimeout(() => setSaveStatus("idle"), 4000);
  };

  // Native Print
  const handlePrint = async () => {
    try {
      const fullResDataUrl = await renderStripToDataUrl({
        shots,
        customization,
        scaleFactor: 2.5,
      });

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Photo Strip</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
                img { max-height: 96vh; max-width: 96vw; object-fit: contain; }
                @media print {
                  body { margin: 0; }
                  img { width: 100%; height: auto; }
                }
              </style>
            </head>
            <body>
              <img src="${fullResDataUrl}" onload="window.print();window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (err) {
      console.error("Print error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-150">
      {/* 1. Download High-Res PNG Button */}
      <button
        type="button"
        onClick={handleDownloadPng}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2.5 transition transform hover:scale-[1.01] cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Download High-Res Print PNG</span>
      </button>

      {/* 2. Generate Looping Animated GIF */}
      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-zinc-200">
              Animated Making-Of GIF
            </span>
          </div>

          {!generatedGifUrl && (
            <button
              type="button"
              disabled={isGeneratingGif}
              onClick={handleGenerateGif}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 transition cursor-pointer"
            >
              {isGeneratingGif ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Encoding ({gifProgress}%)...</span>
                </>
              ) : (
                <span>Create GIF</span>
              )}
            </button>
          )}
        </div>

        {generatedGifUrl && (
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-zinc-800/80">
            <img
              src={generatedGifUrl}
              alt="Animated GIF preview"
              className="w-28 h-20 object-cover rounded-xl border border-purple-500/50 shadow"
            />
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-[11px] text-zinc-300 font-semibold">
                Looping Animated GIF Ready!
              </span>
              <a
                href={generatedGifUrl}
                download={`tic-a-pic-animation-${Date.now()}.gif`}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 w-fit transition shadow"
              >
                <Download className="w-3.5 h-3.5" /> Download .GIF
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 3. Save to Storage / Cloud Vault & Print */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          disabled={saveStatus === "saving"}
          onClick={handleSaveStrip}
          className="flex-1 py-3 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {saveStatus === "saving" ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-400" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              {isAuthenticated ? (
                <Cloud className="w-3.5 h-3.5 text-purple-400" />
              ) : (
                <HardDrive className="w-3.5 h-3.5 text-pink-400" />
              )}
              <span>
                {isAuthenticated ? "Sync to Cloud Vault (Max 5)" : "Save to Browser"}
              </span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="py-3 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Strip</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-semibold text-center leading-relaxed animate-in fade-in">
          ⚠️ {errorMessage}
        </div>
      )}

      {saveStatus === "local_saved" && (
        <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center animate-bounce">
          ✓ Saved to your local browser storage! Access anytime under Saved Strips.
        </div>
      )}

      {saveStatus === "cloud_saved" && (
        <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-semibold text-center animate-bounce">
          ✓ Synced to your encrypted Convex Cloud Vault!
        </div>
      )}
    </div>
  );
}
