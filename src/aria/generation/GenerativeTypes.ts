/**
 * ARIA v3.1 Generative Fashion Intelligence Types
 * Product: LOOK VISION v2.4
 */

export interface GenerationConfidence {
  styleDNAAlignmentScore: number; // 0.0 to 1.0
  historicalEvidenceScore: number; // 0.0 to 1.0
  predictionCompatibilityScore: number; // 0.0 to 1.0
  agentConsensusScore: number; // 0.0 to 1.0
  userPreferenceAccuracyScore: number; // 0.0 to 1.0
  finalCreativeConfidence: number; // 0 to 100
}

export interface ConceptOutfitItem {
  category: string;
  description: string;
  color: string;
  silhouette: string;
  ownedItemMatch?: boolean;
}

export interface FashionConcept {
  conceptId: string;
  userId: string;
  title: string;
  aestheticTheme: string;
  description: string;
  outfitItems: ConceptOutfitItem[];
  colorPalette: string[];
  stylingDirections: string[];
  referencedKnowledgeNodes: string[];
  confidence: GenerationConfidence;
  createdAt: string;
}

export interface OutfitGenerationRequest {
  userId: string;
  userPrompt?: string;
  occasion?: string;
  season?: string;
  incorporateOwnedItems?: boolean;
  timeHorizonMonths?: number;
}

export interface DesignNarrative {
  narrativeId: string;
  title: string;
  historicalReferences: string[];
  luxuryPositioning: string;
  designPhilosophies: string[];
  editorialSummary: string;
}

export interface CreativeDirection {
  directionId: string;
  userId: string;
  seasonalTheme: string;
  personalFashionIdentity: string;
  designNarrative: DesignNarrative;
  keyColorStory: string[];
  keySilhouettes: string[];
  supportingConcepts: FashionConcept[];
  confidence: GenerationConfidence;
  createdAt: string;
}

export interface CapsulePiece {
  category: string;
  description: string;
  versatilityScore: number; // 0-100
  owned: boolean;
}

export interface CapsuleCollection {
  capsuleId: string;
  userId: string;
  collectionName: string;
  targetSeason: string;
  corePieces: CapsulePiece[];
  missingPriorityPieces: { category: string; description: string; synergyGain: number }[];
  rotationCombinationsCount: number;
  optimizationStrategy: string[];
  confidence: GenerationConfidence;
  createdAt: string;
}

export interface GenerationCacheEntry {
  generationId: string;
  type: 'CONCEPT' | 'CREATIVE_DIRECTION' | 'CAPSULE';
  payload: FashionConcept | CreativeDirection | CapsuleCollection;
  savedAt: string;
}
