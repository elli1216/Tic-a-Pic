import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from "react";
import { useBoothStore } from "../../stores/useBoothStore";
import { selfieSegmentation } from "../../lib/segmentation/selfieSegmentation";
import { BACKGROUND_PRESETS, FILTER_PRESETS } from "../../types/booth";
import { Camera, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

export interface CameraCompositorHandle {
  captureSnapshot: () => string | null;
}

interface CameraCompositorProps {
  videoElement: HTMLVideoElement | null;
  isLoadingVideo: boolean;
  videoError: string | null;
  onRetryVideo?: () => void;
}

export const CameraCompositor = forwardRef<CameraCompositorHandle, CameraCompositorProps>(
  function CameraCompositor({ videoElement, isLoadingVideo, videoError, onRetryVideo }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const bgImageCache = useRef<Map<string, HTMLImageElement>>(new Map());

    const {
      selectedBackgroundId,
      customBackgroundUrl,
      selectedFilterId,
      isSegmentationActive,
      isSegmentationReady,
      setIsSegmentationReady,
      setFps,
      isMirrored,
      isFlashActive,
    } = useBoothStore();

    const [isModelLoading, setIsModelLoading] = useState(false);
    const lastFrameTimeRef = useRef<number>(performance.now());
    const frameCountRef = useRef<number>(0);
    const latestMaskRef = useRef<CanvasImageSource | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);

    // Find active background and filter definitions
    const activeBg = BACKGROUND_PRESETS.find((b) => b.id === selectedBackgroundId) || BACKGROUND_PRESETS[1];
    const activeFilter = FILTER_PRESETS.find((f) => f.id === selectedFilterId) || FILTER_PRESETS[0];

    // Preload image background if scene is selected
    useEffect(() => {
      const targetUrl = customBackgroundUrl || (activeBg.category === "scene" ? activeBg.value : null);
      if (targetUrl && !bgImageCache.current.has(targetUrl)) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = targetUrl;
        img.onload = () => {
          bgImageCache.current.set(targetUrl, img);
        };
      }
    }, [activeBg, customBackgroundUrl]);

    // Initialize MediaPipe AI Segmentation model
    useEffect(() => {
      let isMounted = true;

      async function initSegmentation() {
        if (!isSegmentationActive) return;
        setIsModelLoading(true);
        const success = await selfieSegmentation.load();
        if (isMounted) {
          setIsSegmentationReady(success);
          setIsModelLoading(false);
        }
      }

      initSegmentation();

      selfieSegmentation.onResults((results) => {
        if (results.segmentationMask) {
          latestMaskRef.current = results.segmentationMask;
        }
      });

      return () => {
        isMounted = false;
      };
    }, [isSegmentationActive, setIsSegmentationReady]);

    // Snapshot function exposed to parent
    useImperativeHandle(ref, () => ({
      captureSnapshot: () => {
        if (!canvasRef.current) return null;
        try {
          return canvasRef.current.toDataURL("image/png", 1.0);
        } catch (err) {
          console.error("Failed to capture snapshot:", err);
          return null;
        }
      },
    }));

    // Render loop
    const renderFrame = useCallback(() => {
      const canvas = canvasRef.current;
      const video = videoElement;

      if (!canvas || !video || video.readyState < 2) {
        animationFrameIdRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        animationFrameIdRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      // Match canvas resolution to video stream
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      // Setup offscreen canvas
      if (!offscreenCanvasRef.current) {
        offscreenCanvasRef.current = document.createElement("canvas");
      }
      const offscreen = offscreenCanvasRef.current;
      if (offscreen.width !== width || offscreen.height !== height) {
        offscreen.width = width;
        offscreen.height = height;
      }
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });

      // Calculate FPS
      const now = performance.now();
      frameCountRef.current++;
      if (now - lastFrameTimeRef.current >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / (now - lastFrameTimeRef.current)));
        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }

      // Process MediaPipe model input
      if (isSegmentationActive && isSegmentationReady && selfieSegmentation.getIsLoaded()) {
        selfieSegmentation.send({ image: video }).catch(() => {});
      }

      ctx.save();

      // Mirroring transform
      if (isMirrored) {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }

      const shouldApplyVirtualBg =
        isSegmentationActive &&
        isSegmentationReady &&
        selectedBackgroundId !== "none" &&
        latestMaskRef.current &&
        offCtx;

      if (!shouldApplyVirtualBg) {
        // Standard raw camera feed
        ctx.drawImage(video, 0, 0, width, height);
      } else {
        // 1. Draw Virtual Background
        ctx.globalCompositeOperation = "source-over";

        const bgUrl = customBackgroundUrl || (activeBg.category === "scene" ? activeBg.value : null);
        const cachedImg = bgUrl ? bgImageCache.current.get(bgUrl) : null;

        if (cachedImg && cachedImg.complete) {
          // Fit image cover
          const imgRatio = cachedImg.width / cachedImg.height;
          const canvasRatio = width / height;
          let dw = width;
          let dh = height;
          let dx = 0;
          let dy = 0;

          if (imgRatio > canvasRatio) {
            dw = height * imgRatio;
            dx = (width - dw) / 2;
          } else {
            dh = width / imgRatio;
            dy = (height - dh) / 2;
          }
          ctx.drawImage(cachedImg, dx, dy, dw, dh);
        } else if (activeBg.category === "gradient") {
          // Draw gradient
          const grad = ctx.createLinearGradient(0, 0, width, height);
          if (activeBg.id === "pastel-pink") {
            grad.addColorStop(0, "#ff9a9e");
            grad.addColorStop(1, "#fecfef");
          } else if (activeBg.id === "sunset-vibes") {
            grad.addColorStop(0, "#fa709a");
            grad.addColorStop(1, "#fee140");
          } else if (activeBg.id === "cyber-purple") {
            grad.addColorStop(0, "#667eea");
            grad.addColorStop(1, "#764ba2");
          } else if (activeBg.id === "soft-matcha") {
            grad.addColorStop(0, "#84fab0");
            grad.addColorStop(1, "#8fd3f4");
          } else {
            grad.addColorStop(0, "#2b5876");
            grad.addColorStop(1, "#4e4376");
          }
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        } else {
          // Solid color
          ctx.fillStyle = activeBg.value;
          ctx.fillRect(0, 0, width, height);
        }

        // 2. Isolate foreground person on offscreen canvas
        offCtx.clearRect(0, 0, width, height);
        offCtx.save();
        offCtx.globalCompositeOperation = "source-over";
        offCtx.drawImage(video, 0, 0, width, height);

        // Apply alpha mask
        offCtx.globalCompositeOperation = "destination-in";
        offCtx.drawImage(latestMaskRef.current as CanvasImageSource, 0, 0, width, height);
        offCtx.restore();

        // 3. Composite segmented person onto virtual background
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(offscreen, 0, 0, width, height);
      }

      ctx.restore();

      animationFrameIdRef.current = requestAnimationFrame(renderFrame);
    }, [
      videoElement,
      isSegmentationActive,
      isSegmentationReady,
      selectedBackgroundId,
      customBackgroundUrl,
      activeBg,
      isMirrored,
      setFps,
    ]);

    useEffect(() => {
      animationFrameIdRef.current = requestAnimationFrame(renderFrame);
      return () => {
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
      };
    }, [renderFrame]);

    return (
      <div className="relative w-full h-full flex items-center justify-center bg-zinc-950 overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl">
        {/* Loading state */}
        {isLoadingVideo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 backdrop-blur-sm z-20 gap-3">
            <RefreshCw className="w-10 h-10 text-pink-500 animate-spin" />
            <p className="text-zinc-300 font-medium">Connecting to camera...</p>
          </div>
        )}

        {/* Error state */}
        {videoError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/95 p-6 text-center z-20 gap-4">
            <AlertCircle className="w-12 h-12 text-rose-500" />
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-white mb-1">Camera Access Required</h3>
              <p className="text-sm text-zinc-400">{videoError}</p>
            </div>
            {onRetryVideo && (
              <button
                onClick={onRetryVideo}
                className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-medium transition"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            )}
          </div>
        )}

        {/* Active Filter applied visually to canvas */}
        <canvas
          ref={canvasRef}
          style={{ filter: activeFilter.cssFilter }}
          className="w-full h-full object-contain"
        />

        {/* Flash overlay */}
        {isFlashActive && (
          <div className="absolute inset-0 bg-white pointer-events-none z-40 animate-camera-flash" />
        )}

        {/* Status badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 text-xs font-medium text-white shadow-lg">
            <Camera className="w-3.5 h-3.5 text-pink-400" />
            <span>LIVE</span>
          </div>

          {isSegmentationActive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 text-xs font-medium shadow-lg">
              <Sparkles className={`w-3.5 h-3.5 ${isSegmentationReady ? "text-emerald-400" : "text-amber-400 animate-pulse"}`} />
              <span className={isSegmentationReady ? "text-emerald-300" : "text-amber-300"}>
                {isSegmentationReady ? "AI Matting Active" : isModelLoading ? "Loading AI..." : "Ready"}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);
