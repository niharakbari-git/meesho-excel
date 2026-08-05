import { Request, Response } from 'express';
import { DataGeneratorEngine } from '../services/DataGeneratorEngine';

const generator = new DataGeneratorEngine();

export class GeneratorController {
  async generate(req: Request, res: Response) {
    try {
      const { fields, count } = req.body;
      const rows = await generator.generateData(count, fields);
      res.json({ success: true, data: rows });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
