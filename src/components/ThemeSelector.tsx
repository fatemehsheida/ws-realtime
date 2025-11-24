'use client';

import { useState, useEffect, useRef, ReactElement } from 'react';
import { useTheme, Theme } from '@/hooks/useTheme';

// Google Material Design colors and icons
const themes: { 
  value: Theme; 
  name: string; 
  icon: ReactElement; 
  color: string;
  bgGradient: string;
  hoverBg: string;
  activeBg: string;
  borderColor: string;
}[] = [
  { 
    value: 'light', 
    name: 'روشن', 
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
      </svg>
    ),
    color: '#FBBC04', // Google Yellow
    bgGradient: 'from-amber-400 via-yellow-400 to-orange-400',
    hoverBg: 'hover:bg-amber-50/80 dark:hover:bg-amber-950/30',
    activeBg: 'bg-gradient-to-r from-amber-100/90 to-yellow-100/90 dark:from-amber-900/40 dark:to-yellow-900/40',
    borderColor: 'border-amber-300/60 dark:border-amber-700/60'
  },
  { 
    value: 'dark', 
    name: 'تاریک', 
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.34 2.02C6.59 1.82 2 6.42 2 12c0 5.52 4.48 10 10 10 3.71 0 6.93-2.02 8.66-5.02-7.51-.25-13.12-6.11-13.12-13.11 0-.21 0-.42.01-.63.49-.31 1.02-.54 1.58-.72-.09.23-.16.47-.16.72 0 1.08.9 1.96 2 1.96s2-.88 2-1.96c0-.25-.07-.49-.16-.72.56.18 1.09.41 1.58.72.01.21.01.42.01.63 0 7-5.61 12.86-13.12 13.11C5.07 18.98 8.29 21 12 21c5.52 0 10-4.48 10-10 0-5.58-4.59-10.18-10.34-9.98z"/>
      </svg>
    ),
    color: '#4285F4', // Google Blue
    bgGradient: 'from-slate-600 via-gray-700 to-slate-800',
    hoverBg: 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50',
    activeBg: 'bg-gradient-to-r from-slate-100/90 to-gray-100/90 dark:from-slate-800/50 dark:to-gray-800/50',
    borderColor: 'border-slate-300/60 dark:border-slate-600/60'
  },
  { 
    value: 'blue', 
    name: 'آبی', 
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
    ),
    color: '#4285F4', // Google Blue
    bgGradient: 'from-blue-500 via-blue-600 to-indigo-600',
    hoverBg: 'hover:bg-blue-50/80 dark:hover:bg-blue-950/30',
    activeBg: 'bg-gradient-to-r from-blue-100/90 to-indigo-100/90 dark:from-blue-900/40 dark:to-indigo-900/40',
    borderColor: 'border-blue-300/60 dark:border-blue-700/60'
  },
  { 
    value: 'purple', 
    name: 'بنفش', 
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    ),
    color: '#9C27B0', // Material Purple
    bgGradient: 'from-purple-500 via-purple-600 to-pink-500',
    hoverBg: 'hover:bg-purple-50/80 dark:hover:bg-purple-950/30',
    activeBg: 'bg-gradient-to-r from-purple-100/90 to-pink-100/90 dark:from-purple-900/40 dark:to-pink-900/40',
    borderColor: 'border-purple-300/60 dark:border-purple-700/60'
  },
  { 
    value: 'green', 
    name: 'سبز', 
    icon: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    color: '#34A853', // Google Green
    bgGradient: 'from-green-500 via-emerald-500 to-teal-500',
    hoverBg: 'hover:bg-green-50/80 dark:hover:bg-green-950/30',
    activeBg: 'bg-gradient-to-r from-green-100/90 to-emerald-100/90 dark:from-green-900/40 dark:to-emerald-900/40',
    borderColor: 'border-green-300/60 dark:border-green-700/60'
  },
];

