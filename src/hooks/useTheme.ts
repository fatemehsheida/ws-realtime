'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'blue' | 'purple' | 'green';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage and system preference
    const stored = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = stored || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'blue', 'purple', 'green');
    
    // Add new theme class
    root.classList.add(newTheme);
    
    // Also add dark class for dark themes
    if (newTheme === 'dark' || newTheme === 'blue' || newTheme === 'purple' || newTheme === 'green') {
      root.classList.add('dark');
    }
  }, []);

  const setThemeAndSave = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const themes: Theme[] = ['light', 'dark', 'blue', 'purple', 'green'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemeAndSave(themes[nextIndex]);
  }, [theme, setThemeAndSave]);

  return { theme, setTheme: setThemeAndSave, toggleTheme, mounted };
};
