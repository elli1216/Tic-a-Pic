// types/TYPES.ts
export interface Session {
  session_id: string;
  created_at: string;
  device_info?: Record<string, unknown>;
}

export interface Layout {
  id: string;
  name: string;
  type: 'free' | 'premium';
  config_json: string; // JSON string of layout structure
  thumbnail_url: string;
  is_split?: boolean; // for heart-puzzle layouts
}

export interface UserLayout {
  id: string;
  session_id: string;
  name: string;
  config_json: string;
  created_at: string;
}

export interface PremiumCode {
  code: string;
  is_active: boolean;
  payment_id: string;
  email?: string;
  created_at: string;
  expires_at?: string;
}

export interface Feedback {
  type: 'bug' | 'feature';
  message: string;
  session_id?: string;
  created_at: string;
  device_info: {
    userAgent: string;
    platform: string;
  };
}

export interface EmailSubscriber {
  email: string;
  subscribed_at: string;
  source: 'homepage' | 'success-page';
}

export interface VisitorStats {
  total_visitors: number;
  active_now: number;
}

export interface Sticker {
  id: string;
  name: string;
  url: string; // Supabase Storage URL
  category: 'default' | 'uploaded';
}

// Type definitions for legacy getUserMedia implementations
export interface LegacyNavigator extends Navigator {
  getUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: Error) => void
  ) => void;
  webkitGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: Error) => void
  ) => void;
  mozGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: Error) => void
  ) => void;
  msGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: Error) => void
  ) => void;
  mediaDevices: MediaDevices;
}

export type FacingMode = 'user' | 'environment' | null;

// Diagnostics interfaces
export interface DiagnosticsData {
  securityCheck: {
    isSecureContext: boolean;
    protocol: string;
    hostname: string;
    isSecure: boolean;
  };
  deviceEnumeration: {
    success: boolean;
    totalDevices?: number;
    videoDevices?: number;
    audioDevices?: number;
    devices?: Array<{
      deviceId: string;
      label: string;
      groupId: string;
    }>;
    error?: string;
  };
  cameraTest: {
    success: boolean;
    basicAccess?: boolean;
    trackCount?: number;
    tracks?: Array<{
      label: string;
      kind: string;
      enabled: boolean;
      readyState: string;
      settings: MediaTrackSettings;
      capabilities: MediaTrackCapabilities;
    }>;
    facingModes?: {
      front: boolean;
      back: boolean;
    };
    error?: string;
    errorName?: string;
  };
  lastUpdated: Date;
}
