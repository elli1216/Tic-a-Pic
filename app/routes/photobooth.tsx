import { useState, useRef, useEffect, useCallback } from "react";
import { Navbar } from "../components/layout/Navbar";
import { useUserMedia } from "../hooks/useUserMedia";
import { useBoothStore } from "../stores/useBoothStore";
import { CameraCompositor, type CameraCompositorHandle } from "../components/photobooth/CameraCompositor";
import { BackgroundSelector } from "../components/photobooth/BackgroundSelector";
import { FilterSelector } from "../components/photobooth/FilterSelector";
import { CountdownOverlay } from "../components/photobooth/CountdownOverlay";
import { ShotGallerySidebar } from "../components/photobooth/ShotGallerySidebar";
import { soundFx } from "../lib/utils";
import {
  Camera,
  FlipHorizontal,
  RotateCcw,
  Sparkles,
  Settings2,
  Download,
  Share2,
  CheckCircle,
  Film,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

export function meta() {
  return [
    { title: "Tic-a-Pic — Studio Photobooth" },
    { name: "description", content: "Capture 4-shot retro photostrips with client-side AI background segmentation." },
  ];
}

export default function PhotoboothPage() {
  const {
    videoRef,
    stream,
    devices,
    activeDeviceId,
    error: videoError,
    isLoading: isLoadingVideo,
    switchCamera,
    restart: restartCamera,
  } = useUserMedia();

  const compositorRef = useRef<CameraCompositorHandle | null>(null);

  const {
    capturedShots,
    addCapturedShot,
    clearShots,
    remainingCountdown,
    setRemainingCountdown,
    countdownSeconds,
    setCountdownSeconds,
    triggerFlash,
    isMirrored,
    setIsMirrored,
    fps,
    step,
    setStep,
    mode,
    resetSession,
  } = useBoothStore();

  const [isShootingSequence, setIsShootingSequence] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isSequenceRunningRef = useRef(false);

  // Take a single photo with countdown
  const takeSingleShot = useCallback(async () => {
    return new Promise<string | null>((resolve) => {
      let count = countdownSeconds;
      setRemainingCountdown(count);

      const timer = setInterval(() => {
        count--;
        if (count > 0) {
          setRemainingCountdown(count);
        } else if (count === 0) {
          setRemainingCountdown(0);
          clearInterval(timer);

          // Capture moment
          setTimeout(() => {
            triggerFlash();
            soundFx.playShutter();
            const snapshot = compositorRef.current?.captureSnapshot();
            setRemainingCountdown(null);

            if (snapshot) {
              addCapturedShot({
                id: `shot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                dataUrl: snapshot,
                timestamp: Date.now(),
                shotNumber: capturedShots.length + 1,
              });
              resolve(snapshot);
            } else {
              resolve(null);
            }
          }, 350);
        }
      }, 1000);
    });
  }, [countdownSeconds, setRemainingCountdown, triggerFlash, addCapturedShot, capturedShots.length]);

  // Automated 4-shot sequence
  const startFourShotSequence = useCallback(async () => {
    if (isShootingSequence) return;
    setIsShootingSequence(true);
    isSequenceRunningRef.current = true;
    clearShots();

    for (let shotIndex = 1; shotIndex <= 4; shotIndex++) {
      if (!isSequenceRunningRef.current) break;

      // Run countdown & capture
      await takeSingleShot();

      // Pause between shots
      if (shotIndex < 4 && isSequenceRunningRef.current) {
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    setIsShootingSequence(false);
    isSequenceRunningRef.current = false;
    soundFx.playPrintEject();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
  }, [isShootingSequence, clearShots, takeSingleShot]);

  // Stop sequence if component unmounts
  useEffect(() => {
    return () => {
      isSequenceRunningRef.current = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0c11] text-zinc-100 flex flex-col film-grain">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-4">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                {mode === "duo_remote" ? "Duo Remote Mode" : "Photobooth Studio"}
              </span>
            </div>

            {fps > 0 && (
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400">
                {fps} FPS
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mirror Toggle */}
            <button
              onClick={() => setIsMirrored(!isMirrored)}
              title={isMirrored ? "Selfie Mirror: ON" : "Selfie Mirror: OFF"}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                isMirrored
                  ? "bg-pink-950/40 border-pink-500/50 text-pink-300"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isMirrored ? "Mirrored" : "Normal"}</span>
            </button>

            {/* Countdown seconds selector */}
            <div className="flex items-center bg-zinc-800/80 rounded-xl p-0.5 border border-zinc-700/80 text-xs">
              {[3, 5, 10].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setCountdownSeconds(sec)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    countdownSeconds === sec
                      ? "bg-pink-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            {/* Camera Switcher Dropdown */}
            {devices.length > 1 && (
              <select
                value={activeDeviceId || ""}
                onChange={(e) => switchCamera(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-pink-500"
              >
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            )}

            {/* Reset */}
            <button
              onClick={resetSession}
              title="Reset Booth"
              className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Photobooth Main Grid: Camera Preview + Shot Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-[480px]">
          {/* Main Camera Compositor Canvas View */}
          <div className="lg:col-span-3 relative flex flex-col gap-3 min-h-[380px] sm:min-h-[500px]">
            <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-2xl">
              <CameraCompositor
                ref={compositorRef}
                videoElement={videoRef.current}
                isLoadingVideo={isLoadingVideo}
                videoError={videoError}
                onRetryVideo={restartCamera}
              />

              {/* Countdown overlay */}
              <CountdownOverlay remainingSeconds={remainingCountdown} />

              {/* Central Shutter Trigger Button floating over bottom of viewport */}
              <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-4 z-20 pointer-events-auto">
                {/* 4-Shot Auto Burst Trigger */}
                <button
                  disabled={isShootingSequence || Boolean(videoError)}
                  onClick={startFourShotSequence}
                  className="group relative flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 animate-spin group-hover:animate-bounce" />
                  <span>{isShootingSequence ? `Shooting (${capturedShots.length}/4)...` : "Start 4-Shot Shoot"}</span>
                </button>

                {/* Single Snap Button */}
                <button
                  disabled={isShootingSequence || Boolean(videoError)}
                  onClick={takeSingleShot}
                  title="Take single snapshot"
                  className="p-3.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white shadow-lg backdrop-blur-md disabled:opacity-50 transition transform hover:scale-105 active:scale-95"
                >
                  <Camera className="w-5 h-5 text-pink-400" />
                </button>
              </div>
            </div>

            {/* Background & Filter Selection Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <BackgroundSelector />
              <FilterSelector />
            </div>
          </div>

          {/* Side Photostrip 4-Slot Progress Gallery */}
          <div className="lg:col-span-1 h-full min-h-[350px]">
            <ShotGallerySidebar
              onProceedToCustomize={() => {
                alert("All 4 shots ready! Proceeding to strip design customizer.");
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
