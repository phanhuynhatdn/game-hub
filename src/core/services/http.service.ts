import { API_BASE_URL } from '../constants/api.constants';

/**
 * Typed HTTP client — single place for all fetch calls.
 * Automatically attaches Bearer token from localStorage.
 * Unwraps the standard { success, data } response envelope.
 */
class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildHeaders(extra: HeadersInit = {}): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: this.buildHeaders(options.headers as HeadersInit),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error((error as { message?: string }).message || `HTTP ${response.status}`);
    }

    const body = await response.json();
    // Unwrap standard { success: true, data: T } envelope if present
    return (body as { success?: boolean; data?: T }).success !== undefined
      ? (body as { data: T }).data
      : (body as T);
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

/** Singleton HTTP client instance */
export const http = new HttpClient(API_BASE_URL);

/** Convenience logout — clears token and reloads */
export function logout(): void {
  localStorage.removeItem('token');
  window.location.reload();
}
