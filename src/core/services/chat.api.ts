import { http } from './http.service';
import type { ChatMessage } from '../../types/chat.types';

/** All REST calls related to the global chat room */
export const chatApi = {
  /** GET /chat/history — fetch last N messages, ordered oldest → newest */
  getHistory(): Promise<ChatMessage[]> {
    return http.get<ChatMessage[]>('/chat/history');
  },
};
