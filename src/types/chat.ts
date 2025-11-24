export interface Message {
  id: string;
  text?: string;
  image?: string;
  audio?: string;
  sender: string;
  timestamp: string;
  type: 'text' | 'image' | 'audio';
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

