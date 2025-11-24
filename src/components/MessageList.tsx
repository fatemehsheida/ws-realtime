'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUser: string;
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center px-4">
          <div className="text-6xl sm:text-7xl mb-4 sm:mb-6 animate-bounce">👋</div>
          <p className="text-base sm:text-lg font-medium text-gray-500 dark:text-gray-400 blue:text-blue-300 purple:text-purple-300 green:text-green-300">
            شروع به چت کنید!
          </p>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 blue:text-blue-400/70 purple:text-purple-400/70 green:text-green-400/70 mt-2">
            پیام خود را در پایین بنویسید
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 bg-gradient-to-b from-transparent via-transparent to-transparent light:bg-gradient-to-b light:from-blue-50/40 light:via-indigo-50/30 light:to-purple-50/40 dark:bg-gradient-to-b dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 blue:bg-gradient-to-b blue:from-blue-950/50 blue:via-blue-900/30 blue:to-indigo-950/50 purple:bg-gradient-to-b purple:from-purple-950/50 purple:via-purple-900/30 purple:to-pink-950/50 green:bg-gradient-to-b green:from-green-950/50 green:via-green-900/30 green:to-emerald-950/50">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.sender === currentUser}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
