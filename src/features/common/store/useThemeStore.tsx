"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'garden' | 'forest';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/**
 * Theme store using Zustand with localStorage persistence.
 * Handles SSR/hydration safely by using Zustand's persist middleware.
 */
const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'garden',
      setTheme: (theme: Theme) => {
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;