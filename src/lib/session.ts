'use client';

import { LayoutConfig } from '@/components/PhotoStripCanvas';

export interface PhotoSession {
  session_id: string;
  nickname?: string;
  photos: string[];
  selectedLayout: LayoutConfig | null;
  created_at: string;
  updated_at: string;
}

const SESSION_STORAGE_KEY = 'tic-a-pic-session';
const PHOTOS_STORAGE_KEY = 'tic-a-pic-photos';
const LAYOUT_STORAGE_KEY = 'tic-a-pic-layout';

/**
 * Generate a random session ID in format XXXX-XXXX-XXXX
 */
export function generateSessionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [];

  for (let i = 0; i < 3; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }

  return segments.join('-');
}

/**
 * Get current session from localStorage
 */
export function getCurrentSession(): PhotoSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionData) return null;

    return JSON.parse(sessionData);
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
}

/**
 * Create a new session
 */
export function createSession(nickname?: string): PhotoSession {
  const session: PhotoSession = {
    session_id: generateSessionId(),
    nickname,
    photos: [],
    selectedLayout: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  saveSession(session);
  return session;
}

/**
 * Recover an existing session with a given session_id
 */
export function recoverSession(sessionId: string, nickname?: string): PhotoSession {
  const session: PhotoSession = {
    session_id: sessionId,
    nickname,
    photos: [],
    selectedLayout: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  saveSession(session);
  return session;
}

/**
 * Save session to localStorage
 */
export function saveSession(session: PhotoSession): void {
  if (typeof window === 'undefined') return;

  try {
    session.updated_at = new Date().toISOString();
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

/**
 * Get photos from localStorage
 */
export function getStoredPhotos(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const photosData = localStorage.getItem(PHOTOS_STORAGE_KEY);
    return photosData ? JSON.parse(photosData) : [];
  } catch (error) {
    console.error('Error loading photos:', error);
    return [];
  }
}

/**
 * Save photos to localStorage
 */
export function savePhotos(photos: string[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos));

    // Also update session if exists
    const session = getCurrentSession();
    if (session) {
      session.photos = photos;
      saveSession(session);
    }
  } catch (error) {
    console.error('Error saving photos:', error);
  }
}

/**
 * Add a photo to the collection
 */
export function addPhoto(photoData: string): void {
  const photos = getStoredPhotos();
  photos.push(photoData);
  savePhotos(photos);
}

/**
 * Remove a photo by index
 */
export function removePhoto(index: number): void {
  const photos = getStoredPhotos();
  if (index >= 0 && index < photos.length) {
    photos.splice(index, 1);
    savePhotos(photos);
  }
}

/**
 * Clear all photos
 */
export function clearPhotos(): void {
  savePhotos([]);
}

/**
 * Get selected layout from localStorage
 */
export function getStoredLayout(): LayoutConfig | null {
  if (typeof window === 'undefined') return null;

  try {
    const layoutData = localStorage.getItem(LAYOUT_STORAGE_KEY);
    return layoutData ? JSON.parse(layoutData) : null;
  } catch (error) {
    console.error('Error loading layout:', error);
    return null;
  }
}

/**
 * Save selected layout to localStorage
 */
export function saveLayout(layout: LayoutConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));

    // Also update session if exists
    const session = getCurrentSession();
    if (session) {
      session.selectedLayout = layout;
      saveSession(session);
    }
  } catch (error) {
    console.error('Error saving layout:', error);
  }
}

/**
 * Clear all session data
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(PHOTOS_STORAGE_KEY);
    localStorage.removeItem(LAYOUT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

/**
 * Get session statistics
 */
export function getSessionStats(): {
  hasSession: boolean;
  photoCount: number;
  hasLayout: boolean;
  sessionAge?: number;
} {
  const session = getCurrentSession();
  const photos = getStoredPhotos();
  const layout = getStoredLayout();

  return {
    hasSession: !!session,
    photoCount: photos.length,
    hasLayout: !!layout,
    sessionAge: session
      ? Date.now() - new Date(session.created_at).getTime()
      : undefined,
  };
}
