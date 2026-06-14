import { RenderedLook } from '../rendering/outfitRenderer';

export interface LookGenerationRequest {
  tenantId: string;
  styleDNAOverrides?: {
    minimalist?: number;
    cyberpunk?: number;
    luxury?: number;
  };
  promptContext: string;
}

export interface RecommendedStyleResponse {
  recommendedStyles: string[];
  confidenceFactor: number;
  matchSchemaId: string;
}

export interface ScoreOutfitRequest {
  garmentIds: string[];
  tenantId: string;
}
