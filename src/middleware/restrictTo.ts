import { Request, Response, NextFunction } from 'express';
import { Role } from '../constants/roles';
import AppError from '../utils/appError';

export const restrictTo =
  (...roles: Role[]) =>
  (_req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(res.locals.user.role)) {
      return next(new AppError(403, 'You do not have permission'));
    }
    next();
  };
