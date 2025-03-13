import { connectToDatabase } from '../utils/mongoConnect';
import UserModel from '../models/user.model';
import MatchModel from '../models/match.model';
import StatisticsModel from '../models/statistics.model';
import { IStatistics } from '../types/statistics.interface';

async function updateStatistics(): Promise<void> {
  try {
    await connectToDatabase();
    
    console.log('Counting users and matches...');
    
    // Count users by membership type
    const [freeMembers, paidMembers, totalMatches, contactInfoExposed] = await Promise.all([
      UserModel.countDocuments({ memberType: 'free' }),
      UserModel.countDocuments({ memberType: 'paid' }),
      MatchModel.countDocuments(),
      MatchModel.countDocuments({ isContactInfoExposed: true })
    ]);
    
    console.log('User counts:', { freeMembers, paidMembers });
    console.log('Match counts:', { totalMatches, contactInfoExposed });
    
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
    
    console.log('Statistics updated successfully:', stats.toObject());
    process.exit(0);
  } catch (error) {
    console.error('Failed to update statistics:', error);
    process.exit(1);
  }
}

// Run the update
updateStatistics(); 