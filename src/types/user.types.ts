/** Maps to Prisma UserRole enum and BE roles.constants.ts */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

/** Full user profile returned by GET /auth/profile */
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  chillPoints: number;
  unlockedThemes: string[];
  activeTheme: string;
  role: UserRole;
  isBanned: boolean;
  createdAt: string;
}

/** Partial user shape used in admin user list */
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isBanned: boolean;
  chillPoints: number;
  unlockedThemes: string[];
  createdAt: string;
}
