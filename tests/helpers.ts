import { signJwt } from '../src/utils/jwt';

export const validRegisterBody = (overrides: Record<string, unknown> = {}) => ({
  lastName: 'Ivanov',
  firstName: 'Ivan',
  middleName: 'Ivanovich',
  birthDate: '1990-05-15',
  email: 'user@example.com',
  password: 'password123',
  passwordConfirm: 'password123',
  ...overrides,
});

export const bearerFor = (userId: string) =>
  `Bearer ${signJwt({ sub: userId }, 'accessTokenPrivateKey', {
    expiresIn: '15m',
  })}`;

export const refreshTokenFor = (userId: string) =>
  signJwt({ sub: userId }, 'refreshTokenPrivateKey', { expiresIn: '7d' });
