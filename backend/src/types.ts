export type GenerationMode = 'INDEPENDENT_LISTING' | 'VARIATION_MODE';
export type IdentityStrategy = 'UNIQUE_NAME' | 'UNIQUE_NAME_AND_ATTR' | 'CUSTOM';

export interface GenerationProfile {
  mode: GenerationMode;
  identityStrategy: IdentityStrategy;
  adjectivePool: string[];
}

export interface ValidationError {
  row: number; // 0-indexed row number
  colNumber: number; // The column number that failed
  field: string; // The header name
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface GeneratorPayload {
  fields: any[];
  count: number;
  globalSettings: any;
  profile: GenerationProfile;
}
