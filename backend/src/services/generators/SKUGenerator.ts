export class SKUGenerator {
  generate(prefix: string, count: number, startNumber: number = 1): string[] {
    const skus: string[] = [];
    for (let i = 0; i < count; i++) {
      skus.push(`${prefix}${(startNumber + i).toString().padStart(3, '0')}`);
    }
    return skus;
  }
}
