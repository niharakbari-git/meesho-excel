export class ImageEngine {
  generateCombinations(urls: string[], requiredCount: number, rowCount: number): string[][] {
    const rows: string[][] = [];
    for (let i = 0; i < rowCount; i++) {
      const shuffledUrls = [...urls].sort(() => 0.5 - Math.random());
      rows.push(shuffledUrls.slice(0, requiredCount));
    }
    return rows;
  }
}
