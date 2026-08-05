export class RandomizeGenerator {
  generate(baseValue: number, variation: number, allowDecimal: boolean, count: number): number[] {
    const results: number[] = [];
    for (let i = 0; i < count; i++) {
      const min = baseValue - variation;
      const max = baseValue + variation;
      let randomValue = Math.random() * (max - min) + min;
      
      if (!allowDecimal) {
        randomValue = Math.floor(randomValue);
      } else {
        randomValue = parseFloat(randomValue.toFixed(2));
      }
      results.push(randomValue);
    }
    return results;
  }
}
