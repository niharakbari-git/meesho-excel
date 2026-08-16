import { Request, Response } from 'express';
import { ExcelEngine } from '../services/ExcelEngine';
import { TemplateAnalysisEngine } from '../services/TemplateAnalysisEngine';

const excelEngine = new ExcelEngine();
const analysisEngine = new TemplateAnalysisEngine();

export class TemplateController {
  async uploadTemplate(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      
      const parsed = await excelEngine.parseTemplate(req.file.path);
      const analyzedFields = await analysisEngine.classifyFields(parsed.columns);

      res.json({
        success: true,
        data: {
          sheetName: parsed.sheetName,
          headerRowIndex: parsed.headerRowIndex,
          dataRowStart: parsed.dataRowStart,
          fields: analyzedFields,
          filePath: req.file.path // Save path for future generation step
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
