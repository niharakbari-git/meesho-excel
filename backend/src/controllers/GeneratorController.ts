import { Request, Response } from 'express';
import { DataGeneratorEngine } from '../services/DataGeneratorEngine';
import { ValidationEngine } from '../services/ValidationEngine';
import { GenerationProfile } from '../types';

const generator = new DataGeneratorEngine();
const validator = new ValidationEngine();

export class GeneratorController {
  async generate(req: Request, res: Response) {
    try {
      const { fields, count, globalSettings, profile } = req.body;
      
      const activeProfile: GenerationProfile = profile || {
        mode: 'INDEPENDENT_LISTING',
        identityStrategy: 'UNIQUE_NAME',
        adjectivePool: ['Premium']
      };

      // 1. Generate Rows
      const rows = await generator.generateData(count, fields, globalSettings || {}, activeProfile);
      
      // 2. Pre-Export Validation
      const validationResult = validator.validate(rows, fields, activeProfile);

      // 3. Return results (always return rows so user can see what failed)
      res.json({ 
        success: true, 
        data: rows,
        validation: validationResult,
        profile: activeProfile
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
