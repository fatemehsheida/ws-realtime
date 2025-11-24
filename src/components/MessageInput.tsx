'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  UI_CONFIG, 
  AUDIO_CONFIG, 
  ERROR_MESSAGES,
  PLACEHOLDERS,
  LABELS
} from '@/config/app.config';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onSendImage: (imageData: string) => void;
  onSendAudio: (audioData: string) => void;
  onTyping: () => void;
}

export default function MessageInput({
  onSendMessage,
  onSendImage,
  onSendAudio,
  onTyping,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = `${UI_CONFIG.TEXTAREA.MIN_HEIGHT}px`;
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${UI_CONFIG.TEXTAREA.MIN_HEIGHT}px`;
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, UI_CONFIG.TEXTAREA.MAX_HEIGHT)}px`;
    }
  }, [text]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSendImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: AUDIO_CONFIG.ECHO_CANCELLATION,
          noiseSuppression: AUDIO_CONFIG.NOISE_SUPPRESSION,
          sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
        } 
      });
      
      streamRef.current = stream;
      
      const options: MediaRecorderOptions = {
        mimeType: MediaRecorder.isTypeSupported(AUDIO_CONFIG.MIME_TYPES.PRIMARY) 
          ? AUDIO_CONFIG.MIME_TYPES.PRIMARY 
          : AUDIO_CONFIG.MIME_TYPES.FALLBACK,
      };
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: mediaRecorder.mimeType || AUDIO_CONFIG.MIME_TYPES.PRIMARY
          });
          
          if (audioBlob.size > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (reader.result) {
                onSendAudio(reader.result as string);
              }
            };
            reader.onerror = () => {
              console.error('Error reading audio blob');
              alert(ERROR_MESSAGES.AUDIO_READ);
            };
            reader.readAsDataURL(audioBlob);
          }
        }
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = () => {
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(AUDIO_CONFIG.CHUNK_INTERVAL);
      setIsRecording(true);
    } catch (error: any) {
      setIsRecording(false);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert(ERROR_MESSAGES.MICROPHONE_PERMISSION);
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        alert(ERROR_MESSAGES.MICROPHONE_NOT_FOUND);
      } else {
        alert(ERROR_MESSAGES.MICROPHONE_ACCESS(error.message));
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative z-20 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 blue:bg-blue-950/80 purple:bg-purple-950/80 green:bg-green-950/80 border-t border-gray-200/50 dark:border-gray-700/50 blue:border-blue-800/50 purple:border-purple-800/50 green:border-green-800/50 shadow-2xl">
      <form onSubmit={handleSubmit} className="px-6 py-4 flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={PLACEHOLDERS.MESSAGE}
            className="w-full px-5 py-4 pr-14 rounded-2xl border-2 border-gray-200 dark:border-gray-700 blue:border-blue-800/50 purple:border-purple-800/50 green:border-green-800/50 bg-white/50 dark:bg-gray-800/50 blue:bg-blue-900/30 purple:bg-purple-900/30 green:bg-green-900/30 text-gray-900 dark:text-white blue:text-blue-50 purple:text-purple-50 green:text-green-50 placeholder-gray-400 dark:placeholder-gray-500 blue:placeholder-blue-300/70 purple:placeholder-purple-300/70 green:placeholder-green-300/70 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 resize-none overflow-hidden backdrop-blur-sm shadow-inner transition-all"
            rows={1}
            style={{ 
              minHeight: `${UI_CONFIG.TEXTAREA.MIN_HEIGHT}px`, 
              maxHeight: `${UI_CONFIG.TEXTAREA.MAX_HEIGHT}px` 
            }}
          />
        </div>

        <div className="flex gap-2 items-end">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 blue:bg-blue-900/50 purple:bg-purple-900/50 green:bg-green-900/50 hover:bg-gray-200 dark:hover:bg-gray-700 blue:hover:bg-blue-800/70 purple:hover:bg-purple-800/70 green:hover:bg-green-800/70 transition-all transform hover:scale-110 active:scale-95 shadow-md"
            aria-label={LABELS.SEND_IMAGE}
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300 blue:text-blue-200 purple:text-purple-200 green:text-green-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <button
            type="button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`p-3.5 rounded-xl transition-all transform hover:scale-110 active:scale-95 shadow-md ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/50'
                : 'bg-gray-100 dark:bg-gray-800 blue:bg-blue-900/50 purple:bg-purple-900/50 green:bg-green-900/50 hover:bg-gray-200 dark:hover:bg-gray-700 blue:hover:bg-blue-800/70 purple:hover:bg-purple-800/70 green:hover:bg-green-800/70'
            }`}
            aria-label={LABELS.RECORD_AUDIO}
          >
            <svg
              className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-gray-600 dark:text-gray-300 blue:text-blue-200 purple:text-purple-200 green:text-green-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            type="submit"
            disabled={!text.trim()}
            className="p-3.5 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110 active:scale-95 shadow-lg shadow-blue-500/50 disabled:shadow-none"
            aria-label={LABELS.SEND_MESSAGE}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
