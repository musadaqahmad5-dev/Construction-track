/**
 * ARIA End-to-End Prototype Integration Types
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

export interface ARIAUserRequest {
  readonly requestId: string;
  readonly sessionId: string;
  readonly userId: string;
  readonly intent?: ARIAIntent;
  readonly userPrompt: string;
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
  readonly createdAt: string;
}

export interface ARIAReasoningTimelineStep {
  readonly stepId: string;
  readonly engineName: string;
  readonly stepName: string;
  readonly summary: string;
  readonly latencyMs: number;
  readonly confidenceScore: number;
  readonly evidence: readonly string[];
}

export interface ARIAReasoningTimeline {
  readonly sessionId: string;
  readonly requestId: string;
  readonly totalLatencyMs: number;
  readonly steps: readonly ARIAReasoningTimelineStep[];
  readonly activeEngines: readonly string[];
  readonly finalConfidence: number;
}

export interface ARIARecommendationResult {
  readonly resultId: string;
  readonly title: string;
  readonly summary: string;
  readonly recommendation?: FashionRecommendation;
  readonly concept?: FashionConcept;
  readonly visionAnalysis?: VisualFashionAnalysis;
  readonly simulationScenario?: SimulationScenario;
  readonly trendForecasts?: readonly TrendForecast[];
  readonly capsuleCollection?: CapsuleCollection;
  readonly confidenceReport: ARIAConfidenceReport;
  readonly reasoningTimeline: ARIAReasoningTimeline;
  readonly formattedMarkdown: string;
  readonly timestamp: string;
}

export interface ARIAExperienceSession {
  readonly sessionId: string;
  readonly userId: string;
  readonly sessionTitle: string;
  readonly createdAt: string;
  readonly lastInteractionAt: string;
  readonly totalRequestsCount: number;
  readonly requestsHistory: readonly ARIAUserRequest[];
  readonly resultsHistory: readonly ARIARecommendationResult[];
}

export interface ARIAInteractionEvent {
  readonly eventId: string;
  readonly sessionId: string;
  readonly userId: string;
  readonly eventType: 'REQUEST' | 'RESPONSE' | 'FEEDBACK' | 'ERROR';
  readonly payload: Readonly<Record<string, unknown>>;
  readonly timestamp: string;
}

export interface ARIAPrototypeState {
  readonly isInitialized: boolean;
  readonly isProcessing: boolean;
  readonly activeSessionId?: string;
  readonly currentSession?: ARIAExperienceSession;
  readonly availableSessions: readonly ARIAExperienceSession[];
  readonly lastResult?: ARIARecommendationResult;
  readonly activeEnginesCount: number;
  readonly errorMessage?: string;
}
