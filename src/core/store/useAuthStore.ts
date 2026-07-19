import { create } from 'zustand';
import { authApi } from '../services/auth.api';
import { logout } from '../services/http.service';
import type { User } from '../../types/user.types';
import type { ThemeId } from '../../types/theme.types';

interface AuthState {
  user: User | null;
  isLoading: boolean;

  /** Fetch profile from token in localStorage and populate user state */
  bootstrap: () => Promise<void>;

  /** Update user's active theme both remotely and in local state */
  selectTheme: (themeId: ThemeId) => Promise<void>;

  /** Clear user state and reload (delegated to http.service logout) */
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,

  bootstrap: async () => {
    // 1. Handle token from OAuth callback redirect
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      urlParams.delete('token');
      const cleanPath =
        window.location.pathname +
        (urlParams.toString() ? `?${urlParams.toString()}` : '');
      window.history.replaceState(null, '', cleanPath);
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const profile = await authApi.getProfile();
      set({ user: profile });
    } catch {
      // Token invalid or expired — clear it silently
      localStorage.removeItem('token');
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  selectTheme: async (themeId: ThemeId) => {
    const { user } = get();
    if (!user) return;

    const result = await authApi.selectTheme(themeId);
    set((state) => ({
      user: state.user ? { ...state.user, activeTheme: result.activeTheme } : null,
    }));
  },

  logout,
}));
