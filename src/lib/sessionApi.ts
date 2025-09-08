/**
 * Session API Service
 * Handles all session-related operations using Supabase directly
 */

import { validateSession, createSession, PhotoSession } from './session';

export interface SessionValidationResponse {
  valid: boolean;
  message?: string;
  session?: PhotoSession;
}

export interface SessionCreationResponse {
  session_id: string;
  nickname?: string | null;
  created_at: string;
}

/**
 * Validates session code format using regex
 */
export const validateSessionFormat = (code: string): boolean => {
  const sessionIdRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return sessionIdRegex.test(code.toUpperCase());
};

/**
 * Validates session with Supabase and returns session data if valid
 * @param sessionId - The session ID to validate
 * @returns Promise<SessionValidationResponse> - Validation result with session data
 * @throws SessionApiError - If the operation fails
 */
export const validateSessionWithAPI = async (
  sessionId: string
): Promise<SessionValidationResponse> => {
  try {
    // First validate format
    if (!validateSessionFormat(sessionId)) {
      return {
        valid: false,
        message: 'Invalid session ID format. Expected format: XXXX-XXXX-XXXX',
      };
    }

    // Validate with Supabase
    const session = await validateSession(sessionId);
    
    if (session) {
      return {
        valid: true,
        session,
        message: 'Session is valid',
      };
    } else {
      return {
        valid: false,
        message: 'Session not found or expired',
      };
    }
  } catch (error) {
    console.error('Session validation error:', error);
    throw new SessionApiError({
      message: 'Failed to validate session. Please check your connection and try again.',
      code: 'VALIDATION_ERROR',
    });
  }
};

/**
 * Creates a new session in Supabase
 * @param nickname - Optional nickname for the session
 * @returns Promise<SessionCreationResponse> - Created session data
 * @throws SessionApiError - If the operation fails
 */
export const createSessionInDB = async (
  nickname?: string
): Promise<SessionCreationResponse> => {
  try {
    const session = await createSession(nickname);
    
    return {
      session_id: session.session_id,
      nickname: session.nickname || null,
      created_at: session.created_at,
    };
  } catch (error) {
    console.error('Session creation error:', error);
    throw new SessionApiError({
      message: 'Failed to create session. Please check your connection and try again.',
      code: 'CREATION_ERROR',
    });
  }
};

/**
 * Custom error class for session API errors
 */
export class SessionApiError extends Error {
  public code?: string;

  constructor({ message, code }: { message: string; code?: string }) {
    super(message);
    this.name = 'SessionApiError';
    this.code = code;
  }
}

/**
 * Clear all session data from localStorage
 * This includes session info, photos, and layout preferences
 */
export const clearSessionData = (): void => {
  if (typeof window === 'undefined') return;

  try {
    const CURRENT_SESSION_KEY = 'tic-a-pic-current-session';
    const PHOTOS_STORAGE_KEY = 'tic-a-pic-photos';
    const LAYOUT_STORAGE_KEY = 'tic-a-pic-layout';

    localStorage.removeItem(CURRENT_SESSION_KEY);
    localStorage.removeItem(PHOTOS_STORAGE_KEY);
    localStorage.removeItem(LAYOUT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing session data:', error);
    throw new SessionApiError({
      message: 'Failed to clear session data. Please try again.',
      code: 'CLEAR_ERROR',
    });
  }
};