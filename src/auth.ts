import { createAuthClient } from '@neondatabase/neon-js/auth';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react';

const baseAuthClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, {
  adapter: BetterAuthReactAdapter(),
});

/**
 * Neon Auth includes the Better Auth admin client plugin at runtime, but the
 * published createAuthClient typings do not currently surface `admin` or
 * `user.role`. Keep a narrow typed surface for the admin panel.
 */
type AdminClient = {
  listUsers: (args: {
    query: Record<string, unknown>;
  }) => Promise<{
    data?: { users?: unknown[]; total?: number } | null;
    error?: { message?: string } | null;
  }>;
  getUser: (args: {
    query: { id: string };
  }) => Promise<{
    data?: unknown;
    error?: { message?: string } | null;
  }>;
  createUser: (args: {
    email: string;
    password: string;
    name: string;
    role: string;
  }) => Promise<{
    data?: unknown;
    error?: { message?: string } | null;
  }>;
  updateUser: (args: {
    userId: string;
    data: { name: string };
  }) => Promise<{
    data?: unknown;
    error?: { message?: string } | null;
  }>;
  setRole: (args: {
    userId: string;
    role: string;
  }) => Promise<{
    data?: unknown;
    error?: { message?: string } | null;
  }>;
  banUser: (args: {
    userId: string;
    banReason?: string;
    banExpiresIn?: number;
  }) => Promise<{
    data?: unknown;
    error?: { message?: string } | null;
  }>;
  unbanUser: (args: {
    userId: string;
  }) => Promise<{
    data?: unknown;
    error?: { message?: string } | null;
  }>;
};

export type SessionUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role?: string | null;
};

export const authClient = baseAuthClient as typeof baseAuthClient & {
  admin: AdminClient;
};
