'use client';

import { create } from 'zustand';
import { LayoutConfig } from '@/components/PhotoStripCanvas';
import { PhotoSession } from '@/lib/session';

export type AppState = 'camera' | 'preview' | 'strip' | 'layouts';

interface PhotoboothState {
  // App state
  appState: AppState;
  setAppState: (state: AppState) => void;

  // Session
  session: PhotoSession | null;
  setSession: (session: PhotoSession | null) => void;
  showSessionModal: boolean;
  setShowSessionModal: (show: boolean) => void;

  // Photos
  photos: string[];
  setPhotos: (photos: string[]) => void;
  addPhoto: (photo: string) => void;
  removePhoto: (index: number) => void;
  currentPhoto: string | null;
  setCurrentPhoto: (photo: string | null) => void;

  // Layout
  selectedLayout: LayoutConfig;
  setSelectedLayout: (layout: LayoutConfig) => void;

  // UI state
  isCapturing: boolean;
  setIsCapturing: (capturing: boolean) => void;

  // Toast/notifications
  toast: { message: string; type: 'success' | 'error' | 'warning' } | null;
  setToast: (
    toast: { message: string; type: 'success' | 'error' | 'warning' } | null
  ) => void;

  // Navigation helpers
  goToCamera: () => void;
  goToStrip: () => void;
  goToLayouts: () => void;
}

export const usePhotoboothStore = create<PhotoboothState>((set, get) => ({
  // Initial state
  appState: 'camera',
  session: null,
  showSessionModal: false,
  photos: [],
  currentPhoto: null,
  selectedLayout: {
    id: 'classic-4',
    name: 'Classic Strip',
    type: 'free',
    slots: [
      { x: 10, y: 5, width: 80, height: 20 },
      { x: 10, y: 27, width: 80, height: 20 },
      { x: 10, y: 49, width: 80, height: 20 },
      { x: 10, y: 71, width: 80, height: 20 },
    ],
    background: '#ffffff',
  },
  isCapturing: false,
  toast: null,

  // Setters
  setAppState: (appState) => set({ appState }),
  setSession: (session) => set({ session }),
  setShowSessionModal: (showSessionModal) => set({ showSessionModal }),
  setPhotos: (photos) => set({ photos }),
  setCurrentPhoto: (currentPhoto) => set({ currentPhoto }),
  setSelectedLayout: (selectedLayout) => set({ selectedLayout }),
  setIsCapturing: (isCapturing) => set({ isCapturing }),
  setToast: (toast) => set({ toast }),

  // Photo management
  addPhoto: (photo) => {
    const { photos } = get();
    set({ photos: [...photos, photo] });
  },

  removePhoto: (index) => {
    const { photos } = get();
    const updatedPhotos = photos.filter((_, i) => i !== index);
    set({ photos: updatedPhotos });
  },

  // Navigation helpers
  goToCamera: () => set({ appState: 'camera' }),
  goToStrip: () => set({ appState: 'strip' }),
  goToLayouts: () => {

    set({ appState: 'layouts' });
  },
}));
