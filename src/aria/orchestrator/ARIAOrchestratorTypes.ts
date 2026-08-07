/**
 * ARIA v3.2 Orchestrator TypeScript Definitions
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Architecture
 */

import { FashionRecommendation } from '../decision/DecisionTypes';
import { FashionConcept, CapsuleCollection } from '../generation/GenerativeTypes';
import { VisualFashionAnalysis } from '../vision/VisionTypes';
import { SimulationScenario, TrendForecast } from '../prediction/PredictiveTypes';

export type ARIAIntent =
  | 'OUTFIT_RECOMMENDATION'
  | 'IMAGE_ANALYSIS'
  | 'STYLE_CREATION'
  | 'WARDROBE_OPTIMIZATION'
  | 'STYLE_PREDICTION'
  | 'TREND_ANALYSIS';

export interface ARIAExecutionContext {
  readonly occasion?: string;
  readonly season?: string;
  readonly weatherContext?: string;
  readonly temperatureC?: number;
  readonly timeHorizonMonths?: number;
  readonly activeFeatures?: readonly string[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface ARIARequest {
  readonly requestId: string;
  readonly userId: string;
  readonly intent?: ARIAIntent;
  readonly userPrompt: string;
  readonly imageUrl?: string;
  readonly imageBase64?: string;
  readonly imageName?: string;
  readonly context?: ARIAExecutionContext;
  readonly options?: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
}

export interface ARIAReasoningTrace {
  readonly traceId: string;
  readonly engineName: string;
  readonly stepName: string;
  readonly reasoningSummary: string;
  readonly latencyMs: number;
  readonly confidenceScore: number;
  readonly evidence: readonly string[];
}

export interface ARIAConfidenceReport {
  readonly styleDNAMatch: number;
  readonly visualHarmony?: number;
  readonly knowledgeEvidence: number;
  readonly predictionScore?: number;
  readonly agentConsensus: number;
  readonly finalConfidence: number;
}

export interface ARIAResponse {
  readonly responseId: string;
  readonly requestId: string;
  readonly intent: ARIAIntent;
  readonly userId: string;
  readonly summary: string;
  readonly recommendation?: FashionRecommendation;
  readonly concept?: FashionConcept;
  readonly visionAnalysis?: VisualFashionAnalysis;
  readonly simulationScenario?: SimulationScenario;
  readonly trendForecasts?: readonly TrendForecast[];
  readonly capsule?: CapsuleCollection;
  readonly confidenceReport: ARIAConfidenceReport;
  readonly reasoningTraces: readonly ARIAReasoningTrace[];
  readonly referencedKnowledgeNodes: readonly string[];
  readonly executionTimeMs: number;
  readonly timestamp: string;
}

export interface ARIAOrchestratorStatus {
  readonly isInitialized: boolean;
  readonly status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  readonly version: string;
  readonly activeEngines: readonly string[];
  readonly totalExecutionsLogged: number;
  readonly averageLatencyMs: number;
  readonly lastExecutionAt?: string;
}
