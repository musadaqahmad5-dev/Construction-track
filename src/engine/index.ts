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
export { DeviceReactionEngine, type DeviceTelemetryPayload, type AdaptiveLayoutResponse } from './DeviceReactionEngine';
export {
  mapCoordinatesToVideoVectors,
  formatVectorsForAIStudio,
  type CameraVector,
  type VideoTimelinePayload
} from './VideoTrackingMatrixEngine';

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

// 20. Enterprise Observability & Diagnostics Engine
export {
  EnterpriseObservabilityEngine,
  type TraceEvent,
  type RootCauseReport,
  type DiagnosticsSummary,
  type EngineRelationship
} from './observabilityEngine';

// 21. Enterprise System Coordination & Intelligence Hub
export {
  EnterpriseSystemCoordinationEngine,
  type EngineStatus,
  type StateConsistencyMetric,
  type SystemCoordinationSummary,
  type SynchronizationEvent
} from './systemCoordinationEngine';

// 22. Enterprise Architectural Validation Engine
export {
  EnterpriseValidationEngine,
  type ValidationIssue,
  type EnterpriseReadinessReport,
  type ComponentAudit
} from './enterpriseValidationEngine';

// 23. Enterprise Product Intelligence Engine
export {
  EnterpriseProductIntelligenceEngine,
  type UserJourneyStep,
  type FeatureReadinessMetric,
  type ProductQualityMetrics,
  type MissingUXDetection,
  type ProductIntelligenceReport
} from './productIntelligenceEngine';

// 24. Enterprise Unified Fashion Intelligence Brain
export {
  type FashionVibe,
  type FashionDNAScore,
  type GarmentNode,
  type OutfitComposition,
  type ColorHarmonyReport,
  type OccasionType,
  type OccasionSuitability,
  type BodyType,
  type BodyShape,
  type BodyMetricsInput,
  type BodyCompatibilityScore,
  type FabricType,
  type FabricMetrics,
  type TrendWeights,
  type FashionQualityReport,
  type FashionCriticReport,
  type UnifiedFashionDirectorOutput,
  FashionDNAEngine,
  OutfitCompositionEngine,
  ColorHarmonyEngine as UnifiedColorHarmonyEngine,
  OccasionIntelligenceEngine as UnifiedOccasionIntelligenceEngine,
  BodyCompatibilityEngine,
  FabricIntelligenceEngine,
  TrendIntelligenceEngine,
  FashionVocabularyEngine,
  StylingRecommendationEngine,
  FashionQualityEngine,
  FashionCriticEngine,
  AIFashionDirector
} from './fashionIntelligenceEngine';

// 25. Enterprise Centralized Vision Intelligence Layer
export {
  type GarmentCategory,
  type DetectedGarment,
  type GarmentAttributes,
  type ExtractedColor,
  type VisualColorPalette,
  type StyleClass,
  type StyleClassificationScore,
  type VisualBodyAnalysis,
  type VisionCompatibilityReport,
  type VisualAssetFingerprint,
  type UnifiedVisionReport,
  GarmentDetectionEngine,
  GarmentAttributeEngine,
  ColorExtractionEngine,
  StyleClassificationEngine,
  BodyAnalysisEngine,
  FashionCompatibilityEngine,
  PromptExtractionEngine,
  MarketplaceMetadataGenerator,
  FashionAssetFingerprintEngine,
  VisionDirector
} from './visionAnalysisEngine';

// 26. Architectural Infrastructure Stability & Decision Logic
export { StabilityEngine, type SecurityAlert } from './stabilityEngine';
export { DecisionInferenceEngine, type NamespaceMetrics, type DecisionAction } from './DecisionInferenceEngine';
export { GeneratorBridge, type GeneratorType, type GeneratorBridgeResult } from './GeneratorBridge';
export { 
  ComplianceGuard, 
  EvidenceCompiler, 
  GdprErasureRequest, 
  type SOC2EvidencePackage 
} from './complianceGuard';
export {
  OptimizationEngine,
  PredictionCache,
  TelemetryIngestion,
  type TelemetryPayload
} from './optimizationEngine';

