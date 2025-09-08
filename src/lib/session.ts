'use client';

import { LayoutConfig } from '@/components/PhotoStripCanvas';
import { supabaseAnon } from './supabase-admin';

export interface PhotoSession {
  session_id: string;
  nickname?: string;
  photos: string[];
  selectedLayout: LayoutConfig | null;
  created_at: string;
  updated_at: string;
  device_info?: {
    userAgent?: string;
    platform?: string;
  };
}

// Keep some localStorage keys for client-side caching
const PHOTOS_STORAGE_KEY = 'tic-a-pic-photos';
const LAYOUT_STORAGE_KEY = 'tic-a-pic-layout';
const CURRENT_SESSION_KEY = 'tic-a-pic-current-session';

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
 * Get device information for session tracking
 */
function getDeviceInfo() {
  if (typeof window === 'undefined') return {};
  
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  };
}

/**
 * Get current session from localStorage (client-side cache)
 */
export function getCurrentSession(): PhotoSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!sessionData) return null;

    return JSON.parse(sessionData);
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
}

/**
 * Create a new session in Supabase
 */
export async function createSession(nickname?: string): Promise<PhotoSession> {
  const sessionId = generateSessionId();
  const deviceInfo = getDeviceInfo();
  
  try {
    // Insert session into Supabase
    const { error } = await supabaseAnon
      .from('sessions')
      .insert({
        session_id: sessionId,
        nickname: nickname || null,
        device_info: deviceInfo,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error creating session in Supabase:', error);
      throw new Error(`Failed to create session: ${error.message}`);
    }

    const session: PhotoSession = {
      session_id: sessionId,
      nickname,
      photos: [],
      selectedLayout: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      device_info: deviceInfo,
    };

    // Cache session locally
    saveSessionLocally(session);
    return session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Validate session exists in Supabase
 */
export async function validateSession(sessionId: string): Promise<PhotoSession | null> {
  try {
    const { data, error } = await supabaseAnon
      .from('sessions')
      .select('session_id, nickname, created_at')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      console.error('Session not found:', error?.message);
      return null;
    }

    const session: PhotoSession = {
      session_id: data.session_id,
      nickname: data.nickname,
      photos: getStoredPhotos(),
      selectedLayout: getStoredLayout(),
      created_at: data.created_at,
      updated_at: new Date().toISOString(),
    };

    // Cache session locally
    saveSessionLocally(session);
    return session;
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}

/**
 * Save session to localStorage (client-side cache)
 */
function saveSessionLocally(session: PhotoSession): void {
  if (typeof window === 'undefined') return;

  try {
    session.updated_at = new Date().toISOString();
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session locally:', error);
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
      saveSessionLocally(session);
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
      saveSessionLocally(session);
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
    localStorage.removeItem(CURRENT_SESSION_KEY);
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
