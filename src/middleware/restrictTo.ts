import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(res.locals.user.role)) {
      return next(new AppError(403, 'You do not have permission'));
    }
    next();
  };
