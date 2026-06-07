import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getUserById(res.locals.user, req.params.id);

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { users, pagination } = await userService.getAllUsers({
      page: req.query.page as string | undefined,
      limit: req.query.limit as string | undefined,
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      pagination,
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

export const blockUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.blockUser(res.locals.user, req.params.id);

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};
