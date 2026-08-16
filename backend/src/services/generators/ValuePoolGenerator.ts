export class ValuePoolGenerator {
  generate(pool: string[], count: number, sequential: boolean = false): string[] {
    const results: string[] = [];
    if (!pool || pool.length === 0) {
      return Array(count).fill('');
    }
    for (let i = 0; i < count; i++) {
      if (sequential) {
        results.push(pool[i % pool.length]);
      } else {
        const randomIndex = Math.floor(Math.random() * pool.length);
        results.push(pool[randomIndex]);
      }
    }
    return results;
  }
}
