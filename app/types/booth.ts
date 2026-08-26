export type BoothMode = "solo" | "duo_local" | "duo_remote";

export type BoothStep =
  | "setup"
  | "ready"
  | "countdown"
  | "capturing"
  | "customize"
  | "export";

export interface BackgroundPreset {
  id: string;
  name: string;
  category: "color" | "gradient" | "scene" | "texture";
  value: string; // color hex, css gradient, or image URL
  previewUrl?: string;
  isPremium?: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  cssFilter: string; // CSS filter string e.g. "contrast(1.1) brightness(1.05) sepia(0.2)"
  overlayColor?: string;
}

export interface FramePreset {
  id: string;
  name: string;
  borderStyle:
    | "classic-white"
    | "matte-black"
    | "pastel-pink"
    | "y2k-holo"
    | "cherry-retro"
    | "checkerboard";
  backgroundColor: string;
  textColor: string;
  isPremium?: boolean;
}

export interface CapturedShot {
  id: string;
  dataUrl: string;
  timestamp: number;
  shotNumber: number; // 1 to 4
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: "none",
    name: "Camera Real",
    category: "color",
    value: "transparent",
  },
  {
    id: "pastel-pink",
    name: "Pastel Blossom",
    category: "gradient",
    value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
  },
  {
    id: "sunset-vibes",
    name: "Sunset Dream",
    category: "gradient",
    value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: "cyber-purple",
    name: "Neon Cyber",
    category: "gradient",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "studio-white",
    name: "Studio Clean",
    category: "color",
    value: "#f8fafc",
  },
  {
    id: "matte-black",
    name: "Moody Black",
    category: "color",
    value: "#121216",
  },
  {
    id: "retro-grain",
    name: "90s Film Grain",
    category: "gradient",
    value: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
  },
  {
    id: "soft-matcha",
    name: "Matcha Latte",
    category: "gradient",
    value: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  },
  {
    id: "paris-cafe",
    name: "Parisian Night",
    category: "scene",
    value:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cherry-blossom",
    name: "Tokyo Blossoms",
    category: "scene",
    value:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "retro-diner",
    name: "Vintage Diner",
    category: "scene",
    value:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  },
];

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: "normal",
    name: "Original",
    cssFilter: "none",
  },
  {
    id: "vintage-warm",
    name: "Vintage Warm",
    cssFilter: "sepia(0.25) contrast(1.1) brightness(1.05) saturate(1.2)",
  },
  {
    id: "film-bw",
    name: "Classic B&W",
    cssFilter: "grayscale(1) contrast(1.2) brightness(0.95)",
  },
  {
    id: "y2k-glow",
    name: "Y2K Dream",
    cssFilter:
      "brightness(1.1) contrast(1.05) saturate(1.4) hue-rotate(-10deg)",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    cssFilter: "sepia(0.35) saturate(1.3) contrast(1.05) brightness(1.08)",
  },
  {
    id: "soft-mood",
    name: "Moody Muted",
    cssFilter: "contrast(0.9) brightness(1.05) saturate(0.85)",
  },
];

export const FRAME_PRESETS: FramePreset[] = [
  {
    id: "classic-white",
    name: "Classic Studio White",
    borderStyle: "classic-white",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
  },
  {
    id: "matte-black",
    name: "Nocturne Matte Black",
    borderStyle: "matte-black",
    backgroundColor: "#18181b",
    textColor: "#f4f4f5",
  },
  {
    id: "pastel-pink",
    name: "Sweet Cotton Pink",
    borderStyle: "pastel-pink",
    backgroundColor: "#fce7f3",
    textColor: "#9d174d",
  },
  {
    id: "y2k-holo",
    name: "Y2K Cyber Silver",
    borderStyle: "y2k-holo",
    backgroundColor: "#e2e8f0",
    textColor: "#334155",
  },
  {
    id: "cherry-retro",
    name: "Retro Cherry Red",
    borderStyle: "cherry-retro",
    backgroundColor: "#ffe4e6",
    textColor: "#9f1239",
  },
];
