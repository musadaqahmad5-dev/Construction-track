/**
 * AIStyleHub - Engine Layer Entry Point
 * 
 * The Engine Layer contains all reusable business engines, algorithms, and 
 * decision-making systems. This layer is entirely decoupled from the visual UI,
 * allowing engines to execute operations headlessly across any product views.
 * 
 * In accordance with clean enterprise architecture guidelines:
 * - Engine components are independent of specific visual layouts or routes.
 * - They consume platform services to perform side-effects like persistence or logging.
 * - They provide unified, clean APIs for the Product Layer to consume.
 */

// 1. Core Orchestration Engine
export { FashionOrchestrator } from '../core/FashionOrchestrator';

// 2. Global State & System Coordination Broker
export { UnifiedFashionOS, type UnifiedState, type SubscriptionTier, type UnifiedOutfit } from '../features/ai-core/UnifiedFashionOS';

// 3. High-Performance Algorithmic Engines
export { AIEngine } from '../features/feed/AIEngine';
export { VisualSuggestion } from '../features/vision/visualSuggestion';

// 4. Hardening & Self-Healing Engines
export { StorageHardening } from '../core/StorageHardening';
export { AnalyticsEngine } from '../core/AnalyticsEngine';
export { BillingService } from '../features/monetization/billingService';

// 5. Secondary Specialized Sub-Systems
export { UnifiedFashionOS as SystemStateBroker } from '../features/ai-core/UnifiedFashionOS';
export { ErrorRegistry } from '../features/reliability/errorRegistry';
export { FashionAI } from '../features/ai/fashionAI';
export { ImageGenerationRegistry } from '../features/image-generation/imageGenerationProvider';
export { FashionPromptBuilder } from '../features/image-generation/promptBuilder';
export { ImageStorage } from '../features/image-generation/imageStorage';
export { TrendAggregator } from '../features/live-trends/trendAggregator';
export { CatalogSync } from '../features/catalog/catalogSync';
export { RealityAudit } from '../features/reality/realityAudit';
export { AIRequestPipeline, GlobalAdvancedCache, RuleEngine } from '../features/efficiency/aiRequestPipeline';
export {
  CachingEngine,
  PromptOptimizationEngine,
  PromptEngine,
  FashionEngine,
  EmbeddingSearchEngine,
  StyleDNAEngine,
  WardrobeMemoryEngine,
  RecommendationEngine,
  HistoryEngine,
  RenderingEngine,
  VisionEngine,
  PoseEngine,
  BodyEngine,
  FaceEngine,
  MarketplaceMatchingEngine,
  AIGenerationEngine,
  type UserStyleDNA,
  type RenderConfig,
  type VisionClassificationResult,
  type PoseCoordinates,
  type BodyMeasurements,
  type FaceAvatar,
  type ProductRecommendationMatch,
  type GenerationJob
} from './sharedEngines';

export {
  SkinToneIntelligenceEngine,
  ColorHarmonyEngine,
  BodyIntelligenceEngine,
  WeatherIntelligenceEngine,
  OccasionIntelligenceEngine,
  LayeringIntelligenceEngine,
  FootwearIntelligenceEngine,
  AccessoryRecommendationEngine,
  WardrobeIntelligenceEngine,
  OutfitScoringEngine,
  ExplainableAIEngine,
  FashionIntelligenceEngine,
  type ColorPalette,
  type StylingExplainer,
  type DetailedOutfitScore,
  type FashionStylingRecommendation
} from '../features/efficiency/fashionIntelligence';

// 6. Personal Fashion Memory & Self-Learning Engine
export {
  PersonalFashionMemoryEngine,
  type PersonalFashionMemory,
  type PromptKnowledge,
  type NegativeKnowledge,
  type PersonalTimeline
} from './personalMemory';

// 7. Enterprise Fashion Knowledge Graph Engine
export {
  FashionKnowledgeGraphEngine,
  type StyleNode,
  type GraphStats
} from './fashionKnowledgeGraph';

