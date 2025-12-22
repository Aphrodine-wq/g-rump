import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// For physical devices, replace with your computer's local IP
// Find it with: ipconfig (Windows) or ifconfig (Mac/Linux)
// Current IP: 172.20.10.2
const API_BASE_URL = __DEV__ 
  ? (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
      ? 'http://172.20.10.2:3000' // Your local IP for Expo Go on iPhone
      : 'http://localhost:3000')
  : 'https://your-production-api.com';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'grump';
  timestamp: string; // Serialized date
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  errorMessage: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearSession: () => void;
}

export const useChat = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isTyping: false,
      errorMessage: null,

      sendMessage: async (text: string) => {
        const userMessage: Message = {
          id: `msg-${Date.now()}`,
          content: text,
          sender: 'user',
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, userMessage],
          isTyping: true,
          errorMessage: null,
        }));

        try {
          const conversationHistory = get().messages.map((msg) => ({
            sender: msg.sender,
            content: msg.content,
            timestamp: msg.timestamp,
          }));

          const response = await axios.post(`${API_BASE_URL}/api/chat`, {
            message: text,
            conversationHistory,
          });

          const grumpMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            content: response.data.response,
            sender: 'grump',
            timestamp: new Date(response.data.timestamp).toISOString(),
          };

          set((state) => ({
            messages: [...state.messages, grumpMessage],
            isTyping: false,
          }));
        } catch (error: any) {
          set({
            isTyping: false,
            errorMessage: error.response?.data?.error?.message || 'Failed to send message',
          });
        }
      },

      clearSession: () => {
        set({
          messages: [],
          errorMessage: null,
        });
      },
    }),
    {
      name: 'grump-chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ messages: state.messages }), // Only persist messages
    }
  )
);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

