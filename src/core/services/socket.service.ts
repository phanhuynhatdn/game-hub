import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../constants/api.constants';
import type { ChatMessage } from '../../types/chat.types';

type MessageHandler = (message: ChatMessage) => void;
type ErrorHandler = (error: string) => void;
type StatusHandler = (connected: boolean) => void;

/**
 * ChatSocket — encapsulates all Socket.io chat logic.
 * Consumers connect/disconnect explicitly; no ambient side effects.
 */
export class ChatSocket {
  private socket: Socket | null = null;

  /**
   * Open the WebSocket connection with the authenticated JWT token.
   * Registers handlers for connection status, incoming messages, and errors.
   */
  connect(options: {
    onMessage: MessageHandler;
    onError: ErrorHandler;
    onStatusChange: StatusHandler;
  }): void {
    const token = localStorage.getItem('token');
    if (!token) {
      options.onError('No auth token found. Please log in first.');
      return;
    }

    if (this.socket?.connected) return; // Already connected

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      options.onStatusChange(true);
    });

    this.socket.on('disconnect', () => {
      options.onStatusChange(false);
    });

    this.socket.on('connect_error', (err: Error) => {
      options.onStatusChange(false);
      options.onError(`Connection error: ${err.message}`);
    });

    this.socket.on('newMessage', (msg: ChatMessage) => {
      options.onMessage(msg);
    });

    this.socket.on('error', (msg: string) => {
      options.onError(msg);
    });
  }

  /** Send a chat message over the established socket connection */
  sendMessage(message: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit('sendMessage', { message });
  }

  /** Gracefully close the connection and free the socket */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}
