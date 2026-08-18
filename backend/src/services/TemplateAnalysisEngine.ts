import { getDb } from '../database/db';

export type FieldType = 
  'SKU' | 'Price' | 'Title' | 'Description' | 'Image' | 
  'ProfileData' | 'UserInput' | 'Unknown';

export interface AnalyzedField {
  header: string;
  colNumber: number;
  required: boolean;
  description?: string;
  fieldType: FieldType;
  subType?: string;
  generationMode?: string;
  configuration?: any;
  isCustomConfig?: boolean;
}

export class TemplateAnalysisEngine {
  async classifyFields(columns: any[]): Promise<AnalyzedField[]> {
    const db = getDb();
    let presets: any[] = [];
    try {
      presets = await db.all(`SELECT fieldName, fieldValue FROM global_field_presets`);
    } catch (e) {
      console.error('Failed to fetch presets', e);
    }

    const analyzed = columns.map(col => {
      const lower = col.header.toLowerCase();
      let fieldType: FieldType = 'Unknown';
      let subType: string | undefined;

      if (lower.includes('sku')) {
        fieldType = 'SKU';
      } else if (lower.includes('price') || lower.includes('mrp')) {
        fieldType = 'Price';
        if (lower.includes('mrp')) subType = 'mrp';
      } else if (lower.includes('product name') || lower.includes('title')) {
        fieldType = 'Title';
      } else if (lower.includes('description')) {
        fieldType = 'Description';
      } else if (lower.includes('image')) {
        fieldType = 'Image';
        subType = lower.includes('front') ? '1' : lower.match(/\d+/)?.[0] || '1';
      } else if (['gst', 'hsn', 'brand', 'manufacturer', 'packer'].some(k => lower.includes(k))) {
        fieldType = 'ProfileData';
        subType = ['gst', 'hsn', 'brand', 'manufacturer', 'packer'].find(k => lower.includes(k));
      } else {
        fieldType = 'UserInput';
      }

      let generationMode = 'FIXED';
      let configuration: any = { value: '' };
      let isCustomConfig = false;

      // Check for global preset match
      const matchingPreset = presets.find(p => p.fieldName.trim().toLowerCase() === col.header.trim().toLowerCase());
      if (matchingPreset) {
        generationMode = 'FIXED';
        configuration = { value: matchingPreset.fieldValue };
        isCustomConfig = true; // Mark as customized since it's an explicit preset override
      } else {
        // Fallback to empty smart defaults
        if (lower.includes('price') || lower.includes('mrp') || lower.includes('weight') || lower.includes('length') || lower.includes('width') || lower.includes('height') || lower.includes('inventory')) {
          generationMode = 'RANDOMIZE';
          configuration = { mainValue: 100, variation: 20, allowDecimal: !lower.includes('inventory') };
        } else if (lower.includes('sku')) {
          generationMode = 'AUTO_INCREMENT';
          configuration = { prefix: 'SKU', startNumber: 1 };
        } else if (lower.includes('name') && !lower.includes('generic')) {
          generationMode = 'WORD_COMBO';
          configuration = { words: '', minWords: 2, maxWords: 4 };
        } else if (lower.includes('description') || lower.includes('highlight')) {
          generationMode = 'AI';
          configuration = { sample: '', instructions: '' };
        } else if (lower.includes('image')) {
          generationMode = 'VALUE_POOL';
          configuration = { pool: '' };
        } else if (lower.includes('color') || lower.includes('pattern') || lower.includes('material') || lower.includes('size')) {
          generationMode = 'VALUE_POOL';
          configuration = { pool: '' };
        } else if (lower.includes('generic name') || lower.includes('keyword') || lower.includes('tag')) {
          generationMode = 'WORD_COMBO';
          configuration = { words: '', minWords: 1, maxWords: 3 };
        }
      }

      return {
        ...col,
        fieldType,
        subType,
        generationMode,
        configuration,
        isCustomConfig
      };
    });

    // Helper for converting column number to letter
    return analyzed;
  }
}
