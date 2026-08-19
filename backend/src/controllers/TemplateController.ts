import { Request, Response } from 'express';
import { ExcelEngine } from '../services/ExcelEngine';
import { TemplateAnalysisEngine } from '../services/TemplateAnalysisEngine';
import { getDb } from '../database/db';

const excelEngine = new ExcelEngine();
const analysisEngine = new TemplateAnalysisEngine();

export class TemplateController {
  async uploadTemplate(req: Request, res: Response) {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      
      const db = getDb();
      const insertResult = await db.run(
        `INSERT INTO template_files (filename, fileData) VALUES (?, ?)`,
        [req.file.originalname, req.file.buffer]
      );
      
      const fileId = insertResult.lastID;
      const dbPath = `db://${fileId}`;
      
      const parsed = await excelEngine.parseTemplate(req.file.buffer);
      const analyzedFields = await analysisEngine.classifyFields(parsed.columns);

      res.json({
        success: true,
        data: {
          sheetName: parsed.sheetName,
          headerRowIndex: parsed.headerRowIndex,
          dataRowStart: parsed.dataRowStart,
          fields: analyzedFields,
          filePath: dbPath // Save db path for future generation step
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
