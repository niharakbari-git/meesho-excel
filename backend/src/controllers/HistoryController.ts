import { Request, Response } from 'express';
import { getDb } from '../database/db';
import fs from 'fs';

export class HistoryController {
  async getHistory(req: Request, res: Response) {
    try {
      const db = getDb();
      const files = await db.all(`
        SELECT id, originalFilename, generatedFilename, createdAt, templateName, generatedRows, status, generation_profile_id 
        FROM files 
        ORDER BY createdAt DESC
      `);
      res.json({ success: true, files });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getFileProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const db = getDb();
      
      const fileRecord = await db.get(`SELECT generation_profile_id FROM files WHERE id = ?`, [id]);
      if (!fileRecord || !fileRecord.generation_profile_id) {
        return res.status(404).json({ success: false, message: 'Profile not found for this file' });
      }

      const profile = await db.get(`SELECT * FROM generation_profiles WHERE id = ?`, [fileRecord.generation_profile_id]);
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      res.json({ success: true, profile });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async downloadFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const db = getDb();
      const fileRecord = await db.get(`SELECT generatedPath, generatedFilename FROM files WHERE id = ?`, [id]);
      
      if (!fileRecord || !fileRecord.generatedPath) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }

      if (!fs.existsSync(fileRecord.generatedPath)) {
        return res.status(404).json({ success: false, message: 'File no longer exists on server' });
      }

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.generatedFilename}"`);
      const stream = fs.createReadStream(fileRecord.generatedPath);
      stream.pipe(res);
      
      // Update status to downloaded if needed
      await db.run(`UPDATE files SET status = ? WHERE id = ? AND status != 'DOWNLOADED'`, ['DOWNLOADED', id]);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
