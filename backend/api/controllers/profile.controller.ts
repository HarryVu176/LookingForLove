import { Response } from 'express';
import profileService from '../services/profile.service';
import { IAuthRequest } from '../middlewares/auth.middleware';

export class ProfileController {
  public async getProfile(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const profile = await profileService.getUserProfile(req.user.userId);
      
      res.status(200).json({ success: true, profile });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to get profile' 
      });
    }
  }

  public async updateProfile(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const profileData = req.body;
      const updatedProfile = await profileService.updateProfile(req.user.userId, profileData);
      
      res.status(200).json({ success: true, profile: updatedProfile });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update profile' 
      });
    }
  }

  public async updateTechnicalSkills(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { skillsOwned, skillsDesired } = req.body;
      const updatedProfile = await profileService.updateTechnicalSkills(
        req.user.userId,
        skillsOwned,
        skillsDesired
      );
      
      res.status(200).json({ success: true, profile: updatedProfile });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update technical skills' 
      });
    }
  }

  public async updateProfilePhoto(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { photoUrl } = req.body;
      const updatedProfile = await profileService.updateProfilePhoto(req.user.userId, photoUrl);
      
      res.status(200).json({ success: true, profile: updatedProfile });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update profile photo' 
      });
    }
  }
}

export default new ProfileController();
