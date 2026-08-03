export interface FashionCreation {
  id: string;
  userId: string;
  title: string;
  imageUrl: string;
  category: 'Outfit' | 'Dress' | 'Jacket' | 'Shoes' | 'Accessories' | 'Editorial Collection' | string;
  styleDNA: string[];
  colorPalette: string[];
  fabric: string;
  occasion: string;
  season: string;
  confidenceScore: number;
  createdAt: string;
  status: 'draft' | 'published' | 'experiment';
  description?: string;
  silhouette?: string;
  texture?: string;
  fashionEra?: string;
  luxuryLevel?: string;
  stylingDirection?: string;
  likesCount?: number;
  remixCount?: number;
  modernVsClassic?: number;
  luxuryIntensity?: number;
}

export interface CreationVersion {
  id: string;
  creationId: string;
  versionNumber: number;
  imageUrl: string;
  changes: string[];
  feedback: string;
  timestamp: string;
  parameters: {
    colorPalette?: string[];
    fabric?: string;
    silhouette?: string;
    patternVariation?: string;
    luxuryIntensity?: number;
    modernVsClassic?: number;
    texture?: string;
  };
}

export interface CreationPromptParameters {
  userPrompt: string;
  silhouette: string;
  fabric: string;
  texture: string;
  colorPalette: string[];
  fashionEra: string;
  occasion: string;
  luxuryLevel: 'Haute Couture' | 'Pret-A-Porter' | 'Bespoke Luxury' | 'Streetwear Premium' | string;
  stylingDirection: string;
  styleDNAScore?: number;
}

export interface ARIACreativeSuggestion {
  id: string;
  type: 'style_dna' | 'luxury_score' | 'synergy' | 'trend';
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string | number;
  impactColor: string;
  suggestedAction?: string;
}
