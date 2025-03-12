import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

interface ISecurityOptions {
  sanitizationEnabled: boolean;
  mongoSanitize: (req: Request) => void;
}

// MongoDB sanitization function
function mongoSanitize(req: Request): void {
  const sanitizeObject = (obj: Record<string, any>): void => {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      } else if (typeof obj[key] === 'string') {
        // Replace MongoDB operators with harmless strings
        obj[key] = obj[key].replace(/\$|\{|\}/g, '');
      }
    }
  };

  ['params', 'body', 'query'].forEach(key => {
    if (req[key as keyof Request]) {
      const requestPart = req[key as keyof Request] as Record<string, any>;
      sanitizeObject(requestPart);
    }
  });
}

export const securityOptions: ISecurityOptions = {
  sanitizationEnabled: true,
  mongoSanitize
};

// Middleware to sanitize MongoDB queries
export function sanitizeRequest(req: Request, res: Response, next: NextFunction): void {
  if (securityOptions.sanitizationEnabled) {
    securityOptions.mongoSanitize(req);
  }
  next();
}
