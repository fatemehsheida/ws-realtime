'use client';

import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} px-4 sm:px-6 py-1 group`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-3xl px-4 sm:px-5 py-2.5 sm:py-3 shadow-lg transform transition-all hover:scale-[1.02] ${
          isOwn
            ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white rounded-br-md blue:from-blue-600 blue:via-blue-500 blue:to-blue-700 purple:from-purple-600 purple:via-purple-500 purple:to-purple-700 green:from-green-600 green:via-green-500 green:to-green-700'
            : 'bg-white/95 dark:bg-gray-800/95 blue:bg-blue-900/70 purple:bg-purple-900/70 green:bg-green-900/70 text-gray-900 dark:text-white blue:text-blue-50 purple:text-purple-50 green:text-green-50 rounded-bl-md backdrop-blur-sm border-2 border-gray-200/60 dark:border-gray-700/60 blue:border-blue-800/60 purple:border-purple-800/60 green:border-green-800/60'
        }`}
      >
        {!isOwn && (
          <div className="text-xs font-bold mb-1.5 opacity-90 text-gray-700 dark:text-gray-300 blue:text-blue-200 purple:text-purple-200 green:text-green-200">
            {message.sender}
          </div>
        )}

        {message.type === 'text' && message.text && (
          <p className="whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-[15px]">{message.text}</p>
        )}

        {message.type === 'image' && message.image && (
          <div className="my-2 -mx-1 rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 blue:border-blue-800/50 purple:border-purple-800/50 green:border-green-800/50">
            <img
              src={message.image}
              alt="Sent image"
              className="max-w-full h-auto block bg-gray-100 dark:bg-gray-900 blue:bg-blue-950 purple:bg-purple-950 green:bg-green-950"
            />
          </div>
        )}

        {message.type === 'audio' && message.audio && (
          <div className="my-2">
            <audio 
              controls 
              className="w-full h-10 rounded-xl [&::-webkit-media-controls-panel]:bg-gray-100 dark:[&::-webkit-media-controls-panel]:bg-gray-800 blue:[&::-webkit-media-controls-panel]:bg-blue-900 purple:[&::-webkit-media-controls-panel]:bg-purple-900 green:[&::-webkit-media-controls-panel]:bg-green-900"
            >
              <source src={message.audio} type="audio/webm" />
              <source src={message.audio} type="audio/mpeg" />
              مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
            </audio>
          </div>
        )}

        <div
          className={`text-[10px] sm:text-[11px] mt-2 flex items-center gap-1 ${
            isOwn ? 'text-white/80' : 'text-gray-500 dark:text-gray-400 blue:text-blue-300/80 purple:text-purple-300/80 green:text-green-300/80'
          }`}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
