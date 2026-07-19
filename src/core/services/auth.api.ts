import { http } from './http.service';
import type { User } from '../../types/user.types';
import type { ThemeId } from '../../types/theme.types';

/** All REST calls related to authentication and user profile */
export const authApi = {
  /** GET /auth/profile — returns full User profile for the current token */
  getProfile(): Promise<User> {
    return http.get<User>('/auth/profile');
  },

  /** PUT /auth/theme — set the active background theme */
  selectTheme(theme: ThemeId): Promise<{ activeTheme: string }> {
    return http.put<{ activeTheme: string }>('/auth/theme', { theme });
  },
};
