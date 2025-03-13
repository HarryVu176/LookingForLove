import apiService from './api';
import { IUser, ITechnicalSkill } from '../types/user';

interface IProfileResponse {
  success: boolean;
  profile: IUser;
  message?: string;
}

export class ProfileService {
  public async getProfile(): Promise<IProfileResponse> {
    try {
      const response = await apiService.get<IProfileResponse>('/profile');
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }

  public async updateProfile(profileData: Partial<IUser>): Promise<IProfileResponse> {
    try {
      // Log the profile update attempt
      console.log('Updating profile with data:', JSON.stringify(profileData, null, 2));
      
      const response = await apiService.put<IProfileResponse>('/profile', profileData);
      
      // Log successful update
      console.log('Profile updated successfully:', response.success);
      
      return response;
    } catch (error: any) {
      console.error('Profile update error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Throw a more detailed error
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to update profile');
      }
    }
  }

  public async updateTechnicalSkills(
    skillsOwned: ITechnicalSkill[],
    skillsDesired: ITechnicalSkill[]
  ): Promise<IProfileResponse> {
    try {
      const response = await apiService.put<IProfileResponse>('/profile/skills', {
        skillsOwned,
        skillsDesired
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update technical skills');
    }
  }

  public async updateProfilePhoto(photoUrl: string): Promise<IProfileResponse> {
    try {
      const response = await apiService.put<IProfileResponse>('/profile/photo', {
        photoUrl
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile photo');
    }
  }
}

export default new ProfileService();
