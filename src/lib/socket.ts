import { io, Socket } from 'socket.io-client';
import { 
  STORAGE_KEYS, 
  SOCKET_CONFIG, 
  DEFAULTS 
} from '@/config/app.config';

let socket: Socket | null = null;

// Get server URL from environment or use default
const getServerUrl = () => {
  if (typeof window !== 'undefined') {
    // Check if we have a custom server URL in localStorage
    const customUrl = localStorage.getItem(STORAGE_KEYS.CHAT_SERVER_URL);
    if (customUrl) {
      return customUrl;
    }
    
    // Use current hostname with configured port
    const hostname = window.location.hostname;
    return DEFAULTS.SERVER_URL(hostname, SOCKET_CONFIG.DEFAULT_PORT);
  }
  return process.env.NEXT_PUBLIC_SOCKET_URL || DEFAULTS.SERVER_URL(SOCKET_CONFIG.DEFAULT_HOST, SOCKET_CONFIG.DEFAULT_PORT);
};

export const connectSocket = (): Socket => {
  if (!socket) {
    const serverUrl = getServerUrl();
    console.log('Connecting to server:', serverUrl);
    socket = io(serverUrl, {
      transports: [...SOCKET_CONFIG.TRANSPORTS],
      reconnection: true,
      reconnectionDelay: SOCKET_CONFIG.RECONNECTION_DELAY,
      reconnectionAttempts: SOCKET_CONFIG.RECONNECTION_ATTEMPTS,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};

