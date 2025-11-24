/**
 * Application Configuration
 * تمام تنظیمات و مقادیر استاتیک در این فایل قرار دارند
 */

// Storage Keys
export const STORAGE_KEYS = {
  CHAT_NAME: 'chat-name',
  CHAT_USERNAME: 'chat-username',
  CHAT_SERVER_URL: 'chat-server-url',
  CHAT_MESSAGES: 'chat-messages',
} as const;

// Socket Configuration
export const SOCKET_CONFIG = {
  DEFAULT_PORT: 3001,
  DEFAULT_HOST: 'localhost',
  RECONNECTION_DELAY: 1000,
  RECONNECTION_ATTEMPTS: 5,
  TRANSPORTS: ['websocket', 'polling'] as const,
} as const;

// Message Configuration
export const MESSAGE_CONFIG = {
  MAX_STORED_MESSAGES: 50,
  FALLBACK_STORED_MESSAGES: 25,
  TYPING_TIMEOUT: 1000,
} as const;

// UI Configuration
export const UI_CONFIG = {
  TEXTAREA: {
    MIN_HEIGHT: 56,
    MAX_HEIGHT: 120,
  },
  ANIMATION: {
    TYPING_DOTS: {
      DELAYS: [0, 150, 300],
    },
  },
  BACKGROUND: {
    PATTERN_SIZE: '40px 40px',
    PATTERN_IMAGE: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
    OPACITY: {
      LIGHT: 0.05,
      DARK: 0.1,
      THEMED: 0.1,
    },
  },
} as const;

// Audio Recording Configuration
export const AUDIO_CONFIG = {
  ECHO_CANCELLATION: true,
  NOISE_SUPPRESSION: true,
  SAMPLE_RATE: 44100,
  CHUNK_INTERVAL: 100,
  MIME_TYPES: {
    PRIMARY: 'audio/webm',
    FALLBACK: 'audio/mp4',
  },
} as const;

// Default Values
export const DEFAULTS = {
  CHAT_NAME: 'چت ریل‌تایم',
  SERVER_URL: (hostname: string, port: number = SOCKET_CONFIG.DEFAULT_PORT) => {
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://localhost:${port}`;
    }
    return `http://${hostname}:${port}`;
  },
} as const;

// Status Messages
export const STATUS_MESSAGES = {
  CONNECTING: 'در حال اتصال به سرور...',
  DISCONNECTED: 'اتصال به سرور قطع شده است. در حال تلاش برای اتصال مجدد...',
  ONLINE: 'آنلاین',
  OFFLINE: 'آفلاین',
  TYPING: 'در حال تایپ...',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  MICROPHONE_PERMISSION: 'لطفاً دسترسی به میکروفون را در تنظیمات مرورگر فعال کنید',
  MICROPHONE_NOT_FOUND: 'میکروفون یافت نشد. لطفاً یک میکروفون متصل کنید',
  MICROPHONE_ACCESS: (message: string) => `خطا در دسترسی به میکروفون: ${message}`,
  AUDIO_READ: 'خطا در خواندن فایل صوتی',
  SERVER_SAVED: 'آدرس سرور ذخیره شد. صفحه را رفرش کنید.',
  SERVER_RESET: 'آدرس سرور به حالت پیش‌فرض بازگشت. صفحه را رفرش کنید.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  WELCOME: 'به چت ریل‌تایم خوش آمدید',
  ENTER_NAME: 'لطفاً نام خود را وارد کنید',
  START_CHAT: 'شروع چت',
} as const;

// Placeholders
export const PLACEHOLDERS = {
  USERNAME: 'نام شما...',
  MESSAGE: 'پیام خود را بنویسید...',
  SERVER_URL: 'http://192.168.1.100:3001',
} as const;

// Labels
export const LABELS = {
  SERVER_CONFIG: 'تنظیمات سرور',
  SERVER_ADDRESS: 'آدرس سرور',
  SERVER_ADDRESS_DESCRIPTION: 'برای اتصال به سرور دوست خود، آدرس سرور را وارد کنید:',
  SAVE: 'ذخیره',
  RESET: 'بازنشانی',
  CLOSE: 'بستن',
  EDIT_CHAT_NAME: 'تغییر نام چت',
  CLICK_TO_EDIT_NAME: 'کلیک برای تغییر نام',
  SEND_IMAGE: 'Send image',
  RECORD_AUDIO: 'Record audio',
  SEND_MESSAGE: 'Send message',
} as const;

// Tips
export const TIPS = {
  CONNECTION_GUIDE: '💡 برای راهنمای کامل، فایل CONNECTION_GUIDE.md را مطالعه کنید',
} as const;