// 8. Vision Intelligence Engine & Style DNA Engine
export {
  VisionIntelligenceEngine,
  FashionVisualFeatureExtractor,
  OutfitSimilarityEngine,
  DuplicateLookDetectionEngine,
  VisualTrendEngine,
  UnifiedStyleDNAEngine,
  type FashionVisualFeatures,
  type SimilarityReport,
  type DuplicateMatch,
  type TrendAnalytics,
  type UnifiedStyleDNAReport,
  type ExplainableGarment
} from './visionIntelligence';

// 9. Autonomous Fashion Decision Intelligence Layer
export {
  DecisionIntelligenceEngine,
  type CandidateOutfit,
  type DecisionExplanation,
  type DecisionWeights,
  type DecisionContext,
  type StrategicOutfitPlan
} from './decisionIntelligence';

// 10. Autonomous Fashion Agent Layer
export {
  FashionAgentEngine,
  type AutonomousTask,
  type FashionWorkflow,
  type FashionProductivityScore,
  type WorkflowHistoryEntry
} from './fashionAgent';

// 11. Multi-Agent Collaborative System Integration
export {
  AgentCommunicationBus,
  type AgentMessage,
  type AgentTelemetry
} from '../agents/agentBus';

export {
  FashionStylistAgent,
  FashionMemoryAgent,
  FashionVisionAgent,
  FashionKnowledgeAgent,
  DecisionAgent,
  ConflictResolver,
  AgentCoordinator,
  type CollaborationTraceStep,
  type CollaborativeStylingResult
} from '../agents/agents';

// 12. Enterprise Workflow Orchestration Engine
export {
  EnterpriseWorkflowEngine,
  type WorkflowStatus,
  type ExecutionStep,
  type WorkflowDefinition,
  type EnterpriseWorkflowMetrics
} from './workflowEngine';

// 13. Enterprise Strategic Planning & Goal Intelligence Engine
export {
  EnterprisePlanningEngine,
  type PlanningHorizon,
  type GoalType,
  type PlanMilestone,
  type PlanTask,
  type StrategicPlan,
  type EnterprisePlanningMetrics as StrategicPlanningMetrics
} from './planningEngine';

// 14. Enterprise Explainable AI (XAI) & Reasoning Engine
export {
  EnterpriseReasoningEngine,
  type DecisionTreeNode,
  type ExplanationReport,
  type ExplainabilityMetrics
} from './reasoningEngine';

// 15. Enterprise Learning & Intelligence Evolution Engine
export {
  EnterpriseLearningEngine,
  type PreferenceEvolutionPoint,
  type StyleDriftInfo,
  type HabitMetrics,
  type EvolutionTimelineEvent,
  type IntelligenceGrowthMetrics,
  type PersonalizedForecast,
  type LearningWeightOptimization,
  type LearningCycleReport
} from './learningEngine';

// 16. Enterprise Predictive Intelligence & Simulation Engine
export {
  EnterprisePredictiveEngine,
  type ForecastPeriod,
  type ForecastMetrics,
  type SimulationResult,
  type ScenarioComparison
} from './predictiveEngine';

// 17. Enterprise Autonomous Goal Execution Engine
export {
  AutonomousExecutionEngine,
  type ExecutionState,
  type TaskType,
  type ExecutionTask,
  type ExecutionMetricsSummary,
  type AutonomousGoalRecord
} from './autonomousExecutionEngine';

// 18. Enterprise Governance & Policy Intelligence Engine
export {
  EnterpriseGovernanceEngine,
  type GovernanceState,
  type PolicyCategory,
  type SystemRule,
  type PolicyViolation,
  type SystemHealthMetrics,
  type PendingApproval,
  type GovernanceRecommendation
} from './governanceEngine';

// 19. Enterprise Resource Intelligence & Performance Engine
export {
  EnterpriseResourceIntelligenceEngine,
  type LatencyBreakdown,
  type CapacityStats,
  type EngineLoadSummary,
  type BottleneckReport,
  type ResourceOptimizationSuggestion,
  type PerformanceTimelineEvent,
  type PlatformPerformanceIndex,
  type EnterpriseResourceMetrics
} from './resourceIntelligenceEngine';







