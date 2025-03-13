import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

export interface IAuthRequest extends Request {
  user?: {
    userId: string;
    memberType: 'free' | 'paid' | 'product';
  };
}

export function authMiddleware(req: IAuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decodedToken = authService.verifyToken(token);
      
      // Add user info to request object
      req.user = {
        userId: decodedToken.userId,
        memberType: decodedToken.memberType
      };
      
      next();
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      // Provide more specific error message
      const errorMessage = tokenError instanceof Error ? tokenError.message : 'Invalid or expired token';
      res.status(401).json({ success: false, message: errorMessage });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
}

export function requirePaidMembership(req: IAuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.memberType !== 'paid') {
    res.status(403).json({ message: 'Paid membership required for this feature' });
    return;
  }
  
  next();
}

export function requireProductManager(req: IAuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.memberType !== 'product') {
    res.status(403).json({ message: 'Product manager access required' });
    return;
  }
  
  next();
}
