/**
 * ARIA v2.5 Visual Intelligence Types
 * Product: LOOK VISION v2.4
 */

export interface DetectedGarment {
  id: string;
  name: string;
  category: string;             // e.g. 'Outerwear', 'Bottoms', 'Knitwear', 'Footwear', 'Accessories'
  primaryColor: string;
  secondaryColor?: string;
  pattern: string;              // e.g. 'Solid', 'Pinstripe', 'Houndstooth', 'Plaid'
  fabricTexture: string;        // e.g. 'Virgin Wool', 'Cashmere', 'Poplin Cotton', 'Calfskin'
  fitType: string;              // e.g. 'Oversized', 'Tailored', 'Slim', 'Relaxed'
  confidence: number;           // 0.0 to 1.0
  bbox?: number[];              // Normalized bounding box [ymin, xmin, ymax, xmax]
}

export interface ExtractedColorSwatch {
  hex: string;
  colorName: string;
  percentage: number;           // 0 to 100
  isDominant: boolean;
  isAccent: boolean;
}

export interface VisualCompatibilityResult {
  overallCompatibilityScore: number; // 0.0 to 1.0
  styleDNAHarmonyScore: number;       // 0.0 to 1.0
  colorHarmonyScore: number;          // 0.0 to 1.0
  proportionalBalanceScore: number;   // 0.0 to 1.0
  outfitCompletenessScore: number;    // 0.0 to 1.0
  compatibilityNotes: string[];
}

export interface VisionAnalysisResult {
  analysisId: string;
  userId?: string;
  imageUrl?: string;
  imageName?: string;
  garments: DetectedGarment[];
  colorPalette: ExtractedColorSwatch[];
  compatibility: VisualCompatibilityResult;
  overallConfidence: number;
  supportingEvidence: string[];
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface VisionAnalysisRequest {
  userId?: string;
  imageUrl?: string;
  imageBase64?: string;
  imageName?: string;
  targetContext?: string;
}

export interface VisionEngineStatus {
  isInitialized: boolean;
  isAnalyzing: boolean;
  historyCount: number;
  storageMode: 'firestore' | 'offline_local';
  lastAnalyzedAt?: string;
  lastError?: string;
}
