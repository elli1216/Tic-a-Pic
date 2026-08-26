export type StripLayout = "classic_strip_4x1" | "grid_2x2" | "twin_strip";

export interface PlacedSticker {
  id: string;
  stickerId: string;
  label: string;
  type: "emoji" | "badge" | "stamp";
  content: string; // emoji char or text badge string
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  scale: number; // 0.6 to 2.5
  rotation: number; // -180 to 180 degrees
}

export interface StripTheme {
  id: string;
  name: string;
  background: string;
  borderStyle: "solid" | "pattern" | "gradient";
  textColor: string;
  fontFamily: "handwritten" | "mono" | "sans" | "serif";
  isDark?: boolean;
}

export interface StripCustomization {
  layout: StripLayout;
  themeId: string;
  customText: string;
  fontFamily: "handwritten" | "mono" | "sans" | "serif";
  textColor: string;
  includeDateStamp: boolean;
  dateFormat: string;
  filterId: string;
  stickers: PlacedSticker[];
}

export const STRIP_THEMES: StripTheme[] = [
  {
    id: "classic-white",
    name: "Classic Studio White",
    background: "#ffffff",
    borderStyle: "solid",
    textColor: "#1f2937",
    fontFamily: "mono",
    isDark: false,
  },
  {
    id: "matte-black",
    name: "Nocturne Matte Black",
    background: "#18181b",
    borderStyle: "solid",
    textColor: "#f4f4f5",
    fontFamily: "mono",
    isDark: true,
  },
  {
    id: "pastel-pink",
    name: "Sweet Cotton Pink",
    background: "#fce7f3",
    borderStyle: "solid",
    textColor: "#9d174d",
    fontFamily: "handwritten",
    isDark: false,
  },
  {
    id: "cherry-retro",
    name: "Retro Cherry Red",
    background: "#ffe4e6",
    borderStyle: "solid",
    textColor: "#9f1239",
    fontFamily: "sans",
    isDark: false,
  },
  {
    id: "y2k-lilac",
    name: "Y2K Lavender Dream",
    background: "#ede9fe",
    borderStyle: "solid",
    textColor: "#5b21b6",
    fontFamily: "sans",
    isDark: false,
  },
  {
    id: "matcha-mint",
    name: "Matcha Latte",
    background: "#dcfce7",
    borderStyle: "solid",
    textColor: "#166534",
    fontFamily: "sans",
    isDark: false,
  },
  {
    id: "vintage-paper",
    name: "Vintage Kraft Paper",
    background: "#fef3c7",
    borderStyle: "solid",
    textColor: "#78350f",
    fontFamily: "serif",
    isDark: false,
  },
  {
    id: "cyber-gradient",
    name: "Cyber Neon Glow",
    background: "linear-gradient(180deg, #3b0764 0%, #1e1b4b 50%, #030712 100%)",
    borderStyle: "gradient",
    textColor: "#f472b6",
    fontFamily: "mono",
    isDark: true,
  },
];
