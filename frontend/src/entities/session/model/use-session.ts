import { useSessionStore } from './store';

export const useCurrentUser = () => useSessionStore((s) => s.user);
export const useSessionStatus = () => useSessionStore((s) => s.status);
export const useIsAuthenticated = () =>
  useSessionStore((s) => s.status === 'authenticated');
export const useIsAdmin = () =>
  useSessionStore((s) => s.user?.role === 'admin');
