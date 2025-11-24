'use client';

import { useState } from 'react';
import ThemeSelector from './ThemeSelector';
import ServerConfig from './ServerConfig';
import { STATUS_MESSAGES, LABELS } from '@/config/app.config';

interface ChatHeaderProps {
  isConnected: boolean;
  chatName: string;
  onChatNameChange: (name: string) => void;
}

export default function ChatHeader({ isConnected, chatName, onChatNameChange }: ChatHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(chatName);

  const handleSave = () => {
    if (editName.trim()) {
      onChatNameChange(editName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(chatName);
    setIsEditing(false);
  };

  return (
    <header className="relative z-20 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 blue:bg-blue-950/80 purple:bg-purple-950/80 green:bg-green-950/80 border-b border-gray-200/50 dark:border-gray-700/50 blue:border-blue-800/50 purple:border-purple-800/50 green:border-green-800/50 shadow-lg">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-transform">
              💬
            </div>
            {isConnected && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 blue:border-blue-950 purple:border-purple-950 green:border-green-950 animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  className="flex-1 px-4 py-2 text-lg font-bold bg-white/50 dark:bg-gray-800/50 blue:bg-blue-900/50 purple:bg-purple-900/50 green:bg-green-900/50 border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white blue:text-blue-50 purple:text-purple-50 green:text-green-50 backdrop-blur-sm"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                  title={LABELS.SAVE}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title={LABELS.CLOSE}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1
                  onClick={() => setIsEditing(true)}
                  className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 blue:from-blue-100 blue:to-blue-200 purple:from-purple-100 purple:to-purple-200 green:from-green-100 green:to-green-200 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity truncate"
                  title={LABELS.CLICK_TO_EDIT_NAME}
                >
                  {chatName}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 blue:hover:text-blue-200 purple:hover:text-purple-200 green:hover:text-green-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                  title={LABELS.EDIT_CHAT_NAME}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} shadow-lg ${isConnected ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 blue:text-blue-300 purple:text-purple-300 green:text-green-300">
                {isConnected ? STATUS_MESSAGES.ONLINE : STATUS_MESSAGES.OFFLINE}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <ServerConfig />
          <ThemeSelector />
        </div>
      </div>
    </header>
  );
}
