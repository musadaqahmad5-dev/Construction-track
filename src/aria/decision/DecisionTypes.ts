/**
 * ARIA v2.5 Decision Intelligence Types
 * Product: LOOK VISION v2.4
 */

export interface DecisionScoringBreakdown {
  styleMatch: number;        // 0.0 - 1.0
  colorMatch: number;        // 0.0 - 1.0
  lifestyleMatch: number;    // 0.0 - 1.0
  occasionMatch: number;     // 0.0 - 1.0
  preferenceMatch: number;   // 0.0 - 1.0
  wardrobeCompatibility: number; // 0.0 - 1.0
  overallScore: number;      // 0.0 - 1.0
  confidence: number;        // 0.0 - 1.0
}

export interface DecisionReasonSignal {
  id: string;
  category: 'memory' | 'style_dna' | 'user_context' | 'wardrobe_synergy';
  signalText: string;
  source: string;
  confidence: number;
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
  metadata?: Record<string, unknown>;
}

export interface DecisionQueryRequest {
  userId?: string;
  occasion?: string;
  weatherContext?: string;
  targetCategory?: string;
  userPrompt?: string;
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
}
