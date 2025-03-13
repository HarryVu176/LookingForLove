import dotenv from 'dotenv';

dotenv.config();

interface IDatabaseConfig {
  mongoURI: string;
}

const isDevelopment: boolean = process.env.NODE_ENV !== 'production';

const databaseConfig: IDatabaseConfig = {
  mongoURI: isDevelopment 
    ? process.env.MONGO_URI_DEV || 'mongodb://admin:password@localhost:27017/lookingforlove?authSource=admin'
    : process.env.MONGO_URI_PROD || 'mongodb://admin:password@localhost:27017/lookingforlove?authSource=admin',
};

export default databaseConfig;
