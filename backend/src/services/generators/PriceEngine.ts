export class PriceEngine {
  generate(basePrice: number, variation: number, count: number): number[] {
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const min = basePrice - variation;
      const max = basePrice + variation;
      const randomPrice = Math.floor(Math.random() * (max - min + 1)) + min;
      prices.push(randomPrice);
    }
    return prices;
  }
}
