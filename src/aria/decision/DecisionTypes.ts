/**
 * ARIA v2.5 Decision Intelligence & Contextual Decision Engine Types
 * Product: LOOK VISION v2.4
 */

export interface ContextProfile {
  contextId: string;
  userId: string;
  occasion: string;
  eventType: 'business' | 'social' | 'creative' | 'active' | 'formal' | 'casual' | 'everyday';
  formalityRequirement: number; // 0.0 (casual) to 1.0 (black tie formal)
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'transition';
  weatherCondition: {
    temperatureC?: number;
    condition?: 'sunny' | 'rainy' | 'cold' | 'hot' | 'mild' | 'windy';
    indoorOutdoor?: 'indoor' | 'outdoor' | 'mixed';
  };
  userGoals: string[];
  importanceLevel: 'high' | 'medium' | 'low';
  wardrobeAvailabilityCount: number;
  timestamp: string;
  confidenceScore: number; // 0.0 to 1.0
}

export interface DecisionScoringFactor {
  factorKey: string;
  factorName: string;
  score: number; // 0 - 100
  weight: number; // 0.0 - 1.0
  reasoning: string;
}

export interface DecisionScoringBreakdown {
  styleMatch: number;               // 0.0 - 1.0
  colorMatch: number;               // 0.0 - 1.0
  lifestyleMatch: number;           // 0.0 - 1.0
  occasionMatch: number;            // 0.0 - 1.0
  preferenceMatch: number;          // 0.0 - 1.0
  wardrobeCompatibility: number;    // 0.0 - 1.0
  materialSuitability?: number;     // 0.0 - 1.0
  seasonalWeatherSuitability?: number; // 0.0 - 1.0
  feedbackHistoryScore?: number;     // 0.0 - 1.0
  overallScore: number;             // 0.0 - 1.0
  confidence: number;               // 0.0 - 1.0
}

export interface DecisionScore {
  scoreId: string;
  decisionId: string;
  overallScore: number; // 0 - 100
  confidenceLevel: number; // 0.0 - 1.0
  breakdown: DecisionScoringBreakdown;
  factors: DecisionScoringFactor[];
  reasoningFactors: string[];
  calculatedAt: string;
}

export interface DecisionReasonSignal {
  id: string;
  category: 'memory' | 'style_dna' | 'user_context' | 'wardrobe_synergy' | 'feedback_history' | 'evolution';
  signalText: string;
  source: string;
  confidence: number;
}

export interface OutfitItemReference {
  id?: string;
  title: string;
  category: string;
  color?: string;
  brand?: string;
  material?: string;
  isOwned: boolean; // True if item comes directly from user's active closet
  sourceGarmentId?: string;
}

export interface OutfitComposition {
  top?: OutfitItemReference;
  bottom?: OutfitItemReference;
  outerwear?: OutfitItemReference;
  footwear?: OutfitItemReference;
  accessories?: OutfitItemReference[];
}

export interface StructuredDecisionReasoning {
  recommendationTitle: string;
  summaryText: string;
  outfitComposition: OutfitComposition;
  ownedItemRatio: number; // 0.0 to 1.0 (e.g. 0.75 = 75% owned from closet)
  rationaleSignals: DecisionReasonSignal[];
  stylingAdvice: string;
  keyAdjustments: string[];
  contextMatchExplanation: string;
}

export type DecisionFeedbackActionType = 'accepted' | 'rejected' | 'modified';

export interface DecisionFeedbackAction {
  actionId: string;
  decisionId: string;
  userId: string;
  actionType: DecisionFeedbackActionType;
  timestamp: string;
  userModificationNotes?: string;
  modifiedItems?: OutfitComposition;
}

export interface RecommendationMetrics {
  userId: string;
  totalDecisionsGenerated: number;
  totalAccepted: number;
  totalRejected: number;
  totalModified: number;
  acceptanceRate: number; // 0.0 to 1.0
  averageConfidence: number; // 0.0 to 1.0
  averageLatencyMs: number;
  lastUpdated: string;
}

export interface FashionRecommendation {
  recommendationId: string;
  userId?: string;
  title: string;
  description: string;
  category?: string;
  suggestedItems?: string[];
  stylingAdvice?: string;
  confidence: number;
  overallScore: number;
  styleAlignment: number;
  memoryAlignment: number;
  occasionMatch: number;
  colorHarmony: number;
  scoringBreakdown: DecisionScoringBreakdown;
  reasonSignals: DecisionReasonSignal[];
  evidenceCount: number;
  createdAt: string;

  // Priority 4 Contextual Outfit Decision Engine Extensions
  contextProfile?: ContextProfile;
  decisionScore?: DecisionScore;
  reasoning?: StructuredDecisionReasoning;
  status?: 'pending' | 'accepted' | 'rejected' | 'modified';
  metadata?: Record<string, unknown>;
}

export interface DecisionQueryRequest {
  userId?: string;
  occasion?: string;
  eventType?: 'business' | 'social' | 'creative' | 'active' | 'formal' | 'casual' | 'everyday';
  formalityRequirement?: number; // 0.0 - 1.0
  season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'transition';
  weatherContext?: string;
  temperatureC?: number;
  indoorOutdoor?: 'indoor' | 'outdoor' | 'mixed';
  targetCategory?: string;
  userPrompt?: string;
  userGoals?: string[];
  preferredPalette?: string[];
  includeWardrobeContext?: boolean;
}

export interface DecisionEngineStatus {
  isInitialized: boolean;
  isProcessing: boolean;
  historyCount: number;
  storageMode: 'firestore' | 'offline_local';
  lastGeneratedAt?: string;
  lastError?: string;
  metrics?: RecommendationMetrics;
}
