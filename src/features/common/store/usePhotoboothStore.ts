'use client';

import { create } from 'zustand';
import { LayoutConfig } from '@/features/photobooth/components/strips/PhotoStripCanvas';
import { PhotoSession } from '@/lib/session';
import { SavedStrip } from '@/shared/types/TYPES';

export type AppState = 'camera' | 'preview' | 'strip' | 'layouts' | 'booth';

export const LAYOUT_PRESETS: LayoutConfig[] = [
  {
    id: 'classic-white',
    name: 'Classic White',
    type: 'free',
    slots: [
      { x: 10, y: 5, width: 80, height: 20 },
      { x: 10, y: 27, width: 80, height: 20 },
      { x: 10, y: 49, width: 80, height: 20 },
      { x: 10, y: 71, width: 80, height: 20 },
    ],
    background: '#ffffff',
  },
  {
    id: 'soft-pink',
    name: 'Soft Pink',
    type: 'free',
    slots: [
      { x: 10, y: 5, width: 80, height: 20 },
      { x: 10, y: 27, width: 80, height: 20 },
      { x: 10, y: 49, width: 80, height: 20 },
      { x: 10, y: 71, width: 80, height: 20 },
    ],
    background: '#fce7f3',
  },
  {
    id: 'sunny-yellow',
    name: 'Sunny Yellow',
    type: 'free',
    slots: [
      { x: 10, y: 5, width: 80, height: 20 },
      { x: 10, y: 27, width: 80, height: 20 },
      { x: 10, y: 49, width: 80, height: 20 },
      { x: 10, y: 71, width: 80, height: 20 },
    ],
    background: '#fef9c3',
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    type: 'free',
    slots: [
      { x: 10, y: 5, width: 80, height: 20 },
      { x: 10, y: 27, width: 80, height: 20 },
      { x: 10, y: 49, width: 80, height: 20 },
      { x: 10, y: 71, width: 80, height: 20 },
    ],
    background: '#dbeafe',
  },
  {
    id: 'retro-orange',
    name: 'Retro Orange',
    type: 'free',
    slots: [
      { x: 10, y: 5, width: 80, height: 20 },
      { x: 10, y: 27, width: 80, height: 20 },
      { x: 10, y: 49, width: 80, height: 20 },
      { x: 10, y: 71, width: 80, height: 20 },
    ],
    background: '#ffedd5',
  },
  {
    id: 'tilted-fun',
    name: 'Tilted Fun',
    type: 'free',
    slots: [
      { x: 10, y: 5, width: 80, height: 20, rotation: -3 },
      { x: 10, y: 28, width: 80, height: 20, rotation: 2 },
      { x: 10, y: 51, width: 80, height: 20, rotation: -2 },
      { x: 10, y: 74, width: 80, height: 20, rotation: 3 },
    ],
    background: '#f3e8ff',
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    type: 'free',
    slots: [
      { x: 5, y: 8, width: 90, height: 18 },
      { x: 5, y: 30, width: 90, height: 18 },
      { x: 5, y: 52, width: 90, height: 18 },
      { x: 5, y: 74, width: 90, height: 18 },
    ],
    background: '#ffffff',
  },
];

interface PhotoboothState {
  // App state
  appState: AppState;
  setAppState: (state: AppState) => void;

  // Session (DO NOT CHANGE)
  session: PhotoSession | null;
  setSession: (session: PhotoSession | null) => void;
  showSessionModal: boolean;
  setShowSessionModal: (show: boolean) => void;

  // Photos
  photos: string[];
  setPhotos: (photos: string[]) => void;
  addPhoto: (photo: string) => void;
  removePhoto: (index: number) => void;
  reorderPhotos: (fromIndex: number, toIndex: number) => void;
  replacePhoto: (index: number, photo: string) => void;
  currentPhoto: string | null;
  setCurrentPhoto: (photo: string | null) => void;

  // Strips
  strips: SavedStrip[];
  setStrips: (strips: SavedStrip[]) => void;
  selectedStrip: SavedStrip | null;
  setSelectedStrip: (strip: SavedStrip | null) => void;

  // NEW: Photobooth-specific state
  currentSlot: 0 | 1 | 2 | 3;
  setCurrentSlot: (slot: 0 | 1 | 2 | 3) => void;
  isCapturing: boolean;
  setIsCapturing: (isCapturing: boolean) => void;
  countdown: number;
  setCountdown: (countdown: number) => void;
  boothPhotos: [string | null, string | null, string | null, string | null];
  setBoothPhoto: (index: 0 | 1 | 2 | 3, photo: string | null) => void;
  resetBoothPhotos: () => void;
  startCaptureSession: () => void;

  // Layout
  selectedLayout: LayoutConfig;
  setSelectedLayout: (layout: LayoutConfig) => void;

