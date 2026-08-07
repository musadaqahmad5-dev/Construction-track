/**
 * ARIA Experience Types
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

export interface ARIAUserAction {
  readonly actionId: string;
  readonly actionType:
    | 'SEND_MESSAGE'
    | 'REQUEST_RECOMMENDATION'
    | 'ANALYZE_IMAGE'
    | 'GENERATE_CONCEPT'
    | 'LOAD_PASSPORT'
    | 'CLEAR_HISTORY';
  readonly timestamp: string;
  readonly payload?: Readonly<Record<string, unknown>>;
}

export interface ARIARecommendationCard {
  readonly title: string;
  readonly outfitItems: readonly string[];
  readonly styleReasoning: readonly string[];
  readonly confidenceScore: number;
  readonly matchFactors: readonly {
    readonly factorName: string;
    readonly score: number;
  }[];
  readonly occasion: string;
  readonly weatherContext: string;
}

export interface ARIAVisualInsight {
  readonly imageName: string;
  readonly detectedGarments: readonly {
    readonly item: string;
    readonly category: string;
    readonly confidence: number;
  }[];
  readonly dominantColors: readonly string[];
  readonly materials: readonly string[];
  readonly silhouette: string;
  readonly visualConfidence: number;
  readonly styleVibe: string;
}

export interface ARIAOutfitResult {
  readonly conceptTitle: string;
  readonly description: string;
  readonly aestheticTheme: string;
  readonly colorPalette: readonly string[];
  readonly stylingNotes: readonly string[];
  readonly capsuleSuggestions: readonly string[];
  readonly confidenceScore: number;
}

export interface ARIAConversationMessage {
  readonly id: string;
  readonly sender: 'USER' | 'ARIA';
  readonly text: string;
  readonly timestamp: string;
  readonly intent?: ARIAIntent;
  readonly responsePayload?: ARIAResponse;
  readonly reasoningTraces?: readonly ARIAReasoningTrace[];
  readonly confidenceReport?: ARIAConfidenceReport;
}

export interface ARIAExperienceState {
  readonly isInitialized: boolean;
  readonly isProcessing: boolean;
  readonly activeTab: 'CHAT' | 'RECOMMENDATIONS' | 'VISION' | 'STUDIO' | 'PASSPORT';
  readonly conversationHistory: readonly ARIAConversationMessage[];
  readonly currentRecommendation?: ARIARecommendationCard;
  readonly currentVisualAnalysis?: ARIAVisualInsight;
  readonly currentOutfitResult?: ARIAOutfitResult;
  readonly rawLastResponse?: ARIAResponse;
  readonly errorMessage?: string;
  readonly totalInteractions: number;
}

export interface ARIAExperienceTelemetry {
  readonly traceId: string;
  readonly actionName: string;
  readonly intent: ARIAIntent;
  readonly latencyMs: number;
  readonly confidenceScore: number;
  readonly activeEngines: readonly string[];
  readonly timestamp: string;
  readonly success: boolean;
}
