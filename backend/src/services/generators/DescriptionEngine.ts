export class DescriptionEngine {
  async generate(keywords: string[], count: number): Promise<string[]> {
    const descriptions: string[] = [];
    for (let i = 0; i < count; i++) {
      const description = `This is a highly SEO-friendly product description generated for keywords: ${keywords.join(', ')}. ` +
      `It highlights the premium quality and unique features of the product. `.repeat(15) +
      `[MOCK LLM GENERATION - 500 words would go here]`;
      
      descriptions.push(description);
    }
    return descriptions;
  }
}
