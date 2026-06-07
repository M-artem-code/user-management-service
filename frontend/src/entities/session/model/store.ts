import { create } from 'zustand';
import type { User } from '@/shared/types';

export type SessionStatus = 'loading' | 'authenticated' | 'anonymous';

type SessionState = {
  accessToken: string | null;
  user: User | null;
  status: SessionStatus;
  setSession: (payload: { accessToken: string; user: User }) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  accessToken: null,
  user: null,
  status: 'loading',
  setSession: ({ accessToken, user }) =>
    set({ accessToken, user, status: 'authenticated' }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  clearSession: () =>
    set({ accessToken: null, user: null, status: 'anonymous' }),
}));
