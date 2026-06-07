import '../load-env';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (typeof connectionString !== 'string' || !connectionString) {
  throw new Error(
    'DATABASE_URL is missing or invalid; ensure .env is loaded before Prisma (see src/load-env.ts).'
  );
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
