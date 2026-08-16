import { Request, Response } from 'express';
import { getDb } from '../database/db';

export class PresetController {
  async getPresets(req: Request, res: Response) {
    try {
      const db = getDb();
      const presets = await db.all(`SELECT * FROM global_field_presets`);
      res.json({ success: true, presets });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async savePreset(req: Request, res: Response) {
    try {
      const { fieldName, fieldValue } = req.body;
      if (!fieldName) {
        return res.status(400).json({ success: false, message: 'fieldName is required' });
      }

      const db = getDb();
      await db.run(
        `INSERT INTO global_field_presets (fieldName, fieldValue) VALUES (?, ?)
         ON CONFLICT(fieldName) DO UPDATE SET fieldValue = excluded.fieldValue, updatedAt = CURRENT_TIMESTAMP`,
        [fieldName.trim(), fieldValue || '']
      );

      res.json({ success: true, message: 'Preset saved successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deletePreset(req: Request, res: Response) {
    try {
      const fieldName = req.params.fieldName as string;
      const db = getDb();
      await db.run(`DELETE FROM global_field_presets WHERE fieldName = ?`, [fieldName.trim()]);
      res.json({ success: true, message: 'Preset deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
