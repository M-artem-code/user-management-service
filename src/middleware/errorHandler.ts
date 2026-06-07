import { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../../generated/prisma/client';
import AppError from '../utils/appError';

type ErrorBody = {
  status: 'fail' | 'error';
  message: string;
  errors?: { path: string; message: string }[];
};

const formatZodError = (err: ZodError): ErrorBody => ({
  status: 'fail',
  message: 'Validation failed',
  errors: err.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  })),
});

const formatPrismaKnownError = (
  err: Prisma.PrismaClientKnownRequestError
): { statusCode: number; body: ErrorBody } => {
  switch (err.code) {
    case 'P2002':
      return {
        statusCode: 409,
        body: { status: 'fail', message: 'Resource already exists' },
      };
    case 'P2025':
      return {
        statusCode: 404,
        body: { status: 'fail', message: 'Resource not found' },
      };
    default:
      return {
        statusCode: 400,
        body: { status: 'fail', message: 'Invalid database request' },
      };
  }
};

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json(formatZodError(err));
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { statusCode, body } = formatPrismaKnownError(err);
    res.status(statusCode).json(body);
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status as 'fail' | 'error',
      message: err.message,
    });
    return;
  }

  // Unexpected / programming errors: log full detail, never leak it to clients.
  console.error('Unhandled error:', err);

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};
