import { Request, Response } from 'express';
import {
  accessTokenCookieOptions,
  clearCookieOptions,
  refreshTokenCookieOptions,
} from '../constants/auth.cookies';

export const extractAccessToken = (req: Request): string | undefined => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  return req.cookies.access_token;
};

export const setAuthCookies = (
  res: Response,
  tokens: { access_token: string; refresh_token: string }
) => {
  res.cookie('access_token', tokens.access_token, accessTokenCookieOptions);
  res.cookie('refresh_token', tokens.refresh_token, refreshTokenCookieOptions);
};

export const setAccessTokenCookie = (res: Response, access_token: string) => {
  res.cookie('access_token', access_token, accessTokenCookieOptions);
};

export const clearAuthCookies = (res: Response) => {
  res.cookie('access_token', '', clearCookieOptions);
  res.cookie('refresh_token', '', clearCookieOptions);
};
