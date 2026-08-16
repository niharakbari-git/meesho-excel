export class RandomizeGenerator {
  generate(baseValue: number, variation: number, allowDecimal: boolean, count: number, unique: boolean = false): number[] {
    const results: number[] = [];
    const usedValues = new Set<number>();
    
    for (let i = 0; i < count; i++) {
      let min = baseValue - variation;
      let max = baseValue + variation;
      
      let randomValue = 0;
      let attempts = 0;
      let isUnique = false;
      
      while (!isUnique && attempts < 100) {
        randomValue = Math.random() * (max - min) + min;
        
        if (!allowDecimal) {
          randomValue = Math.floor(randomValue);
        } else {
          randomValue = parseFloat(randomValue.toFixed(2));
        }
        
        if (unique) {
          if (!usedValues.has(randomValue)) {
            isUnique = true;
            usedValues.add(randomValue);
          } else {
            // Expand the range slightly if we are getting stuck
            if (attempts > 20) {
              min -= 1;
              max += 1;
            }
          }
        } else {
          isUnique = true;
        }
        
        attempts++;
      }
      
      results.push(randomValue);
    }
    return results;
  }
}
