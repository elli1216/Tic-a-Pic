"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'nord' | 'sunset';

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
      theme: 'nord',
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