/**
 * ARIA Live Prototype Types
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import {
  ARIARequest,
  ARIAResponse,
  ARIAIntent,
  ARIAReasoningTrace,
  ARIAConfidenceReport
} from '../../aria/orchestrator/ARIAOrchestratorTypes';
import { FashionRecommendation } from '../../aria/decision/DecisionTypes';
import { VisualFashionAnalysis } from '../../aria/vision/VisionTypes';
import { FashionConcept, CapsuleCollection } from '../../aria/generation/GenerativeTypes';
import { SimulationScenario, TrendForecast } from '../../aria/prediction/PredictiveTypes';

export interface ARIAUserSession {
  readonly sessionId: string;
  readonly userId: string;
  readonly title: string;
  readonly createdAt: string;
  readonly lastActiveAt: string;
  readonly totalInteractions: number;
  readonly interactionHistory: readonly ARIAPrototypeRequest[];
  readonly responseHistory: readonly ARIAPrototypeResponse[];
}

export interface ARIAPrototypeRequest {
  readonly requestId: string;
  readonly sessionId: string;
  readonly userId: string;
  readonly prompt: string;
  readonly intent?: ARIAIntent;
  readonly imageUrl?: string;
  readonly imageBase64?: string;
  readonly imageName?: string;
  readonly context?: Readonly<{
    occasion?: string;
    season?: string;
    weatherContext?: string;
    temperatureC?: number;
    timeHorizonMonths?: number;
  }>;
  readonly timestamp: string;
}

export interface ARIAExecutionTimelineStep {
  readonly stepId: string;
  readonly engineName: string;
  readonly stepName: string;
  readonly summary: string;
  readonly latencyMs: number;
  readonly confidenceScore: number;
  readonly evidence: readonly string[];
  readonly status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'SKIPPED';
}

export interface ARIAExecutionTimeline {
  readonly traceId: string;
  readonly sessionId: string;
  readonly requestId: string;
  readonly totalLatencyMs: number;
  readonly steps: readonly ARIAExecutionTimelineStep[];
  readonly activeEngineNames: readonly string[];
  readonly overallConfidence: number;
}

export interface ARIAEngineStatus {
  readonly engineId: string;
  readonly name: string;
  readonly category: 'CORE' | 'AGENT' | 'MEMORY' | 'VISION' | 'GENERATIVE' | 'PREDICTION' | 'DECISION';
  readonly isOnline: boolean;
  readonly averageLatencyMs: number;
  readonly readinessPercentage: number;
}

export interface ARIARecommendationPayload {
  readonly title: string;
  readonly description: string;
  readonly items: readonly string[];
  readonly reasoning: readonly string[];
  readonly aestheticTheme?: string;
  readonly colorPalette?: readonly string[];
  readonly matchFactors?: readonly {
    readonly name: string;
    readonly score: number;
  }[];
}

export interface ARIAPrototypeResponse {
  readonly responseId: string;
  readonly requestId: string;
  readonly sessionId: string;
  readonly summary: string;
  readonly intent: ARIAIntent;
  readonly recommendationPayload?: ARIARecommendationPayload;
  readonly rawRecommendation?: FashionRecommendation;
  readonly rawConcept?: FashionConcept;
  readonly rawVisionAnalysis?: VisualFashionAnalysis;
  readonly rawSimulation?: SimulationScenario;
  readonly rawCapsule?: CapsuleCollection;
  readonly confidenceReport: ARIAConfidenceReport;
  readonly executionTimeline: ARIAExecutionTimeline;
  readonly formattedMarkdown: string;
  readonly timestamp: string;
}

export interface ARIAPrototypeLiveState {
  readonly isOnline: boolean;
  readonly isProcessing: boolean;
  readonly activeSessionId?: string;
  readonly currentSession?: ARIAUserSession;
  readonly availableSessions: readonly ARIAUserSession[];
  readonly activeEngines: readonly ARIAEngineStatus[];
  readonly lastResponse?: ARIAPrototypeResponse;
  readonly currentStepSummary?: string;
  readonly overallReadinessScore: number;
  readonly errorMessage?: string;
}