export default function ThemeSelector() {
  const { theme, setTheme, mounted } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 250; // Approximate dropdown height
      const dropdownWidth = 200;
      const padding = 8;
      
      // Calculate top position (prevent bottom overflow)
      let top = rect.bottom + padding;
      if (top + dropdownHeight > window.innerHeight) {
        // If dropdown would overflow bottom, show it above the button
        top = rect.top - dropdownHeight - padding;
        if (top < padding) {
          // If still doesn't fit, align to top with max height
          top = padding;
        }
      }
      
      // Calculate right position (prevent right overflow)
      let right = window.innerWidth - rect.right;
      if (right + dropdownWidth > window.innerWidth - padding) {
        right = Math.max(padding, window.innerWidth - dropdownWidth - padding);
      }
      
      setDropdownPosition({
        top: Math.max(padding, top),
        right: Math.max(padding, right)
      });
    }
  };

  // Handle body overflow
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        buttonRef.current &&
        dropdownRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  return (
    <div className="relative">
      {/* Main Toggle Button - Minimal */}
      <button
        ref={buttonRef}
        onClick={() => {
          if (!isOpen) {
            calculatePosition();
          }
          setIsOpen(!isOpen);
        }}
        className="group relative p-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 blue:bg-blue-900/60 purple:bg-purple-900/60 green:bg-green-900/60 hover:bg-white dark:hover:bg-gray-700 blue:hover:bg-blue-800 purple:hover:bg-purple-800 green:hover:bg-green-800 transition-all duration-200 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 blue:border-blue-700/50 purple:border-purple-700/50 green:border-green-700/50 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
        style={{ 
          boxShadow: isOpen ? `0 0 12px ${currentTheme.color}30` : undefined 
        }}
        aria-label="تغییر تم"
        title="تغییر تم"
      >
        {/* Icon container - Small */}
        <div 
          className={`relative w-7 h-7 rounded-lg bg-gradient-to-br ${currentTheme.bgGradient} flex items-center justify-center shadow-md transform group-hover:scale-110 transition-all duration-200`}
          style={{ color: 'white' }}
        >
          <div className="w-4 h-4">
            {currentTheme.icon}
          </div>
        </div>
      </button>

      {/* Dropdown Menu - Positioned to prevent overflow */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div 
            ref={dropdownRef}
            className="fixed z-[9999] bg-white/95 dark:bg-gray-900/95 blue:bg-blue-950/95 purple:bg-purple-950/95 green:bg-green-950/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 blue:border-blue-800/50 purple:border-purple-800/50 green:border-green-800/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`,
              width: '200px',
              maxHeight: 'calc(100vh - 16px)',
              boxShadow: `0 8px 32px rgba(0,0,0,0.2)`
            }}
          >
            {/* Theme Options - Compact */}
            <div className="p-2 space-y-1 max-h-[calc(100vh-32px)] overflow-y-auto">
              {themes.map((t) => {
                const isActive = theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value);
                      setIsOpen(false);
                    }}
                    className={`group relative w-full px-3 py-2.5 flex items-center gap-2.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${
                      isActive 
                        ? `${t.activeBg} shadow-md ring-1 ${t.borderColor}` 
                        : `${t.hoverBg} hover:shadow-sm`
                    }`}
                  >
                    {/* Active indicator background */}
                    {isActive && (
                      <div 
                        className={`absolute inset-0 bg-gradient-to-br ${t.bgGradient} opacity-10`}
                      />
                    )}
                    
                    {/* Icon - Small */}
                    <div 
                      className={`relative w-8 h-8 rounded-lg bg-gradient-to-br ${t.bgGradient} flex items-center justify-center shadow-md transform transition-all duration-200 ${
                        isActive 
                          ? 'scale-105 ring-2 ring-white/30' 
                          : 'group-hover:scale-105'
                      }`}
                      style={{ color: 'white' }}
                    >
                      <div className="w-4 h-4">
                        {t.icon}
                      </div>
                    </div>
                    
                    {/* Theme name - Small */}
                    <span className={`flex-1 text-right text-sm font-medium relative z-10 ${
                      isActive 
                        ? 'text-gray-900 dark:text-gray-50' 
                        : 'text-gray-700 dark:text-gray-300 blue:text-blue-200 purple:text-purple-200 green:text-green-200'
                    }`}>
                      {t.name}
                    </span>
                    
                    {/* Checkmark for active theme - Small */}
                    {isActive && (
                      <div 
                        className={`relative w-5 h-5 rounded-full bg-gradient-to-br ${t.bgGradient} flex items-center justify-center shadow-sm`}
                        style={{ color: 'white' }}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
