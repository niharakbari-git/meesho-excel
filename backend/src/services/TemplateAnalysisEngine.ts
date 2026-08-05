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
}

export class TemplateAnalysisEngine {
  classifyFields(columns: any[]): AnalyzedField[] {
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

      return {
        ...col,
        fieldType,
        subType
      };
    });

    // Helper for converting column number to letter
    const colLetter = (colNum: number) => {
      let temp, letter = '';
      while (colNum > 0) {
        temp = (colNum - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        colNum = (colNum - temp - 1) / 26;
      }
      return letter;
    };

    analyzed.forEach(col => {
      console.log(`Column ${colLetter(col.colNumber)}`);
      console.log(`Field Name: ${col.header}`);
      console.log(`Required: ${col.required}`);
      if (col.description) {
        console.log(`Description: ${col.description}`);
      }
      console.log(`Detected Type: ${col.fieldType}`);
      console.log('-'.repeat(50));
    });

    console.log('\nFINAL PARSED METADATA (JSON):');
    const jsonOutput = analyzed.map(a => ({
       name: a.header,
       required: a.required,
       type: a.fieldType
    }));
    console.log(JSON.stringify(jsonOutput, null, 2));

    return analyzed;
  }
}
