import { useEffect, useRef, type ReactNode } from 'react';
import { decodeJwt } from '@/shared/lib';
import {
  connectSessionToApi,
  refreshToken,
  useSessionStore,
} from '@/entities/session';
import { getUserById } from '@/entities/user';

// Wire the session into the API client once, before any request is made.
connectSessionToApi();

/**
 * Restores the session on app start: tries to exchange the refresh_token cookie
 * for an access token, then loads the current user. Sets the session to
 * "anonymous" if there is no valid session.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const bootstrap = async () => {
      try {
        const token = await refreshToken();
        useSessionStore.getState().setAccessToken(token);

        const payload = decodeJwt(token);
        if (!payload?.sub) throw new Error('Invalid token');

        const user = await getUserById(payload.sub);
        useSessionStore.getState().setSession({ accessToken: token, user });
      } catch {
        useSessionStore.getState().clearSession();
      }
    };

    void bootstrap();
  }, []);

  return <>{children}</>;
}
