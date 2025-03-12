import StatisticsModel from '../../models/statistics.model';
import UserModel from '../../models/user.model';
import MatchModel from '../../models/match.model';
import { IStatistics } from '../../types/statistics.interface';

export class StatisticsService {
  /**
   * Get current statistics
   */
  public async getStatistics(): Promise<IStatistics> {
    const stats = await StatisticsModel.findOne();
    
    if (!stats) {
      throw new Error('Statistics not found');
    }
    
    return stats.toObject();
  }

  /**
   * Update statistics
   */
  public async updateStatistics(): Promise<IStatistics> {
    // Count users by membership type
    const [freeMembers, paidMembers, totalMatches, contactInfoExposed] = await Promise.all([
      UserModel.countDocuments({ memberType: 'free' }),
      UserModel.countDocuments({ memberType: 'paid' }),
      MatchModel.countDocuments(),
      MatchModel.countDocuments({ isContactInfoExposed: true })
    ]);
    
    // Update statistics
    const stats = await StatisticsModel.findOneAndUpdate(
      {},
      {
        totalFreeMembers: freeMembers,
        totalPaidMembers: paidMembers,
        totalMatches,
        totalContactInfoExposed: contactInfoExposed,
        lastUpdated: new Date()
      },
      { new: true, upsert: true }
    );
    
    return stats.toObject();
  }

  /**
   * Get match quality statistics
   */
  public async getMatchQualityStatistics(): Promise<Record<string, number>> {
    const matches = await MatchModel.find({ userRating: { $exists: true } });
    
    // Calculate average rating
    let totalRating = 0;
    let ratingCounts = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0
    };
    
    matches.forEach(match => {
      if (match.userRating) {
        totalRating += match.userRating;
        ratingCounts[match.userRating.toString() as keyof typeof ratingCounts]++;
      }
    });
    
    const averageRating = matches.length > 0 ? totalRating / matches.length : 0;
    
    return {
      averageRating,
      ...ratingCounts,
      totalRatings: matches.length
    };
  }
}

export default new StatisticsService();
