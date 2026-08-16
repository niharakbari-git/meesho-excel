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
  isCustomConfig?: boolean;
}

export interface TemplateState {
  sheetName: string;
  headerRowIndex: number;
  dataRowStart: number;
  fields: AnalyzedField[];
  filePath: string;
  
  // Robust Generation State
  generationMode: 'INDEPENDENT_LISTING' | 'VARIATION_MODE';
  setGenerationMode: (mode: 'INDEPENDENT_LISTING' | 'VARIATION_MODE') => void;
  
  setTemplateData: (data: any) => void;
  updateFieldType: (colNumber: number, fieldType: string) => void;
  updateFieldConfig: (colNumber: number, mode: string, config: any) => void;
  applySavedProfile: (savedFields: AnalyzedField[], mode: 'INDEPENDENT_LISTING' | 'VARIATION_MODE') => void;
}



export const useTemplateStore = create<TemplateState>((set) => ({
  sheetName: '',
  headerRowIndex: 0,
  dataRowStart: 0,
  fields: [],
  filePath: '',
  generationMode: 'INDEPENDENT_LISTING',
  setGenerationMode: (mode) => set({ generationMode: mode }),
  setTemplateData: (data) => {
    set({ ...data, fields: data.fields || [] });
  },
  updateFieldType: (colNumber, fieldType) => set((state) => ({
    fields: state.fields.map(f => f.colNumber === colNumber ? { ...f, fieldType } : f)
  })),
  updateFieldConfig: (colNumber, mode, config) => set((state) => ({
    fields: state.fields.map(f => f.colNumber === colNumber ? { ...f, generationMode: mode, configuration: config, isCustomConfig: true } : f)
  })),
  applySavedProfile: (savedFields, mode) => set((state) => {
    const newFields = state.fields.map(f => {
      const saved = savedFields.find(sf => sf.header.trim().toLowerCase() === f.header.trim().toLowerCase());
      if (saved) {
        return { ...f, generationMode: saved.generationMode, configuration: saved.configuration, isCustomConfig: true };
      }
      return f;
    });
    return { fields: newFields, generationMode: mode };
  })
}));
