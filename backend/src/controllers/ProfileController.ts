import { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileService';

const profileService = new ProfileService();

export class ProfileController {
  async getProfile(req: Request, res: Response) {
    try {
      const profile = await profileService.getProfile();
      res.json({ success: true, data: profile || {} });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async saveProfile(req: Request, res: Response) {
    try {
      const profile = await profileService.saveProfile(req.body);
      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
