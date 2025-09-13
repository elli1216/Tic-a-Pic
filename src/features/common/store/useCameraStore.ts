'use client';

import { create } from 'zustand';
import { FacingMode } from '@/shared/types/TYPES';

interface CameraState {
  isCapturing: boolean;
  setIsCapturing: (isCapturing: boolean) => void;
  facingMode: FacingMode | null;
  setFacingMode: (facingMode: FacingMode) => void;
  isMirrored: boolean;
  setIsMirrored: (isMirrored: boolean) => void;
  cameraReady: boolean;
  setCameraReady: (cameraReady: boolean) => void;
  cameraKey: number;
  setCameraKey: (cameraKey: number) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isInitializing: boolean;
  setIsInitializing: (isInitializing: boolean) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  isCapturing: false,
  setIsCapturing: (isCapturing: boolean) => set({ isCapturing }),
  facingMode: 'user',
  setFacingMode: (facingMode: FacingMode) => set({ facingMode }),
  isMirrored: false,
  setIsMirrored: (isMirrored: boolean) => set({ isMirrored }),
  cameraReady: false,
  setCameraReady: (cameraReady: boolean) => set({ cameraReady }),
  cameraKey: 0,
  setCameraKey: (cameraKey: number) => set({ cameraKey }),
  error: null,
  setError: (error: string | null) => set({ error }),
  isInitializing: false,
  setIsInitializing: (isInitializing: boolean) => set({ isInitializing }),
}));
