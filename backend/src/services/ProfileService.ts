import { ProfileRepository } from '../repositories/ProfileRepository';
import { Profile } from '../models/Profile';

export class ProfileService {
  private repo = new ProfileRepository();

  async getProfile(): Promise<Profile | null> {
    return this.repo.getProfile();
  }

  async saveProfile(profile: Profile): Promise<Profile> {
    return this.repo.saveProfile(profile);
  }
}
