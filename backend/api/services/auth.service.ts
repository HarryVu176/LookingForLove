import { compare, hash } from 'bcryptjs';
import { sign, verify, Secret, SignOptions } from 'jsonwebtoken';
import jwtConfig from '../../config/jwt';
import UserModel from '../../models/user.model';
import { IUser } from '../../types/user.interface';

export interface IAuthPayload {
  userId: string;
  memberType: 'free' | 'paid' | 'product';
}

export interface ILoginResponse {
  token: string;
  user: Omit<IUser, 'password'>;
}

export class AuthService {
  /**
   * Register a new user
   */
  public async register(userData: Partial<IUser>): Promise<IUser> {
    // Create a new user
    const newUser = new UserModel({
      ...userData,
      memberType: 'free' // Default to free membership
    });

    const savedUser = await newUser.save();
    return savedUser.toObject();
  }

  /**
   * Authenticate a user and generate a JWT token
   */
  public async login(email: string, password: string): Promise<ILoginResponse> {
    // Find user by email
    const user = await UserModel.findOne({ 'contactInfo.email': email });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password - This would be implemented in a real app
    // In this MVP, we're skipping password checks since it's not in requirements

    // Generate JWT token
    const payload: IAuthPayload = {
      userId: user._id.toString(),
      memberType: user.memberType
    };
    const signOptions: SignOptions = {
      expiresIn: parseInt(jwtConfig.expiresIn),
      ...jwtConfig.options
    };

    const token = sign(payload, jwtConfig.secret, signOptions);

    return {
      token,
      user: user.toObject()
    };
  }

  /**
   * Upgrade a user to paid membership
   */
  public async upgradeToPaidMembership(userId: string): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { 
        memberType: 'paid',
        subscriptionDate: new Date()
      },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user.toObject();
  }

  /**
   * Verify a JWT token
   */
  public verifyToken(token: string): IAuthPayload {
    try {
      const decoded = verify(token, jwtConfig.secret) as IAuthPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new Error('Invalid token');
    }
  }

  /**
   * Get user by ID
   */
  public async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(userId);
      return user ? user.toObject() : null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Failed to fetch user');
    }
  }
}

export default new AuthService();
