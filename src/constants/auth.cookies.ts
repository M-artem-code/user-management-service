import { CookieOptions } from 'express';

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

export const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  maxAge: 15 * 60 * 1000,
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearCookieOptions: CookieOptions = {
  maxAge: 1,
};
