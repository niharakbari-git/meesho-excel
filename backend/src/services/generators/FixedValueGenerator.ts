export class FixedValueGenerator {
  generate(value: string, count: number): string[] {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(value);
    }
    return results;
  }
}
