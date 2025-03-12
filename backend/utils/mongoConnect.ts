import mongoose from 'mongoose';
import databaseConfig from '../config/database';

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(databaseConfig.mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with failure
  }
};
