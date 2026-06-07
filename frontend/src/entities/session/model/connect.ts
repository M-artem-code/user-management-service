import { setAccessTokenGetter, setRefreshHandler } from '@/shared/api';
import { refreshToken } from '../api/session-api';
import { useSessionStore } from './store';

/**
 * Wire the session store into the shared API client once at app startup:
 *  - the request interceptor reads the current access token from the store;
 *  - on 401 the response interceptor asks the store to refresh the token.
 */
export function connectSessionToApi() {
  setAccessTokenGetter(() => useSessionStore.getState().accessToken);

  setRefreshHandler(async () => {
    try {
      const token = await refreshToken();
      useSessionStore.getState().setAccessToken(token);
      return token;
    } catch {
      useSessionStore.getState().clearSession();
      return null;
    }
  });
}
