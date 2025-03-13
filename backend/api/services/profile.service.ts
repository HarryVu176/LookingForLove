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
    
    console.log('Received profile data for update:', JSON.stringify(profileData, null, 2));
    
    // Handle nested objects like contactInfo
    if (profileData.contactInfo) {
      if (!user.contactInfo) {
        user.contactInfo = { email: '', whatsAppId: '' };
      }
      
      if (profileData.contactInfo.email) {
        user.contactInfo.email = profileData.contactInfo.email;
      }
      
      if (profileData.contactInfo.whatsAppId !== undefined) {
        user.contactInfo.whatsAppId = profileData.contactInfo.whatsAppId;
      }
      
      // Remove contactInfo from profileData to prevent double-processing
      delete profileData.contactInfo;
    }
    
    // Safe update to prevent overwriting critical fields
    const updatedData = safeUpdate(user.toObject(), profileData);
    
    // Update user profile
    Object.assign(user, updatedData);
    
    try {
      await user.save();
      console.log('Profile updated successfully');
      return user.toObject();
    } catch (error) {
      console.error('Error saving profile:', error);
      throw new Error('Failed to save profile updates');
    }
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
