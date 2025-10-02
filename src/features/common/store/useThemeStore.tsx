"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const themes = {
  light: 'tic-light',
  dark: 'tic-dark'
} as const;
export type Theme = (typeof themes)[keyof typeof themes];

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  hasHydrated: boolean;
}

/**
 * Theme store using Zustand with localStorage persistence.
 * Handles SSR/hydration safely by tracking hydration state and preventing server-side localStorage access.
 */
const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: themes.light,
      hasHydrated: false,
      setTheme: (theme: Theme) => {
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);

export default useThemeStore;