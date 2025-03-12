import UserModel from '../../models/user.model';
import { IUser, ITechnicalSkill } from '../../types/user.interface';
import { safeUpdate } from '../../utils/dbOperations';

export class ProfileService {
  /**
   * Get user profile by ID
   */
  public async getUserProfile(userId: string): Promise<IUser> {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.toObject();
  }

  /**
   * Update user profile
   */
  public async updateProfile(userId: string, profileData: Partial<IUser>): Promise<IUser> {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Safe update to prevent overwriting critical fields
    const updatedData = safeUpdate(user.toObject(), profileData);
    
    // Update user profile
    Object.assign(user, updatedData);
    await user.save();
    
    return user.toObject();
  }

  /**
   * Update technical skills
   */
  public async updateTechnicalSkills(
    userId: string, 
    skillsOwned: ITechnicalSkill[], 
    skillsDesired: ITechnicalSkill[]
  ): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { 
        technicalSkillsOwned: skillsOwned,
        technicalSkillsDesired: skillsDesired
      },
      { new: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.toObject();
  }

  /**
   * Upload profile photo
   */
  public async updateProfilePhoto(userId: string, photoUrl: string): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { photoUrl },
      { new: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.toObject();
  }
}

export default new ProfileService();
