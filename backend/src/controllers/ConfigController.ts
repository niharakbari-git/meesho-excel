import { Request, Response } from 'express';
import { getDb } from '../database/db';

export class ConfigController {
  async saveConfig(req: Request, res: Response) {
    try {
      const { name, configData } = req.body;
      const db = getDb();
      
      const existing = await db.get('SELECT * FROM configurations WHERE name = ?', [name]);
      if (existing) {
        await db.run('UPDATE configurations SET configData = ? WHERE name = ?', [JSON.stringify(configData), name]);
      } else {
        await db.run('INSERT INTO configurations (name, configData) VALUES (?, ?)', [name, JSON.stringify(configData)]);
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getConfigs(req: Request, res: Response) {
    try {
      const db = getDb();
      const configs = await db.all('SELECT id, name FROM configurations ORDER BY id DESC');
      res.json({ success: true, data: configs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getConfigByName(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const db = getDb();
      const config = await db.get('SELECT * FROM configurations WHERE name = ?', [name]);
      
      if (!config) {
        return res.status(404).json({ success: false, message: 'Configuration not found' });
      }
      
      res.json({ success: true, data: JSON.parse(config.configData) });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
