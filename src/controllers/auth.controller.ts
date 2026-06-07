import { NextFunction, Request, Response } from 'express';
import { LoginUserInput, RegisterUserInput } from '../schemas/user.schema';
import * as authService from '../services/auth.service';
import {
  clearAuthCookies,
  setAccessTokenCookie,
  setAuthCookies,
} from '../utils/cookies';

export const registerUserHandler = async (
  req: Request<Record<string, never>, unknown, RegisterUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.register(req.body);

    res.status(201).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

export const loginUserHandler = async (
  req: Request<Record<string, never>, unknown, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokens = await authService.login(req.body);

    setAuthCookies(res, tokens);

    res.status(200).json({
      status: 'success',
      access_token: tokens.access_token,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { access_token } = await authService.refresh(
      req.cookies.refresh_token
    );

    setAccessTokenCookie(res, access_token);

    res.status(200).json({
      status: 'success',
      access_token,
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUserHandler = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    clearAuthCookies(res);

    res.status(200).json({ status: 'success' });
  } catch (err) {
    next(err);
  }
};
