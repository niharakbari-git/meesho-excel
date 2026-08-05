export class AutoIncrementGenerator {
  generate(prefix: string, startNumber: number, count: number): string[] {
    const results: string[] = [];
    let current = startNumber;
    for (let i = 0; i < count; i++) {
      results.push(`${prefix}${current}`);
      current++;
    }
    return results;
  }
}
