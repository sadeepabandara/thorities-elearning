import express, { NextFunction, Request, Response } from 'express';
export const app = express();
require('dotenv').config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';

//  body parser
app.use(express.json({ limit: '50mb' }));

// cookie parser
app.use(cookieParser());

// cors
app.use(cors({ origin: process.env.ORIGIN }));

// routes
app.use('/api/v1', userRouter);

// testing API
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: 'API is working' });
});

// unknow route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} does not exist`) as any;
  error.statusCode = 404;
  next(error);
});

app.use(ErrorMiddleware);
