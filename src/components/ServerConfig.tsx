'use client';

import { useState, useEffect } from 'react';
import { 
  STORAGE_KEYS, 
  SOCKET_CONFIG, 
  DEFAULTS,
  ERROR_MESSAGES,
  LABELS,
  TIPS,
  PLACEHOLDERS
} from '@/config/app.config';

export default function ServerConfig() {
  const [serverUrl, setServerUrl] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  // Load server URL from localStorage after hydration
  useEffect(() => {
    const initializeServerUrl = () => {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_SERVER_URL);
      if (saved) {
        setServerUrl(saved);
      } else {
        const hostname = window.location.hostname;
        setServerUrl(DEFAULTS.SERVER_URL(hostname, SOCKET_CONFIG.DEFAULT_PORT));
      }
    };
    
    // Use requestAnimationFrame to defer state update
    requestAnimationFrame(initializeServerUrl);
  }, []);

  useEffect(() => {
    if (showConfig) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showConfig]);

  const handleSave = () => {
    if (serverUrl.trim()) {
      localStorage.setItem(STORAGE_KEYS.CHAT_SERVER_URL, serverUrl.trim());
      alert(ERROR_MESSAGES.SERVER_SAVED);
      window.location.reload();
    }
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEYS.CHAT_SERVER_URL);
    const hostname = window.location.hostname;
    setServerUrl(DEFAULTS.SERVER_URL(hostname, SOCKET_CONFIG.DEFAULT_PORT));
    alert(ERROR_MESSAGES.SERVER_RESET);
    window.location.reload();
  };

  if (!showConfig) {
    return (
      <button
        onClick={() => setShowConfig(true)}
        className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 blue:bg-blue-900/50 purple:bg-purple-900/50 green:bg-green-900/50 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 blue:hover:bg-blue-800/70 purple:hover:bg-purple-800/70 green:hover:bg-green-800/70 transition-all backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 blue:border-blue-800/50 purple:border-purple-800/50 green:border-green-800/50 shadow-md transform hover:scale-105 active:scale-95 flex-shrink-0"
        title={LABELS.SERVER_CONFIG}
        aria-label={LABELS.SERVER_CONFIG}
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300 blue:text-blue-200 purple:text-purple-200 green:text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 dark:bg-black/80 blue:bg-black/80 purple:bg-black/80 green:bg-black/80 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
        onClick={() => setShowConfig(false)}
      />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white/95 dark:bg-gray-900/95 blue:bg-blue-950/95 purple:bg-purple-950/95 green:bg-green-950/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200/50 dark:border-gray-700/50 blue:border-blue-800/50 purple:border-purple-800/50 green:border-green-800/50 pointer-events-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 blue:from-blue-100 blue:to-blue-200 purple:from-purple-100 purple:to-purple-200 green:from-green-100 green:to-green-200 bg-clip-text text-transparent">
              {LABELS.SERVER_CONFIG}
            </h2>
            <button
              onClick={() => setShowConfig(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 blue:hover:text-blue-200 purple:hover:text-purple-200 green:hover:text-green-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              aria-label={LABELS.CLOSE}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white blue:text-blue-50 purple:text-purple-50 green:text-green-50 mb-2">
              {LABELS.SERVER_ADDRESS}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 blue:text-blue-200 purple:text-purple-200 green:text-green-200 mb-4">
              {LABELS.SERVER_ADDRESS_DESCRIPTION}
            </p>
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder={PLACEHOLDERS.SERVER_URL}
              className="w-full px-5 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 blue:border-blue-800/50 purple:border-purple-800/50 green:border-green-800/50 bg-white/50 dark:bg-gray-800/50 blue:bg-blue-900/30 purple:bg-purple-900/30 green:bg-green-900/30 text-gray-900 dark:text-white blue:text-blue-50 purple:text-purple-50 green:text-green-50 placeholder-gray-400 dark:placeholder-gray-500 blue:placeholder-blue-300/70 purple:placeholder-purple-300/70 green:placeholder-green-300/70 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 backdrop-blur-sm transition-all text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/50 font-medium text-sm sm:text-base"
            >
              {LABELS.SAVE}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 blue:bg-blue-900/50 purple:bg-purple-900/50 green:bg-green-900/50 text-gray-900 dark:text-white blue:text-blue-50 purple:text-purple-50 green:text-green-50 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 blue:hover:bg-blue-800/70 purple:hover:bg-purple-800/70 green:hover:bg-green-800/70 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium text-sm sm:text-base"
            >
              {LABELS.RESET}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 blue:text-blue-300 purple:text-purple-300 green:text-green-300 mt-6 text-center">
            {TIPS.CONNECTION_GUIDE}
          </p>
        </div>
      </div>
    </>
  );
}
