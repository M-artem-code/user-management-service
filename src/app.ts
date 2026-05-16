import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import AppError from './utils/appError';

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(morgan('dev'));

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// HEALTH CHECK
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ERROR
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

// ERROR HANDLER
app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
  });
});

export default app;