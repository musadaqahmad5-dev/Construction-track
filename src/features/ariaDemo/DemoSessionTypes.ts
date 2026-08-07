/**
 * ARIA Demo Session Types
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import { ARIAConfidenceReport } from '../../aria/orchestrator/ARIAOrchestratorTypes';
import { ARIAPrototypeResponse } from '../ariaLivePrototype/LivePrototypeTypes';

export type DemoScenarioId =
  | 'DEMO_1_PERSONAL_STYLIST'
  | 'DEMO_2_FASHION_VISION'
  | 'DEMO_3_FUTURE_PREDICTION'
  | 'DEMO_4_CAPSULE_WARDROBE'
  | 'DEMO_5_CIVILIZATION_KNOWLEDGE';

export interface DemoScenarioDefinition {
  readonly id: DemoScenarioId;
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly prompt: string;
  readonly iconName: string;
  readonly accentColor: string;
  readonly sampleImageUrl?: string;
  readonly sampleImageName?: string;
  readonly contextData?: Record<string, unknown>;
}

export interface DemoProductMetrics {
  readonly totalAIDecisions: number;
  readonly totalStyleRecommendations: number;
  readonly visualAnalysesCompleted: number;
  readonly generationRequests: number;
  readonly predictionRequests: number;
  readonly agentCollaborations: number;
  readonly knowledgeRetrievalOperations: number;
  readonly lastUpdated: string;
}

export interface ARIAInvestorOverview {
  readonly systemStatus: 'OPERATIONAL' | 'OPTIMIZING' | 'OFFLINE';
  readonly version: string;
  readonly activeEngineCount: number;
  readonly knowledgeGraphNodesCount: number;
  readonly knowledgeGraphEdgesCount: number;
  readonly agentNetworkCount: number;
  readonly reasoningConfidenceAvg: number;
  readonly averageLatencyMs: number;
  readonly memoryNodesCount: number;
  readonly visualModelsCount: number;
  readonly metrics: DemoProductMetrics;
}

export interface DemoExecutionResult {
  readonly scenarioId: DemoScenarioId;
  readonly title: string;
  readonly response: ARIAPrototypeResponse;
  readonly executionTimeMs: number;
  readonly confidenceReport: ARIAConfidenceReport;
  readonly timestamp: string;
}

export interface DemoState {
  readonly isDemoModeActive: boolean;
  readonly isInvestorViewActive: boolean;
  readonly isExecutingScenario: boolean;
  readonly activeScenarioId?: DemoScenarioId;
  readonly currentScenarioResult?: DemoExecutionResult;
  readonly metrics: DemoProductMetrics;
  readonly investorOverview: ARIAInvestorOverview;
  readonly executionHistory: readonly DemoExecutionResult[];
}
