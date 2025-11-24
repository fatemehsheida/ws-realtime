'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/chat';
import { connectSocket, getSocket, disconnectSocket } from '@/lib/socket';
import { STORAGE_KEYS, MESSAGE_CONFIG } from '@/config/app.config';

export const useMessages = (currentUser: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Load messages from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMessages(parsed);
      } catch (e) {
        console.error('Error loading messages from storage:', e);
      }
    }
  }, []);

  // Save messages to localStorage (keep only last N messages)
  const saveMessages = useCallback((msgs: Message[]) => {
    try {
      const messagesToSave = msgs.slice(-MESSAGE_CONFIG.MAX_STORED_MESSAGES);
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messagesToSave));
    } catch (e) {
      console.error('Error saving messages to storage:', e);
      // If quota exceeded, try to save fewer messages
      try {
        const messagesToSave = msgs.slice(-MESSAGE_CONFIG.FALLBACK_STORED_MESSAGES);
        localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messagesToSave));
      } catch (e2) {
        console.error('Error saving reduced messages:', e2);
      }
    }
  }, []);

  // Connect to socket
  useEffect(() => {
    const socket = connectSocket();
    setConnectionStatus('connecting');

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      console.log('✅ Connected to server');
    };

    const handleDisconnect = (reason: string) => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      console.log('❌ Disconnected from server:', reason);
      
      // Try to reconnect if it was an unexpected disconnect
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        setTimeout(() => {
          socket.connect();
        }, MESSAGE_CONFIG.TYPING_TIMEOUT);
      }
    };

    const handleConnectError = (error: Error) => {
      console.error('Connection error:', error);
      setConnectionStatus('disconnected');
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    socket.on('messages', (msgs: Message[]) => {
      setMessages(msgs);
      saveMessages(msgs);
    });

    socket.on('message', (message: Message) => {
      setMessages((prev) => {
        const updated = [...prev, message];
        saveMessages(updated);
        return updated;
      });
    });

    // Check initial connection state
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('messages');
      socket.off('message');
    };
  }, [saveMessages]);

  const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('message', message);
    } else {
      // Fallback: save locally if not connected
      const newMessage: Message = {
        ...message,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => {
        const updated = [...prev, newMessage];
        saveMessages(updated);
        return updated;
      });
    }
  }, [saveMessages]);

  return { messages, sendMessage, isConnected: isConnected && connectionStatus === 'connected', connectionStatus };
};
