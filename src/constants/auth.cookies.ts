import { CookieOptions } from 'express';
import { parseDurationToMs } from '../utils/duration';

const DEFAULT_ACCESS_TTL_MS = 15 * 60 * 1000;
const DEFAULT_REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Cookie lifetimes are derived from the same env vars as the JWT expiry so the
// two can never drift apart.
const accessTtlMs = parseDurationToMs(
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  DEFAULT_ACCESS_TTL_MS
);
const refreshTtlMs = parseDurationToMs(
  process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  DEFAULT_REFRESH_TTL_MS
);

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

export const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  maxAge: accessTtlMs,
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  maxAge: refreshTtlMs,
};

export const clearCookieOptions: CookieOptions = {
  maxAge: 1,
};
