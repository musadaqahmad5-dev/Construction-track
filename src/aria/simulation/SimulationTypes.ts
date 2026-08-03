/**
 * ARIA v2.5 Simulation Engine Types
 * Product: LOOK VISION v2.4
 */

export type SimulationScenarioType =
  | 'add_item'
  | 'remove_item'
  | 'capsule_conversion'
  | 'seasonal_transition'
  | 'budget_plan'
  | 'occasion_planning'
  | 'palette_change'
  | 'style_evolution'
  | 'brand_shift'
  | 'wardrobe_optimization';

export interface SimulationScenarioConfig {
  scenarioId: string;
  type: SimulationScenarioType;
  title: string;
  description: string;
  parameters: {
    itemCategory?: string;
    itemDetails?: string;
    colorHex?: string;
    targetSeason?: string;
    budgetLimit?: number;
    targetOccasion?: string;
    styleShiftGoal?: string;
    targetBrand?: string;
  };
  createdAt: string;
}

export interface StyleDNAEffect {
  archetypeMatchDelta: number; // e.g. +0.05
  silhouetteAlignment: string;
  colorHarmonyScore: number; // 0.0 - 1.0
  gapClosureScore: number;
}

export interface CreativeEffect {
  aestheticSynergy: string;
  moodElevationScore: number;
  textureVersatility: string;
}

export interface AlternativeOutcome {
  outcomeId: string;
  title: string;
  description: string;
  versatilityScore: number;
  keyTradeoff: string;
}

export interface SimulationReport {
  simulationId: string;
  userId: string;
  scenario: SimulationScenarioConfig;
  expectedStyleImpact: string;
  wardrobeCompatibilityScore: number; // 0.0 - 1.0
  versatilityScore: number; // 0.0 - 1.0
  styleDNAEffect: StyleDNAEffect;
  creativeEffect: CreativeEffect;
  confidence: number;
  supportingEvidence: string[];
  reasonSignals: string[];
  alternativeOutcomes: AlternativeOutcome[];
  timestamp: string;
}

export interface SimulationEngineStatus {
  isInitialized: boolean;
  isSimulating: boolean;
  totalSimulationsRun: number;
  lastSimulatedAt?: string;
  lastError?: string;
}
