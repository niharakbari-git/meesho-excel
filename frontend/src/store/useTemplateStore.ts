import { create } from 'zustand';

export interface AnalyzedField {
  header: string;
  colNumber: number;
  required: boolean;
  description?: string;
  fieldType: string;
  subType?: string;
  generationMode?: string;
  configuration?: any;
}

export interface TemplateState {
  sheetName: string;
  headerRowIndex: number;
  dataRowStart: number;
  fields: AnalyzedField[];
  filePath: string;
  setTemplateData: (data: any) => void;
  updateFieldType: (colNumber: number, fieldType: string) => void;
  updateFieldConfig: (colNumber: number, mode: string, config: any) => void;
}

const applySmartDefaults = (field: AnalyzedField): AnalyzedField => {
  const headerLower = (field.header || '').toLowerCase();
  
  let mode = 'FIXED';
  let config: any = { value: '' };

  if (headerLower.includes('price') || headerLower.includes('mrp') || headerLower.includes('weight') || headerLower.includes('length') || headerLower.includes('width') || headerLower.includes('height') || headerLower.includes('inventory')) {
    mode = 'RANDOMIZE';
    config = { mainValue: 100, variation: 20, allowDecimal: !headerLower.includes('inventory') };
  } else if (headerLower.includes('sku')) {
    mode = 'AUTO_INCREMENT';
    config = { prefix: 'SKU', startNumber: 1 };
  } else if (headerLower.includes('name') && !headerLower.includes('generic')) {
    mode = 'AI';
    config = { sample: '', instructions: 'Generate product name' };
  } else if (headerLower.includes('description') || headerLower.includes('highlight')) {
    mode = 'AI';
    config = { sample: '', instructions: 'Generate description' };
  } else if (headerLower.includes('image')) {
    mode = 'VALUE_POOL'; // Alias for Image Pool
    config = { pool: 'url1, url2' };
  } else if (headerLower.includes('color') || headerLower.includes('pattern') || headerLower.includes('material') || headerLower.includes('size')) {
    mode = 'VALUE_POOL';
    config = { pool: '' };
  } else if (headerLower.includes('generic name') || headerLower.includes('keyword') || headerLower.includes('tag')) {
    mode = 'WORD_COMBO';
    config = { words: '', minWords: 1, maxWords: 3 };
  }

  return {
    ...field,
    generationMode: mode,
    configuration: config,
  };
};

export const useTemplateStore = create<TemplateState>((set) => ({
  sheetName: '',
  headerRowIndex: 0,
  dataRowStart: 0,
  fields: [],
  filePath: '',
  setTemplateData: (data) => {
    const fieldsWithDefaults = (data.fields || []).map(applySmartDefaults);
    set({ ...data, fields: fieldsWithDefaults });
  },
  updateFieldType: (colNumber, fieldType) => set((state) => ({
    fields: state.fields.map(f => f.colNumber === colNumber ? { ...f, fieldType } : f)
  })),
  updateFieldConfig: (colNumber, mode, config) => set((state) => ({
    fields: state.fields.map(f => f.colNumber === colNumber ? { ...f, generationMode: mode, configuration: config } : f)
  }))
}));