// 27. AI-SEOS Evolution Knowledge Graph, Autonomous Engine, Operating Layer & Expansion Engine
export { KnowledgeGraphEngine, type GraphNode, type GraphEdge, type GraphQueryResult } from './knowledgeGraphEngine';
export { 
  AISEOSAutonomousEngine, 
  type HealthTelemetry, 
  type ImprovementRecommendation, 
  type MultiAgentTaskExecution 
} from './aiSeosAutonomousEngine';
export {
  AgentRegistrySystem,
  AIGovernanceSystem,
  CentralAIOrchestrator,
  EnterpriseIntelligenceReporting,
  type RegisteredAgent,
  type GovernanceDecision,
  type WorkflowIntent,
  type OrchestrationResult,
  type EnterpriseIntelligenceReports
} from './aiSeosOperatingLayer';
export {
  AISEOSEcosystemExpansionEngine,
  type EcosystemAgentPlugin,
  type CrossModuleSignal,
  type ExpandedAnalyticsReport
} from './aiSeosEcosystemExpansion';

// 28. Community Visual Intelligence System (C02 Evolution)
export {
  CommunityVisualIntelligence,
  type CreativeMode,
  type CameraFramingMode,
  type VisualFocusPriority,
  type PromptIntentAnalysis,
  type EnhancementOption,
  type PrePublishQualityEvaluation
} from '../features/image-generation/CommunityVisualIntelligence';

// 29. Theme Phenomenon Engine Layer
export {
  ThemePhenomenonEngine,
  globalThemePhenomenonEngine,
  analyzeThemePhenomenon,
  validateThemePhenomenonDNA,
  exportThemeAsJsonSchema,
  THEME_PHENOMENON_JSON_SCHEMA,
  PRESET_THEME_OUTPUTS,
  type PermanentEntity,
  type PhenomenonEntity,
  type ThemeCoat,
  type ShellCoat,
  type FoundationEntity,
  type ClickVisualResponse,
  type ThemePhenomenonDNA
} from './themePhenomenonEngine';

// 30. Theme DNA Visual Token Generator Layer
export {
  ThemeDNAVisualTokenGenerator,
  globalThemeDNAVisualTokenGenerator,
  generateVisualTokensFromDNA,
  PRESET_GENERATED_VISUAL_TOKENS,
  type ThemeTokens,
  type UIShellTokens,
  type ThemeCoatTokens,
  type ShellCoatTokens,
  type CoatTokens,
  type InteractionTokens,
  type VisualTokenSystem
} from './themeTokenGenerator';

// 31. UI Shell Spectrum Renderer Layer
export {
  UIShellSpectrumRenderer,
  globalUIShellSpectrumRenderer,
  UIShellProvider,
  useUIShellSpectrum,
  ShellPrimaryButton,
  ShellSecondaryButton,
  ShellIconButton,
  ShellNavItem,
  ShellCard,
  ShellPanel,
  ShellBadge,
  ShellAIAssistant,
  createUIShellConfig,
  type UIShellMode,
  type SupportedComponentType,
  type UIShellSpectrumConfig,
  type UIShellComponentStyle,
  type UIShellContextType,
  type UIShellProviderProps,
  type ShellPrimaryButtonProps,
  type ShellSecondaryButtonProps,
  type ShellIconButtonProps,
  type ShellNavItemProps,
  type ShellCardProps,
  type ShellPanelProps,
  type ShellBadgeProps,
  type ShellAIAssistantProps
} from './uiShellSpectrumRenderer';

// 32. Adaptive Coat Layer Visual System Layer
export {
  AdaptiveCoatLayerEngine,
  globalAdaptiveCoatLayerEngine,
  PRESET_COAT_DNA_SYSTEMS,
  ThemeCoatRenderer,
  ShellCoatRenderer,
  defaultCoatMotionVariants,
  CoatLayerContext,
  useCoatLayerContext,
  type CoatLayerContextValue,
  type CoatCategory,
  type CoatMaterialFinish,
  type ThemeCoatLayerProperties,
  type ShellCoatLayerProperties,
  type CoatLayerDNA,
  type CoatMotionVariants,
  type ThemeCoatRendererProps,
  type ShellCoatRendererProps
} from './adaptiveCoatLayerEngine';

