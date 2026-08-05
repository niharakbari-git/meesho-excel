import { getDb } from '../database/db';
import { Profile } from '../models/Profile';

export class ProfileRepository {
  async getProfile(): Promise<Profile | null> {
    const db = getDb();
    const profile = await db.get<Profile>('SELECT * FROM profiles ORDER BY id DESC LIMIT 1');
    return profile || null;
  }

  async saveProfile(profile: Profile): Promise<Profile> {
    const db = getDb();
    const existing = await this.getProfile();
    
    if (existing) {
      await db.run(`
        UPDATE profiles SET
          gst = ?, hsn = ?, brand = ?, manufacturer = ?, packer = ?,
          address = ?, phone = ?, email = ?, defaultKeywords = ?,
          defaultProfit = ?, defaultPriceVariation = ?
        WHERE id = ?
      `, [
        profile.gst, profile.hsn, profile.brand, profile.manufacturer, profile.packer,
        profile.address, profile.phone, profile.email, profile.defaultKeywords,
        profile.defaultProfit, profile.defaultPriceVariation, existing.id
      ]);
      return { ...profile, id: existing.id };
    } else {
      const result = await db.run(`
        INSERT INTO profiles (
          gst, hsn, brand, manufacturer, packer, address, phone, email,
          defaultKeywords, defaultProfit, defaultPriceVariation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        profile.gst, profile.hsn, profile.brand, profile.manufacturer, profile.packer,
        profile.address, profile.phone, profile.email, profile.defaultKeywords,
        profile.defaultProfit, profile.defaultPriceVariation
      ]);
      return { ...profile, id: result.lastID };
    }
  }
}
