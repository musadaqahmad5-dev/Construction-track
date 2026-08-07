/**
 * ARIA Gemini Fashion Intelligence Types
 * Product: LOOK VISION v2.4
 */

export type GeminiHealthStatus = 'AVAILABLE' | 'OFFLINE_FALLBACK' | 'ERROR';

export interface GeminiTelemetryData {
  latencyMs: number;
  tokensUsed?: number;
  imageProcessingTimeMs?: number;
  confidenceScore: number;
  timestamp: string;
  modelUsed: string;
  status: GeminiHealthStatus;
  errorMessage?: string;
}

export interface DetectedGarment {
  id: string;
  name: string;
  category: string;
  color: string;
  secondaryColor?: string;
  pattern?: string;
  material?: string;
  fit?: string;
  confidence: number;
}

export interface ExtractedColorSwatch {
  hex: string;
  colorName: string;
  percentage: number;
  isDominant: boolean;
  isAccent: boolean;
}

export interface FabricDetail {
  material: string;
  texture: string;
  weight?: string;
  breathability?: string;
}

export interface VisualStyleClassification {
  primaryStyle: string;
  subStyles: string[];
  formalityLevel: string;
  aestheticScore: number;
}

export interface VisualFashionAnalysis {
  analysisId: string;
  timestamp: string;
  imageUrl?: string;
  imageName?: string;
  outfitSummary: string;
  garments: DetectedGarment[];
  colorPalette: ExtractedColorSwatch[];
  fabricDetails: FabricDetail[];
  visualStyleClassification: VisualStyleClassification;
  styleDNAHarmonyScore: number;
  overallConfidence: number;
  keyInsights: string[];
  embeddingVector?: number[];
  telemetry: GeminiTelemetryData;
}

export interface FashionReasoningInput {
  userQuery?: string;
  styleDna?: any;
  memoryContext?: any;
  visualAnalysis?: VisualFashionAnalysis;
  targetOccasion?: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export interface FashionReasoningOutput {
  id: string;
  timestamp: string;
  reasoningText: string;
  stylingExplanation: string;
  creativeDirection: string;
  recommendationEnhancement: {
    outfitName: string;
    items: string[];
    suitabilityScore: number;
    colorHarmony: string;
    materialSynergy: string;
  };
  confidenceScore: number;
  telemetry: GeminiTelemetryData;
}
