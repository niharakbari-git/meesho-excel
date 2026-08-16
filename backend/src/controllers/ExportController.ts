import { Request, Response } from 'express';
import { ExcelEngine } from '../services/ExcelEngine';
import fs from 'fs';
import path from 'path';
import { getDb } from '../database/db';

const excelEngine = new ExcelEngine();

export class ExportController {
  async exportExcel(req: Request, res: Response) {
    try {
      const { rows, filePath, headerRowIndex, sheetName, dataRowStart, customFilename, originalFilename } = req.body;
      
      const buffer = await excelEngine.fillAndExport(filePath, sheetName, headerRowIndex, rows, dataRowStart);
      
      // Sanitize custom filename
      let baseFilename = customFilename ? customFilename.replace(/[^a-zA-Z0-9 _-]/g, '').trim() : '';
      if (!baseFilename) {
        baseFilename = `Meesho_Bulk_Catalogue_${rows.length}_Listings`;
      }
      const generatedFilename = `${baseFilename}_${Date.now()}.xlsx`;
      
      const exportDir = path.join(__dirname, '../../uploads/exports');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }
      
      const generatedPath = path.join(exportDir, generatedFilename);
      fs.writeFileSync(generatedPath, buffer);
      
      const db = getDb();
      
      const insertProfileResult = await db.run(
        `INSERT INTO generation_profiles (mode, identityStrategy, adjectivePool, fieldsConfig, globalSettings, rowCount, sheetName, headerRowIndex, dataRowStart, originalFilePath)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
           req.body.profile?.mode || null,
           req.body.profile?.identityStrategy || null,
           req.body.profile?.adjectivePool ? JSON.stringify(req.body.profile.adjectivePool) : null,
           req.body.fields ? JSON.stringify(req.body.fields) : null,
           req.body.globalSettings ? JSON.stringify(req.body.globalSettings) : null,
           rows.length,
           sheetName,
           headerRowIndex,
           dataRowStart,
           filePath
        ]
      );
      const profileId = insertProfileResult.lastID;

      const result = await db.run(
        `INSERT INTO files (originalFilename, originalPath, generatedFilename, generatedPath, templateName, generatedRows, status, strategyProfile, generation_profile_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [originalFilename || path.basename(filePath), filePath, generatedFilename, generatedPath, sheetName, rows.length, 'GENERATED', req.body.profile ? JSON.stringify(req.body.profile) : null, profileId]
      );
      
      res.json({ success: true, fileId: result.lastID, filename: generatedFilename });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
