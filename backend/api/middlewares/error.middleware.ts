import { Request, Response, NextFunction } from 'express';

interface IAppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  error: IAppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  console.error(`Error: ${message}`);
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
}
