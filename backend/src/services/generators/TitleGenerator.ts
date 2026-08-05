export class TitleGenerator {
  generate(keywords: string[], count: number): string[] {
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const shuffled = [...keywords].sort(() => 0.5 - Math.random());
      titles.push(shuffled.slice(0, 3 + Math.floor(Math.random() * 3)).join(' '));
    }
    return titles;
  }
}
