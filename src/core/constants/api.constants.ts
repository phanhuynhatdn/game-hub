/** Backend REST API base URL — read once, used everywhere */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

/** WebSocket server URL (same origin as API) */
export const SOCKET_URL: string = API_BASE_URL;

/** Google OAuth redirect entry point */
export const GOOGLE_AUTH_URL = `${API_BASE_URL}/auth/google`;
