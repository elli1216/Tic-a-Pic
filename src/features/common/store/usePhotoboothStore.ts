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
  reorderPhotos: (fromIndex: number, toIndex: number) => void;
  replacePhoto: (index: number, photo: string) => void;
  currentPhoto: string | null;
  setCurrentPhoto: (photo: string | null) => void;

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

  // Session management
  clearSession: () => void;
  createSession: (nickname?: string) => Promise<void>;
  createSessionOnLocalStorage: (nickname?: string) => Promise<void>;
  loadExistingSession: (sessionId: string) => Promise<void>;
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
  toast: null,

  // Setters
  setAppState: (appState) => set({ appState }),
  setSession: (session) => set({ session }),
  setShowSessionModal: (showSessionModal) => set({ showSessionModal }),
  setPhotos: (photos) => set({ photos }),
  setCurrentPhoto: (currentPhoto) => set({ currentPhoto }),
  setSelectedLayout: (selectedLayout) => set({ selectedLayout }),
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

  // Navigation helpers
  goToCamera: () => set({ appState: 'camera' }),
  goToStrip: () => set({ appState: 'strip' }),
  goToLayouts: () => {
    set({ appState: 'layouts' });
  },

  // Session management
  clearSession: () => {
    // Reset all state to initial values
    set({
      session: null,
      photos: [],
      currentPhoto: null,
      appState: 'camera',
      showSessionModal: true,
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
    });
  },

  createSession: async (nickname?: string) => {
    const { createSession } = await import('@/lib/session');
    try {
      const newSession = await createSession(nickname);
      set({ session: newSession });
      localStorage.setItem('isTemporarySession', btoa(false.toString()));
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
      localStorage.setItem('isTemporarySession', btoa(true.toString()));
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
      localStorage.setItem('isTemporarySession', btoa(false.toString()));
    } catch (error) {
      console.error('Error loading session:', error);
      throw error;
    }
  },
}));
