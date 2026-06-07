import { useMutation } from '@tanstack/react-query';
import { getUserById } from '@/entities/user';
import { useSessionStore } from '@/entities/session';
import { decodeJwt } from '@/shared/lib';
import { loginRequest } from '../api/login-request';
import type { LoginValues } from './schema';

export function useLogin() {
  const setSession = useSessionStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (values: LoginValues) => {
      const accessToken = await loginRequest(values);

      const payload = decodeJwt(accessToken);
      if (!payload?.sub) {
        throw new Error('Не удалось прочитать токен авторизации');
      }

      // store the token first so the request to load the user is authorized
      useSessionStore.getState().setAccessToken(accessToken);
      const user = await getUserById(payload.sub);

      setSession({ accessToken, user });
      return user;
    },
  });
}
