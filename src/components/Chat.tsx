'use client';

import { useState, useRef, useEffect } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { getSocket } from '@/lib/socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import ServerConfig from './ServerConfig';
import { 
  STORAGE_KEYS, 
  DEFAULTS, 
  MESSAGE_CONFIG, 
  STATUS_MESSAGES,
  UI_CONFIG 
} from '@/config/app.config';

interface ChatProps {
  currentUser: string;
}

export default function Chat({ currentUser }: ChatProps) {
  const { messages, sendMessage, isConnected, connectionStatus } = useMessages(currentUser);
  const [isTyping, setIsTyping] = useState(false);
  const [chatName, setChatName] = useState(DEFAULTS.CHAT_NAME);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Load chat name from localStorage after hydration
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT_NAME);
    if (saved) {
      setChatName(saved);
    }
  }, []);

  const handleChatNameChange = (name: string) => {
    setChatName(name);
    localStorage.setItem(STORAGE_KEYS.CHAT_NAME, name);
  };

  const handleSendMessage = (text: string) => {
    if (text.trim()) {
      sendMessage({
        text: text.trim(),
        sender: currentUser,
        type: 'text',
      });
    }
  };

  const handleSendImage = (imageData: string) => {
    sendMessage({
      image: imageData,
      sender: currentUser,
      type: 'image',
    });
  };

  const handleSendAudio = (audioData: string) => {
    sendMessage({
      audio: audioData,
      sender: currentUser,
      type: 'audio',
    });
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('typing', { sender: currentUser });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        const currentSocket = getSocket();
        if (currentSocket && currentSocket.connected) {
          currentSocket.emit('stop-typing');
        }
        setIsTyping(false);
      }, MESSAGE_CONFIG.TYPING_TIMEOUT);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      const handleTyping = () => setIsTyping(true);
      const handleStopTyping = () => setIsTyping(false);

      socket.on('typing', handleTyping);
      socket.on('stop-typing', handleStopTyping);

      return () => {
        socket.off('typing', handleTyping);
        socket.off('stop-typing', handleStopTyping);
      };
    }
  }, []);

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 blue:opacity-10 purple:opacity-10 green:opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: UI_CONFIG.BACKGROUND.PATTERN_IMAGE,
          backgroundSize: UI_CONFIG.BACKGROUND.PATTERN_SIZE
        }} />
      </div>

      <ChatHeader 
        isConnected={isConnected} 
        chatName={chatName}
        onChatNameChange={handleChatNameChange}
      />
      
      {connectionStatus === 'connecting' && (
        <div className="relative px-6 py-3 bg-amber-500/10 dark:bg-amber-500/20 blue:bg-amber-500/20 purple:bg-amber-500/20 green:bg-amber-500/20 border-b border-amber-500/20 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 blue:text-amber-200 purple:text-amber-200 green:text-amber-200 text-sm text-center backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            {STATUS_MESSAGES.CONNECTING}
          </div>
        </div>
      )}
      
      {connectionStatus === 'disconnected' && !isConnected && (
        <div className="relative px-6 py-3 bg-red-500/10 dark:bg-red-500/20 blue:bg-red-500/20 purple:bg-red-500/20 green:bg-red-500/20 border-b border-red-500/20 dark:border-red-500/30 text-red-700 dark:text-red-300 blue:text-red-200 purple:text-red-200 green:text-red-200 text-sm text-center backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {STATUS_MESSAGES.DISCONNECTED}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden relative z-10">
        <MessageList messages={messages} currentUser={currentUser} />
        {isTyping && (
          <div className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 blue:text-blue-300 purple:text-purple-300 green:text-green-300 italic flex items-center gap-2">
            <div className="flex gap-1">
              {UI_CONFIG.ANIMATION.TYPING_DOTS.DELAYS.map((delay, index) => (
                <div 
                  key={index}
                  className="w-1 h-1 bg-current rounded-full animate-bounce" 
                  style={{ animationDelay: `${delay}ms` }} 
                />
              ))}
            </div>
            {STATUS_MESSAGES.TYPING}
          </div>
        )}
      </div>

      <MessageInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        onSendAudio={handleSendAudio}
        onTyping={handleTyping}
      />
    </div>
  );
}
