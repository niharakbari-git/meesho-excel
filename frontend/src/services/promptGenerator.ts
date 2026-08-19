/**
 * Service for generating AI prompts for product titles and descriptions.
 * Designed to be reusable and extendable for future AI features.
 */

export interface PromptParams {
  restrictedWords: string[];
  count?: number;
  context?: string;
}

export const PromptGenerator = {
  /**
   * Generates a prompt for creating product titles.
   */
  generateTitlePrompt({ restrictedWords, count = 10, context = 'the product shown in the provided image' }: PromptParams): string {
    const listString = restrictedWords.length > 0 
      ? restrictedWords.map(w => `"${w}"`).join(', ')
      : 'None';

    return `Generate ${count} unique product titles for ${context}.

Rules:
- Keep every title relevant and factually accurate.
- Do not use any word from this restricted-word list, including different capitalization: ${listString}
- Do not use unauthorized brand names.
- Do not use promotional or misleading claims.
- Do not use medical, guaranteed, or unsupported claims.
- Do not use phone numbers, URLs, emails, or social media handles.
- Avoid excessive special characters.
- Keep every title unique and marketplace-appropriate.`;
  },

  /**
   * Generates a prompt for creating product descriptions.
   */
  generateDescriptionPrompt({ restrictedWords, count = 10, context = 'the product shown in the provided image' }: PromptParams): string {
    const listString = restrictedWords.length > 0 
      ? restrictedWords.map(w => `"${w}"`).join(', ')
      : 'None';

    return `Generate ${count} unique product descriptions for ${context}.

Rules:
- Keep every description relevant and factually accurate.
- Do not use any word from this restricted-word list, including different capitalization: ${listString}
- Do not use unauthorized brand names.
- Do not use promotional or misleading claims.
- Do not use medical, guaranteed, or unsupported claims.
- Do not use phone numbers, URLs, emails, or social media handles.
- Do not invent product specifications that were not provided.
- Keep every description unique and marketplace-appropriate.`;
  }
};
