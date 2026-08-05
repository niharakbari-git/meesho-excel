import { FixedValueGenerator } from './generators/FixedValueGenerator';
import { RandomizeGenerator } from './generators/RandomizeGenerator';
import { ValuePoolGenerator } from './generators/ValuePoolGenerator';
import { WordCombinationGenerator } from './generators/WordCombinationGenerator';
import { AutoIncrementGenerator } from './generators/AutoIncrementGenerator';
import { AIGenerator } from './generators/AIGenerator';

export class DataGeneratorEngine {
  async generateData(count: number, fields: any[]) {
    const fixedGen = new FixedValueGenerator();
    const randomizeGen = new RandomizeGenerator();
    const valuePoolGen = new ValuePoolGenerator();
    const wordComboGen = new WordCombinationGenerator();
    const autoIncGen = new AutoIncrementGenerator();
    const aiGen = new AIGenerator();

    const columnGenerators: any = {};

    // Pre-generate data for each field for all rows to optimize
    for (const field of fields) {
      const mode = field.generationMode || 'FIXED';
      const config = field.configuration || {};
      
      let generatedValues: any[] = Array(count).fill('');

      switch (mode) {
        case 'FIXED':
          generatedValues = fixedGen.generate(config.value || '', count);
          break;
        case 'RANDOMIZE':
          generatedValues = randomizeGen.generate(
            Number(config.mainValue) || 0,
            Number(config.variation) || 0,
            !!config.allowDecimal,
            count
          );
          break;
        case 'VALUE_POOL':
          const pool = config.pool ? config.pool.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
          generatedValues = valuePoolGen.generate(pool, count);
          break;
        case 'WORD_COMBO':
          const words = config.words ? config.words.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
          generatedValues = wordComboGen.generate(
            words,
            Number(config.minWords) || 1,
            Number(config.maxWords) || 3,
            count
          );
          break;
        case 'AUTO_INCREMENT':
          generatedValues = autoIncGen.generate(
            config.prefix || '',
            Number(config.startNumber) || 1,
            count
          );
          break;
        case 'AI':
          generatedValues = await aiGen.generate(
            config.sample || '',
            config.instructions || '',
            count
          );
          break;
        case 'CUSTOM':
          // Reserved for future
          generatedValues = Array(count).fill('[Custom Generator Placeholder]');
          break;
      }
      
      columnGenerators[field.colNumber] = generatedValues;
    }

    const rows: any[] = [];
    
    // Assemble the rows
    for (let i = 0; i < count; i++) {
      const rowData: any = {};
      fields.forEach(field => {
        rowData[field.colNumber] = columnGenerators[field.colNumber][i];
      });
      rows.push(rowData);
    }
    
    return rows;
  }
}
