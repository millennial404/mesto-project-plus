import { Request, Response, NextFunction } from 'express';
import { CustomError } from './errors';

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
