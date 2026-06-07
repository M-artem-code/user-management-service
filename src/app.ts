import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// HEALTH CHECK
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 404
app.all('*', notFoundHandler);

// ERROR HANDLER
app.use(errorHandler);

export default app;
