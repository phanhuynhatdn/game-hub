/** A single message in the global chat room */
export interface ChatMessage {
  id: string;
  message: string;
  createdAt: string;
  user: {
    username: string;
    avatarUrl: string | null;
  };
}
