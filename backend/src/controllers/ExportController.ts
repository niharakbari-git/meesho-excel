import { Request, Response } from 'express';
import { ExcelEngine } from '../services/ExcelEngine';

const excelEngine = new ExcelEngine();

export class ExportController {
  async exportExcel(req: Request, res: Response) {
    try {
      const { rows, filePath, headerRowIndex, sheetName, dataRowStart } = req.body;
      
      const buffer = await excelEngine.fillAndExport(filePath, sheetName, headerRowIndex, rows, dataRowStart);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="Meesho_Bulk_Generated_${Date.now()}.xlsx"`);
      res.send(buffer);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
