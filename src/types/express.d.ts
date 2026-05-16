import { User } from '../../generated/prisma/client';

declare global {
  namespace Express {
    interface Locals {
      user: Omit<User, 'password'>;
    }
  }
}