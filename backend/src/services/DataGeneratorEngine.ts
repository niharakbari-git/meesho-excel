import { FixedValueGenerator } from './generators/FixedValueGenerator';
import { RandomizeGenerator } from './generators/RandomizeGenerator';
import { ValuePoolGenerator } from './generators/ValuePoolGenerator';
import { WordCombinationGenerator } from './generators/WordCombinationGenerator';
import { AutoIncrementGenerator } from './generators/AutoIncrementGenerator';
import { AIGenerator } from './generators/AIGenerator';
import { GenerationProfile } from '../types';

export class DataGeneratorEngine {
  async generateData(count: number, fields: any[], globalSettings?: any, profile?: GenerationProfile) {
    const fixedGen = new FixedValueGenerator();
    const randomizeGen = new RandomizeGenerator();
    const valuePoolGen = new ValuePoolGenerator();
    const wordComboGen = new WordCombinationGenerator();
    const autoIncGen = new AutoIncrementGenerator();
    const aiGen = new AIGenerator();

    const columnGenerators: any = {};
    let meeshoPriceCol = -1;

    // Use default profile if none provided
    const activeProfile: GenerationProfile = profile || {
      mode: 'INDEPENDENT_LISTING',
      identityStrategy: 'UNIQUE_NAME',
      adjectivePool: ['Traditional', 'Stylish', 'Elegant', 'Modern', 'Classic']
    };

    // Pre-generate data for each field for all rows to optimize
    for (const field of fields) {
      let mode = field.generationMode || 'FIXED';
      let config = field.configuration || {};
      
      const headerLower = (field.header || '').toLowerCase();
      if (headerLower === 'meesho price') {
        meeshoPriceCol = field.colNumber;
      }

      // Fallback to global settings if field-specific config is practically empty
      const isConfigEmpty = Object.keys(config).length === 0 || 
        (mode === 'FIXED' && !config.value) || 
        (mode === 'RANDOMIZE' && !config.mainValue) ||
        (mode === 'VALUE_POOL' && !config.pool) ||
        (mode === 'WORD_COMBO' && !config.words) ||
        (mode === 'AUTO_INCREMENT' && !config.prefix);

      if (isConfigEmpty && globalSettings) {
        if (field.fieldType === 'SKU' && globalSettings.skuPrefix) {
          mode = 'AUTO_INCREMENT';
          config = { prefix: globalSettings.skuPrefix, startNumber: globalSettings.startSku || 1 };
        } else if (field.fieldType === 'Price' && globalSettings.basePrice) {
          mode = 'RANDOMIZE';
          config = { mainValue: globalSettings.basePrice, variation: globalSettings.priceVariation || 0, allowDecimal: false };
        } else if (field.fieldType === 'Title' && globalSettings.keywords) {
          mode = 'WORD_COMBO';
          config = { words: globalSettings.keywords, minWords: 2, maxWords: 4 };
        } else if (field.fieldType === 'Image' && globalSettings.imageUrls) {
          mode = 'VALUE_POOL';
          config = { pool: globalSettings.imageUrls };
        }
      }

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
            count,
            !!config.unique
          );
          break;
        case 'VALUE_POOL':
          const pool = config.pool ? config.pool.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
          const isVarFieldForPool = headerLower.includes('size') || headerLower.includes('variation');
          const isSequential = (activeProfile.mode === 'VARIATION_MODE' && isVarFieldForPool) || config.unique;
          generatedValues = valuePoolGen.generate(pool, count, isSequential);
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
          generatedValues = Array(count).fill('[Custom Generator]');
          break;
      }
      
      columnGenerators[field.colNumber] = generatedValues;
    }

    const rows: any[] = [];
    const adjectivePool = activeProfile.adjectivePool.length > 0 ? activeProfile.adjectivePool : ['Premium'];
    
    // Assemble the rows
    for (let i = 0; i < count; i++) {
      const rowData: any = {};
      
      fields.forEach(field => {
        let val = columnGenerators[field.colNumber][i];
        const headerLower = (field.header || '').toLowerCase();
        
        // POST-PROCESSING RULES BASED ON MODE

        // 1. INDEPENDENT_LISTING with UNIQUE_NAME strategy
        if (activeProfile.mode === 'INDEPENDENT_LISTING' && activeProfile.identityStrategy === 'UNIQUE_NAME') {
           if (field.fieldType === 'Title' || headerLower.includes('product name')) {
              const adjective = adjectivePool[i % adjectivePool.length].trim();
              if (adjective && !val.startsWith(adjective)) {
                 val = `${adjective} ${val}`.trim();
              }
           }
        }

        // 2. VARIATION_MODE
        if (activeProfile.mode === 'VARIATION_MODE') {
           const isVariationField = headerLower.includes('size') || headerLower.includes('variation');
           const isSkuField = field.fieldType === 'SKU';
           const isInventory = headerLower.includes('inventory') || headerLower.includes('stock');

           // Overwrite shared attributes to be identical to Row 0
           if (i > 0) {
             const isSharedAttribute = !isSkuField && !isVariationField && !isInventory;
               
             if (isSharedAttribute) {
                val = rows[0][field.colNumber];
             }
           }

           // Ensure Variation column is unique
           if (isVariationField) {
              if (i === 0 && !val) {
                 val = 'Size 1';
              } else if (i > 0) {
                 let isDuplicate = false;
                 for (let j = 0; j < i; j++) {
                   if (rows[j][field.colNumber] === val) {
                     isDuplicate = true;
                     break;
                   }
                 }
                 
                 if (isDuplicate || !val) {
                    val = val ? `${val} ${i + 1}` : `Size ${i + 1}`;
                 }
              }
           }
        }
        
        // 3. RETURNS PRICE FIX
        if (headerLower.includes('returns') || headerLower.includes('defective')) {
           if (meeshoPriceCol !== -1) {
             const meeshoPrice = Number(rowData[meeshoPriceCol] || columnGenerators[meeshoPriceCol][i]);
             const currentVal = Number(val);
             
             if (!isNaN(meeshoPrice)) {
                if (!val) {
                   // If the user didn't configure a Returns Price, auto-calculate it as 10% lower
                   val = Math.floor(meeshoPrice * 0.9).toString();
                } else if (!isNaN(currentVal) && currentVal >= meeshoPrice) {
                   // The generated value is higher than Meesho Price, which breaks Meesho's hard rule!
                   // Intelligently cap it to slightly below Meesho Price (e.g. 5% lower or at least 1 unit)
                   const capDiff = Math.max(Math.floor(meeshoPrice * 0.05), 1);
                   val = (meeshoPrice - capDiff).toString();
                }
             }
           }
        }

        rowData[field.colNumber] = val;
      });
      
      rows.push(rowData);
    }
    
    return rows;
  }
}
