'use client';

import { useEffect } from 'react';
import { Theme } from '@/hooks/useTheme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply theme immediately on mount to prevent flash
    const applyTheme = () => {
      const stored = localStorage.getItem('theme') as Theme | null;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = stored || (systemPrefersDark ? 'dark' : 'light');
      
      const root = document.documentElement;
      
      // Remove all theme classes
      root.classList.remove('light', 'dark', 'blue', 'purple', 'green');
      
      // Add new theme class
      root.classList.add(initialTheme);
      
      // Also add dark class for dark themes
      if (initialTheme === 'dark' || initialTheme === 'blue' || initialTheme === 'purple' || initialTheme === 'green') {
        root.classList.add('dark');
      }
    };

    // Apply immediately
    applyTheme();

    // Listen for system theme changes (only if no theme is stored)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!localStorage.getItem('theme')) {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return <>{children}</>;
}