// 33. Global Cognitive Intelligence Coordinator
export {
  GlobalCognitiveCoordinator,
  globalCognitiveCoordinator,
  CognitiveCoordinatorProvider,
  useCognitiveCoordinator,
  type CognitiveSnapshot,
  type CognitiveCoordinatorContextValue,
  type CognitiveCoordinatorProviderProps
} from './globalCognitiveCoordinator';

// 34. Global Autonomous Execution Orchestrator
export {
  GlobalAutonomousOrchestrator,
  globalAutonomousOrchestrator,
  AutonomousOrchestratorProvider,
  useAutonomousOrchestrator,
  type AutonomousOrchestratorSnapshot,
  type AutonomousOrchestratorContextValue,
  type AutonomousOrchestratorProviderProps
} from './globalAutonomousOrchestrator';

// 33. Foundation Click Visual Response System Layer
export {
  FoundationVisualResponseEngine,
  globalFoundationVisualResponseEngine,
  FoundationInteractionWrapper,
  FoundationButton,
  type FoundationInteractionEvent,
  type FoundationWaveType,
  type FoundationResponseParams,
  type ActiveRippleState,
  type FoundationMotionPreset,
  type FoundationInteractionWrapperProps,
  type FoundationButtonProps
} from './foundationResponseEngine';

// 34. Personal Theme Sequence Memory System
export {
  ThemeSequenceGenerator,
  PersonalThemeSequenceMemoryService,
  globalPersonalThemeSequenceMemoryService,
  usePersonalThemeSequence,
  type UserThemeCoatSettings,
  type UserFoundationSettings,
  type ColorSequenceBehavior,
  type UserThemeProfile,
  type UsePersonalThemeSequenceReturn
} from './personalThemeSequenceMemory';

// 35. Theme Intelligence Integration Layer
export {
  ThemeValidationLayer,
  ThemeIntelligenceController,
  ThemeIntelligenceProvider,
  useThemeIntelligence,
  ThemeIntelligenceShell,
  type ThemeIntelligenceState,
  type ThemeIntelligenceContextValue,
  type ThemeIntelligenceProviderProps,
  type ThemeIntelligenceShellProps
} from './themeIntelligenceIntegration';

// 36. Theme Intelligence Production Audit & Validation System
export {
  ThemeIntelligenceAuditEngine,
  globalThemeIntelligenceAuditEngine,
  type ModuleAuditMetric,
  type ThemeValidationTestCase,
  type ProductionAuditReport
} from './themeIntelligenceAudit';

// 37. Theme Intelligence Application Bridge & Adapter System
export {
  ThemeIntelligenceAdapter,
  ThemeIntelligenceAppBridge,
  ThemeIntelligenceBridgeContent,
  DEFAULT_THEME_FEATURE_FLAGS,
  type ThemeFeatureFlags,
  type ThemeIntelligenceBridgeProps
} from './themeIntelligenceAppBridge';

// 38. Real User Theme Experience Testing System
export {
  RealUserThemeExperienceTester,
  globalRealUserThemeExperienceTester,
  type UserSimulationResult,
  type ScalabilityBenchmarkResult,
  type CategoryTestResult,
  type UserFlowTestResult,
  type ThemeSwitchingTestResult,
  type SecurityValidationResult,
  type ExperienceQualityResult,
  type FullQAExperienceReport
} from './realUserThemeExperienceTest';

// 39. Final Production Deployment Validation System
export {
  FinalProductionDeploymentValidator,
  globalFinalProductionDeploymentValidator,
  type DeploymentChecklistItem,
  type MonitoringAndRecoveryStrategy,
  type FinalReleaseScores,
  type FinalProductionAuditReport
} from './finalProductionDeploymentValidation';

// 40. Unified Fashion Intelligence Core
export {
  UnifiedFashionIntelligenceCore,
  unifiedFashionIntelligenceCore,
  UnifiedFashionIntelligenceProvider,
  useUnifiedFashionIntelligence,
  type EnginePriority,
  type ConfidenceScore,
  type RecommendationScore,
  type FashionRequestType,
  type FashionContext,
  type FashionRequest,
  type EngineResult,
  type ExecutionPipelineStep,
  type ExecutionPipeline,
  type FashionResponse,
  type UnifiedFashionIntelligenceContextValue,
  type UnifiedFashionIntelligenceProviderProps
} from './unifiedFashionIntelligenceCore';


















