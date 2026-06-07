import express from 'express';
import {
  getUserHandler,
  getAllUsersHandler,
  blockUserHandler,
} from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { restrictTo } from '../middleware/restrictTo';
import { validate } from '../middleware/validate';
import { listUsersSchema, userIdParamSchema } from '../schemas/user.schema';
import { ROLES } from '../constants/roles';

const router = express.Router();

// все роуты требуют авторизации
router.use(deserializeUser, requireUser);

// GET /api/users — только админ
router.get(
  '/',
  restrictTo(ROLES.admin),
  validate(listUsersSchema),
  getAllUsersHandler
);

// GET /api/users/:id — админ или сам пользователь
router.get('/:id', validate(userIdParamSchema), getUserHandler);

// PATCH /api/users/:id/block — админ или сам пользователь
router.patch('/:id/block', validate(userIdParamSchema), blockUserHandler);

export default router;
