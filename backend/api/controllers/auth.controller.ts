import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { IAuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const user = await authService.register(userData);
      
      res.status(201).json({ success: true, user });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(401).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Authentication failed' 
      });
    }
  }

  public async upgradeMembership(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const user = await authService.upgradeToPaidMembership(req.user.userId);
      
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Upgrade failed' 
      });
    }
  }

  public async getCurrentUser(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      // Get the user from the database using the userId from the token
      const user = await authService.getUserById(req.user.userId);
      
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to get user data' 
      });
    }
  }
}

export default new AuthController();
