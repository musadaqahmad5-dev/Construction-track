/**
 * ARIA v3.2 Visual Fashion Intelligence Types
 * Product: LOOK VISION v2.4
 */

export interface VisionConfidence {
  imageQualityScore: number;       // 0.0 to 1.0
  recognitionAccuracyScore: number; // 0.0 to 1.0
  styleDNAMatchScore: number;       // 0.0 to 1.0
  knowledgeEvidenceScore: number;   // 0.0 to 1.0
  agentConsensusScore: number;      // 0.0 to 1.0
  finalVisualConfidence: number;    // 0 to 100
}

export interface GarmentRecognition {
  garmentId: string;
  name: string;
  category: string;             // e.g. 'Outerwear', 'Bottoms', 'Knitwear', 'Footwear', 'Accessories', 'Tops'
  construction: string;         // e.g. 'Unstructured double-face', 'Single-pleated canvas', 'Hand-welted'
  details: string[];            // e.g. ['Notched lapel', 'Horn buttons', 'Patch pockets']
  seasonSuitability: string[];  // e.g. ['Autumn/Winter', 'Transitional']
  primaryColor: string;
  secondaryColor?: string;
  pattern: string;              // e.g. 'Solid Matte', 'Subtle Pinstripe'
  material: string;             // e.g. 'Virgin Wool', 'Cashmere Blend'
  silhouette: string;           // e.g. 'Tailored Fluid', 'Boxy Tapered'
  confidence: number;           // 0.0 to 1.0
  bbox?: number[];              // [ymin, xmin, ymax, xmax]
}

export interface SilhouetteAnalysis {
  shoulderStructure: string;    // e.g. 'Soft unstructured', 'Padded architectural'
  waistDefinition: string;     // e.g. 'High waisted pleated', 'Relaxed straight'
  trouserLegRatio: string;     // e.g. 'Fluid wide-leg', 'Slim tapered'
  overallProportion: string;   // e.g. '1:2 Architectural Column'
  balanceScore: number;        // 0.0 to 1.0
}

export interface FabricAnalysis {
  appearance: string;          // e.g. 'Matte finish with subtle weave texture'
  texture: string;             // e.g. 'Tactile heavy-drape wool crepe'
  materialCharacteristics: string[]; // e.g. ['Thermal regulating', 'Crease resistant', 'High recovery']
  perceivedLuxuryIndex: number; // 0.0 to 1.0
}

export interface ExtractedColorSwatch {
  hex: string;
  colorName: string;
  percentage: number;           // 0 to 100
  isDominant: boolean;
  isAccent: boolean;
}

export interface ColorAnalysisResult {
  dominantColors: ExtractedColorSwatch[];
  paletteCompatibilityScore: number;  // 0.0 to 1.0
  contrastLevel: 'High Contrast' | 'Monochromatic' | 'Tonal Minimalist' | 'Complementary';
  styleDNAAlignmentScore: number;     // 0.0 to 1.0
  colorNotes: string[];
}

export interface OutfitVisualProfile {
  outfitId: string;
  composition: string;               // e.g. '3-piece tailored winter layering'
  layeringDepth: number;            // e.g. 3
  proportion: string;               // e.g. 'Elongated architectural column'
  silhouette: SilhouetteAnalysis;
  colorHarmony: ColorAnalysisResult;
  fabricAnalysis: FabricAnalysis;
  overallHarmonyScore: number;      // 0.0 to 1.0
}

export interface VisualStyleEmbedding {
  embeddingId: string;
  vector: number[];                 // 128-dimensional normalized float array
  dimension: number;                // 128
  aestheticTag: string;             // e.g. 'Quiet Luxury Architectural Minimalist'
  similarityCluster: string;         // e.g. 'cluster_minimalist_ta04'
  generatedAt: string;
}

export interface VisualFashionAnalysis {
  analysisId: string;
  userId: string;
  imageUrl?: string;
  imageName: string;
  garments: GarmentRecognition[];
  outfitProfile: OutfitVisualProfile;
  visualEmbedding: VisualStyleEmbedding;
  confidence: VisionConfidence;
  supportingEvidence: string[];
  referencedKnowledgeNodes: string[];
  createdAt: string;
}

// Backward Compatibility Types for previous ARIA versions
export interface DetectedGarment {
  id: string;
  name: string;
  category: string;
  primaryColor: string;
  secondaryColor?: string;
  pattern: string;
  fabricTexture: string;
  fitType: string;
  confidence: number;
  bbox?: number[];
}

export interface VisualCompatibilityResult {
  overallCompatibilityScore: number;
  styleDNAHarmonyScore: number;
  colorHarmonyScore: number;
  proportionalBalanceScore: number;
  outfitCompletenessScore: number;
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