  // Toast/notifications
  toast: { message: string; type: 'success' | 'error' | 'warning' } | null;
  setToast: (
    toast: { message: string; type: 'success' | 'error' | 'warning' } | null
  ) => void;

  // Navigation helpers
  goToCamera: () => void;
  goToStrip: () => void;
  goToLayouts: () => void;
  goToBooth: () => void;

  // Session management (DO NOT CHANGE)
  clearSession: () => void;
  createSession: (nickname?: string) => Promise<void>;
  createSessionOnLocalStorage: (nickname?: string) => Promise<void>;
  loadExistingSession: (sessionId: string) => Promise<void>;
}

export const usePhotoboothStore = create<PhotoboothState>((set, get) => ({
  // Initial state
  appState: 'layouts', // Changed: default to layout selection
  session: null,
  showSessionModal: false,
  photos: [],
  currentPhoto: null,
  strips: [],
  selectedStrip: null,

  // NEW: Photobooth-specific initial state
  currentSlot: 0,
  isCapturing: false,
  countdown: 0,
  boothPhotos: [null, null, null, null],

  selectedLayout: LAYOUT_PRESETS[0],
  toast: null,

  // Setters
  setAppState: (appState) => set({ appState }),
  setSession: (session) => set({ session }),
  setShowSessionModal: (showSessionModal) => set({ showSessionModal }),
  setPhotos: (photos) => set({ photos }),
  setCurrentPhoto: (currentPhoto) => set({ currentPhoto }),
  setSelectedLayout: (selectedLayout) => set({ selectedLayout }),
  setToast: (toast) => set({ toast }),

  // NEW: Photobooth-specific setters
  setCurrentSlot: (currentSlot) => set({ currentSlot }),
  setIsCapturing: (isCapturing) => set({ isCapturing }),
  setCountdown: (countdown) => set({ countdown }),
  setBoothPhoto: (index, photo) => {
    const { boothPhotos } = get();
    const newPhotos: [
      string | null,
      string | null,
      string | null,
      string | null
    ] = [...boothPhotos];
    newPhotos[index] = photo;
    set({ boothPhotos: newPhotos });
  },
  resetBoothPhotos: () =>
    set({ boothPhotos: [null, null, null, null], currentSlot: 0 }),
  startCaptureSession: () => set({ isCapturing: true, currentSlot: 0 }),

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

  reorderPhotos: (fromIndex, toIndex) => {
    const { photos } = get();
    const updatedPhotos = [...photos];
    const [movedPhoto] = updatedPhotos.splice(fromIndex, 1);
    updatedPhotos.splice(toIndex, 0, movedPhoto);
    set({ photos: updatedPhotos });
  },

  replacePhoto: (index, photo) => {
    const { photos } = get();
    const updatedPhotos = [...photos];
    updatedPhotos[index] = photo;
    set({ photos: updatedPhotos });
  },

  setStrips: (strips) => set({ strips }),
  setSelectedStrip: (selectedStrip) => set({ selectedStrip }),

  // Navigation helpers
  goToCamera: () => set({ appState: 'camera' }),
  goToStrip: () => set({ appState: 'strip' }),
  goToLayouts: () => {
    set({ appState: 'layouts' });
  },
  goToBooth: () => set({ appState: 'booth' }),

  // Session management (DO NOT CHANGE)
  clearSession: () => {
    // Reset all state to initial values
    set({
      session: null,
      photos: [],
      strips: [],
      selectedStrip: null,
      currentPhoto: null,
      appState: 'layouts', // Changed: default to layout selection
      showSessionModal: true,
      // NEW: Reset booth photos
      boothPhotos: [null, null, null, null],
      currentSlot: 0,
      isCapturing: false,
      countdown: 0,
      selectedLayout: LAYOUT_PRESETS[0],
    });
  },

  createSession: async (nickname?: string) => {
    const { createSession } = await import('@/lib/session');
    try {
      const newSession = await createSession(nickname);
      set({ session: newSession });
      localStorage.setItem('isTemporarySession', 'false');
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  createSessionOnLocalStorage: async () => {
    const { createSessionOnLocalStorage } = await import('@/lib/session');
    try {
      const newSession = await createSessionOnLocalStorage();
      set({ session: newSession as PhotoSession });
      localStorage.setItem('isTemporarySession', 'true');
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  loadExistingSession: async (sessionId: string) => {
    const { loadExistingSession } = await import('@/lib/session');
    try {
      const existingSession = await loadExistingSession(sessionId);
      if (!existingSession) {
        throw new Error('Session not found');
      }
      set({ session: existingSession });
      localStorage.setItem('isTemporarySession', 'false');
    } catch (error) {
      console.error('Error loading session:', error);
      throw error;
    }
  },
}));
