import { Response } from 'express';
import matchService from '../services/match.service';
import { IAuthRequest } from '../middlewares/auth.middleware';

export class MatchController {
  public async findMatches(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const matches = await matchService.findMatches(req.user.userId);
      
      res.status(200).json({ success: true, matches });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to find matches' 
      });
    }
  }

  public async exposeContactInfo(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { matchedUserId } = req.params;
      const match = await matchService.exposeContactInfo(req.user.userId, matchedUserId);
      
      res.status(200).json({ success: true, match });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to expose contact information' 
      });
    }
  }

  public async rateMatch(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { matchedUserId } = req.params;
      const { rating } = req.body;
      
      const match = await matchService.rateMatch(req.user.userId, matchedUserId, rating);
      
      res.status(200).json({ success: true, match });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to rate match' 
      });
    }
  }
}

export default new MatchController();
