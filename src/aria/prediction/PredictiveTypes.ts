/**
 * ARIA v3.0 Predictive Fashion Intelligence & Future Simulation Types
 * Product: LOOK VISION v2.4
 */

export type StyleTransitionPhase = 'STABLE' | 'EMERGING' | 'TRANSITIONING' | 'TRANSFORMATIONAL';
export type TrendCyclePhase = 'EMERGING' | 'PEAK_GROWTH' | 'MATURE' | 'DECLINING' | 'RECURRING_HERITAGE';
export type AdditionPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface FutureStylePrediction {
  predictionId: string;
  userId: string;
  timeHorizonMonths: number; // e.g. 3, 6, 12
  predictedArchetype: string;
  predictedPalette: string[];
  predictedFormalityShift: number; // -1.0 (casual shift) to +1.0 (formal shift)
  predictedSilhouettes: string[];
  emergingPreferences: string[];
  styleTransitionPhase: StyleTransitionPhase;
  confidenceScore: number; // 0-100
  createdAt: string;
}

export interface TrendForecast {
  forecastId: string;
  trendName: string;
  category: string;
  cyclePhase: TrendCyclePhase;
  compatibilityScore: number; // 0-100
  seasonalAlignment: string; // e.g., 'Spring/Summer 2027'
  projectedAdoptionWindow: string; // e.g., '3-6 months'
  keyElements: string[];
  sourceNodeIds: string[];
}

export interface RecommendedAddition {
  itemCategory: string;
  styleDescription: string;
  priority: AdditionPriority;
  projectedSynergyGain: number; // e.g. +15% capsule efficiency
}

export interface PredictedUnusedItem {
  itemId?: string;
  itemCategory: string;
  description: string;
  riskFactor: number; // 0.0 to 1.0 risk of becoming unused
}

export interface WardrobeEvolutionPrediction {
  simulationId: string;
  timeHorizonMonths: number;
  projectedEfficiencyScore: number; // 0-100
  recommendedAdditions: RecommendedAddition[];
  predictedUnusedItems: PredictedUnusedItem[];
  capsuleOptimizationSuggestions: string[];
}

export interface PredictionConfidence {
  historicalAccuracyScore: number; // 0.0 to 1.0
  styleEvolutionStabilityScore: number; // 0.0 to 1.0
  agentReliabilityScore: number; // 0.0 to 1.0
  knowledgeEvidenceScore: number; // 0.0 to 1.0
  userFeedbackQualityScore: number; // 0.0 to 1.0
  finalPredictionConfidence: number; // 0 to 100
}

export interface SimulationScenario {
  scenarioId: string;
  userId: string;
  title: string;
  timeHorizonMonths: number;
  stylePrediction: FutureStylePrediction;
  trendForecasts: TrendForecast[];
  wardrobeEvolution: WardrobeEvolutionPrediction;
  confidence: PredictionConfidence;
  executiveSummary: string;
  keyInsights: string[];
  latencyMs: number;
  createdAt: string;
}

export interface PredictionCacheEntry {
  scenarioId: string;
  record: SimulationScenario;
  savedAt: string;
}
