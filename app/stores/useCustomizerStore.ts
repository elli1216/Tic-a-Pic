import { create } from "zustand";
import type {
  StripCustomization,
  StripLayout,
  StripTheme,
  PlacedSticker,
} from "../types/strip";
import { STRIP_THEMES } from "../types/strip";
import type { StickerPreset } from "../lib/stickers";

export type CustomizerTab = "theme" | "stickers" | "text" | "export";
export type SaveStatus = "idle" | "saving" | "local_saved" | "cloud_saved";

interface CustomizerState {
  // Customization settings
  customization: StripCustomization;
  activeTab: CustomizerTab;
  selectedStickerId: string | null;
  stickerCategory: string;

  // Render & Export states
  previewDataUrl: string | null;
  isRendering: boolean;
  isGeneratingGif: boolean;
  gifProgress: number;
  generatedGifUrl: string | null;
  saveStatus: SaveStatus;
  errorMessage: string | null;

  // Actions
  setActiveTab: (tab: CustomizerTab) => void;
  setLayout: (layout: StripLayout) => void;
  setThemeId: (themeId: string, textColor?: string) => void;
  setCustomText: (text: string) => void;
  setFontFamily: (fontFamily: "mono" | "handwritten" | "sans" | "serif") => void;
  setTextColor: (color: string) => void;
  setIncludeDateStamp: (include: boolean) => void;
  setStickerCategory: (category: string) => void;

  // Sticker actions
  addSticker: (preset: StickerPreset) => void;
  updateSelectedSticker: (updates: Partial<PlacedSticker>) => void;
  deleteSelectedSticker: () => void;
  setSelectedStickerId: (id: string | null) => void;

  // Preview & Export actions
  setPreviewDataUrl: (url: string | null) => void;
  setIsRendering: (isRendering: boolean) => void;
  setIsGeneratingGif: (isGenerating: boolean) => void;
  setGifProgress: (progress: number) => void;
  setGeneratedGifUrl: (url: string | null) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setErrorMessage: (msg: string | null) => void;
  resetCustomizer: () => void;
}

const initialCustomization: StripCustomization = {
  layout: "classic_strip_4x1",
  themeId: "classic-white",
  customText: "TIC-A-PIC ♡ 2026",
  fontFamily: "mono",
  textColor: "#1f2937",
  includeDateStamp: true,
  dateFormat: "MM.DD.YYYY",
  filterId: "normal",
  stickers: [],
};

export const useCustomizerStore = create<CustomizerState>((set) => ({
  customization: initialCustomization,
  activeTab: "theme",
  selectedStickerId: null,
  stickerCategory: "all",

  previewDataUrl: null,
  isRendering: false,
  isGeneratingGif: false,
  gifProgress: 0,
  generatedGifUrl: null,
  saveStatus: "idle",
  errorMessage: null,

  setActiveTab: (activeTab) => set({ activeTab }),

  setLayout: (layout) =>
    set((state) => ({
      customization: { ...state.customization, layout },
    })),

  setThemeId: (themeId, textColor) =>
    set((state) => {
      const theme = STRIP_THEMES.find((t) => t.id === themeId);
      return {
        customization: {
          ...state.customization,
          themeId,
          textColor: textColor || theme?.textColor || state.customization.textColor,
        },
      };
    }),

  setCustomText: (customText) =>
    set((state) => ({
      customization: { ...state.customization, customText },
    })),

  setFontFamily: (fontFamily) =>
    set((state) => ({
      customization: { ...state.customization, fontFamily },
    })),

  setTextColor: (textColor) =>
    set((state) => ({
      customization: { ...state.customization, textColor },
    })),

  setIncludeDateStamp: (includeDateStamp) =>
    set((state) => ({
      customization: { ...state.customization, includeDateStamp },
    })),

  setStickerCategory: (stickerCategory) => set({ stickerCategory }),

  addSticker: (preset) =>
    set((state) => {
      const newSticker: PlacedSticker = {
        id: `sticker-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        stickerId: preset.id,
        label: preset.label,
        type: preset.type,
        content: preset.content,
        x: 50 + (Math.random() * 20 - 10),
        y: 50 + (Math.random() * 30 - 15),
        scale: 1,
        rotation: Math.round(Math.random() * 20 - 10),
      };

      return {
        customization: {
          ...state.customization,
          stickers: [...state.customization.stickers, newSticker],
        },
        selectedStickerId: newSticker.id,
      };
    }),

  updateSelectedSticker: (updates) =>
    set((state) => {
      if (!state.selectedStickerId) return state;
      return {
        customization: {
          ...state.customization,
          stickers: state.customization.stickers.map((s) =>
            s.id === state.selectedStickerId ? { ...s, ...updates } : s
          ),
        },
      };
    }),

  deleteSelectedSticker: () =>
    set((state) => {
      if (!state.selectedStickerId) return state;
      return {
        customization: {
          ...state.customization,
          stickers: state.customization.stickers.filter(
            (s) => s.id !== state.selectedStickerId
          ),
        },
        selectedStickerId: null,
      };
    }),

  setSelectedStickerId: (selectedStickerId) => set({ selectedStickerId }),

  setPreviewDataUrl: (previewDataUrl) => set({ previewDataUrl }),
  setIsRendering: (isRendering) => set({ isRendering }),
  setIsGeneratingGif: (isGeneratingGif) => set({ isGeneratingGif }),
  setGifProgress: (gifProgress) => set({ gifProgress }),
  setGeneratedGifUrl: (generatedGifUrl) => set({ generatedGifUrl }),
  setSaveStatus: (saveStatus) => set({ saveStatus }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),

  resetCustomizer: () =>
    set({
      customization: initialCustomization,
      activeTab: "theme",
      selectedStickerId: null,
      stickerCategory: "all",
      previewDataUrl: null,
      isRendering: false,
      isGeneratingGif: false,
      gifProgress: 0,
      generatedGifUrl: null,
      saveStatus: "idle",
      errorMessage: null,
    }),
}));
