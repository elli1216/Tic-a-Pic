import { create } from "zustand";
import type { BoothMode, BoothStep, CapturedShot } from "../types/booth";

interface BoothState {
  step: BoothStep;
  mode: BoothMode;
  selectedBackgroundId: string;
  customBackgroundUrl: string | null;
  selectedFilterId: string;
  selectedFrameId: string;
  capturedShots: CapturedShot[];
  currentShotIndex: number;
  countdownSeconds: number;
  remainingCountdown: number | null;
  isFlashActive: boolean;
  isSegmentationActive: boolean;
  isSegmentationReady: boolean;
  fps: number;
  isMirrored: boolean;
  cameraDeviceId: string | null;
  roomCode: string | null;
  isHost: boolean;
  customText: string;
  includeDateStamp: boolean;

  // Actions
  setStep: (step: BoothStep) => void;
  setMode: (mode: BoothMode) => void;
  setSelectedBackgroundId: (id: string) => void;
  setCustomBackgroundUrl: (url: string | null) => void;
  setSelectedFilterId: (id: string) => void;
  setSelectedFrameId: (id: string) => void;
  setCapturedShots: (shots: CapturedShot[]) => void;
  addCapturedShot: (shot: CapturedShot) => void;
  clearShots: () => void;
  setCurrentShotIndex: (index: number) => void;
  setCountdownSeconds: (seconds: number) => void;
  setRemainingCountdown: (remaining: number | null) => void;
  triggerFlash: () => void;
  setIsSegmentationActive: (active: boolean) => void;
  setIsSegmentationReady: (ready: boolean) => void;
  setFps: (fps: number) => void;
  setIsMirrored: (mirrored: boolean) => void;
  setCameraDeviceId: (deviceId: string | null) => void;
  setRoomCode: (code: string | null) => void;
  setIsHost: (isHost: boolean) => void;
  setCustomText: (text: string) => void;
  setIncludeDateStamp: (include: boolean) => void;
  resetSession: () => void;
}

export const useBoothStore = create<BoothState>((set) => ({
  step: "ready",
  mode: "solo",
  selectedBackgroundId: "pastel-pink",
  customBackgroundUrl: null,
  selectedFilterId: "normal",
  selectedFrameId: "classic-white",
  capturedShots: [],
  currentShotIndex: 0,
  countdownSeconds: 3,
  remainingCountdown: null,
  isFlashActive: false,
  isSegmentationActive: true,
  isSegmentationReady: false,
  fps: 0,
  isMirrored: true,
  cameraDeviceId: null,
  roomCode: null,
  isHost: true,
  customText: "TIC-A-PIC ♡ 2026",
  includeDateStamp: true,

  setStep: (step) => set({ step }),
  setMode: (mode) => set({ mode }),
  setSelectedBackgroundId: (id) => set({ selectedBackgroundId: id }),
  setCustomBackgroundUrl: (url) => set({ customBackgroundUrl: url }),
  setSelectedFilterId: (id) => set({ selectedFilterId: id }),
  setSelectedFrameId: (id) => set({ selectedFrameId: id }),
  setCapturedShots: (capturedShots) => set({ capturedShots }),
  addCapturedShot: (shot) =>
    set((state) => ({
      capturedShots: [...state.capturedShots, shot],
      currentShotIndex: state.currentShotIndex + 1,
    })),
  clearShots: () => set({ capturedShots: [], currentShotIndex: 0 }),
  setCurrentShotIndex: (currentShotIndex) => set({ currentShotIndex }),
  setCountdownSeconds: (countdownSeconds) => set({ countdownSeconds }),
  setRemainingCountdown: (remainingCountdown) => set({ remainingCountdown }),
  triggerFlash: () => {
    set({ isFlashActive: true });
    setTimeout(() => set({ isFlashActive: false }), 450);
  },
  setIsSegmentationActive: (isSegmentationActive) => set({ isSegmentationActive }),
  setIsSegmentationReady: (isSegmentationReady) => set({ isSegmentationReady }),
  setFps: (fps) => set({ fps }),
  setIsMirrored: (isMirrored) => set({ isMirrored }),
  setCameraDeviceId: (cameraDeviceId) => set({ cameraDeviceId }),
  setRoomCode: (roomCode) => set({ roomCode }),
  setIsHost: (isHost) => set({ isHost }),
  setCustomText: (customText) => set({ customText }),
  setIncludeDateStamp: (includeDateStamp) => set({ includeDateStamp }),
  resetSession: () =>
    set({
      step: "ready",
      capturedShots: [],
      currentShotIndex: 0,
      remainingCountdown: null,
      isFlashActive: false,
    }),
}));
