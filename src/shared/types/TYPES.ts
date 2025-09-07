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
