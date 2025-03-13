import dotenv from 'dotenv';
import { SignOptions, Secret } from 'jsonwebtoken';

dotenv.config();

interface IJwtConfig {
  secret: Secret;
  expiresIn: string;
  options: SignOptions;
}

const jwtConfig: IJwtConfig = {
  secret: process.env.JWT_SECRET || 'lookingforlove-secret-key',
  expiresIn: '30d', // Increased from 7d to 30d
  options: {
    algorithm: 'HS256'
  }
};

export default jwtConfig;

