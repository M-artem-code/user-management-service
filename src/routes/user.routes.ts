import express from 'express';
import {
  getUserHandler,
  getAllUsersHandler,
  blockUserHandler,
} from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { restrictTo } from '../middleware/restrictTo';

const router = express.Router();

// все роуты требуют авторизации
router.use(deserializeUser, requireUser);

// GET /api/users — только админ
router.get('/', restrictTo('admin'), getAllUsersHandler);

// GET /api/users/:id — админ или сам пользователь
router.get('/:id', getUserHandler);

// PATCH /api/users/:id/block — админ или сам пользователь
router.patch('/:id/block', blockUserHandler);

export default router;