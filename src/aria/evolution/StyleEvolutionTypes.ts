/**
 * ARIA v2.5 Style Evolution Engine Types
 * Product: LOOK VISION v2.4
 */

export type EvolutionTriggerEvent =
  | 'outfit_like'
  | 'outfit_dislike'
  | 'creation_saved'
  | 'rec_accepted'
  | 'rec_rejected'
  | 'rec_modified'
  | 'wardrobe_usage'
  | 'wardrobe_item_worn'
  | 'manual_update'
  | 'memory_sync';

export interface StyleEvolutionSnapshot {
  snapshotId: string;
  userId: string;
  version: number;
  capturedAt: string; // ISO timestamp
  triggerEvent: EvolutionTriggerEvent;

  // Tracked Style Vector Trajectories
  preferredColors: Array<{ value: string; confidence: number; evidenceCount: number }>;
  preferredGarments: Array<{ value: string; confidence: number; evidenceCount: number }>;
  preferredBrands: Array<{ value: string; confidence: number; evidenceCount: number }>;
  preferredMaterials: Array<{ value: string; confidence: number; evidenceCount: number }>;
  fashionCategories: Array<{ value: string; weight: number }>;
  
  // Behavioral Parameters
  formalityLevel: number; // 0.0 (casual) to 1.0 (formal)
  experimentalIndex: number; // 0.0 (conservative) to 1.0 (adventurous)
  seasonalPreference: 'spring' | 'summer' | 'fall' | 'winter' | 'transition';

  // Confidence & Maturity
  overallConfidence: number; // 0.0 to 1.0
  evidenceCount: number;
  maturityLabel: string;
}

export interface StyleEvolutionTimeline {
  userId: string;
  records: StyleEvolutionSnapshot[];
  lastEvolvedAt: string;
  totalEvolutions: number;
}

export interface EvolutionConfidenceFactor {
  name: 'interaction_count' | 'recency' | 'direct_feedback' | 'usage_frequency' | 'wardrobe_density';
  weight: number;
  score: number; // 0.0 to 1.0
  reason: string;
}

export interface AttributeConfidenceScore {
  attributeKey: string;
  attributeValue: string;
  category: string;
  confidenceScore: number; // 0.0 to 1.0
  interactionCount: number;
  evidenceCount: number;
  factors: EvolutionConfidenceFactor[];
  lastUpdatedTimestamp: string;
  reasons: string[];
}

export type FeedbackType =
  | 'outfit_like'
  | 'outfit_dislike'
  | 'creation_saved'
  | 'rec_accepted'
  | 'rec_rejected'
  | 'rec_modified'
  | 'wardrobe_item_worn';

export interface UserFeedbackEvent {
  feedbackId: string;
  userId: string;
  timestamp: string;
  feedbackType: FeedbackType;
  itemId?: string;
  attributes: {
    colors?: string[];
    garments?: string[];
    brands?: string[];
    materials?: string[];
    styleVibe?: string;
    formality?: number;
    category?: string;
  };
  userNote?: string;
}

export interface RecommendationTargetOutfit {
  id?: string;
  title: string;
  colors: string[];
  garmentTypes: string[];
  brands?: string[];
  materials?: string[];
  styleVibe?: string;
  formality?: number; // 0.0 to 1.0
  season?: string;
  occasion?: string;
}

export interface RecommendationScoreRequest {
  userId: string;
  targetOutfit: RecommendationTargetOutfit;
  currentSeason?: string;
  currentOccasion?: string;
  userGoals?: string[];
  availableWardrobeIds?: string[];
}

export type RecommendationMatchLevel =
  | 'ideal_match'
  | 'strong_match'
  | 'moderate_match'
  | 'experimental_match'
  | 'low_match';

export interface RecommendationConfidenceResult {
  recommendationScore: number; // 0 to 100
  confidenceScore: number; // 0.0 to 1.0
  recommendationLevel: RecommendationMatchLevel;
  compatibilityBreakdown: {
    styleMatch: number;
    colorMatch: number;
    garmentMatch: number;
    seasonMatch: number;
    occasionMatch: number;
    wardrobeMatch: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface IntelligenceSummary {
  userId: string;
  overallConfidence: number;
  totalFeedbackProcessed: number;
  totalEvolutions: number;
  lastCalculatedAt: string;
  primaryIdentityName: string;
  topColors: string[];
  topGarments: string[];
  topBrands: string[];
  dislikedColors: string[];
  dislikedGarments: string[];
}
