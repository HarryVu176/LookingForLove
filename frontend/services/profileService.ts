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
      const response = await apiService.put<IProfileResponse>('/profile', profileData);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
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
