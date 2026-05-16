import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { extractAccessToken } from '../utils/cookies';

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = extractAccessToken(req);
    const user = await authService.getCurrentUser(accessToken);

    res.locals.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
