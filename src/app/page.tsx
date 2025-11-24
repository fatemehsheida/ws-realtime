'use client';

import { useState, useEffect } from 'react';
import Chat from '@/components/Chat';
import { connectSocket } from '@/lib/socket';
import { STORAGE_KEYS, SUCCESS_MESSAGES, PLACEHOLDERS, UI_CONFIG } from '@/config/app.config';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isReady, setIsReady] = useState(false);

  // Load username from localStorage after hydration
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT_USERNAME);
    if (saved) {
      setUsername(saved);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (isReady && username) {
      connectSocket();
    }
  }, [isReady, username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem(STORAGE_KEYS.CHAT_USERNAME, username.trim());
      setIsReady(true);
      connectSocket();
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 blue:from-blue-950 blue:via-blue-900 blue:to-indigo-950 purple:from-purple-950 purple:via-purple-900 purple:to-pink-950 green:from-green-950 green:via-green-900 green:to-emerald-950" />
        <div className="absolute inset-0 opacity-10 dark:opacity-5 blue:opacity-10 purple:opacity-10 green:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: UI_CONFIG.BACKGROUND.PATTERN_IMAGE,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 bg-white/90 dark:bg-gray-900/90 blue:bg-blue-950/90 purple:bg-purple-950/90 green:bg-green-950/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-gray-200/50 dark:border-gray-700/50 blue:border-blue-800/50 purple:border-purple-800/50 green:border-green-800/50">
          <div className="text-center mb-8">
            <div className="text-7xl mb-6 animate-bounce">💬</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
              {SUCCESS_MESSAGES.WELCOME}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 blue:text-blue-300 purple:text-purple-300 green:text-green-300">
              {SUCCESS_MESSAGES.ENTER_NAME}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={PLACEHOLDERS.USERNAME}
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 blue:border-blue-800/50 purple:border-purple-800/50 green:border-green-800/50 bg-white/50 dark:bg-gray-800/50 blue:bg-blue-900/30 purple:bg-purple-900/30 green:bg-green-900/30 text-gray-900 dark:text-white blue:text-blue-50 purple:text-purple-50 green:text-green-50 placeholder-gray-400 dark:placeholder-gray-500 blue:placeholder-blue-300/70 purple:placeholder-purple-300/70 green:placeholder-green-300/70 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 backdrop-blur-sm transition-all text-lg"
              autoFocus
            />
            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-lg hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/50 disabled:shadow-none"
            >
              {SUCCESS_MESSAGES.START_CHAT}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <Chat currentUser={username} />;
}
