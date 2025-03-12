import dotenv from 'dotenv';

dotenv.config();

interface IDatabaseConfig {
  mongoURI: string;
  options: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
    useCreateIndex: boolean;
    useFindAndModify: boolean;
  };
}

const isDevelopment: boolean = process.env.NODE_ENV !== 'production';

const databaseConfig: IDatabaseConfig = {
  mongoURI: isDevelopment 
    ? process.env.MONGO_URI_DEV || 'mongodb://localhost:27017/lookingforlove'
    : process.env.MONGO_URI_PROD || '',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
};

export default databaseConfig;
