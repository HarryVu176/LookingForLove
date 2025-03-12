import { Response } from 'express';
import statisticsService from '../services/statistics.service';
import { IAuthRequest } from '../middlewares/auth.middleware';

export class StatisticsController {
  public async getStatistics(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const statistics = await statisticsService.getStatistics();
      
      res.status(200).json({ success: true, statistics });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to get statistics' 
      });
    }
  }

  public async updateStatistics(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const statistics = await statisticsService.updateStatistics();
      
      res.status(200).json({ success: true, statistics });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update statistics' 
      });
    }
  }

  public async getMatchQualityStatistics(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const statistics = await statisticsService.getMatchQualityStatistics();
      
      res.status(200).json({ success: true, statistics });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to get match quality statistics' 
      });
    }
  }
}

export default new StatisticsController();
