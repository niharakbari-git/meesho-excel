export class WordCombinationGenerator {
  generate(words: string[], minWords: number, maxWords: number, count: number): string[] {
    const results: string[] = [];
    if (!words || words.length === 0) {
      return Array(count).fill('');
    }
    
    for (let i = 0; i < count; i++) {
      const numWords = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
      const shuffled = [...words].sort(() => 0.5 - Math.random());
      const selectedWords = shuffled.slice(0, Math.min(numWords, words.length));
      results.push(selectedWords.join(' '));
    }
    return results;
  }
}
