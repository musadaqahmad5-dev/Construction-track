/**
 * ARIA v2.5 Digital Twin Types
 * Product: LOOK VISION v2.4
 */

export interface PreferencePattern {
  category: string;
  preferredValue: string;
  weight: number; // 0.0 - 1.0
  confidence: number;
  source: string;
}

export interface EvolutionMilestone {
  milestoneId: string;
  timestamp: string;
  phaseName: string;
  description: string;
  triggerEvent: string;
  keyShift: string;
  confidence: number;
}

export interface WardrobeInsight {
  insightId: string;
  category: 'frequent_styles' | 'preferred_combos' | 'usage_patterns' | 'repetition' | 'wardrobe_gaps';
  title: string;
  description: string;
  confidence: number;
  evidenceCount: number;
  source: string;
}

export interface FashionForecastSignal {
  forecastId: string;
  dimension: 'future_direction' | 'seasonal_evolution' | 'wardrobe_gap' | 'creative_growth';
  title: string;
  forecastText: string;
  confidence: number;
  reasoningSignals: string[];
  supportingHistory: string[];
  horizonMonths: number;
}

export interface DigitalTwinModel {
  twinId: string;
  userId: string;
  identitySummary: {
    archetypeTitle: string;
    description: string;
    signatureColors: string[];
    primarySilhouette: string;
    styleMaturityLevel: 'Emerging' | 'Curated' | 'Refined' | 'Avant-Garde';
    styleMaturityScore: number; // 0.0 - 1.0
  };
  currentStyleState: {
    dominantVibe: string;
    activePalette: string[];
    recentFormalityBias: string;
    confidence: number;
  };
  preferencePatterns: PreferencePattern[];
  wardrobeBehaviour: WardrobeInsight[];
  creativeDirections: {
    activeTheme: string;
    colorStory: string[];
    moodKeyword: string;
  }[];
  evolutionTimeline: EvolutionMilestone[];
  futureForecasts: FashionForecastSignal[];
  supportingEvidence: string[];
  lastUpdated: string;
}

export interface DigitalTwinEngineStatus {
  isInitialized: boolean;
  isAnalyzing: boolean;
  storageMode: 'firestore' | 'offline_local';
  lastAnalyzedAt?: string;
  lastError?: string;
}
