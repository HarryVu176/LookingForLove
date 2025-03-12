import { connectToDatabase } from '../utils/mongoConnect';
import UserModel from '../models/user.model';
import StatisticsModel from '../models/statistics.model';
import { IStatistics } from '../types/statistics.interface';

async function initializeDatabase(): Promise<void> {
  try {
    await connectToDatabase();
    
    // Check if statistics document exists
    const statsExists = await StatisticsModel.exists({});
    
    if (!statsExists) {
      // Create initial statistics document
      const initialStats: IStatistics = {
        totalFreeMembers: 0,
        totalPaidMembers: 0,
        totalMatches: 0,
        totalContactInfoExposed: 0,
        lastUpdated: new Date()
      };
      
      await StatisticsModel.create(initialStats);
      console.log('Initial statistics document created');
    }
    
    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
