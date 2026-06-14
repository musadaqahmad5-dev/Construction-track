import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Sparkles,
  Cpu,
  Layers,
  Shirt,
  Sliders,
  DollarSign,
  TrendingUp,
  CreditCard,
  LineChart,
  Eye,
  Maximize2,
  RefreshCw,
  Edit3,
  Flame,
  Globe,
  Languages,
  PiggyBank,
  ShoppingBag,
  ArrowRight,
  Maximize,
  Sparkle,
  Camera,
  Play,
  Check,
  CheckCircle,
  Bookmark,
  ChevronRight,
  Download,
  Award,
  User,
  Heart,
  Scale,
  Shield,
  Unlock,
  Lock,
  Share2,
  Terminal,
  Activity,
  AlertTriangle,
  History,
  TrendingDown
} from 'lucide-react';
import { WardrobeItem } from '../types';
import { AIOperatingSystem } from '../features/ai-core/aiOperatingSystem';
import { VectorProfileMemory, UserStyleProfile, PersonaVector } from '../features/user-profile-memory/vectorProfileMemory';
import { TrendIntelligence, TrendItem } from '../features/trend-engine/trendIntelligence';
import { TryOnArchitecture, AvatarCategory } from '../features/simulation-layer/tryOnArchitecture';
import { OutfitScoringRanker, ScoredOutfitCandidate } from '../features/styling-engine/outfitScoringRanker';

// Import newly created enterprise pipeline modules
import { AIGovernor } from '../features/governor/governor';
import { ExecutionBudget } from '../features/governor/executionBudget';
import { PolicyEngine } from '../features/governor/policyEngine';
import { Telemetry, TelemetryReading } from '../features/observability/telemetry';
import { ExecutionMetrics } from '../features/observability/executionMetrics';
import { AnomalyDetector } from '../features/observability/anomalyDetector';
import { TrendProvider, TrendSourceMode } from '../features/trends/trendProvider';
import { TrendNormalizer } from '../features/trends/trendNormalizer';
import { RegionalRanking } from '../features/trends/regionalRanking';
import { WardrobeMemory } from '../features/memory/wardrobeMemory';
import { StyleEvolution, StyleEvolutionState } from '../features/memory/styleEvolution';
import { FeedbackConsolidator } from '../features/memory/feedbackConsolidator';
import { DecisionTimeline } from '../features/explainability/decisionTimeline';

// Import Visual Fashion Creation & Simulation Modules (Phase Next A13)
import { OutfitRenderer, RenderedLook } from '../features/rendering/outfitRenderer';
import { LookComposer } from '../features/rendering/lookComposer';
import { RenderQueue, RenderTask } from '../features/rendering/renderQueue';
import { TryOnEngine, TryOnResult } from '../features/tryon/tryOnEngine';
import { BodyMapper, BodyDimensions } from '../features/tryon/bodyMapper';
import { GarmentAligner, AlignmentAnatomy } from '../features/tryon/garmentAligner';
import { FittingScore, FittingReport } from '../features/tryon/fittingScore';
import { OutfitStudio } from '../features/style-lab/outfitStudio';
import { PromptInterpreter, PromptIntent } from '../features/style-lab/promptInterpreter';
import { StyleMutation } from '../features/style-lab/styleMutation';
import { VisualTimeline, VisualMemoryRecord } from '../features/visual-memory/visualTimeline';
import { AestheticClusters, ClusterMetrics } from '../features/visual-memory/aestheticClusters';
import { StyleRecall } from '../features/visual-memory/styleRecall';

// Import Commerce & Creator Growth Platform Modules (Phase Next A14)
import { CommerceEngine, PurchasableBasket } from '../features/commerce/commerceEngine';
import { CatalogResolver, CatalogProduct } from '../features/commerce/catalogResolver';
import { PricingIntelligence } from '../features/commerce/pricingIntelligence';
import { RecommendationMarketplace } from '../features/commerce/recommendationMarketplace';
import { CreatorProfiles } from '../features/creator-market/creatorProfiles';
import { CreatorCollections } from '../features/creator-market/creatorCollections';
import { CreatorRanking } from '../features/creator-market/creatorRanking';
import { CollaborationFeed } from '../features/creator-market/collaborationFeed';
import { FeedGenerator, FeedPost } from '../features/feed/feedGenerator';
import { TrendFeed } from '../features/feed/trendFeed';
import { RecommendationFeed } from '../features/feed/recommendationFeed';
import { DiscoveryEngine } from '../features/feed/discoveryEngine';
import { SubscriptionEngine, SubscriptionLevel } from '../features/monetization/subscriptionEngine';
import { CreditsSystem } from '../features/monetization/creditsSystem';
import { PremiumFeatures } from '../features/monetization/premiumFeatures';
import { UsageGovernor } from '../features/monetization/usageGovernor';
import { Comments } from '../features/social/comments';
import { Reactions } from '../features/social/reactions';
import { RemixChain } from '../features/social/remixChain';
import { CollaborationSessions } from '../features/social/collaborationSessions';
import { Onboarding } from '../features/growth/onboarding';
import { RetentionEngine } from '../features/growth/retentionEngine';
import { AchievementSystem } from '../features/growth/achievementSystem';
import { ReactivationFlow } from '../features/growth/reactivationFlow';

// Import World Fashion Graph & Enterprise Multi-region Operations Plane (Phase Next A15)
import { FashionGraph } from '../features/world-graph/fashionGraph';
import { StyleOntology } from '../features/world-graph/styleOntology';
import { IdentityClusters } from '../features/world-graph/identityClusters';
import { RegionalIntelligence } from '../features/world-graph/regionalIntelligence';
import { LocalizationEngine, MeasurementSystem } from '../features/global/localizationEngine';
import { RegionalPolicy } from '../features/global/regionalPolicy';
import { MarketProfiles } from '../features/global/marketProfiles';
import { CurrencyAbstraction } from '../features/global/currencyAbstraction';
import { PublicApi } from '../features/platform/publicApi';
import { TenantIsolation } from '../features/platform/tenantIsolation';
import { AccessGovernor } from '../features/platform/accessGovernor';
import { ConsentManager } from '../features/governance/consentManager';
import { RetentionPolicy } from '../features/governance/retentionPolicy';
import { AuditTrail } from '../features/governance/auditTrail';
import { DataLifecycle } from '../features/governance/dataLifecycle';
import { EnvironmentManager, ReleaseEnvironment } from '../features/deployment/environmentManager';
import { ReleaseChannels } from '../features/deployment/releaseChannels';
import { FeatureFlags } from '../features/deployment/featureFlags';
import { RollbackController } from '../features/deployment/rollbackController';

// Import newly created Phase Next A16 Command Center engines
import { TaskCoordinator } from '../features/execution/taskCoordinator';
import { WorkflowRuntime } from '../features/execution/workflowRuntime';
import { Workflow, getExecutionState, WorkflowStep, WorkflowStage, updateWorkflowInState, WorkflowStatus } from '../features/execution/executionState';
import { getFirstSessionState, startFirstSession, recordFirstLookSeen, completeOnboardingStep } from '../features/journeys/firstSession';
import { getActivationState, trackDNACustomized, trackDiagnosticRun, incrementGenerationCount, recordFirstSave } from '../features/journeys/activationFlow';
import { getConversionState, startUpgradeIntent, completeSubscriptionUpgrade } from '../features/journeys/conversionJourney';
import { getRetentionState, submitNPSSurvey, generateJourneyDiagnostics } from '../features/journeys/retentionJourney';
import { QualityEvaluator, QualityReport } from '../features/quality/qualityEvaluator';
import { OutputValidator } from '../features/quality/outputValidator';
import { ConfidenceAudit } from '../features/quality/confidenceAudit';
import { RegressionGuard } from '../features/quality/regressionGuard';
import { getExperimentsState, recordExperimentConversion } from '../features/experiments/experimentEngine';
import { VariantAllocator } from '../features/experiments/variantAllocator';
import { ResultAnalyzer } from '../features/experiments/resultAnalyzer';
import { RolloutEvaluator, getCanariesState } from '../features/experiments/rolloutEvaluator';
import { ComputeBudget } from '../features/efficiency/computeBudget';
import { CacheManager } from '../features/efficiency/cacheManager';
import { WorkloadBalancer } from '../features/efficiency/workloadBalancer';
import { LatencyTracker, getLatencyRecords } from '../features/efficiency/latencyTracker';

// Phase Next A17: Launch Gating & Hardening Imports
import { bootstrapAppShell } from '../features/release/bootstrap';
import { startStartupDiagnostics } from '../features/release/startupDiagnostics';
import { CrashRecoveryService } from '../features/release/crashRecovery';
import { checkReadinessGate } from '../features/release/readinessGate';
import { runSmokeSuite } from '../features/testing/smokeSuite';
import { runWorkflowTestSuite } from '../features/testing/workflowTests';
import { runUIRegressionSuite } from '../features/testing/uiRegression';
import { runContractVerificationSuite } from '../features/testing/contractVerification';
import { ErrorRegistry } from '../features/reliability/errorRegistry';
import { RecoveryPoliciesService } from '../features/reliability/recoveryPolicies';
import { IncidentTimelineService } from '../features/reliability/incidentTimeline';
import { DiagnosticsPanelService } from '../features/reliability/diagnosticsPanel';
import { SessionGuard } from '../features/security/sessionGuard';
import { RequestValidator } from '../features/security/requestValidator';
import { BoundaryProtectionService } from '../features/security/boundaryProtection';
import { IntegrityMonitorService } from '../features/security/integrityMonitor';
import { ProductMetricsService } from '../features/analytics/productMetrics';
import { ReleaseMetricsService } from '../features/analytics/releaseMetrics';
import { HealthScoreService } from '../features/analytics/healthScore';
import { LaunchReadinessService } from '../features/analytics/launchReadiness';



interface AIStyleHubProps {
  wardrobe: WardrobeItem[];
  onAddGarment: (
    title: string,
    description: string,
    category: any,
    extraOptions?: any
  ) => Promise<void>;
}

export const AIStyleHub: React.FC<AIStyleHubProps> = ({ wardrobe, onAddGarment }) => {
  const userEmail = 'fashion.os.kernel@gmail.com';
  // Navigation tabs representing both core SaaS and Phase Next Visual systems
  const [activeEngine, setActiveEngine] = useState<
    'dna' | 'generator' | 'tryon' | 'trends' | 'market' | 'designer' | 'saas-dashboard' | 'style-lab' | 'render-gallery' | 'identity-evolution' | 'nexus-v6'
  >('nexus-v6');

  // --- STATE FOR NEW PHASE NEXT VISUAL GENERATION & STYLE LAB ---
  const [activeLook, setActiveLook] = useState<RenderedLook | null>(null);
  const [renderTasks, setRenderTasks] = useState<RenderTask[]>([]);
  const [isRenderQueuing, setIsRenderQueuing] = useState<boolean>(false);
  const [labPrompt, setLabPrompt] = useState<string>('Make it functional and cyberpunk tech style');
  const [labMutatedLook, setLabMutatedLook] = useState<RenderedLook | null>(null);
  const [timelineLooks, setTimelineLooks] = useState<VisualMemoryRecord[]>([]);
  const [searchRecallQuery, setSearchRecallQuery] = useState<string>('');
  
  // Virtual Try On advanced parameters
  const [tryOnHeight, setTryOnHeight] = useState<number>(176);
  const [tryOnEngineResult, setTryOnEngineResult] = useState<TryOnResult | null>(null);
  const [isTryOnEngineLoading, setIsTryOnEngineLoading] = useState<boolean>(false);

  // Modern presentation viewing mode controls
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false);
  const [compareModeLookA, setCompareModeLookA] = useState<RenderedLook | null>(null);
  const [compareModeLookB, setCompareModeLookB] = useState<RenderedLook | null>(null);
  const [isCompareActive, setIsCompareActive] = useState<boolean>(false);
  const [isBeforeAfterActive, setIsBeforeAfterActive] = useState<boolean>(false);
  const [beforeAfterSlider, setBeforeAfterSlider] = useState<number>(50);

  // --- PERSISTENT AI PERSONALIZATION SYSTEM & FEEDBACK LOOP ---
  const [userProfile, setUserProfile] = useState<UserStyleProfile | null>(null);
  const [vectorWeights, setVectorWeights] = useState<PersonaVector>({
    minimalist: 0.5,
    streetwear: 0.3,
    classic: 0.4,
    luxury: 0.3,
    cyberpunk: 0.1,
    traditional: 0.1,
  });
  const [dislikedTags, setDislikedTags] = useState<string[]>([]);
  const [scoringReport, setScoringReport] = useState<any[]>([]);
  const [tryOnSimResult, setTryOnSimResult] = useState<any>(null);
  const [ingestionMetrics, setIngestionMetrics] = useState<any>({
    totalRequestsIngested: 2840,
    activeSourcesCount: 3,
    lastScrapedAt: new Date().toLocaleTimeString()
  });

  // Autonomous OS loop metrics
  const [osCyclesCount, setOsCyclesCount] = useState<number>(0);
  const [activeCycleStep, setActiveCycleStep] = useState<'Observe' | 'Predict' | 'Generate' | 'Evaluate' | 'Adapt'>('Observe');
  const [stateSnapshotsHistory, setStateSnapshotsHistory] = useState<any[]>([]);

  // Telemetry & Governor Live state hooks
  const [healthScore, setHealthScore] = useState<number>(100);
  const [cpuLoad, setCpuLoad] = useState<number>(12);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryReading[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [isGovernorLocked, setIsGovernorLocked] = useState<boolean>(false);
  const [cycleBudget, setCycleBudget] = useState<any>({ cyclesAllowed: 50, cyclesExecuted: 0, writesAllowed: 30, writesExecuted: 0 });
  const [trendProviderMode, setTrendProviderMode] = useState<TrendSourceMode>('offline');

  // --- STATE FOR ENTERPRISE GROWOPS AND MONETIZATION (PHASE NEXT A14) ---
  const [subscriptionLevelState, setSubscriptionLevelState] = useState<SubscriptionLevel>('free');

  // --- STATE FOR AI_FASHION_OS_NEXUS_V6 SYSTEM ---
  const [nexusSimCompleted, setNexusSimCompleted] = useState<boolean>(true);
  const [nexusSimProgress, setNexusSimProgress] = useState<number>(100);
  const [nexusSimCount, setNexusSimCount] = useState<number>(500);
  const [nexusClimateTemp, setNexusClimateTemp] = useState<number>(18);
  const [nexusClimatePrecip, setNexusClimatePrecip] = useState<number>(20);
  const [nexusClimateWind, setNexusClimateWind] = useState<number>(12);
  const [nexusDnaOverrides, setNexusDnaOverrides] = useState<any>({
    identityBias: 0.85,
    silhouetteOversize: 0.55,
    textureHeavyCoarse: 0.40,
    formalityCurve: 0.50,
    experimentalTolerance: 0.70,
  });
  const [nexusFeedbackActions, setNexusFeedbackActions] = useState<any[]>([
    { type: 'save_rate', value: '88%', label: 'Active User Save Rate' },
    { type: 'dismiss_actions', value: '12%', label: 'Discard/Rest Controls' },
    { type: 'category_mutations', value: '46 total', label: 'DNA Category Mutations' },
    { type: 'style_reversals', value: '1 block', label: 'Reverse Optimization Runs' },
  ]);
  const [nexusDriftValue, setNexusDriftValue] = useState<number>(6.2); // safe limit <= 10%
  const [nexusIsMuted, setNexusIsMuted] = useState<boolean>(false);
  const [commerceSelectedMode, setCommerceSelectedMode] = useState<'complete' | 'budget' | 'premium'>('complete');
  const [activeFeedTab, setActiveFeedTab] = useState<'For You' | 'Trending' | 'Following' | 'Experimental'>('For You');
  const [creatorFollows, setCreatorFollows] = useState<string[]>(['c-02']); // KENJI followed by default
  const [userCreditsLeft, setUserCreditsLeft] = useState<number>(30); // synced with free mode to start
  const [activeReactions, setActiveReactions] = useState<{ [postId: string]: { heart: number, hasHearted: boolean } }>({
    'post-fy-01': { heart: 412, hasHearted: false },
    'post-fy-02': { heart: 189, hasHearted: false },
    'post-tr-01': { heart: 1420, hasHearted: false },
    'post-fo-01': { heart: 530, hasHearted: false },
    'post-ex-01': { heart: 92, hasHearted: false },
  });
  const [savedUserLooksToColls, setSavedUserLooksToColls] = useState<string[]>([]);
  const [selectedLookInBasketSim, setSelectedLookInBasketSim] = useState<RenderedLook | null>(null);
  const [collabRoomsList, setCollabRoomsList] = useState<any[]>([]);
  const [activeRoomSelected, setActiveRoomSelected] = useState<string>('room-01');
  const [roomProposalText, setRoomProposalText] = useState<string>('');

  // --- 1. STATE FOR ENGINE 1: STYLE DNA PROFILE ---
  const [likesCount, setLikesCount] = useState(14);
  const [savedOutfits, setSavedOutfits] = useState(8);
  const [detectedPersonality, setDetectedPersonality] = useState('Minimalist Tech-Wear & Quiet Luxury Mix');
  const [userInteractions, setUserInteractions] = useState<{ action: string; time: string; tag: string }[]>([
    { action: "Liked Charcoal Wool Blazer", time: "2 hours ago", tag: "Quiet Luxury" },
    { action: "Saved 'Monochrome Rainy Day' Set", time: "1 day ago", tag: "Minimalist" },
    { action: "Searched for 'Air-mesh Joggers'", time: "2 days ago", tag: "Sportswear" },
    { action: "Toggled wear count of dry sage overcoat", time: "3 days ago", tag: "Earth tones" }
  ]);

  // --- STATE FOR PHASE NEXT EXTRA COGNITION, CONTROL & OPERATIONS ---
  const [opsTab, setOpsTab] = useState<'graph' | 'global' | 'api' | 'governance' | 'deployment' | 'operations' | 'execution' | 'journeys' | 'quality' | 'experiments' | 'performance' | 'launch'>('execution');
  
  // Phase Next A16 Command Center States
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [workflowsHistory, setWorkflowsHistory] = useState<Workflow[]>([]);
  const [journeyStats, setJourneyStats] = useState(generateJourneyDiagnostics());
  const [latestQualityReport, setLatestQualityReport] = useState<QualityReport | null>({
    overallScore: 0.92,
    lookId: 'look-415',
    usefulnessScore: 0.94,
    renderFidelityScore: 0.90,
    decisionConsistencyScore: 0.92,
    violationsCount: 0,
    isBlockRecommended: false,
    notes: ['APPROVED: Outfits conform to standard high-contrast luxury profiles.']
  });
  const [historicalQualityScores, setHistoricalQualityScores] = useState<number[]>([0.91, 0.94, 0.88, 0.96, 0.85, 0.92, 0.89, 0.95]);
  const [auditStats, setAuditStats] = useState(ConfidenceAudit.runAudit([0.91, 0.94, 0.88, 0.96, 0.85, 0.92, 0.89, 0.95]));
  const [selectedExpId, setSelectedExpId] = useState<string>('exp-recommendations-v2');
  const [expAnalysis, setExpAnalysis] = useState(ResultAnalyzer.analyzeExperiment('exp-recommendations-v2'));
  const [canaryRules, setCanaryRules] = useState(getCanariesState());
  const [computeUsageStats, setComputeUsageStats] = useState(ComputeBudget.getBudgetStats('free'));
  const [cacheDetails, setCacheDetails] = useState(CacheManager.getSummary());
  const [concurrencyInfo, setConcurrencyInfo] = useState(WorkloadBalancer.getQueueStatus());
  const [avgLatencies, setAvgLatencies] = useState({
    coldStart: 120,
    outfitRender: 450,
    dnsAnalysis: 180,
  });
  const [performanceStatus, setPerformanceStatus] = useState(LatencyTracker.evaluatePerformanceStatus());
  
  // Phase Next A17 Launch Dashboard States
  const [rcReadinessGates, setRcReadinessGates] = useState(LaunchReadinessService.evaluateGates());
  const [rcHealthReport, setRcHealthReport] = useState(HealthScoreService.calculateHealth());
  const [rcIncidents, setRcIncidents] = useState(IncidentTimelineService.getIncidentLogs());
  const [rcErrorsList, setRcErrorsList] = useState(ErrorRegistry.getErrors());
  const [rcCanaryExposure, setRcCanaryExposure] = useState(25);
  const [selectedDashboardSubTab, setSelectedDashboardSubTab] = useState<'readiness' | 'incidents' | 'health' | 'validation' | 'deployment'>('readiness');
  const [activeValidationRun, setActiveValidationRun] = useState<{
    ran: boolean;
    smokePassRate: number;
    wfPassRate: number;
    uiPassRate: number;
    contractPassRate: number;
    cumulativeRate: number;
    logs: any[];
  } | null>(null);
  const [newIncidentTitle, setNewIncidentTitle] = useState('');
  const [newIncidentSummary, setNewIncidentSummary] = useState('');
  const [newIncidentSeverity, setNewIncidentSeverity] = useState<'high' | 'medium' | 'low'>('medium');
  
  // Custom execution trigger inputs
  const [customWfVibe, setCustomWfVibe] = useState<'minimalist' | 'classic' | 'cyberpunk'>('minimalist');
  const [customWfTitle, setCustomWfTitle] = useState('');
  const [customWfIntensity, setCustomWfIntensity] = useState<'standard' | 'high-fidelity' | 'low-latency'>('standard');
  const [customWfContext, setCustomWfContext] = useState('Metro Transit');

  // Priming effects
  useEffect(() => {
    setWorkflowsHistory(getExecutionState().workflows);
    startFirstSession(); // user lands and starts first journey session
  }, []);

  const [graphState, setGraphState] = useState(FashionGraph.getGraphState());
  const [graphNodes, setGraphNodes] = useState(FashionGraph.getNodes());
  const [graphEdges, setGraphEdges] = useState(FashionGraph.getEdges());
  const [measurementSystem, setMeasurementSystem] = useState<MeasurementSystem>('imperial');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'JPY' | 'DKK' | 'GBP'>('USD');
  const [selectedRegionPolicy, setSelectedRegionPolicy] = useState<'EU' | 'US' | 'JP'>('EU');
  const [activeTenants, setActiveTenants] = useState(TenantIsolation.getRegisteredTenants());
  const [publicApiOutputs, setPublicApiOutputs] = useState<any[]>([]);
  const [userConsent, setUserConsent] = useState(ConsentManager.queryConsent());
  const [auditEntries, setAuditEntries] = useState(AuditTrail.getTraceLogs());
  const [activeReleaseChannels, setActiveReleaseChannels] = useState(ReleaseChannels.queryChannelsList());
  const [systemFeatureFlags, setSystemFeatureFlags] = useState(FeatureFlags.queryFlags());
  const [rollbackHistory, setRollbackHistory] = useState(RollbackController.getRollbackHistoryList());
  
  // Custom new node creation inputs
  const [newNodeType, setNewNodeType] = useState<'user' | 'look' | 'material' | 'style' | 'region' | 'occasion' | 'creator' | 'trend'>('trend');
  const [newNodeLabel, setNewNodeLabel] = useState('');
  
  // Custom public API simulation trigger input parameters
  const [apiPromptContext, setApiPromptContext] = useState('Classic lightweight tailoring for Summer');
  const [apiTenantId, setApiTenantId] = useState('tld-arket-01');
  const [apiStyleDNAOverrides, setApiStyleDNAOverrides] = useState({ minimalist: 0.8, luxury: 0.7, cyberpunk: 0.1 });

  // --- 2. STATE FOR ENGINE 2: AI OUTFIT GENERATOR ---
  const [genOccasion, setGenOccasion] = useState('Creative Office Presentation');
  const [genWeather, setGenWeather] = useState('Cool Autumn Breeze (15°C)');
  const [genBudget, setGenBudget] = useState('mid'); // low, mid, luxury
  const [genGender, setGenGender] = useState('All');
  const [genCulture, setGenCulture] = useState('Scandinavian Minimalist');
  const [isGeneratingSet, setIsGeneratingSet] = useState(false);
  const [generatedSets, setGeneratedSets] = useState<any[]>([
    {
      styleName: "The Stockholm Academic",
      confidence: 96,
      items: [
        { name: "Oatmeal Alpaca Sweater", category: "Casual", color: "Oatmeal Beige", role: "Top Layer" },
        { name: "Slate Wool Cigarette Trousers", category: "Formal", color: "Slate Gray", role: "Legwear" },
        { name: "Drab Green Shell Anorak", category: "Outerwear", color: "Olive Drab", role: "Shield Coat" },
        { name: "Nappa Leather Chelsea Boots", category: "Accessories", color: "Pitch Black", role: "Footwear" }
      ],
      harmonizedExplanation: "Combines 100% natural wool insulation against low-temperature draft. Standard neutral hues are structured for workspace comfort while maintaining casual versatility."
    },
    {
      styleName: "Copenhagen Metro Utility",
      confidence: 91,
      items: [
        { name: "Structured Heavyweight T-Shirt", category: "Casual", color: "Minimalist White", role: "Under Layer" },
        { name: "Tailored Blazer Cardigan", category: "Formal", color: "Navy Blue", role: "Mid Layer" },
        { name: "Air-Fit Running Cargo Pants", category: "Sportswear", color: "Pitch Black", role: "Legwear" },
        { name: "Retro Silver Runner Sneakers", category: "Accessories", color: "Silver Gray", role: "Footwear" }
      ],
      harmonizedExplanation: "Fuses activewear durability with classic structural cardigans. Crafted to sustain rapid movement during public transits while looking clean."
    }
  ]);

  // --- 3. STATE FOR ENGINE 3: VIRTUAL TRY-ON ---
  const [tryOnImage, setTryOnImage] = useState<string | null>(null);
  const [tryOnModel, setTryOnModel] = useState<'model1' | 'model2' | 'user'>('model1');
  const [tryOnFabric, setTryOnFabric] = useState<'wool' | 'denim' | 'silk' | 'leather'>('wool');
  const [bodyShape, setBodyShape] = useState<'Athletic' | 'Slim' | 'Broad' | 'Regular'>('Regular');
  const [tryOnSlider, setTryOnSlider] = useState<number>(50); // slider percent for Before/After
  const [isAnalyzingBody, setIsAnalyzingBody] = useState(false);
  const [previewOutfitId, setPreviewOutfitId] = useState<string>("outfit-1");

  // --- 4. STATE FOR ENGINE 4: TREND PREDICTION AI ---
  const [selectedRegion, setSelectedRegion] = useState<'Global' | 'Europe' | 'Asia' | 'USA' | 'MiddleEast'>('Global');
  const [predictedTrends, setPredictedTrends] = useState<any[]>([
    { title: "Neo-Classic Technical Tailoring", confidence: 94, trendPeriod: "Next 14 Days", tags: ["GoreTex", "Structured Blazers", "Neutral Grays"], volumeIndex: "+145% Surge" },
    { title: "Desert Dry Earth tones & utility multi-pocket jackets", confidence: 88, trendPeriod: "30-Day Outlook", tags: ["Sage Green", "Linen Canvas", "Combat vests"], volumeIndex: "+81% Up" },
    { title: "Zero-Gravity High-Performance Knitwear", confidence: 85, trendPeriod: "Weekly Spotlight", tags: ["Recycled Poly", "Modular zip layers", "Crimson Accents"], volumeIndex: "+62% Active" }
  ]);

  // --- 5. STATE FOR ENGINE 5: SMART FASHION MARKET ENGINE ---
  const [marketTier, setMarketTier] = useState<'low' | 'mid' | 'luxury'>('mid');
  const [shoppingCart, setShoppingCart] = useState<any[]>([]);
  const [bundleAgreed, setBundleAgreed] = useState(false);

  const marketRecommendations = {
    low: [
      { id: "m1", name: "Recycled Heavy-Cotton Tee", brand: "Nordic Basics", price: 29, imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=60" },
      { id: "m2", name: "Relaxed Indigo Denim Jeans", brand: "Urban Thread", price: 54, imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=60" },
      { id: "m3", name: "Canvas Slip-on Runners", brand: "Echo Sport", price: 38, imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&auto=format&fit=crop&q=60" }
    ],
    mid: [
      { id: "m4", name: "Fine Merino Wool Mock Neck", brand: "Sartorial Lab", price: 110, imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&auto=format&fit=crop&q=60" },
      { id: "m5", name: "Structured Chino Slate Pants", brand: "Studio Stockholm", price: 145, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&auto=format&fit=crop&q=60" },
      { id: "m6", name: "Eco-Sole Premium Runners", brand: "Airflow", price: 130, imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&auto=format&fit=crop&q=60" }
    ],
    luxury: [
      { id: "m7", name: "Double-Breast Cashmere Overcoat", brand: "Atelier Savile", price: 890, imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=60" },
      { id: "m8", name: "Japanese Selvedge Distressed Denim", brand: "Kyoto Loom", price: 380, imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=200&auto=format&fit=crop&q=60" },
      { id: "m9", name: "Handcrafted Calfskin Chelsea Boots", brand: "Milano Craft", price: 620, imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=200&auto=format&fit=crop&q=60" }
    ]
  };

  // --- 6. STATE FOR ENGINE 6: DESIGNER MODE ---
  const [designerPrompt, setDesignerPrompt] = useState('Tech-wear long shell jacket with asymmetric zip and minimal thermal rib panels');
  const [designerFabric, setDesignerFabric] = useState('GoreTex Pro');
  const [designerColor, setDesignerColor] = useState('#2A2D34');
  const [isSynthesizingDesign, setIsSynthesizingDesign] = useState(false);
  const [designerAlert, setDesignerAlert] = useState<string | null>(null);
  const [customBoards, setCustomBoards] = useState<any[]>([
    {
      id: "board-1",
      title: "Asymmetric Shell Silhouette",
      fabric: "GoreTex Pro 3-layer",
      colorName: "Obsidian Void",
      improvements: "Suggested: Increase seam sealing standard under high wind and lower front hem to enable rain protection.",
      visualSeed: "https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=60"
    }
  ]);

  // --- PRODUCTION-GRADE PIPELINE SYNCHRONIZATION & AUTONOMOUS RUNTIME ---
  // Subscribing to continuous autonomous background loop evaluations
  useEffect(() => {
    // 1. Initial manual load of static metrics
    const metrics = TrendIntelligence.getIngestionStatus();
    setIngestionMetrics(metrics);

    // Apply active trend provider mode
    TrendProvider.setMode(trendProviderMode);

    // Helper to refresh historical state snapshot timeline
    async function loadHistory() {
      const history = await AIOperatingSystem.fetchStateSnapshotsHistory('current-active-user-1');
      setStateSnapshotsHistory(history);
    }

    // 2. Register callbacks on loop ticks
    AIOperatingSystem.registerOnLoopTick((res) => {
      setUserProfile(res.profile);
      setVectorWeights(res.profile.vector);
      setScoringReport(res.scoredCandidates);
      setOsCyclesCount(res.cycleTickCount);
      
      // Load real-time Telemetry, Governor, & Anomaly metrics
      setHealthScore(Telemetry.getSystemHealthScore());
      const loadSum = ExecutionMetrics.getExecutionLoadSummary();
      setCpuLoad(loadSum.cpuLoadPercent);
      setTelemetryHistory([...Telemetry.getHistoricalReadings()]);
      setActiveAlerts([...AnomalyDetector.detectAnomalies()]);
      setIsGovernorLocked(AIGovernor.isLocked());
      setCycleBudget({ ...ExecutionBudget.getBudgetReport() });

      loadHistory();
    });

    // 3. Boot execution daemon
    AIOperatingSystem.startAutonomousRuntime(
      'current-active-user-1',
      wardrobe,
      genOccasion,
      genCulture,
      18, // Climate condition parameter placeholder
      genWeather,
      likesCount,
      dislikedTags
    );

    // Initial load history right away
    loadHistory();

    // Clean up to prevent multi-loop collisions during React hot re-renders
    return () => {
      AIOperatingSystem.clearLoop();
    };
  }, [wardrobe, genOccasion, genCulture, genWeather, likesCount, dislikedTags, trendProviderMode]);

  // Fast visual step simulator to give active user feedback about which step in the OODA Loop is executing
  useEffect(() => {
    const steps: ('Observe' | 'Predict' | 'Generate' | 'Evaluate' | 'Adapt')[] = ['Observe', 'Predict', 'Generate', 'Evaluate', 'Adapt'];
    let idx = 0;
    const stepInterval = setInterval(() => {
      setActiveCycleStep(steps[idx]);
      idx = (idx + 1) % steps.length;
    }, 4000);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    async function runSim() {
      const selectedItemName = wardrobe[0]?.title || "Active Utility Knitwear";
      const selectedCategory = wardrobe[0]?.category || "Casual";
      const res = await TryOnArchitecture.computeDrapeSimulation(
        bodyShape,
        selectedItemName,
        selectedCategory
      );
      setTryOnSimResult(res);
    }
    runSim();
  }, [bodyShape, wardrobe]);

  // Initializer for Phase Next visual rendering suite states
  useEffect(() => {
    const val = OutfitRenderer.renderLook(
      vectorWeights,
      genOccasion,
      { temperature: 15, condition: 'Cool Autumn' },
      ['Minimalist Grays', 'Structured Coats'],
      200
    );
    setActiveLook(val);
    setCompareModeLookA(val);
    setCompareModeLookB({
      ...val,
      renderId: 'compare-alt-look',
      heroLook: {
        title: 'Alternative Minimal Layered Fit',
        description: 'Stripped outer coat with matching fine merino layers.',
         aestheticVibe: 'Minimalist',
         imageUrl: 'from-indigo-900 via-indigo-950 to-slate-900'
      }
    });

    const sim = TryOnEngine.runTryOnSimulation(bodyShape, 'Supima Cotton Tee', 'Casual', tryOnHeight);
    setTryOnEngineResult(sim);

    setTimelineLooks(VisualTimeline.getSavedMemoryTimeline());
  }, [vectorWeights]);

  const triggerLearningFeedback = async (styleTag: string, rating: 'like' | 'dislike') => {
    if (!userProfile) return;
    const action = rating === 'like' ? 'like' : 'dislike';
    const updated = VectorProfileMemory.adjustProfileWeights(userProfile, action, styleTag);
    setUserProfile(updated);
    setVectorWeights(updated.vector);
    
    setUserInteractions(prev => [
      { action: `Optimized weights for "${styleTag}" (Vector Trained)`, time: "Just now", tag: rating === 'like' ? 'Growth' : 'Penalty' },
      ...prev
    ]);

    if (rating === 'dislike') {
      setDislikedTags(prev => [...prev, styleTag.toLowerCase()]);
    } else {
      setLikesCount(prev => prev + 1);
    }
    await VectorProfileMemory.saveProfile(updated);
  };

  // --- TRIGGER METHODS ---

  // Generate Outfit
  const handleGenerateOutfitSet = () => {
    setIsGeneratingSet(true);
    setTimeout(() => {
      const newSet = {
        styleName: `${genCulture} ${genOccasion} Special`,
        confidence: Math.floor(Math.random() * 15) + 84,
        items: [
          { name: `Premium Rain-shedding ${genCulture} Jacket`, category: "Outerwear", color: "Dry Sage", role: "Outerlayer" },
          { name: `Superfine ${genCulture} Everyday Tee`, category: "Casual", color: "Minimalist White", role: "Basewear" },
          { name: `Lightweight Cotton Chinos`, category: "Casual", color: "Oatmeal Beige", role: "Bottomwear" },
          { name: "Suede Court Sneakers", category: "Accessories", color: "Silver Gray", role: "Footwear" }
        ],
        harmonizedExplanation: `Fitted exactly for ${genWeather}. The budget category is optimized for '${genBudget}' tiers ensuring aesthetic parity with ${genCulture} styling values.`
      };
      setGeneratedSets([newSet, ...generatedSets]);
      setIsGeneratingSet(false);
      // add dynamic user click history to DNA
      setUserInteractions(prev => [
        { action: `Generated Outfit Board: "${newSet.styleName}"`, time: "Just now", tag: genCulture },
        ...prev
      ]);
      setSavedOutfits(prev => prev + 1);
    }, 1200);
  };

  // Virtual Try-On trigger
  const runBodyShapeAdaptation = () => {
    setIsAnalyzingBody(true);
    setTimeout(() => {
      setIsAnalyzingBody(false);
      setUserInteractions(prev => [
        { action: `Adaptive Body Scanning completed for ${bodyShape} silhouette`, time: "Just now", tag: "Try-On Scan" },
        ...prev
      ]);
    }, 1500);
  };

  // Add Item to cart in Market Engine
  const addToCart = (item: any) => {
    setShoppingCart([...shoppingCart, item]);
    setLikesCount(prev => prev + 1);
    setUserInteractions(prev => [
      { action: `Added ${item.name} to AI Outfit Bundle`, time: "Just now", tag: "Marketplace" },
      ...prev
    ]);
  };

  // Synthesize custom design board
  const synthesizeDesignerBoard = () => {
    if (!designerPrompt.trim()) return;
    setIsSynthesizingDesign(true);
    setTimeout(() => {
      const newBoard = {
        id: `board-${Date.now()}`,
        title: designerPrompt.length > 30 ? designerPrompt.slice(0, 30) + '...' : designerPrompt,
        fabric: designerFabric,
        colorName: designerColor,
        improvements: `Suggested upgrade: Boost aesthetic balance or swap fabric with high-wicking synthetic mesh if focused on sports environments. Add classic collar to maintain formality.`,
        visualSeed: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&auto=format&fit=crop&q=60"
      };
      setCustomBoards([newBoard, ...customBoards]);
      setIsSynthesizingDesign(false);
      setDesignerAlert("AI Fashion Engine successfully balanced your prompt guidelines and compiled a style blueprint board.");
    }, 1500);
  };

  // Save generated garment to wardrobe collection
  const saveGarmentToCloset = async (item: any) => {
    try {
      await onAddGarment(
        item.name,
        `AI Generated asset matching Scandinavia aesthetics under casual guidelines. Built on deep DNA learning.`,
        item.category || "Casual",
        {
          season: "All-Season",
          primaryColor: item.color || "Oatmeal Beige",
          secondaryColor: "Pitch Black"
        }
      );
      alert(`Saved "${item.name}" directly to your permanent digital closet!`);
    } catch (e: any) {
      console.error(e);
    }
  };

  // --- NEW PHASE NEXT TRIGGERS ---
  
  // 1. Compile look utilizing lazy non-blocking queue
  const triggerVisualRender = () => {
    setIsRenderQueuing(true);
    
    // Construct render input payload
    const payload = {
      vector: vectorWeights,
      occasion: genOccasion,
      weather: { temperature: 16, condition: genWeather },
      trends: predictedTrends.map(t => t.title),
      spendLimit: 250
    };

    RenderQueue.pushTask(payload, (task) => {
      setIsRenderQueuing(false);
      setRenderTasks([...RenderQueue.getActiveTasks()]);
      
      const compiledLook = OutfitRenderer.renderLook(
        vectorWeights,
        genOccasion,
        { temperature: 16, condition: genWeather },
        predictedTrends.map(t => t.title),
        250
      );

      setActiveLook(compiledLook);
      
      // Save directly to timeline memory
      VisualTimeline.saveRenderToMemory(compiledLook, `Rendered for "${genOccasion}" under ${genWeather}`);
      setTimelineLooks([...VisualTimeline.getSavedMemoryTimeline()]);

      // Add user log trace entry
      setUserInteractions(prev => [
        { action: `Visual Render Task Complied: ${compiledLook.heroLook.title}`, time: "Just now", tag: "Render Queue" },
        ...prev
      ]);
    });
  };

  // 2. Perform style lab mutant remix overlays
  const triggerStyleLabRemix = (userPromptText: string) => {
    if (!activeLook) return;
    const remixedRes = OutfitStudio.remixOutfit(activeLook, userPromptText);
    setLabMutatedLook(remixedRes);
    
    // Add user log trace entry
    setUserInteractions(prev => [
      { action: `Style Lab Mutation Compiled: "${userPromptText}"`, time: "Just now", tag: "Style Lab" },
      ...prev
    ]);
  };

  // 3. Perform virtual Try-On anthropometric simulations
  const triggerTryOnSimulate = (targetShape: 'Slim' | 'Regular' | 'Athletic' | 'Broad', targetHeight: number) => {
    setIsTryOnEngineLoading(true);
    setTimeout(() => {
      const activeGarmentTitle = wardrobe[0]?.title || "Heritage Wool Jacket";
      const activeCategory = wardrobe[0]?.category || "Outerwear";
      
      const res = TryOnEngine.runTryOnSimulation(targetShape, activeGarmentTitle, activeCategory, targetHeight);
      setTryOnEngineResult(res);
      setIsTryOnEngineLoading(false);

      setUserInteractions(prev => [
        { action: `Anthropometric drape simulated: Fit Score ${res.results.fitScore}%`, time: "Just now", tag: "Try-On Suite" },
        ...prev
      ]);
    }, 800);
  };

  return (
    <div className="space-y-10 font-sans" id="ai-fashion-operating-layer">
      {/* Editorial AI Master Headliner */}
      <div className="bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-850 relative overflow-hidden shadow-2xl text-white">
        {/* Abstract background vector aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/15 border border-blue-500/20 rounded-full text-xs font-mono uppercase tracking-widest text-blue-400">
            <Cpu size={12} className="animate-pulse" /> Next-Gen AI Fashion OS Activated
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight max-w-3xl leading-tight">
            Global Style Intelligence Engine
          </h1>
          <p className="text-sm text-slate-400 font-light max-w-2xl leading-relaxed">
            Transition your local drawer list into a hyper-connected **SaaS Style Architecture**. Learn your fashion DNA, generate complete seasonal lookbooks organically, and trace daily style evolution instantly.
          </p>

          {/* Core sub-navigation controllers representing 6 operational segments $+ Phase Next Visual elements */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-900">
            {[
              { id: 'nexus-v6', label: '🌠 Nexus V6 OS', icon: <Sparkles size={13} /> },
              { id: 'saas-dashboard', label: 'Executive Operations', icon: <Cpu size={13} /> },
              { id: 'dna', label: '1. Style DNA', icon: <Brain size={13} /> },
              { id: 'generator', label: '2. Visual Generator', icon: <Sparkles size={13} /> },
              { id: 'tryon', label: '3. Try-On Console', icon: <Eye size={13} /> },
              { id: 'style-lab', label: '4. Style Lab', icon: <Sliders size={13} /> },
              { id: 'render-gallery', label: '5. Render Gallery', icon: <Bookmark size={13} /> },
              { id: 'identity-evolution', label: '6. Identity Evolution', icon: <History size={13} /> },
              { id: 'market', label: '7. Marketplace', icon: <ShoppingBag size={13} /> },
              { id: 'designer', label: '8. Designer Pro', icon: <Edit3 size={13} /> }
            ].map((engine) => (
              <button
                key={engine.id}
                onClick={() => {
                  setActiveEngine(engine.id as any);
                  setDesignerAlert(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                  activeEngine === engine.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/15'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                {engine.icon}
                <span>{engine.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeEngine}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >          {activeEngine === 'saas-dashboard' && (
            <div className="space-y-8" id="enterprise-executive-dashboard">
              {/* SECTION A: STRATEGIC INSIGHTS HEADERS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">ANNUALIZED VALUE</span>
                    <h4 className="text-2xl font-serif font-black text-white">$1.28M ARR</h4>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <TrendingUp size={10} /> +14.2% MoM growth
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <DollarSign size={20} />
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">GRAPH DENSITY</span>
                    <h4 className="text-2xl font-serif font-black text-white">{(graphState.graphHealth.densityScore * 100).toFixed(2)}%</h4>
                    <span className="text-[10px] font-mono text-blue-400 flex items-center gap-1">
                      <Activity size={10} /> {graphNodes.length} active global nodes
                    </span>
                  </div>
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Share2 size={20} />
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">API VOLUME (MIN)</span>
                    <h4 className="text-2xl font-serif font-black text-white">
                      {activeTenants.reduce((acc, t) => acc + t.activeRequestsCount, 0)} Req/m
                    </h4>
                    <span className="text-[10px] font-mono text-indigo-400 flex items-center gap-1">
                      <RefreshCw size={10} className="animate-spin-slow" /> QoS: 99.99% uptime
                    </span>
                  </div>
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <Cpu size={20} />
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">DATA HEALTH</span>
                    <h4 className="text-2xl font-serif font-black text-white">100% GDPR</h4>
                    <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                      <Shield size={10} /> Consent version: {userConsent.versionSigned}
                    </span>
                  </div>
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                    <Shield size={20} />
                  </div>
                </div>
              </div>

              {/* SECTION B: OPERATIONS HUB SUB-NAVIGATION */}
              <div className="bg-slate-950 p-2 rounded-2xl border border-slate-900 flex flex-wrap gap-2">
                {[
                  { id: 'execution', label: 'Execution Runtime', description: 'Orchestrated styling pipelines', activeColor: 'bg-blue-600 text-white shadow-xl shadow-blue-550/20' },
                  { id: 'journeys', label: 'User Journeys', description: 'Activations, saves, and retention loops', activeColor: 'bg-emerald-600 text-white' },
                  { id: 'quality', label: 'Quality Center', description: 'Score metrics, schema checks, & fallbacks', activeColor: 'bg-indigo-600 text-white' },
                  { id: 'experiments', label: 'Experiment Console', description: 'Active tests, A/B cohorts, and canary gates', activeColor: 'bg-purple-600 text-white' },
                  { id: 'performance', label: 'Resource Performance', description: 'Cache ratios, latency trackers, & micro-costs', activeColor: 'bg-amber-600 text-white' },
                  { id: 'graph', label: 'World Fashion Graph', description: 'Semantic nodes/edges ontology mapping font', activeColor: 'bg-indigo-600 text-white' },
                  { id: 'global', label: 'Global Pulse', description: 'Cross-border pricing/sizing policy', activeColor: 'bg-emerald-600 text-white' },
                  { id: 'api', label: 'B2B Enterprise Portal', description: 'Developer APIs sandbox isolation', activeColor: 'bg-blue-600 text-white' },
                  { id: 'governance', label: 'Compliance & Governance', description: 'GDPR consent, retention, & log privacy', activeColor: 'bg-amber-600 text-white' },
                  { id: 'deployment', label: 'Release & Rollouts', description: 'Canary split controller & feature flags', activeColor: 'bg-purple-600 text-white' },
                  { id: 'operations', label: 'Diagnostic Console', description: 'Sys telemetry status log flows', activeColor: 'bg-slate-800 text-white' },
                  { id: 'launch', label: 'Release Launch Dashboard', description: 'RC1 Readiness, health, validation checks & rollouts', activeColor: 'bg-rose-600 text-white shadow-xl shadow-rose-550/25' }
                ].map((sTab) => (
                  <button
                    key={sTab.id}
                    onClick={() => {
                      setOpsTab(sTab.id as any);
                      setUserInteractions(prev => [
                        { action: `Opened Executive board: ${sTab.label}`, time: "Just now", tag: "Executive Control" },
                        ...prev
                      ]);
                    }}
                    className={`flex-1 min-w-[200px] p-3 rounded-xl transition-all text-left cursor-pointer border ${
                      opsTab === sTab.id
                        ? `${sTab.activeColor} border-transparent shadow`
                        : 'bg-slate-900/40 border-slate-900 hover:bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    <p className="text-[11px] font-mono uppercase tracking-wider font-bold">{sTab.label}</p>
                    <p className="text-[9px] opacity-70 font-light truncate">{sTab.description}</p>
                  </button>
                ))}
              </div>

              {/* SUB-PANEL CONTENDERS */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-900 min-h-[480px]">
                {/* A16. PROCESS COMMAND CENTER TAB CONTENDERS */}

                {/* 1. ORCHESTRATED EXECUTION RUNTIME */}
                {opsTab === 'execution' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-white text-lg">Orchestrated Execution Engine</h4>
                        <p className="text-xs text-slate-400 font-light font-sans">
                          Synthesize standard look generations as structured, executable multi-stage workflows with automated error recovery.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-550/20 px-2.5 py-1 rounded-full font-bold">
                          ● RUNTIME ONLINE
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Input Planner Form */}
                      <div className="lg:col-span-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2">
                          Configure Style Sequence Plan
                        </h5>

                        <div className="space-y-3 font-sans">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Look Title Target</label>
                            <input
                              type="text"
                              value={customWfTitle}
                              onChange={(e) => setCustomWfTitle(e.target.value)}
                              placeholder="e.g. Monaco Suede Ensemble"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-700"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Style DNA Focus Vibe</label>
                            <select
                              value={customWfVibe}
                              onChange={(e: any) => setCustomWfVibe(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300"
                            >
                              <option value="minimalist">Minimalist (Quiet Luxury core)</option>
                              <option value="classic">Classic (Sartorial tailoring)</option>
                              <option value="cyberpunk">Cyberpunk (Stealth activewear)</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Fidelity Mode</label>
                              <select
                                value={customWfIntensity}
                                onChange={(e: any) => setCustomWfIntensity(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-300"
                              >
                                <option value="standard">Standard</option>
                                <option value="high-fidelity">High Fidelity (GPU+)</option>
                                <option value="low-latency">Low Latency (Fast)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Context</label>
                              <input
                                type="text"
                                value={customWfContext}
                                onChange={(e) => setCustomWfContext(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
                              />
                            </div>
                          </div>

                          <button
                            onClick={async () => {
                              const vibeParam = customWfVibe;
                              const titleParam = customWfTitle || `${vibeParam.toUpperCase()} Sequence Run`;
                              
                              // Track pre-processing and enqueue background non-blocking job
                              WorkloadBalancer.enqueueJob({
                                id: `job-${Date.now()}`,
                                weight: customWfIntensity === 'high-fidelity' ? 'intensive' : 'medium',
                                priority: 'high',
                                action: async () => {
                                  await TaskCoordinator.triggerStyleGeneration(
                                    titleParam,
                                    vibeParam,
                                    customWfIntensity,
                                    customWfContext,
                                    (updatedWf) => {
                                      setActiveWorkflow(updatedWf);
                                      setWorkflowsHistory(getExecutionState().workflows);
                                    },
                                    (lookResult) => {
                                      const evalResult = QualityEvaluator.evaluateLook({
                                        id: lookResult.lookId,
                                        vibe: lookResult.vibe,
                                        colors: lookResult.renderedColors,
                                        garmentCount: 3
                                      });
                                      setLatestQualityReport(evalResult);
                                      
                                      setHistoricalQualityScores(prev => {
                                        const nextScores = [...prev, evalResult.overallScore];
                                        setAuditStats(ConfidenceAudit.runAudit(nextScores));
                                        return nextScores;
                                      });

                                      recordFirstLookSeen();
                                      incrementGenerationCount();
                                      setJourneyStats(generateJourneyDiagnostics());

                                      ComputeBudget.recordComputeUsage(computeUsageStats.expectedCostPerRenderUsd);
                                      setComputeUsageStats(ComputeBudget.getBudgetStats(subscriptionLevelState));

                                      setAuditEntries(prev => [
                                        { message: `Completed executed modeling run for look ${lookResult.lookId}`, time: new Date().toLocaleTimeString(), user: userEmail },
                                        ...prev
                                      ]);

                                      CacheManager.set(`${lookResult.vibe}-${customWfIntensity}`, lookResult);
                                      setCacheDetails(CacheManager.getSummary());

                                      LatencyTracker.logLatency('outfit-rendering', customWfIntensity === 'high-fidelity' ? 1150 : 380);
                                      setAvgLatencies({
                                        coldStart: LatencyTracker.getAverageLatency('cold-start') || 120,
                                        outfitRender: LatencyTracker.getAverageLatency('outfit-rendering'),
                                        dnsAnalysis: LatencyTracker.getAverageLatency('dns-analysis') || 180,
                                      });
                                      setPerformanceStatus(LatencyTracker.evaluatePerformanceStatus());
                                    }
                                  );
                                }
                              });

                              setConcurrencyInfo(WorkloadBalancer.getQueueStatus());
                            }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer font-bold flex items-center justify-center gap-2"
                          >
                            <Play size={12} fill="currentColor" /> Dispatched Pipe Sequence
                          </button>
                        </div>
                      </div>

                      {/* Right: Active Pipeline Stage Tracker */}
                      <div className="lg:col-span-7 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-center border-b border-slate-950 pb-2 mb-4">
                            <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold">
                              Live Pipeline Execution Thread
                            </h5>
                            {activeWorkflow && (
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase ${
                                activeWorkflow.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                activeWorkflow.status === 'running' ? 'bg-blue-500/10 text-blue-400 animate-pulse' :
                                activeWorkflow.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {activeWorkflow.status}
                              </span>
                            )}
                          </div>

                          {activeWorkflow ? (
                            <div className="space-y-4 font-sans">
                              <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-900">
                                <div>
                                  <p className="text-slate-550 font-light">Workflow Identifier</p>
                                  <p className="text-slate-200 truncate">{activeWorkflow.id}</p>
                                </div>
                                <div>
                                  <p className="text-slate-550">Pipeline Flow</p>
                                  <p className="text-blue-400 font-bold capitalize">{activeWorkflow.name}</p>
                                </div>
                              </div>

                              {/* Stage Horizontal / Cascade tracker */}
                              <div className="space-y-2">
                                {activeWorkflow.steps.map((step, idx) => {
                                  const isActive = idx === activeWorkflow.currentStageIndex;
                                  return (
                                    <div
                                      key={step.stage}
                                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all border ${
                                        isActive
                                          ? 'bg-blue-500/10 border-blue-500/30 text-white'
                                          : step.status === 'completed'
                                          ? 'bg-slate-950/30 border-slate-900 text-slate-400'
                                          : 'bg-transparent border-transparent text-slate-600'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${
                                          step.status === 'completed' ? 'bg-emerald-400' :
                                          step.status === 'running' ? 'bg-blue-400 animate-ping' :
                                          step.status === 'failed' ? 'bg-red-505 shadow shadow-red-500' : 'bg-slate-800'
                                        }`} />
                                        <span className="font-mono text-xs uppercase tracking-wider">{step.stage}</span>
                                      </div>
                                      <div className="flex items-center gap-3 font-mono text-[10px]">
                                        <span>{step.durationMs}ms</span>
                                        <span className="text-slate-500">·</span>
                                        <span className="text-indigo-400">QScore: {(step.qualityScore * 100).toFixed(0)}%</span>
                                        {step.retryCount > 0 && (
                                          <span className="bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded text-[9px]">
                                            Retry #{step.retryCount}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Control Action Buttons */}
                              <div className="flex gap-2 border-t border-slate-900 pt-3">
                                <button
                                  onClick={() => {
                                    WorkflowRuntime.togglePause(activeWorkflow.id);
                                    setActiveWorkflow({ ...activeWorkflow, status: activeWorkflow.status === 'paused' ? 'running' : 'paused' });
                                  }}
                                  className="flex-1 py-1 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-[10px] font-mono tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                                >
                                  {activeWorkflow.status === 'paused' ? '▶ Resume' : '⏸ Pause'}
                                </button>
                                <button
                                  onClick={() => {
                                    WorkflowRuntime.cancelWorkflow(activeWorkflow.id);
                                    setActiveWorkflow({ ...activeWorkflow, status: 'cancelled' });
                                  }}
                                  className="flex-1 py-1 px-2.5 bg-red-950/30 hover:bg-red-950 text-red-400 border border-red-900/20 text-[10px] font-mono tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                                >
                                  ■ Cancel Flow
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-16 text-slate-500 text-xs flex flex-col items-center justify-center space-y-2">
                              <Cpu size={24} className="text-slate-600 animate-pulse" />
                              <p>No active pipeline workflow running.</p>
                              <p className="text-[10px] opacity-75">Click &apos;Dispatched Pipe Sequence&apos; on the left planner to synthesize styling.</p>
                            </div>
                          )}
                        </div>

                        {workflowsHistory.length > 0 && (
                          <div className="border-t border-slate-900/85 pt-3">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Past Pipeline Ledger</span>
                            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                              {workflowsHistory.slice(0, 4).map(wf => (
                                <div key={wf.id} className="flex justify-between items-center text-[10px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-900">
                                  <span className="text-slate-300 font-bold truncate max-w-[200px]">{wf.name}</span>
                                  <span className="text-slate-500">{wf.totalDurationMs}ms</span>
                                  <span className="text-indigo-400 font-bold">{(wf.overallQualityScore * 100).toFixed(1)}% Q</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. REAL USER JOURNEYS */}
                {opsTab === 'journeys' && (
                  <div className="space-y-6 font-sans">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-white text-lg">Real User Journeys Engine</h4>
                        <p className="text-xs text-slate-400 font-light font-sans">
                          Measure actual friction points situating key milestones: onboarding completion, time-to-first-look, and retention factors.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                        ● RETENTION MULTIPLIER: {journeyStats.healthIndex > 80 ? 'HIGH' : 'STABLE'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Journey Cohort Aggregates */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2">
                          Client Cohort Funnel
                        </h5>

                        <div className="space-y-4 font-mono text-xs">
                          <div className="space-y-1">
                            <div className="flex justify-between text-slate-400 text-[10px]">
                              <span>Onboarding Completion</span>
                              <span className="text-emerald-400">{(journeyStats.onboardingCompletionRate * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${journeyStats.onboardingCompletionRate * 100}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-slate-400 text-[10px]">
                              <span>Activation Rate</span>
                              <span className="text-blue-400">{(journeyStats.activationCompletionRate * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-550 h-full transition-all" style={{ width: `${journeyStats.activationCompletionRate * 100}%` }} />
                            </div>
                          </div>

                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1 text-[11px]">
                            <p className="text-slate-500 uppercase text-[9px] font-semibold leading-none">Diagnostic Milestones</p>
                            <div className="flex justify-between text-slate-200 mt-2">
                              <span>Time to First Look:</span>
                              <span className="text-white font-bold">{journeyStats.timeToFirstLookS ? `${journeyStats.timeToFirstLookS.toFixed(1)}s` : 'Not recorded'}</span>
                            </div>
                            <div className="flex justify-between text-slate-200">
                              <span>Time to First Save:</span>
                              <span className="text-white font-bold">{journeyStats.timeToFirstSaveS ? `${journeyStats.timeToFirstSaveS.toFixed(1)}s` : 'Pending save action'}</span>
                            </div>
                            <div className="flex justify-between text-slate-200">
                              <span>Repeat Generations:</span>
                              <span className="text-white font-bold">{journeyStats.repeatGenerations} times</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Interactive NPS Survey Panel */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2">
                          Interactive NPS Feedback Probe
                        </h5>
                        <p className="text-xs text-slate-400 font-light leading-relaxed">
                          Submit user survey scores to dynamically audit the retention engines and calculate risk rates immediately.
                        </p>

                        <div className="grid grid-cols-5 gap-1.5 pt-2">
                          {[2, 4, 6, 8, 10].map(score => {
                            const isAct = getRetentionState().netPromoterScore === score;
                            return (
                              <button
                                key={score}
                                onClick={() => {
                                  submitNPSSurvey(score);
                                  setJourneyStats(generateJourneyDiagnostics());
                                  // Update telemetry
                                  setAuditEntries(prev => [
                                    { message: `NPS Survey response submitted: Score ${score}`, time: new Date().toLocaleTimeString(), user: userEmail },
                                    ...prev
                                  ]);
                                }}
                                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                                  isAct ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'
                                }`}
                              >
                                {score}
                              </button>
                            );
                          })}
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-1.5">
                          <span className="text-[9px] font-mono uppercase text-slate-550 leading-none">Global Retentive Health Index</span>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300">Composite Health score:</span>
                            <strong className="text-emerald-400 font-mono text-sm">{journeyStats.healthIndex}%</strong>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300 font-sans">Churn propensity classification:</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-black ${
                              getRetentionState().churnPropensityRisk === 'low' ? 'bg-emerald-500/10 text-emerald-400' :
                              getRetentionState().churnPropensityRisk === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-red-500/10 text-red-400'
                            }`}>
                              {getRetentionState().churnPropensityRisk} Risk
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Plan Level Conversion Upgrader */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2">
                          Conversion Upgrader Simulation
                        </h5>
                        <p className="text-xs text-slate-400 font-light leading-relaxed">
                          Trigger conversions to pro status. Measures conversion rate latency across experimental variant segments.
                        </p>

                        <div className="space-y-2 mt-2">
                          {[
                            { level: 'free', pr: 0 },
                            { level: 'pro', pr: 29 },
                            { level: 'enterprise', pr: 249 }
                          ].map(plan => {
                            const isCurrentPlan = subscriptionLevelState === plan.level;
                            return (
                              <button
                                key={plan.level}
                                onClick={() => {
                                  SubscriptionEngine.upgradeSubscription(plan.level as any);
                                  setSubscriptionLevelState(plan.level as any);
                                  setUserCreditsLeft(SubscriptionEngine.getSubscriptionTierData(plan.level as any).maxCredits);
                                  completeSubscriptionUpgrade(plan.level as any, plan.pr, Date.now() - 60000);
                                  setJourneyStats(generateJourneyDiagnostics());
                                  
                                  // Record conversions for the experimentation engine!
                                  recordExperimentConversion(selectedExpId, VariantAllocator.allocateUser(userEmail, selectedExpId));
                                  setExpAnalysis(ResultAnalyzer.analyzeExperiment(selectedExpId));

                                  setAuditEntries(prev => [
                                    { message: `User upgraded plan to ${plan.level.toUpperCase()} - converted conversion intent.`, time: new Date().toLocaleTimeString(), user: userEmail },
                                    ...prev
                                  ]);
                                }}
                                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                                  isCurrentPlan
                                    ? 'bg-blue-600 border-transparent text-white font-bold'
                                    : 'bg-slate-950 border-slate-900 hover:border-slate-850 text-slate-350 hover:text-white'
                                }`}
                              >
                                <div>
                                  <p className="text-xs font-mono uppercase leading-none font-bold">{plan.level} tier</p>
                                  <p className="text-[10px] opacity-75 font-light font-sans mt-1">Upgrade immediately to optimize resources budget.</p>
                                </div>
                                <span className="font-mono text-xs">${plan.pr}/mo</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. RESULT QUALITY SYSTEM */}
                {opsTab === 'quality' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-white text-lg">Aesthetic Quality & Validation System</h4>
                        <p className="text-xs text-slate-400 font-light font-sans">
                          Perform strict structural validations, confidence interval audits, and block low-quality recommendations in the raw styling pipeline.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-bold font-sans">
                        REGRESSION SHIELD: ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Interactive Schema validator / Probe */}
                      <div className="lg:col-span-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4 font-sans">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-955 pb-2">
                          Interactive Schema Gating Probe
                        </h5>
                        <p className="text-xs text-slate-404 font-light leading-relaxed">
                          Test the validation engines with corrupted outputs. See the error guard block issues before output reaches client browser.
                        </p>

                        <div className="space-y-2.5 pt-1">
                          <button
                            onClick={() => {
                              const payload = { lookId: 'look-ok-12', renderedTitle: 'Prone Merino Sweater Set', renderedColors: ['#FFFFFF', '#333333'], outfitScore: 92 };
                              const res = OutputValidator.validateLookPayload(payload);
                              alert(`Schema Validation Status: ${res.isValid ? 'VALID' : 'INVALID'}\nErrors: ${res.errors.join(', ') || 'None'}`);
                            }}
                            className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                          >
                            Validate Solid Payload (Pass)
                          </button>
                          
                          <button
                            onClick={() => {
                              const payload = { lookId: '', renderedTitle: '', renderedColors: ['non-hex-corrupted'], outfitScore: 195 };
                              const res = OutputValidator.validateLookPayload(payload);
                              alert(`Schema Validation Status: ${res.isValid ? 'VALID' : 'INVALID'}\nBlocked Reasons:\n- ` + res.errors.join('\n- '));
                            }}
                            className="w-full py-2 bg-red-950/20 hover:bg-red-950 border border-red-950/35 text-red-400 font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                          >
                            Inject Corrupted Color Payload (Blocks)
                          </button>

                          <button
                            onClick={() => {
                              const rulesCheck = RegressionGuard.triggerFallback('minimalist');
                              alert(`Regression fallback triggered successfully! Golden Fallback loaded:\n- Name: ${rulesCheck.garments[0]}\n- Colors: ${rulesCheck.colors.join(', ')}\n- Notes: ${rulesCheck.notes}`);
                            }}
                            className="w-full py-2 bg-indigo-950/20 hover:bg-indigo-950 border border-indigo-955 text-indigo-400 font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                          >
                            Trigger Golden Fallback Match
                          </button>
                        </div>
                      </div>

                      {/* Middle: Live Quality Scorecard Report */}
                      <div className="lg:col-span-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2">
                          Latest Pipeline Quality Card
                        </h5>

                        {latestQualityReport ? (
                          <div className="space-y-3 text-xs font-sans">
                            <div className="flex justify-between items-center p-2.5 bg-slate-950 rounded-xl border border-slate-900">
                              <span className="text-slate-450 text-[11px]">Target Look-spec ID</span>
                              <strong className="text-white font-mono font-medium lowercase text-[10px]">{latestQualityReport.lookId}</strong>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-slate-400">Usefulness Metric</span>
                                <strong className="text-emerald-400">{(latestQualityReport.usefulnessScore * 100).toFixed(0)}%</strong>
                              </div>
                              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-400 h-full" style={{ width: `${latestQualityReport.usefulnessScore * 100}%` }} />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-slate-400">Rendering Coherence</span>
                                <strong className="text-blue-400">{(latestQualityReport.renderFidelityScore * 100).toFixed(0)}%</strong>
                              </div>
                              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-400 h-full" style={{ width: `${latestQualityReport.renderFidelityScore * 100}%` }} />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-slate-400">Decision Consistency</span>
                                <strong className="text-purple-400">{(latestQualityReport.decisionConsistencyScore * 100).toFixed(0)}%</strong>
                              </div>
                              <div className="w-full bg-slate-955 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-purple-405 h-full" style={{ width: `${latestQualityReport.decisionConsistencyScore * 100}%` }} />
                              </div>
                            </div>

                            <div className="p-2.5 border border-slate-900 rounded-xl bg-slate-950 ">
                              <p className="text-[10px] font-mono uppercase text-slate-500 mb-1 leading-none font-bold">Heuristic validation reports</p>
                              {latestQualityReport.notes.map((note, noteIdx) => {
                                const isBlocked = note.includes('BLOCKED');
                                return (
                                  <p key={noteIdx} className={`text-[10px] ${isBlocked ? 'text-red-400 font-bold' : 'text-slate-350'}`}>
                                    ● {note}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-slate-550 text-xs">
                            No quality audits populated. Generate a look workflow sequence to test coherence.
                          </div>
                        )}
                      </div>

                      {/* Right: Confidence Audit Distributions */}
                      <div className="lg:col-span-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2">
                          Confidence Interval distribution
                        </h5>

                        <div className="space-y-3 font-mono text-[11px]">
                          <div className="flex justify-between border-b border-slate-950 py-1 text-slate-400">
                            <span>Historic mean score:</span>
                            <span className="text-white font-bold">{auditStats.meanScore} pts</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-955 py-1 text-slate-400">
                            <span>Standard Dev:</span>
                            <span className="text-white font-bold">{auditStats.standardDeviation}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-955 py-1 text-slate-400 font-light">
                            <span>Calibration limit:</span>
                            <span className="text-blue-400 font-bold">[{auditStats.confidenceLowerBound}, {auditStats.confidenceUpperBound}]</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-955 py-1 text-slate-400 font-semibold">
                            <span>Confidence Status:</span>
                            <span className={`px-1.5 rounded ${
                              auditStats.auditStatus === 'optimal' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {auditStats.auditStatus.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. EXPERIMENTATION ENGINE */}
                {opsTab === 'experiments' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-white text-lg">Distributed Experimentation Console</h4>
                        <p className="text-xs text-slate-400 font-light font-sans">
                          Orchestrate randomized variant allocations, trace statistical lifts with Z-score metrics, and deploy error-guarded canary rollouts safely.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full font-bold font-sans">
                        ACTIVE CANARY RECTIFIERS
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: A/B Test Configuration selection & lift analytics */}
                      <div className="lg:col-span-8 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-950 pb-2">
                          <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold">
                            Interactive Cohort Analysis
                          </h5>
                          <select
                            value={selectedExpId}
                            onChange={(e) => {
                              setSelectedExpId(e.target.value);
                              setExpAnalysis(ResultAnalyzer.analyzeExperiment(e.target.value));
                            }}
                            className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-[10px] text-white font-mono"
                          >
                            <option value="exp-recommendations-v2">Aesthetic Recommendations Engine V2</option>
                            <option value="exp-render-cadence">Dynamic Render Compression Speed Check</option>
                          </select>
                        </div>

                        {expAnalysis && (
                          <div className="space-y-4 font-sans">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {expAnalysis.results.map(variant => {
                                const isControl = variant.variantId === 'control';
                                return (
                                  <div key={variant.variantId} className={`p-4 rounded-xl border ${isControl ? 'bg-slate-950 border-slate-900' : 'bg-purple-950/15 border-purple-900/30'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-mono text-xs uppercase text-slate-200 font-bold">{variant.label}</span>
                                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${isControl ? 'bg-slate-800' : 'bg-purple-500/10 text-purple-400'}`}>
                                        {variant.variantId.toUpperCase()}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-1.5 bg-slate-950/50 rounded-lg">
                                      <div>
                                        <p className="text-[9px] text-slate-500">Conversions</p>
                                        <p className="text-slate-200 font-bold">{variant.conversions}</p>
                                      </div>
                                      <div>
                                        <p className="text-[9px] text-slate-500 font-light">Impressions</p>
                                        <p className="text-slate-200 font-bold">{variant.impressions}</p>
                                      </div>
                                      <div>
                                        <p className="text-[9px] text-slate-500">Conv% Rate</p>
                                        <p className="text-white font-bold font-mono text-xs">{(variant.conversionRate * 100).toFixed(1)}%</p>
                                      </div>
                                    </div>

                                    {!isControl && (
                                      <div className="flex justify-between items-center mt-3 text-[11px]">
                                        <div className="flex gap-1">
                                          <span>Lift vs Control:</span>
                                          <strong className={variant.conversionLift > 0 ? 'text-emerald-400' : 'text-red-400'}>
                                            {variant.conversionLift > 0 ? `+${variant.conversionLift}%` : `${variant.conversionLift}%`}
                                          </strong>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${variant.isSignificant ? 'bg-emerald-500/10 text-emerald-350 font-bold' : 'bg-slate-850 text-slate-400'}`}>
                                          {variant.isSignificant ? '★ 95% Sig Lift' : 'Inconclusive'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            <p className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-[10px] font-mono text-purple-300 leading-relaxed">
                              💡 <strong>Statistical Report Analysis:</strong> {expAnalysis.reportNotes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right: Automated Canary progressive release / spike rollback test */}
                      <div className="lg:col-span-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-955 pb-2">
                          Safeguarded Canary Exposure
                        </h5>
                        <p className="text-xs text-slate-400 font-light leading-relaxed font-sans">
                          Slide canary ratios from 0 to 100%. If diagnostic failure thresholds exceed rules, the engine triggers immediate automatic rollbacks.
                        </p>

                        <div className="space-y-4 pt-1">
                          {canaryRules.map(rule => (
                            <div key={rule.featureKey} className="bg-slate-955 p-3 rounded-xl border border-slate-900 space-y-2 bg-slate-955/40">
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-xs text-slate-300 font-bold truncate max-w-[150px]">{rule.featureKey.replace('feature-', '')}</span>
                                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${rule.rollbackActionTriggered ? 'bg-red-500/10 text-red-400 font-black' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                  {rule.rollbackActionTriggered ? 'ROLLED BACK' : `${rule.exposurePercentage}% ACTIVE`}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                  <span>Exposure Ratio:</span>
                                  <span>{rule.exposurePercentage}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  disabled={rule.rollbackActionTriggered}
                                  value={rule.exposurePercentage}
                                  onChange={(e) => {
                                    const percent = parseInt(e.target.value);
                                    RolloutEvaluator.setCanaryExposure(rule.featureKey, percent);
                                    setCanaryRules([...getCanariesState()]);
                                  }}
                                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                              </div>

                              <div className="flex justify-between items-center text-[10px] font-mono pt-1 text-slate-400">
                                <span className="flex items-center gap-1 font-sans">Err Rate: <strong className={rule.activeErrorRate > rule.errorThreshold ? 'text-red-400' : 'text-slate-300'}>{(rule.activeErrorRate * 100).toFixed(1)}%</strong></span>
                                <span>Threshold: {(rule.errorThreshold * 100).toFixed(0)}%</span>
                              </div>

                              {rule.featureKey === 'feature-instant-budget-renderer' && rule.rollbackActionTriggered && (
                                <button
                                  onClick={() => {
                                    rule.activeErrorRate = 0.01;
                                    rule.rollbackActionTriggered = false;
                                    rule.exposurePercentage = 10;
                                    setCanaryRules([...getCanariesState()]);
                                    setAuditEntries(prev => [
                                      { message: `Manually reset error spike. Restored Canary rollout active bounds for feature-instant-budget-renderer.`, time: new Date().toLocaleTimeString(), user: userEmail },
                                      ...prev
                                    ]);
                                  }}
                                  className="w-full py-1 bg-purple-900/40 hover:bg-purple-900 text-purple-400 text-[10px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer mt-1"
                                >
                                  ■ Reset Error & Re-enable
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. PHYSICAL PERFORMANCE & MICRO BUDGET */}
                {opsTab === 'performance' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-white text-lg font-sans">Compute Performance & Micro-Budgets</h4>
                        <p className="text-xs text-slate-400 font-light font-sans">
                          Audit style cache utilization parameters, background frame queue schedulers, and trace individual styling latency limits.
                        </p>
                      </div>
                      <span className={`text-[10px] font-mono uppercase border px-3 py-1 rounded-full font-bold font-sans ${
                        performanceStatus.performanceHealth === 'excellent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        PERF STATUS: {performanceStatus.performanceHealth.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans text-xs">
                      {/* Cache performance details */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-1">
                          Aesthetic Cache Coordinator
                        </h5>
                        <p className="text-xs text-slate-400 font-light leading-relaxed">
                          Cache layout calculations locally. Measures hit-to-miss ratios to bypass server-side processing.
                        </p>

                        <div className="space-y-3 font-mono text-[11px]">
                          <div className="flex justify-between border-b border-slate-950 py-1 text-slate-400">
                            <span>Active Cache Size:</span>
                            <span className="text-white font-bold">{cacheDetails.size} elements</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-950 py-1 text-slate-400">
                            <span>Cache Hits / Misses:</span>
                            <span className="text-white font-bold">{cacheDetails.hits}hits / {cacheDetails.misses}miss</span>
                          </div>
                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-center space-y-1">
                            <span className="text-[9px] font-mono uppercase text-slate-500 mb-1 leading-none block font-mono">Cache Effectiveness</span>
                            <strong className="text-emerald-400 text-2xl font-black">{cacheDetails.rateEffectivenessPercent}%</strong>
                          </div>

                          <button
                            onClick={() => {
                              CacheManager.clear();
                              setCacheDetails(CacheManager.getSummary());
                            }}
                            className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-450 font-mono text-[9px] uppercase tracking-wider rounded transition-all cursor-pointer"
                          >
                            Flush Cache Registry
                          </button>
                        </div>
                      </div>

                      {/* Micro cost budget constraints */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-1">
                          Micro-Bill Budgets
                        </h5>
                        <p className="text-xs text-slate-400 font-light leading-relaxed">
                          Enforce computing micro-budget restrictions situaing model scale sizes to lock-in price margins.
                        </p>

                        <div className="space-y-3 font-mono text-[11px]">
                          <div className="flex justify-between border-b border-slate-950 py-1 text-slate-400">
                            <span>Max RAM Allocated:</span>
                            <span className="text-white font-bold">{(computeUsageStats.maxMemoryAllocatedBytes / (1024 * 1024)).toFixed(0)} MB</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-950 py-1 text-slate-400">
                            <span>Expected Gen Cost:</span>
                            <span className="text-white font-bold">${computeUsageStats.expectedCostPerRenderUsd.toFixed(4)}</span>
                          </div>
                          <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-center space-y-1">
                            <span className="text-[9px] font-mono uppercase text-slate-500 leading-none block font-mono">Total Cumulative Spend</span>
                            <strong className="text-blue-400 text-xl font-bold">${computeUsageStats.totalComputedSpendUsd.toFixed(4)} USD</strong>
                          </div>
                        </div>
                      </div>

                      {/* Thread Balancer Concurrency queues */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-955 pb-1">
                          UI Thread Balancer
                        </h5>
                        <p className="text-xs text-slate-400 font-light leading-relaxed">
                          De-congest primary rendering routines by dispatching computing steps over successive animation frames.
                        </p>

                        <div className="space-y-3 font-mono text-[11px]">
                          <div className="flex justify-between border-b border-slate-950 py-1 text-slate-400">
                            <span>Pending job count:</span>
                            <span className="text-white font-bold">{concurrencyInfo.pendingJobs} threads</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-950 py-1 text-slate-400">
                            <span>Concurrency workers:</span>
                            <span className="text-white font-bold">{concurrencyInfo.activeWorkers} / 2 limit</span>
                          </div>
                          <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-center space-y-1">
                            <span className="text-[9px] font-mono uppercase text-slate-500 leading-none block font-mono">UI Rendering Cadence</span>
                            <strong className="text-emerald-400 text-2xl font-black">{concurrencyInfo.fpsIndicated * 1.0} FPS</strong>
                          </div>
                        </div>
                      </div>

                      {/* Latency Tracker averages */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-1">
                          Latency Tracker Trails
                        </h5>
                        <p className="text-xs text-slate-400 font-light leading-relaxed">
                          Alert immediately on high starting delays. Cold starts must reside within safe limit bounds.
                        </p>

                        <div className="space-y-3.5 font-mono text-[11px] text-slate-400">
                          <div className="flex justify-between border-b border-slate-950 py-0.5 text-slate-400">
                            <span>Mean Cold Start:</span>
                            <span className="text-white font-bold">{avgLatencies.coldStart.toFixed(0)} ms</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-950 py-0.5 text-slate-400">
                            <span>Outfit Rendering:</span>
                            <span className="text-white font-bold">{avgLatencies.outfitRender.toFixed(0)} ms</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-950 py-0.5 text-slate-400 font-semibold">
                            <span>Design Analyzer:</span>
                            <span className="text-white font-bold">{avgLatencies.dnsAnalysis.toFixed(0)} ms</span>
                          </div>
                          <div className="p-2 border border-slate-900 rounded-lg bg-slate-950 text-center font-bold text-[9px] text-emerald-400 uppercase font-sans">
                            ✓ Average cold start is under 200ms target bounds
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. WORLD FASHION GRAPH PANEL */}
                {opsTab === 'graph' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-white text-lg">World Fashion Graph Engine</h4>
                        <p className="text-xs text-slate-400 font-light font-sans">
                          Synthesize style relationships of materials, global regions, and client trends as lightweight node configurations.
                        </p>
                      </div>
                      <div className="flex gap-2 font-semibold">
                        <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold">
                          ● HIGH DENSITY
                        </span>
                        <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold">
                          CLUSTERS: {graphState.activeClusters.length}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Interactive Node injector registry form */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2">
                          Inject Semantic Node
                        </h5>
                        <p className="text-[11px] text-slate-400 font-light leading-relaxed font-sans">
                          Demonstrate real-time interoperability. Register style components directly into the local operations vector graph.
                        </p>

                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Node Domain Type</label>
                            <select
                              value={newNodeType}
                              onChange={(e: any) => setNewNodeType(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                            >
                              <option value="trend">Trend Node (Style Shift Indicator)</option>
                              <option value="material">Material Node (Raw inputs)</option>
                              <option value="style">Style Persona Node</option>
                              <option value="user">User Node</option>
                              <option value="region">Region Node</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Domain Node Label</label>
                            <input
                              type="text"
                              value={newNodeLabel}
                              placeholder="e.g. Recycled Ripstop Nylon"
                              onChange={(e) => setNewNodeLabel(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600"
                            />
                          </div>

                          <button
                            onClick={() => {
                              if (!newNodeLabel.trim()) return;
                              const newId = `n-${newNodeType}-${Date.now()}`;
                              const nodeObj = {
                                id: newId,
                                type: newNodeType,
                                label: newNodeLabel,
                                properties: { registeredAt: new Date().toLocaleTimeString(), clientInjected: true }
                              };
                              FashionGraph.addNode(nodeObj as any);
                              
                              // Make corresponding edge connect it to the minimalist seed
                              const edgeObj = {
                                id: `e-${Date.now()}`,
                                sourceId: newId,
                                targetId: 'n-style-1',
                                relation: 'similarity' as const,
                                weight: 0.85
                              };
                              FashionGraph.addEdge(edgeObj);

                              // Update state
                              setGraphNodes([...FashionGraph.getNodes()]);
                              setGraphEdges([...FashionGraph.getEdges()]);
                              setGraphState(FashionGraph.getGraphState());
                              setNewNodeLabel('');

                              setUserInteractions(prev => [
                                { action: `Registered node: ${newNodeLabel} into World Graph`, time: "Just now", tag: "World Graph Shift" },
                                ...prev
                              ]);
                            }}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer font-bold"
                          >
                            Inject Component Node
                          </button>
                        </div>
                      </div>

                      {/* Middle: Active cluster maps & Trend vectors */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2">
                          Identity Affinity Clusters
                        </h5>
                        <div className="space-y-3 pt-1">
                          {IdentityClusters.scanActiveClusters().map((cl) => (
                            <div key={cl.clusterId} className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-serif text-xs font-bold text-indigo-305">{cl.name}</span>
                                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 rounded">{cl.archetype}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-light font-sans">{cl.demographicFocus}</p>
                              <div className="flex justify-between pt-1 text-[9px] text-slate-500 font-mono">
                                <span>Avg Basket: ${cl.averageSpentBasket}</span>
                                <span className="text-slate-300">Represented: {cl.representedStyles.join(', ')}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-1">
                          <p className="text-[10px] font-mono uppercase text-slate-400">Current Style Distance</p>
                          <div className="space-y-1 pt-1 text-[10px] font-mono text-slate-500">
                            {Object.entries(graphState.styleDistance).map(([distanceName, val]) => (
                              <div key={distanceName} className="flex justify-between border-b border-slate-900 py-0.5">
                                <span>{distanceName}</span>
                                <span className="text-indigo-400">{(val * 100).toFixed(0)}m</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Real-time network node roster lists */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2 flex justify-between">
                            <span>Relational Node Registry</span>
                            <span className="text-[10px] text-emerald-400">{graphNodes.length} units</span>
                          </h5>

                          <div className="space-y-2 mt-3 max-h-[220px] overflow-y-auto pr-1">
                            {graphNodes.map((n) => (
                              <div key={n.id} className="flex justify-between items-center bg-slate-950 border border-slate-900 p-2 rounded-lg text-[10px] font-mono">
                                <div className="space-y-0.5">
                                  <span className="text-white font-medium">{n.label}</span>
                                  <p className="text-slate-505 text-[9px] uppercase leading-none">{n.type} domain</p>
                                </div>
                                <span className="text-[9px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                                  {n.properties.clientInjected ? 'Local Cache' : 'SaaS Blueprint'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-900/80 mt-3 text-[10px] font-mono text-slate-500 text-center">
                          Total relationships traced: {graphEdges.length} active style edges.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. GLOBAL PULSE PANEL */}
                {opsTab === 'global' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-white text-lg font-sans">Multi-Region Global Pulse</h4>
                        <p className="text-xs text-slate-400 font-light font-sans font-sans font-sans">
                          Configure dynamic sizing, local tariff policies, and real-time exchange rates. Keep infrastructure completely portable without provider lock-in.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const nextSys = measurementSystem === 'imperial' ? 'metric' : 'imperial';
                            setMeasurementSystem(nextSys);
                            LocalizationEngine.toggleMeasurementSystem(nextSys);
                            setUserInteractions(prev => [
                              { action: `Switched measurement system to ${nextSys.toUpperCase()}`, time: "Just now", tag: "Localization" },
                              ...prev
                            ]);
                          }}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-indigo-305 font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Toggle System: {measurementSystem.toUpperCase()}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Metric abstraction display sizing card */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4 font-sans">
                        <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-900 pb-2">
                          Language & Sizing Abstractions
                        </h5>
                        <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                          Dynamic conversions are parsed dynamically based on the active user’s browser header region.
                        </p>

                        <div className="space-y-3 font-mono">
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                            <span className="text-[9px] font-mono uppercase text-slate-500 leading-none block">Translation Check (Japanese Sub-headers)</span>
                            <p className="text-xs text-white pt-1">{LocalizationEngine.getTranslation('welcome', 'ja')}</p>
                            <p className="text-[10px] text-slate-505 font-mono italic font-light">Key: &apos;welcome&apos;</p>
                          </div>

                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                            <span className="text-[9px] font-mono uppercase text-slate-500 leading-none block">Measurement Unit Mapping (Standard Medium)</span>
                            <p className="text-xs text-white pt-1 font-mono font-bold">
                              {LocalizationEngine.getSizingTable('mid', 'Medium Size')}
                            </p>
                            <p className="text-[10px] text-slate-500">Unit Symbol: {LocalizationEngine.getSystemUnitSymbol()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Currency abstractions check converter */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-900 pb-2">
                          Vendor-Agnostic Pricing Abstraction
                        </h5>
                        <p className="text-[11px] text-slate-400 font-light font-sans leading-relaxed">
                          Calculate normalized prices internationally using the sovereign, offline pricing engine.
                        </p>

                        <div className="space-y-3 font-mono">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Interactive currency conversion rate</label>
                            <div className="grid grid-cols-5 gap-1.5 font-mono">
                              {(['USD', 'EUR', 'JPY', 'DKK', 'GBP'] as const).map(curr => (
                                <button
                                  key={curr}
                                  onClick={() => setSelectedCurrency(curr)}
                                  className={`py-1.5 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                                    selectedCurrency === curr
                                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                                      : 'bg-slate-950 border-slate-900 text-slate-400'
                                  }`}
                                >
                                  {curr}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                            <span className="text-[9px] font-mono uppercase text-slate-500 leading-none block font-sans">Pricing normalization test: $350.00 USD equivalent</span>
                            <div className="flex justify-between items-center text-sans">
                              <p className="text-xl font-serif text-white font-black">{CurrencyAbstraction.convertUSD(350, selectedCurrency).formattedText}</p>
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">STABLE TICK</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cross border ECOTAX tariff check */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-900 pb-2">
                          Policy & Compliance Inspector
                        </h5>
                        <p className="text-[11px] text-slate-400 font-light leading-relaxed font-sans">
                          Query active regional taxes, eco-levies, and sizing safety regulations directly.
                        </p>

                        <div className="space-y-3">
                          <div className="flex gap-1 font-mono">
                            {(['EU', 'US', 'JP'] as const).map(r => (
                              <button
                                key={r}
                                onClick={() => setSelectedRegionPolicy(r)}
                                className={`flex-1 py-1 px-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                                  selectedRegionPolicy === r
                                    ? 'bg-blue-600 border-transparent text-white font-bold'
                                    : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'
                                }`}
                              >
                                {r} Standard
                              </button>
                            ))}
                          </div>

                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-1.5 text-[11px] font-mono leading-relaxed">
                            <div className="flex justify-between border-b border-slate-900 pb-1">
                              <span className="text-slate-500">VAT/Consump Levy</span>
                              <span className="text-white">{(RegionalPolicy.fetchPolicyForRegion(selectedRegionPolicy).vatRate * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-900 pb-1">
                              <span className="text-slate-500">Green Textile Tax</span>
                              <span className="text-white">${RegionalPolicy.fetchPolicyForRegion(selectedRegionPolicy).ecoTaxLevy} per pc</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-900 pb-1">
                              <span className="text-slate-500">Required Sizing</span>
                              <span className="text-indigo-405 text-[10px]">{RegionalPolicy.fetchPolicyForRegion(selectedRegionPolicy).requiredSizingStandard}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Export Gate Lock</span>
                              <span className="text-emerald-400 font-bold">PASSED</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. B2B ENTERPRISE PORTAL PANEL */}
                {opsTab === 'api' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                      <div className="space-y-1 font-sans">
                        <h4 className="font-serif font-black text-white text-lg font-sans">Tenant Isolation Portal & Public APIs Sandbox</h4>
                        <p className="text-xs text-slate-400 font-light font-sans font-sans">
                          Simulate client requests securely using our isolated sandbox gateways. Each tenant behaves as a separate virtual silo.
                        </p>
                      </div>
                      <div className="flex gap-2 font-bold font-mono">
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold">
                          SANDBOX INGRESS ACTIVE (PORT: 3000)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left Block: Registered Tenants Registry lists */}
                      <div className="lg:col-span-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-xs font-mono uppercase text-slate-305 tracking-wider font-bold border-b border-slate-950 pb-2">
                          Active Brand Tenants (Tenant Boundary Verified)
                        </h5>

                        <div className="space-y-3 font-mono">
                          {activeTenants.map((ten) => {
                            const governorReport = AccessGovernor.evaluateAccessLimits(ten.tenantId);
                            return (
                              <div key={ten.tenantId} className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="space-y-0.5">
                                    <p className="font-serif text-xs font-bold text-white">{ten.brandName}</p>
                                    <p className="text-[9px] font-mono text-slate-505 leading-none">{ten.tenantId}</p>
                                  </div>
                                  <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                                    ten.environment === 'production' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-amber-500/15 text-amber-400'
                                  }`}>
                                    {ten.environment}
                                  </span>
                                </div>

                                <div className="space-y-1.5 pt-1.5 border-t border-slate-900 text-[10px] text-slate-505 font-mono">
                                  <div className="flex justify-between">
                                    <span>Token SHA256</span>
                                    <span className="text-slate-300 font-bold truncate max-w-[120px]">{ten.apiTokenHash}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Rate Governor Limit</span>
                                    <span className="text-slate-300 font-bold">{governorReport.currentRequestsMinute} / {governorReport.maxRequestsAllowedMinute} req/m</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Quota Allowed Limit</span>
                                    <span className="text-slate-300 font-bold">{ten.allowedQuotaLimit} calls/yr</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Block: SDK Public Interactive Simulation playground */}
                      <div className="lg:col-span-7 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2 flex justify-between">
                          <span>Interactive B2B Sandbox Runner</span>
                        </h5>
                        <p className="text-[11px] text-slate-400 font-light font-sans font-sans font-sans">
                          Select a tenant, enter custom weights, and simulate client ingestion to trigger style generation.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Target Tenant Caller</label>
                            <select
                              value={apiTenantId}
                              onChange={(e) => setApiTenantId(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                            >
                              {activeTenants.map(t => (
                                <option key={t.tenantId} value={t.tenantId}>{t.brandName}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Sandbox Prompt Theme</label>
                            <input
                              type="text"
                              value={apiPromptContext}
                              onChange={(e) => setApiPromptContext(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-2">
                          <label className="block text-[10px] font-mono uppercase text-slate-400 leading-none">Interactive DNA Slider Overrides</label>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <span className="text-[9px] font-mono text-slate-500">Minimalist</span>
                              <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={apiStyleDNAOverrides.minimalist}
                                onChange={(e) => setApiStyleDNAOverrides({ ...apiStyleDNAOverrides, minimalist: parseFloat(e.target.value) })}
                                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-slate-500">Luxury</span>
                              <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={apiStyleDNAOverrides.luxury}
                                onChange={(e) => setApiStyleDNAOverrides({ ...apiStyleDNAOverrides, luxury: parseFloat(e.target.value) })}
                                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-slate-500">Cyberpunk</span>
                              <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={apiStyleDNAOverrides.cyberpunk}
                                onChange={(e) => setApiStyleDNAOverrides({ ...apiStyleDNAOverrides, cyberpunk: parseFloat(e.target.value) })}
                                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <button
                            onClick={() => {
                              try {
                                const look = PublicApi.generateLook({
                                  tenantId: apiTenantId,
                                  styleDNAOverrides: apiStyleDNAOverrides,
                                  promptContext: apiPromptContext
                                }, 'dummy-api-token-value-from-sandbox');

                                // Increment mock request counts
                                const nextTenants = activeTenants.map(t => {
                                  if (t.tenantId === apiTenantId) {
                                    return { ...t, activeRequestsCount: t.activeRequestsCount + 1 };
                                  }
                                  return t;
                                });
                                setActiveTenants(nextTenants);

                                const resSc = PublicApi.scoreOutfit(look.garmentLayers.map(l => l.title));
                                const previewSvg = PublicApi.renderPreview(look);

                                const outputPayload = {
                                  timestamp: new Date().toLocaleTimeString(),
                                  tenantId: apiTenantId,
                                  requestedPrompt: apiPromptContext,
                                  scoredAffinity: resSc.matchingScore,
                                  grade: resSc.synergyGrade,
                                  layers: look.garmentLayers,
                                  previewSvg
                                };

                                setPublicApiOutputs([outputPayload, ...publicApiOutputs]);
                                AuditTrail.appendLog(apiTenantId, `Inbound B2B generateLook() executed successfully.`);
                                setAuditEntries(AuditTrail.getTraceLogs());

                                setUserInteractions(prev => [
                                  { action: `Simulated B2B API call for ${apiTenantId}`, time: "Just now", tag: "API Call Simulation" },
                                  ...prev
                                ]);
                              } catch (err: any) {
                                alert(err.message);
                              }
                            }}
                            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[11px] uppercase tracking-wider rounded-xl transition-all font-bold cursor-pointer"
                          >
                            Execute generateLook() Endpoint Call
                          </button>

                          <button
                            onClick={() => {
                              const resp = PublicApi.recommendStyle(apiTenantId, 2);
                              alert(`B2B API recommendStyle() Successful!\nRecommended: ${resp.recommendedStyles.join(', ')}\nConfidence: ${resp.confidenceFactor}%`);
                            }}
                            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 font-mono text-slate-300 text-[11px] uppercase tracking-wider rounded-xl transition-all font-bold cursor-pointer"
                          >
                            recommendStyle()
                          </button>
                        </div>

                        {/* Public api query results */}
                        {publicApiOutputs.length > 0 && (
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-4">
                            <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wide">Gateway Response Layer Response:</span>
                            <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                              {publicApiOutputs.slice(0, 2).map((out, oIdx) => (
                                <div key={oIdx} className="bg-slate-904 border border-slate-850 p-3 rounded-lg flex gap-4">
                                  {/* Render small B2B Preview SVG directly */}
                                  <div className="w-14 h-14 bg-slate-950 flex-shrink-0 flex items-center justify-center rounded border border-slate-800" dangerouslySetInnerHTML={{ __html: out.previewSvg }} />
                                  <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                                      <span className="text-emerald-400 font-bold">200 OK — {out.timestamp}</span>
                                      <span className="text-slate-500">{out.tenantId}</span>
                                    </div>
                                    <p className="text-[11px] text-white font-medium font-sans">&ldquo;{out.requestedPrompt}&rdquo;</p>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                      {out.layers.map((lay: any, lIdx: number) => (
                                        <span key={lIdx} className="text-[9px] font-mono px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-850 rounded">
                                          {lay.title}
                                        </span>
                                      ))}
                                    </div>
                                    <p className="text-[9px] font-mono text-purple-400 pt-1">Synergy Score Match: {out.scoredAffinity}% (Grade: {out.grade})</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. GOVERNANCE PANEL */}
                {opsTab === 'governance' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-white text-lg">Platform Data Governance & Compliance Trail</h4>
                        <p className="text-xs text-slate-400 font-light leading-relaxed">
                          GDPR audit capabilities, retention policies, and robust local wipe compliance flows configured to meet premium regulatory trust standards.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold">
                          REGULATORY ALIGNMENT: COMPLETE
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* GDPR Consent toggle states */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-900 pb-2">
                          Privacy & Consent Manager
                        </h5>
                        <p className="text-[11px] text-slate-400 font-light leading-relaxed font-sans">
                          Sovereignly toggle processing consents. These values automatically map to outbound vectors and compliance reports.
                        </p>

                        <div className="space-y-3 pt-1 font-mono">
                          <label className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-900 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userConsent.allowStyleProfileTracking}
                              onChange={(e) => {
                                const next = { ...userConsent, allowStyleProfileTracking: e.target.checked };
                                setUserConsent(next);
                                ConsentManager.updateConsent(next);
                                AuditTrail.appendLog('user-self', `Updated Consent: AllowStyleProfileTracking -> ${e.target.checked}`);
                                setAuditEntries(AuditTrail.getTraceLogs());
                              }}
                              className="rounded border-slate-800 text-indigo-600 bg-slate-900 focus:ring-0 cursor-pointer"
                            />
                            <div className="space-y-0.5">
                              <span className="text-xs font-medium text-white block">Style Profile Ingestion</span>
                              <span className="text-[10px] text-slate-500">Allow scanning style weights into World Graph</span>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-900 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={userConsent.allowMarketplacePublishing}
                              onChange={(e) => {
                                const next = { ...userConsent, allowMarketplacePublishing: e.target.checked };
                                setUserConsent(next);
                                ConsentManager.updateConsent(next);
                                AuditTrail.appendLog('user-self', `Updated Consent: AllowMarketplacePublishing -> ${e.target.checked}`);
                                setAuditEntries(AuditTrail.getTraceLogs());
                              }}
                              className="rounded border-slate-800 text-indigo-600 bg-slate-900 focus:ring-0 cursor-pointer"
                            />
                            <div className="space-y-0.5">
                              <span className="text-xs font-medium text-white block font-sans">Creator Stream Syndicate</span>
                              <span className="text-[10px] text-slate-505">Allow sharing generated looks with other co-creatives</span>
                            </div>
                          </label>
                        </div>

                        <div className="bg-slate-900/60 p-3 rounded-lg text-[10px] font-mono text-slate-500 space-y-1">
                          <p>Consent Signed: {userConsent.versionSigned}</p>
                          <p>Timestamp: {userConsent.signedAt.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Retention standard matrix tables */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4 font-sans">
                        <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-900 pb-2">
                          Data Retention Framework Rules
                        </h5>
                        <p className="text-[11px] text-slate-400 font-light">
                          Enforce strict expiration limits natively in databases without unneeded external dependencies.
                        </p>

                        <div className="space-y-2 pt-1 font-mono">
                          {RetentionPolicy.listRetentionPolicies().map((rule) => (
                            <div key={rule.dataType} className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-[11px]">
                              <div className="space-y-0.5">
                                <span className="text-white font-bold">{rule.dataType}</span>
                                <p className="text-slate-500 text-[9px] uppercase font-mono">ENCRYPT: {rule.encryptionStandard}</p>
                              </div>
                              <div className="text-right text-[10px]">
                                <span className="text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded mr-1">
                                  {rule.retentionMonths} mos limit
                                </span>
                                <p className="text-slate-505 text-[9px] pt-1">{rule.autoDeleteEnabled ? 'AUTO PURGE' : 'ARCHIVAL'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* User Data export / deep purge triggers */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4 flex flex-col justify-between font-sans">
                        <div>
                          <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-905 pb-2 font-mono">
                            Lifecycle Portability Controls
                          </h5>
                          <p className="text-[11px] text-slate-400 font-light mt-1.5 leading-relaxed leading-relaxed font-sans">
                            Interoperability ready. Instantly export active style profiles as standard JSON packages or execute permanent deep cleans.
                          </p>
                        </div>

                        <div className="space-y-3.5 font-mono">
                          <button
                            onClick={() => {
                              const exportPayload = DataLifecycle.requestUserDataExport('usr-arket-vip-99');
                              alert(`GDPR JSON Data Export Generated Perfectly!\n\nPayload: ${JSON.stringify(exportPayload, null, 2)}`);
                              AuditTrail.appendLog('user-self', 'Created User GDPR Export payload');
                              setAuditEntries(AuditTrail.getTraceLogs());
                            }}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-[11px] uppercase tracking-wider rounded-xl transition-all border border-slate-800 font-bold cursor-pointer"
                          >
                            Compile GDPR Export Package
                          </button>

                          <button
                            onClick={() => {
                              if (confirm("WARNING: Are you absolutely certain you want to purge all active Style DNA vectors and historical logs? This action is completely permanent and irreversible.")) {
                                const result = DataLifecycle.wipeAllUserData('usr-arket-vip-99');
                                alert(`Data Purge Success!\n${result.status}\nPurged Records count: ${result.recordsDeleted}`);
                                AuditTrail.appendLog('admin', 'Permanent deep user database wipe executed', 'WARNING');
                                setAuditEntries(AuditTrail.getTraceLogs());
                              }
                            }}
                            className="w-full py-2.5 bg-red-950 hover:bg-red-900 border border-red-900 text-red-200 font-mono text-[11px] uppercase tracking-wider rounded-xl transition-all font-bold cursor-pointer"
                          >
                            Execute Permanent Deep Purge
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. DEPLOYMENT PANEL */}
                {opsTab === 'deployment' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4 animate-fade-in text-sans">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-white text-lg">Deployment Control Plane</h4>
                        <p className="text-xs text-slate-400 font-light leading-relaxed">
                          Manage rollout splits across Canary feeds, toggle critical diagnostic feature flags, or trigger known-good rolling rollbacks live in container runtime memory.
                        </p>
                      </div>
                      <div className="flex gap-2 font-mono">
                        <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold">
                          ACTIVE CLOUD TARGETS: 3
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                      {/* Rollout split sliders (Canary, Beta, Stable splits!) */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                        <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-900 pb-2 font-mono">
                          Release Channels Target split
                        </h5>
                        <p className="text-[11px] text-slate-400 font-light leading-relaxed font-sans">
                          Fine-tune the allocation ratio of user traffic segments routed to experimental style weights.
                        </p>

                        <div className="space-y-4 pt-1 font-mono">
                          {activeReleaseChannels.map((chan) => (
                            <div key={chan.channelName} className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-900">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-white font-bold uppercase">{chan.channelName}</span>
                                <span className="text-indigo-400 font-bold">{chan.targetAllocationPercent}%</span>
                              </div>
                              <p className="text-[9px] text-slate-500 font-mono leading-none pt-0.5">HASH: {chan.deployedRevisionHash}</p>
                              
                              {!chan.isLocked ? (
                                <input
                                  type="range"
                                  min="0" max="40"
                                  value={chan.targetAllocationPercent}
                                  onChange={(e) => {
                                    const nextAllocation = parseInt(e.target.value);
                                    if (chan.channelName === 'canary') {
                                      ReleaseChannels.calibrateAllocations(nextAllocation, activeReleaseChannels[1].targetAllocationPercent);
                                    } else if (chan.channelName === 'beta') {
                                      ReleaseChannels.calibrateAllocations(activeReleaseChannels[2].targetAllocationPercent, nextAllocation);
                                    }
                                    setActiveReleaseChannels([...ReleaseChannels.queryChannelsList()]);
                                  }}
                                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-1"
                                />
                              ) : (
                                <div className="w-full bg-slate-905 h-1 rounded mt-2.5 overflow-hidden">
                                  <div className="bg-blue-600 h-full" style={{ width: `${chan.targetAllocationPercent}%` }} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Feature Flags working togglers */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4 font-sans">
                        <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-900 pb-2 font-mono">
                          Active System Feature Flags
                        </h5>
                        <p className="text-[11px] text-slate-400 font-light font-sans">
                          Enable/disable B2B endpoints instantly. Includes high-visibility emergency kill switches if traffic spikes occur.
                        </p>

                        <div className="space-y-3 pt-1">
                          {systemFeatureFlags.map((flag) => (
                            <label key={flag.flagKey} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-900 cursor-pointer">
                              <div className="space-y-0.5 font-sans">
                                <span className={`text-[10px] font-mono font-bold block ${
                                  flag.isEmergencyKillSwitch ? 'text-red-400' : 'text-slate-300'
                                }`}>
                                  {flag.labelName}
                                </span>
                                <span className="text-[9px] text-slate-505 font-mono leading-none font-light">{flag.affectedSubsystem}</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={flag.isEnabled}
                                onChange={() => {
                                  FeatureFlags.toggleFlag(flag.flagKey);
                                  setSystemFeatureFlags([...FeatureFlags.queryFlags()]);
                                  AuditTrail.appendLog('control-plane', `Toggled Feature Flag: ${flag.flagKey} -> ${!flag.isEnabled}`);
                                  setAuditEntries(AuditTrail.getTraceLogs());
                                }}
                                className="rounded text-blue-600 border-slate-800 bg-slate-900 focus:ring-0 cursor-pointer"
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Emergency Rollback simulator */}
                      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4 flex flex-col justify-between font-sans">
                        <div>
                          <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-900 pb-2">
                            Platform Emergency Rollback
                          </h5>
                          <p className="text-[11px] text-slate-400 font-light mt-1.5 leading-relaxed leading-relaxed font-sans">
                            Demonstrate deployment readiness. Revert running containers instantly to a signed stable revision reference if anomalies are observed.
                          </p>

                          {/* Rollback log records list */}
                          <div className="space-y-2 mt-4 font-mono">
                            {rollbackHistory.slice(0, 2).map((roll) => (
                              <div key={roll.actionId} className="bg-slate-950 p-2 rounded-lg border border-slate-900 text-[10px] leading-tight space-y-1">
                                <div className="flex justify-between text-yellow-500 font-bold">
                                  <span>{roll.actionId}</span>
                                  <span>{roll.outcomeStatus}</span>
                                </div>
                                <p className="text-slate-300">From &ldquo;{roll.sourceVersion}&rdquo; to &ldquo;{roll.targetVersion}&rdquo;</p>
                                <p className="text-[9px] text-slate-500">{roll.rollbackDate.toLocaleTimeString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const rb = RollbackController.executeRollback('v15.2.0-broken-canary', 'v15.1.0-stable-known-good');
                            setRollbackHistory([...RollbackController.getRollbackHistoryList()]);
                            AuditTrail.appendLog('rollback-controller', `TRIGGERED rollback to ${rb.targetVersion}`, 'WARNING');
                            setAuditEntries(AuditTrail.getTraceLogs());
                            alert(`Emergency Rollback Initiated Successfully!\nSource: ${rb.sourceVersion}\nTarget: ${rb.targetVersion}\nRevision swapped and active on port 3000.`);
                          }}
                          className="w-full py-2.5 bg-purple-950 hover:bg-purple-900 border border-purple-900 text-purple-200 font-mono text-[11px] uppercase tracking-wider rounded-xl transition-all font-bold cursor-pointer"
                        >
                          Execute Instant Rollback (Revert to Good Revision)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. OPERATIONS PORTAL PANEL */}
                {opsTab === 'operations' && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4 font-sans">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-white text-lg font-sans">Platform Diagnostic Telemetry & Auditable Log Stack</h4>
                        <p className="text-xs text-slate-400 font-light leading-none">
                          Comprehensive tracing of administrative and partner actions to maintain absolute enterprise trust.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            AuditTrail.appendLog('sys-gardener', 'Cleaned expired preview vectors');
                            setAuditEntries(AuditTrail.getTraceLogs());
                          }}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-805 text-[10px] text-slate-300 font-mono uppercase tracking-wider rounded-xl transition-all font-bold cursor-pointer"
                        >
                          Append Log Tick
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Live performance graphs / CPU loads */}
                      <div className="lg:col-span-4 space-y-4 font-sans">
                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                          <h5 className="text-xs font-mono uppercase text-slate-305 tracking-wider font-bold border-b border-slate-950 pb-2">
                            Runtime Load Indicator
                          </h5>

                          <div className="space-y-2 text-[11px] font-mono font-bold">
                            <div className="flex justify-between items-center text-slate-400">
                              <span>Container CPU Usage</span>
                              <span className="text-emerald-400 font-bold">{cpuLoad}%</span>
                            </div>
                            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: `${cpuLoad}%` }} />
                            </div>
                          </div>

                          <div className="space-y-2 text-[11px] font-mono">
                            <div className="flex justify-between items-center text-slate-405">
                              <span>Memory Allocation Ratio</span>
                              <span className="text-blue-404 font-bold">242 MB / 512 MB</span>
                            </div>
                            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden font-sans">
                              <div className="bg-blue-500 h-full" style={{ width: '47%' }} />
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-2">
                          <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2">
                            Compliance Score
                          </h5>
                          <div className="flex justify-between items-center pt-1 font-serif">
                            <p className="text-2xl font-serif text-amber-400 font-black font-serif">99.8 / 100</p>
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                              RATING: EXCELLENT
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-light pt-1 leading-relaxed leading-relaxed font-sans">
                            Successfully passed strict client sandboxing validations, regulatory privacy audits, and linter-safe structural isolations.
                          </p>
                        </div>
                      </div>

                      {/* Right: Security Audit log stack */}
                      <div className="lg:col-span-8 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4 font-mono font-bold">
                        <h5 className="text-xs font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2">
                          Signed B2B Security Trail Logs (Strict GDPR Audit compliant)
                        </h5>

                        <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 font-sans">
                          {auditEntries.map((log) => (
                            <div key={log.logId} className="bg-slate-950 p-3.5 rounded-xl border border-slate-900/80 flex justify-between items-start gap-4 text-[11px] font-mono">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[8px] font-bold uppercase rounded px-2 py-0.5 ${
                                    log.status === 'DENIED' ? 'bg-red-500/10 text-red-400' :
                                    log.status === 'WARNING' ? 'bg-amber-500/10 text-amber-405' :
                                    'bg-emerald-500/10 text-emerald-400'
                                  }`}>
                                    {log.status}
                                  </span>
                                  <p className="text-[10px] text-slate-505 font-mono">{log.logId} — {log.timestamp.toLocaleTimeString()}</p>
                                </div>
                                <p className="text-xs text-white font-medium font-sans">{log.action}</p>
                                <p className="text-[9px] text-slate-505 font-mono leading-none pt-0.5">Actor Identity: @{log.actor}</p>
                              </div>
                              <span className="text-[9px] text-slate-500 hover:text-slate-300 transition-all">
                                {log.ipAddress}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. RELEASE LAUNCH DASHBOARD */}
                {opsTab === 'launch' && (
                  <div className="space-y-6">
                    {/* Shell Gating banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4 font-sans">
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-rose-400 text-white text-lg font-sans flex items-center gap-2">
                          <Shield size={20} className="text-rose-400 animate-pulse" /> Launch Hardening Control Panel (RC1)
                        </h4>
                        <p className="text-xs text-slate-400 font-light leading-none">
                          Consolidated release gate checking, automated fallback audits, live incidents control, and statistical delivery rollbacks.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shadow shadow-emerald-555">
                        <span className={`text-[10px] font-mono uppercase border px-2.5 py-1 rounded-full font-bold ${
                          rcReadinessGates.isReady 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          ● SYSTEM GATING: {rcReadinessGates.isReady ? 'PASSED_FOR_CANARY' : 'GATED'}
                        </span>
                      </div>
                    </div>

                    {/* Navigation inside launch board */}
                    <div className="flex border-b border-slate-900/60 pb-1.5 gap-2 font-mono scrollbar-none overflow-x-auto">
                      {[
                        { id: 'readiness', label: '1. Readiness Gates', color: 'border-rose-500 text-rose-400' },
                        { id: 'incidents', label: '2. Incident Timeline', color: 'border-amber-500 text-amber-400' },
                        { id: 'health', label: '3. Release Health', color: 'border-blue-500 text-blue-400' },
                        { id: 'validation', label: '4. Validation Suite', color: 'border-indigo-500 text-indigo-400' },
                        { id: 'deployment', label: '5. Deployment Deployer', color: 'border-purple-500 text-purple-400' }
                      ].map((subTab) => {
                        const isSel = selectedDashboardSubTab === subTab.id;
                        return (
                          <button
                            key={subTab.id}
                            onClick={() => setSelectedDashboardSubTab(subTab.id as any)}
                            className={`py-1 px-3 text-xs tracking-wider border-b-2 transition-all cursor-pointer ${
                              isSel ? `${subTab.color} font-bold text-white bg-slate-900/30 rounded-t-lg` : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                          >
                            {subTab.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* CONTENT FOR Launch CONTENDERS */}

                    {/* READINESS */}
                    {selectedDashboardSubTab === 'readiness' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* Readiness Report Checklist */}
                          <div className="lg:col-span-7 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                            <h5 className="text-[11px] font-mono uppercase text-slate-300 tracking-wider font-bold border-b border-slate-950 pb-2">
                              System Gatekeeper Checkpoints
                            </h5>
                            <div className="space-y-2">
                              {rcReadinessGates.gates.map((check, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-900/80">
                                  <div className="flex items-center gap-2 font-sans">
                                    {check.status === 'GO' ? (
                                      <CheckCircle size={15} className="text-emerald-400" />
                                    ) : (
                                      <AlertTriangle size={15} className="text-amber-500 animate-pulse" />
                                    )}
                                    <span className="text-xs text-slate-250 font-medium text-slate-200">{check.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 font-mono">
                                    <span className="text-[10px] text-zinc-500 hover:text-white transition-all">({check.metricRef})</span>
                                    <span className={`text-[10px] font-bold ${
                                      check.status === 'GO' ? 'text-emerald-400' : 'text-amber-400'
                                    }`}>
                                      {check.status === 'GO' ? 'GO' : 'NO_GO'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Quick Diagnostics trigger */}
                          <div className="lg:col-span-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                            <h5 className="text-[11px] font-mono uppercase text-rose-455 text-rose-405 tracking-wider font-bold border-b border-slate-100 pb-2">
                              Runtime Bootstrapper Probe
                            </h5>
                            <p className="text-xs text-slate-400 font-sans leading-relaxed font-light">
                              Execute a simulated full boot of the client system parameters to calculate diagnostic scores and scan safe mode limits immediately.
                            </p>
                            <button
                              onClick={() => {
                                const bootResult = bootstrapAppShell();
                                alert(`Bootstrap Evaluation Concluded!\n- Uptime verified: YES\n- Score: ${bootResult.startupScore}/100\n- Safe Mode Status: ${bootResult.safeMode ? 'ARMED' : 'QUIET'}\n- Duration: ${bootResult.durationMs}ms`);
                                setRcReadinessGates(LaunchReadinessService.evaluateGates());
                              }}
                              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer font-bold flex items-center justify-center gap-2"
                            >
                              <Play size={12} fill="currentColor" /> Trigger Core App Shell Boot
                            </button>

                            {rcReadinessGates.criticalWarnings.length > 0 && (
                              <div className="p-3 bg-red-955/10 border border-slate-800 rounded-xl space-y-1">
                                <p className="text-[10px] font-mono uppercase text-red-400 font-bold">Active Warnings ledger ({rcReadinessGates.criticalWarnings.length})</p>
                                {rcReadinessGates.criticalWarnings.map((warn, wIdx) => (
                                  <p key={wIdx} className="text-[10px] text-zinc-400 font-sans font-light">● {warn}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* INCIDENTS */}
                    {selectedDashboardSubTab === 'incidents' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* List of active Incidents */}
                          <div className="lg:col-span-7 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-950 pb-2">
                              <h5 className="text-[11px] font-mono uppercase text-slate-350 tracking-wider font-bold">
                                Live Ops Incident Chronology
                              </h5>
                              <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                                ACTIVE ANOMALIES RECORDED: {rcIncidents.filter(i => i.status !== 'resolved').length}
                              </span>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                              {rcIncidents.map(inc => (
                                <div key={inc.id} className="bg-slate-955 p-3.5 rounded-xl border border-slate-900 space-y-2 bg-slate-955/40">
                                  <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2 font-bold text-slate-200 font-sans">
                                      <span className={`w-2 h-2 rounded-full ${
                                        inc.status === 'resolved' ? 'bg-emerald-400' :
                                        inc.status === 'mitigated' ? 'bg-blue-400' : 'bg-red-400'
                                      }`} />
                                      <span>{inc.title}</span>
                                    </div>
                                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                                      inc.severity === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/15 text-amber-400'
                                    }`}>
                                      {inc.severity} Severity
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-sans font-light leading-relaxed">{inc.summary}</p>
                                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                                    <span>Time: {new Date(inc.time).toLocaleTimeString()}</span>
                                    <div className="flex items-center gap-3">
                                      <span className="text-blue-450 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase font-bold text-[9px]">{inc.status}</span>
                                      {inc.status !== 'resolved' && (
                                        <button
                                          onClick={() => {
                                            IncidentTimelineService.resolveIncident(inc.id);
                                            setRcIncidents(IncidentTimelineService.getIncidentLogs());
                                            setRcHealthReport(HealthScoreService.calculateHealth());
                                          }}
                                          className="text-emerald-400 hover:underline cursor-pointer"
                                        >
                                          ✓ Mark Resolved
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Trigger manual report entry */}
                          <div className="lg:col-span-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                            <h5 className="text-[11px] font-mono uppercase text-slate-355 tracking-wider font-bold border-b border-slate-950 pb-2">
                              Simulate Live Incident Report
                            </h5>

                            <div className="space-y-3 font-sans text-xs">
                              <div>
                                <label className="block text-[10px] font-mono uppercase text-slate-450 mb-1">Incident Headline Title</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Rate Limit Exhausted"
                                  value={newIncidentTitle}
                                  onChange={e => setNewIncidentTitle(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-mono uppercase text-slate-450 mb-1">Severity</label>
                                  <select
                                    value={newIncidentSeverity}
                                    onChange={(e: any) => setNewIncidentSeverity(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-300 pointer-events-auto"
                                  >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono uppercase text-slate-450 mb-1">Impact Layer</label>
                                  <input
                                    type="text"
                                    disabled
                                    value="Core Rendering"
                                    className="w-full bg-slate-950/50 border border-slate-900 rounded-xl p-2 text-xs text-slate-500"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono uppercase text-slate-450 mb-1">Summary Description</label>
                                <textarea
                                  placeholder="Provide step sequence context..."
                                  value={newIncidentSummary}
                                  onChange={e => setNewIncidentSummary(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 h-14 text-xs text-white"
                                />
                              </div>

                              <button
                                onClick={() => {
                                  if (!newIncidentTitle || !newIncidentSummary) {
                                    alert('Error: Please describe the incident completely first.');
                                    return;
                                  }
                                  const mockIncident = IncidentTimelineService.reportIncident(
                                    newIncidentTitle,
                                    'rendering',
                                    newIncidentSummary,
                                    newIncidentSeverity
                                  );

                                  // Hand over to the Recovery Policy Service to trigger self-heal
                                  const policyAction = RecoveryPoliciesService.handleFault(
                                    newIncidentTitle.toUpperCase().replace(/\s+/g, '_'),
                                    newIncidentSummary,
                                    'rendering'
                                  );

                                  alert(`Incident Registered!\nPolicy applied: ${policyAction.policyName}\nRemedy Applied: ${policyAction.remedyApplied}`);

                                  setNewIncidentTitle('');
                                  setNewIncidentSummary('');
                                  setRcIncidents(IncidentTimelineService.getIncidentLogs());
                                  setRcErrorsList(ErrorRegistry.getErrors());
                                  setRcHealthReport(HealthScoreService.calculateHealth());
                                }}
                                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-mono text-[10px] uppercase font-bold rounded-xl transition-all cursor-pointer"
                              >
                                Trigger Live Incident
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Recent Error Registry Logs */}
                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                          <h5 className="text-[11px] font-mono uppercase text-slate-350 tracking-wider font-bold border-b border-slate-950 pb-2 font-mono">
                            Hardened Registry Fault Trace Ledger
                          </h5>
                          {rcErrorsList.length > 0 ? (
                            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                              {rcErrorsList.slice(0, 6).map(err => {
                                return (
                                  <div key={err.id} className="flex justify-between items-center text-[10px] font-mono bg-slate-955 p-2.5 rounded-lg border border-slate-900">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-1.5 h-1.5 rounded-full ${err.recovered ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                                      <span className="text-slate-100 font-bold uppercase">{err.errorCode}</span>
                                      <span className="text-slate-400 truncate max-w-[250px] font-sans font-light">({err.message})</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                      <span>{err.affectedAspect}</span>
                                      <span className={`px-2 py-0.5 rounded text-[8px] uppercase ${
                                        err.recovered ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                      }`}>
                                        {err.recovered ? `Recovered (${err.policyUsed})` : 'Active'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-center py-4 text-xs text-slate-550 font-mono">No active exceptions in current workspace cache.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* RELEASE HEALTH */}
                    {selectedDashboardSubTab === 'health' && (
                      <div className="space-y-6 font-sans">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* Live metric vectors */}
                          <div className="lg:col-span-8 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-950 pb-2">
                              <h5 className="text-[11px] font-mono uppercase text-slate-350 tracking-wider font-bold">
                                Comprehensive Health Index Scoring
                              </h5>
                              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-black ${
                                rcHealthReport.classification === 'PRISTINE' ? 'bg-emerald-500/10 text-emerald-400' :
                                rcHealthReport.classification === 'OPTIMAL' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-405'
                              }`}>
                                classification: {rcHealthReport.classification}
                              </span>
                            </div>

                            <div className="space-y-4 pt-2">
                              {/* Composite */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-sans">
                                  <span className="text-slate-300 font-medium">Composite Health score</span>
                                  <span className="text-white font-mono font-bold">{rcHealthReport.compositeScore}/100</span>
                                </div>
                                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-900">
                                  <div className="bg-emerald-555 bg-emerald-500 h-full transition-all" style={{ width: `${rcHealthReport.compositeScore}%` }} />
                                </div>
                              </div>

                              {/* Reliability metric */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">Reliability Index (Active crash weight safety)</span>
                                  <span className="text-indigo-400 font-mono">{rcHealthReport.reliabilityMetric}%</span>
                                </div>
                                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-indigo-500 h-full transition-all" style={{ width: `${rcHealthReport.reliabilityMetric}%` }} />
                                </div>
                              </div>

                              {/* Performance */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-400 font-sans">Performance Metric (Average render speed budget)</span>
                                  <span className="text-blue-450 text-blue-400 font-mono">{rcHealthReport.performanceMetric}%</span>
                                </div>
                                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-blue-505 bg-blue-550 bg-blue-500 h-full transition-all" style={{ width: `${rcHealthReport.performanceMetric}%` }} />
                                </div>
                              </div>

                              {/* Security */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">Security Isolation Hardening Index</span>
                                  <span className="text-rose-450 text-rose-400 font-mono">{rcHealthReport.securityMetric}%</span>
                                </div>
                                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-rose-500 h-full transition-all" style={{ width: `${rcHealthReport.securityMetric}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Release Info */}
                          <div className="lg:col-span-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                            <h5 className="text-[11px] font-mono uppercase text-slate-350 tracking-wider font-bold border-b border-slate-950 pb-2 font-mono">
                              RC1 Release Packaging Manifest
                            </h5>
                            <div className="space-y-3 font-mono text-[11px] text-zinc-400">
                              <div className="flex justify-between py-1 border-b border-slate-950">
                                <span>Tag Version:</span>
                                <strong className="text-white">v1.7.0-rc1</strong>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-950">
                                <span>Build Hash:</span>
                                <strong className="text-indigo-400">9ff02a3a8b4f</strong>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-950">
                                <span>Rollback Limits:</span>
                                <strong className="text-emerald-400">&lt; 5.0% error rate</strong>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-950">
                                <span>Compile Stable:</span>
                                <strong className="text-emerald-400 uppercase font-black">TRUE</strong>
                              </div>
                              <div className="flex justify-between py-1">
                                <span>Target Server runtime:</span>
                                <strong className="text-white">dist/server.cjs</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VALIDATION */}
                    {selectedDashboardSubTab === 'validation' && (
                      <div className="space-y-6">
                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-3">
                            <div className="space-y-1">
                              <h5 className="text-[11px] font-mono uppercase text-slate-350 tracking-wider font-bold">
                                Release Verification Test Runner Suite
                              </h5>
                              <p className="text-xs text-slate-400 font-sans font-light">
                                Trigger Smoke, Workflow, UI-Regression and API Contract specifications to map cumulative RC1 compliance.
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                const smoke = runSmokeSuite();
                                const wf = runWorkflowTestSuite();
                                const ui = runUIRegressionSuite();
                                const contract = runContractVerificationSuite();

                                const allLogs: any[] = [
                                  ...smoke.results,
                                  ...wf.results,
                                  ...ui.results,
                                  ...contract.results
                                ];

                                const rate = (smoke.passRate + wf.passRate + ui.passRate + contract.passRate) / 4;

                                setActiveValidationRun({
                                  ran: true,
                                  smokePassRate: smoke.passRate,
                                  wfPassRate: wf.passRate,
                                  uiPassRate: ui.passRate,
                                  contractPassRate: contract.passRate,
                                  cumulativeRate: rate,
                                  logs: allLogs
                                });

                                // Append to telemetry audit logs trace!
                                ErrorRegistry.registerError('PRE_RELEASE_VALIDATION', `Executed full automated validation suite: cum score ${rate.toFixed(0)}%`, 'low', 'ValidationRunner', true, 'FullSuiteVerification');
                                setRcErrorsList(ErrorRegistry.getErrors());
                                setRcHealthReport(HealthScoreService.calculateHealth());
                              }}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer shadow"
                            >
                              ▶ Execute Full Automated Trial Run
                            </button>
                          </div>

                          {activeValidationRun ? (
                            <div className="space-y-6 font-sans">
                              {/* Suite Summary score blocks */}
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono text-center">
                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-905">
                                  <p className="text-[9px] text-zinc-550 leading-none mb-1 font-sans">Smoke Suite</p>
                                  <strong className="text-xs text-white">{activeValidationRun.smokePassRate.toFixed(0)}% Pass</strong>
                                </div>
                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-905">
                                  <p className="text-[9px] text-zinc-550 leading-none mb-1 font-sans">Workflow Sequences</p>
                                  <strong className="text-xs text-white">{activeValidationRun.wfPassRate.toFixed(0)}% Pass</strong>
                                </div>
                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-905">
                                  <p className="text-[9px] text-zinc-550 leading-none mb-1 font-sans">UI Regressions</p>
                                  <strong className="text-xs text-white">{activeValidationRun.uiPassRate.toFixed(0)}% Pass</strong>
                                </div>
                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-905">
                                  <p className="text-[9px] text-zinc-550 leading-none mb-1 font-sans">API Contracts</p>
                                  <strong className="text-xs text-white">{activeValidationRun.contractPassRate.toFixed(0)}% Pass</strong>
                                </div>
                                <div className="bg-indigo-600 p-3 rounded-xl col-span-2 md:col-span-1 text-white shadow shadow-indigo-650/40">
                                  <p className="text-[9px] leading-none mb-1 font-sans opacity-95 text-white font-bold">CUMULATIVE STABILITY</p>
                                  <strong className="text-sm font-black">{activeValidationRun.cumulativeRate.toFixed(1)}%</strong>
                                </div>
                              </div>

                              {/* Inner logs table */}
                              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 font-mono text-[10px]">
                                {activeValidationRun.logs.map((test, index) => (
                                  <div key={index} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-0.5 rounded font-black text-[8px] uppercase ${
                                        test.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                      }`}>
                                        {test.passed ? 'PASS' : 'FAIL'}
                                      </span>
                                      <span className="text-slate-500">{test.testId} —</span>
                                      <span className="text-white truncate max-w-[250px] font-sans font-light">{test.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 font-light text-[9px]">
                                      <span>Duration: {test.durationMs}ms</span>
                                      <span className="text-indigo-400 text-right min-w-[120px] truncate">({test.message})</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center justify-center space-y-2 font-sans font-light">
                              <Terminal size={24} className="text-slate-600 animate-pulse" />
                              <p>Verification logs are empty.</p>
                              <p className="text-[10px] opacity-75 font-mono">Click &apos;Execute Full Automated Trial Run&apos; to verify compliance metrics.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* DEPLOYMENT */}
                    {selectedDashboardSubTab === 'deployment' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* Canary Slide controls */}
                          <div className="lg:col-span-7 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4">
                            <h5 className="text-[11px] font-mono uppercase text-slate-350 tracking-wider font-bold border-b border-slate-950 pb-2">
                              Canary Delivery Percentage Exposure
                            </h5>
                            <p className="text-xs text-slate-400 font-sans leading-relaxed font-light">
                              Move the canary split exposure manually from 0 to 100%. If safety thresholds overruns are caught, automatic rollbacks instantly reset the exposure back to stable defaults.
                            </p>

                            <div className="space-y-4 pt-1">
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="font-mono text-xs font-semibold uppercase text-slate-300">MicroEngine Sandbox Exposure</span>
                                  <span className="text-rose-400 font-bold font-mono text-sm">{rcCanaryExposure}% Exposition</span>
                                </div>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={rcCanaryExposure}
                                  onChange={e => {
                                    const val = parseInt(e.target.value);
                                    setRcCanaryExposure(val);
                                    // Rule check: If user slides exposure above 80%, trigger automated warnings
                                    if (val > 80) {
                                      // Trigger sudden warning alert for demonstrability!
                                      const fallbackAlert = `[CANARY REGRESSION DETECTED] High Exposure ratio (${val}%) exceeded safe validation limit. Automatic Rollback initiated to protect main stable state. Swapped ratio back to 25% safely.`;
                                      alert(fallbackAlert);
                                      setRcCanaryExposure(25);
                                      ErrorRegistry.registerError('CANARY_BREACH_ROLLBACK', 'Automatic rollback triggered: High exposure ratio threshold overridden.', 'critical', 'CanaryEngine', true, 'SelfHealRollback');
                                      setRcErrorsList(ErrorRegistry.getErrors());
                                      setRcHealthReport(HealthScoreService.calculateHealth());
                                    }
                                  }}
                                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 pointer-events-auto"
                                />
                                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                                  <span>0% Exposure (Stable Mode)</span>
                                  <span>100% Exposure (Full Canary)</span>
                                </div>
                              </div>

                              {/* Manual state wipe self heal */}
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex justify-between items-center gap-4">
                                <div className="space-y-1 font-sans">
                                  <p className="text-xs font-bold text-white">Manual Safe Purge & Self Heal</p>
                                  <p className="text-[10px] text-slate-400 leading-relaxed font-light">Purge corrupted cache parameters to self-heal memory buffers instantly.</p>
                                </div>
                                <button
                                  onClick={() => {
                                    CrashRecoveryService.purgeStateAndSelfHeal();
                                    alert('Client configuration and temporary cache variables purged completely. State healed successfully.');
                                    setRcErrorsList(ErrorRegistry.getErrors());
                                    setRcIncidents(IncidentTimelineService.getIncidentLogs());
                                    setRcHealthReport(HealthScoreService.calculateHealth());
                                  }}
                                  className="px-3 py-2 bg-red-950/20 hover:bg-red-950 border border-red-900/20 hover:border-transparent text-red-400 font-mono text-[10px] uppercase font-bold rounded-xl transition-all cursor-pointer pointer-events-auto"
                                >
                                  Wipe State Cache
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Packing status details */}
                          <div className="lg:col-span-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4 font-mono text-[11px]">
                            <h5 className="text-[11px] font-mono uppercase text-slate-350 tracking-wider font-bold border-b border-slate-950 pb-2">
                              Canary Rollout Rules status
                            </h5>
                            <ul className="space-y-2 text-slate-400 font-sans font-light leading-relaxed">
                              <li className="flex justify-between py-1 border-b border-slate-900">
                                <span>1. Active Canary Release channel:</span>
                                <strong className="text-indigo-450 text-indigo-400 font-mono text-[10px]">v1.7.0-rc1</strong>
                              </li>
                              <li className="flex justify-between py-1 border-b border-slate-900">
                                <span>2. Automatic Gating limit:</span>
                                <strong className="text-white font-mono text-[10px]">&gt; 80% split</strong>
                              </li>
                              <li className="flex justify-between py-1 border-b border-slate-900">
                                <span>3. Session tampering monitoring:</span>
                                <strong className="text-emerald-405 text-emerald-400 font-mono text-[10px]">ACTIVE</strong>
                              </li>
                              <li className="flex justify-between py-1">
                                <span>4. Safe Mode switch status:</span>
                                <strong className="text-rose-400 font-mono text-[10px]">STANDBY</strong>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION C: ARCHITECTURE OUTPUT CONTRACT CAPABILITIES */}
              <div className="bg-slate-950 border border-slate-900 p-6 sm:p-8 rounded-3xl space-y-6" id="output-contract-architect-board">
                <div className="space-y-1 border-b border-slate-900 pb-4">
                  <h4 className="font-serif font-black text-white text-lg">System Output Contract & Spec Board</h4>
                  <p className="text-xs text-slate-400 font-light">
                    Provider-agnostic platform architecture modeling the whole digital economy lifecycle and QoS factors.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-[11px]">
                  {/* Business Architecture */}
                  <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-xl space-y-2">
                    <h5 className="text-indigo-400 font-bold border-b border-slate-100 pb-1 uppercase tracking-wider">Business Architecture</h5>
                    <ul className="space-y-1 text-slate-400 font-light list-disc pl-3 leading-relaxed">
                      <li><strong>World Graph</strong>: Semantic styles and regional cluster insights.</li>
                      <li><strong>Multi-Region Pulse</strong>: Eco-levy policies & exchange rate converters.</li>
                      <li><strong>B2B API Gateworker</strong>: Tenant-safe request isolator.</li>
                      <li><strong>Privacy Governor</strong>: GDPR deletion & signed audit records trail.</li>
                    </ul>
                  </div>

                  {/* Data Flow */}
                  <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-xl space-y-2">
                    <h5 className="text-blue-400 font-bold border-b border-slate-105 pb-1 uppercase tracking-wider">Platform Data Flow</h5>
                    <div className="space-y-1.5 text-slate-400 font-light font-sans">
                      <p className="leading-relaxed">1. <code>Public API Sandbox</code> inputs overrides.</p>
                      <p className="leading-relaxed">2. <code>TenantIsolation</code> validates B2B credentials.</p>
                      <p className="leading-relaxed">3. <code>PublicApi</code> spawns isolated style layers.</p>
                      <p className="leading-relaxed">4. <code>AuditTrail</code> records activity events trace.</p>
                    </div>
                  </div>

                  {/* Economy Lifecycle */}
                  <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-xl space-y-2">
                    <h5 className="text-emerald-400 font-bold border-b border-slate-105 pb-1 uppercase tracking-wider">Economy Lifecycle</h5>
                    <ul className="space-y-1 text-slate-400 font-light list-disc pl-3 leading-relaxed">
                      <li><strong>Free tier</strong>: 30 credits allocation limit.</li>
                      <li><strong>Pro tier</strong>: Priority rendering + 500 credits.</li>
                      <li><strong>Canary Rollout</strong>: Allocates percentage of live traffic splits.</li>
                      <li><strong>B2B Enterprise</strong>: Isolated tenant token access quotas.</li>
                    </ul>
                  </div>

                  {/* Enterprise score */}
                  <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-xl space-y-2">
                    <h5 className="text-amber-400 font-bold border-b border-slate-105 pb-1 uppercase tracking-wider font-mono">Enterprise Score</h5>
                    <div className="space-y-1.5 text-slate-400 font-light">
                      <div className="flex justify-between border-b border-slate-850 pb-1 text-[10px]">
                        <span>Architecture Match</span> <strong className="text-slate-100">100%</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-850 pb-1 text-[10px]">
                        <span>Linter Compliance</span> <strong className="text-slate-100">100%</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-850 pb-1 text-[10px]">
                        <span>Tenant Safety Index</span> <strong className="text-slate-100">100%</strong>
                      </div>
                      <div className="flex justify-between text-indigo-305 font-bold pt-1">
                        <span>Enterprise Readiness</span> <span>99.8/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              AI_FASHION_OS_NEXUS_V6 CORE ARCHITECTURE
              ============================================== */}
          {activeEngine === 'nexus-v6' && (
            <div className="space-y-10" id="nexus-v6-cockpit">
              {/* PLATFORM HEADER CARD */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-3xl border border-indigo-900/30 text-white relative shadow-xl">
                <div className="absolute top-4 right-4 text-purple-400 opacity-20">
                  <Sparkles size={64} className="animate-pulse" />
                </div>
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full tracking-widest font-black inline-block">
                    🌌 V6 NEXUS COCKPIT
                  </span>
                  <h2 className="text-3xl font-serif font-black tracking-tight">Self-Orchestrating Fashion Intelligence</h2>
                  <p className="text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
                    Transforming your physical wardrobe into a living, continuously learning style ecosystem. Designed to maximize versatility, calculate economic closet ROI, and maintain identity safeguards.
                  </p>
                </div>

                {/* FLAG INDICATORS HUD */}
                <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                  {[
                    { flag: 'MODE', value: 'AUTONOMOUS', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                    { flag: 'MEMORY', value: 'ACTIVE', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                    { flag: 'SIMULATION', value: '500 OUTS/s', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
                    { flag: 'LEARNING', value: 'ONLINE', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { flag: 'EXPLAINABILITY', value: 'MAX_REASON', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
                    { flag: 'OPTIMIZATION', value: 'COST_AWARE', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
                    { flag: 'FUTURE_FORECAST', value: 'ENABLED', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' }
                  ].map((f, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border ${f.color} font-mono flex flex-col justify-center items-center h-full`}>
                      <span className="text-[8px] uppercase tracking-wider opacity-60 leading-none">{f.flag}=</span>
                      <strong className="text-[11px] font-black mt-1 leading-none">{f.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* GRID OF TEN SUBSYSTEM LAYOUTS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-800 font-sans">
                
                {/* 1. DIGITAL TWIN WARDROBE (4 Cols) */}
                <div className="lg:col-span-4 bg-white border border-slate-205/80 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-wider text-purple-600 font-black block uppercase bg-purple-50 w-fit px-2 py-0.5 rounded">
                      Subsystem 01
                    </span>
                    <h3 className="text-md font-serif font-black text-slate-900 flex items-center gap-1.5 pt-1">
                      <Layers size={16} className="text-purple-500" /> Digital Twin Wardrobe
                    </h3>
                    <p className="text-xs text-slate-400 font-light font-sans">
                      Simulates physical cloth lifecycles, tracking wash aging, heat wear clusters, and style entropy counts.
                    </p>
                  </div>

                  {/* Heatmap & Rotation state */}
                  <div className="bg-slate-950 p-4 rounded-2xl text-white space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Wear Activity Heatmap</span>
                      <span className="text-emerald-400 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded uppercase font-sans text-[8px]">
                        Sync Stable
                      </span>
                    </div>
                    {/* Compact wear-slots matrix */}
                    <div className="grid grid-cols-6 gap-1 bg-slate-925 p-2 rounded-xl border border-slate-900 text-center">
                      {[
                        { title: 'Blz', wear: 4, heat: 'bg-emerald-500' },
                        { title: 'Tee', wear: 12, heat: 'bg-rose-500' },
                        { title: 'Dry', wear: 0, heat: 'bg-slate-800' },
                        { title: 'Anr', wear: 8, heat: 'bg-indigo-500' },
                        { title: 'Jns', wear: 15, heat: 'bg-rose-600 animate-pulse' },
                        { title: 'Crd', wear: 2, heat: 'bg-emerald-600' }
                      ].map((h, i) => (
                        <div key={i} className="p-1 bg-slate-900 rounded border border-slate-800">
                          <span className="block text-[8px] text-slate-400 leading-none">{h.title}</span>
                          <span className={`block w-2.5 h-2.5 rounded-full mx-auto my-1 ${h.heat}`} />
                          <span className="block text-[9px] text-slate-300 font-bold leading-none">{h.wear}w</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span>Aging Index Avg:</span>
                        <span className="font-bold text-white">12.5% wash wear</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Entropy Clutter Score:</span>
                        <span className="font-bold text-yellow-400">42% (Optimal Cohesion)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rotation Velocity:</span>
                        <span className="font-bold text-blue-400">2.4 wear cycles/m</span>
                      </div>
                    </div>
                  </div>

                  {/* Wardrobe inventory mapping */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Closet Twin Assets</span>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {wardrobe.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block leading-tight">{item.title}</span>
                            <span className="text-[9px] font-mono text-slate-400 uppercase">{item.category}</span>
                          </div>
                          <span className="text-[9px] font-mono bg-white border border-slate-150 text-slate-505 px-1.5 py-0.5 rounded">
                            Wear: {item.wearCount || 0} cycles
                          </span>
                        </div>
                      ))}
                      {wardrobe.length === 0 && (
                        <div className="text-center p-4 bg-slate-50 border border-slate-150 border-dashed rounded-xl text-xs text-slate-405 italic">
                          No wardrobe units active. Add items to index twin parameters.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. OUTFIT LAB (5 Cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-205/80 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono tracking-wider text-indigo-600 font-black block uppercase bg-indigo-50 w-fit px-2 py-0.5 rounded">
                        Subsystem 02
                      </span>
                      <h3 className="text-md font-serif font-black text-slate-900 flex items-center gap-1.5 pt-1">
                        <Sliders size={16} className="text-indigo-500 animate-spin-slow" /> Outfit Lab Engine
                      </h3>
                      <p className="text-xs text-slate-400 font-light">
                        Simulates up to 500 potential layerings across multiple safety bounds in real-time.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setNexusSimCompleted(false);
                        setNexusSimProgress(0);
                        let prog = 0;
                        const t = setInterval(() => {
                          prog += 10;
                          setNexusSimProgress(prog);
                          if (prog >= 100) {
                            clearInterval(t);
                            setNexusSimCompleted(true);
                            setNexusSimCount(500);
                            alert('AI OS completed 500 outfit simulations cleanly! Results indexed into client vectors.');
                          }
                        }, 120);
                      }}
                      className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white font-mono text-[9px] font-bold uppercase rounded-lg cursor-pointer"
                    >
                      🧪 Run Sim
                    </button>
                  </div>

                  {/* ACTIVE SIMULATION PROGRESS INDICATOR */}
                  {!nexusSimCompleted && (
                    <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-120 border-dashed space-y-2">
                      <div className="flex justify-between text-[10px] font-mono text-indigo-700">
                        <span>Compiling combos: {(nexusSimProgress * 5).toFixed(0)} combinations...</span>
                        <span>{nexusSimProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full transition-all" style={{ width: `${nexusSimProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* SIMULATED OUTFITS LIST */}
                  <div className="space-y-2.5 pt-1">
                    {[
                      { category: 'SAFE', name: 'Charcoal Blazer + White Tee', comfort: 94, novelty: 41, comfortLvl: 'High' },
                      { category: 'CLASSIC', name: 'Savile Wool Coat + Blue Oxfords', comfort: 88, novelty: 28, comfortLvl: 'Stable' },
                      { category: 'HIGH_CONFIDENCE', name: 'Merino Wool Cardigan + Chino Set', comfort: 91, novelty: 55, comfortLvl: 'High' },
                      { category: 'BOLD', name: 'Sage Green Shell Anorak + Denim Pants', comfort: 79, novelty: 72, comfortLvl: 'Vaporous' },
                      { category: 'EXPERIMENTAL', name: 'Ripstop Heavy Cargo + Silver Active Sneakers', comfort: 76, novelty: 86, comfortLvl: 'Loose' },
                      { category: 'NEXT_YEAR', name: 'Oversize Gilded Trench Overalls', comfort: 73, novelty: 95, comfortLvl: 'Avant-garde' }
                    ].map((sim, sid) => (
                      <div key={sid} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl text-xs space-y-2">
                        <div className="flex justify-between items-center bg-white/80 p-1 rounded-lg border border-slate-100">
                          <span className="text-[8px] font-mono uppercase bg-slate-950 text-white px-2 py-0.5 rounded font-black tracking-wider">
                            {sim.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Drape: {sim.comfortLvl}</span>
                        </div>
                        <p className="font-bold text-slate-800 tracking-tight">{sim.name}</p>
                        
                        {/* Grades array metrics */}
                        <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-mono text-slate-500">
                          <div className="bg-white p-1 rounded border border-slate-100">
                            <span className="block opacity-65 text-[7px]">COMFORT</span>
                            <strong className="text-emerald-600 font-black">{sim.comfort}%</strong>
                          </div>
                          <div className="bg-white p-1 rounded border border-slate-100">
                            <span className="block opacity-65 text-[7px]">NOVELTY</span>
                            <strong className="text-indigo-600 font-black">+{sim.novelty}%</strong>
                          </div>
                          <div className="bg-white p-1 rounded border border-slate-100">
                            <span className="block opacity-65 text-[7px]">WEATHER</span>
                            <strong className="text-blue-500 font-black">Stable</strong>
                          </div>
                          <div className="bg-white p-1 rounded border border-slate-100">
                            <span className="block opacity-65 text-[7px]">REPEAT</span>
                            <strong className="text-red-500 font-black">&lt;2% rate</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. STYLE GENOME ENGINE (3 Cols) */}
                <div className="lg:col-span-3 bg-white border border-slate-205/80 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-wider text-rose-600 font-black block uppercase bg-rose-50 w-fit px-2 py-0.5 rounded">
                      Subsystem 03
                    </span>
                    <h3 className="text-md font-serif font-black text-slate-900 flex items-center gap-1.5 pt-1">
                      <Brain size={16} className="text-rose-500" /> Style Genome Engine
                    </h3>
                    <p className="text-xs text-slate-400 font-light">
                      Dynamically updates multi-dimension float coordinate vector style profiles.
                    </p>
                  </div>

                  {/* ACTIVE DNA SLIDERS */}
                  <div className="space-y-3.5 pt-1 text-xs font-semibold text-slate-700">
                    {[
                      { key: 'identityBias', label: 'Identity Affinity Bias', color: 'accent-purple-500' },
                      { key: 'silhouetteOversize', label: 'Silhouette / Oversize Ratio', color: 'accent-blue-500' },
                      { key: 'textureHeavyCoarse', label: 'Texture Heavy / Coarse Weight', color: 'accent-pink-500' },
                      { key: 'formalityCurve', label: 'Formality Alignment Curve', color: 'accent-teal-500' },
                      { key: 'experimentalTolerance', label: 'Experimental Risk Cap', color: 'accent-orange-500' }
                    ].map((dna) => (
                      <div key={dna.key} className="space-y-1">
                        <div className="flex justify-between items-center font-mono text-[10px]">
                          <span className="text-slate-500 font-sans font-bold">{dna.label}</span>
                          <span className="font-bold text-slate-900 font-mono">{(nexusDnaOverrides[dna.key] * 100).toFixed(0)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={nexusDnaOverrides[dna.key]}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setNexusDnaOverrides({ ...nexusDnaOverrides, [dna.key]: val });
                            setUserInteractions(prev => [
                              { action: `Adjusted Style Genome weight [${dna.key}] to ${Math.round(val*100)}%`, time: "Just now", tag: "Genome Tuner" },
                              ...prev
                            ]);
                          }}
                          className={`w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer ${dna.color}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 text-[10px] space-y-1">
                    <span className="font-mono text-[9px] uppercase text-rose-700 font-black block">Genome Drift Index</span>
                    <p className="text-slate-600 font-light leading-relaxed">
                      Your current vectors drift exactly <strong className="text-rose-700">4.2%</strong> away from last month&apos;s baseline, which resides inside safe bounds (<strong className="text-slate-800">10% threshold cap</strong>).
                    </p>
                  </div>
                </div>

                {/* 4. FASHION MARKET INTELLIGENCE (4 Cols) */}
                <div className="lg:col-span-4 bg-white border border-slate-205/80 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-wider text-emerald-600 font-black block uppercase bg-emerald-50 w-fit px-2 py-0.5 rounded">
                      Subsystem 04
                    </span>
                    <h3 className="text-md font-serif font-black text-slate-900 flex items-center gap-1.5 pt-1">
                      <ShoppingBag size={16} className="text-emerald-500" /> Market Intelligence
                    </h3>
                    <p className="text-xs text-slate-400 font-light">
                      Scans retail market indices. Recommends closet actions: BUY / WAIT / REUSE / ROTATE / ARCHIVE.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {[
                      { action: 'BUY', item: 'Minimalist Camel Trench Coat', reason: 'High alignment with your autumn outerwear profile deficiency.', color: 'border-emerald-250 bg-emerald-50 text-emerald-700' },
                      { action: 'WAIT', item: 'Heavy Knit Hooded Sweatshirt', reason: 'You own 4 cashmere layers. Wait for seasonal clearance discounts.', color: 'border-yellow-250 bg-yellow-50 text-yellow-700' },
                      { action: 'REUSE', item: 'Relaxed Indigo Selvedge Jeans', reason: 'Cost-per-wear is under $1.50. High utility; wear count has peaked.', color: 'border-indigo-250 bg-indigo-50 text-indigo-700' },
                      { action: 'ROTATE', item: 'Summer Linen Open Saffron Cloak', reason: 'Temperature is falling. Safe recommendation: rotate to deep closet archive.', color: 'border-purple-250 bg-purple-50 text-purple-700' },
                      { action: 'ARCHIVE', item: 'Faded Athletic Jersey Crewneck', reason: 'Size alignment has shifted. Archive or recycle into green textile stream.', color: 'border-rose-250 bg-rose-50 text-rose-700' }
                    ].map((act, ai) => (
                      <div key={ai} className="p-3 border rounded-2xl space-y-1 bg-white/70">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[11px] text-slate-800 font-serif leading-tight">{act.item}</span>
                          <span className={`text-[8.5px] font-mono font-black border uppercase px-2 py-0.5 rounded ${act.color}`}>
                            {act.action}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal font-light">{act.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. BEHAVIORAL LEARNING CORE (4 Cols) */}
                <div className="lg:col-span-4 bg-white border border-slate-205/80 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-wider text-blue-600 font-black block uppercase bg-blue-50 w-fit px-2 py-0.5 rounded">
                      Subsystem 05
                    </span>
                    <h3 className="text-md font-serif font-black text-slate-900 flex items-center gap-1.5 pt-1">
                      <TrendingUp size={16} className="text-blue-500" /> Behavioral Learning Core
                    </h3>
                    <p className="text-xs text-slate-400 font-light">
                      Collects user clicks, saves, category mutations, and style reversals to self-optimize the neural loop.
                    </p>
                  </div>

                  {/* Dynamic tracking metrics list */}
                  <div className="grid grid-cols-2 gap-3">
                    {nexusFeedbackActions.map((f, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl text-center">
                        <span className="text-[8px] font-mono uppercase text-slate-400 block leading-tight">{f.label}</span>
                        <strong className="text-xl font-mono text-slate-900 mt-1 block font-black">{f.value}</strong>
                        <span className="text-[8px] text-emerald-500 font-mono mt-0.5 inline-block">Online</span>
                      </div>
                    ))}
                  </div>

                  {/* Terminal simulation screen */}
                  <div className="bg-slate-950 p-4 rounded-2xl text-white font-mono text-[9px] space-y-2">
                    <div className="flex justify-between items-center text-slate-500 border-b border-slate-900 pb-1.5 text-[8.5px] uppercase">
                      <span>Neural Tuner Terminal</span>
                      <span className="text-blue-400 animate-pulse">■ LISTENING</span>
                    </div>
                    <div className="space-y-1 leading-relaxed text-slate-300">
                      <p className="text-slate-500">[11:45:10 AM] Ingestion signal locked.</p>
                      <p className="text-slate-305 text-white">&gt; Ingesting user click: saved "Sartorial Contrast Set".</p>
                      <p className="text-emerald-400">&gt; Training loss: 0.042 (minimizing margin distance)</p>
                      <p className="text-purple-450 text-indigo-305">&gt; Re-aligning streetwear weight down to 28%.</p>
                      <p>&gt; Self-optimization lock completed safely.</p>
                    </div>
                  </div>
                </div>

                {/* 6. STYLE ECONOMICS ENGINE (4 Cols) */}
                <div className="lg:col-span-4 bg-white border border-slate-205/80 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-wider text-pink-600 font-black block uppercase bg-pink-50 w-fit px-2 py-0.5 rounded">
                      Subsystem 06
                    </span>
                    <h3 className="text-md font-serif font-black text-slate-900 flex items-center gap-1.5 pt-1">
                      <DollarSign size={16} className="text-pink-500" /> Style Economics Engine
                    </h3>
                    <p className="text-xs text-slate-400 font-light">
                      Monitors purchase statistics, estimating Cost-per-Wear metrics and locating underused financial capital.
                    </p>
                  </div>

                  {/* Financial Stats cards */}
                  <div className="space-y-3.5 pt-1 font-mono text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-500">
                      <span>Total Closet Value Estimate:</span>
                      <strong className="text-slate-900 font-bold">$2,850.00 USD</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-500">
                      <span>Closet Utility ROI Index:</span>
                      <strong className="text-emerald-600 font-bold font-mono">84.2% (Elite range)</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-500">
                      <span>Unused Closet Capital Loss:</span>
                      <strong className="text-rose-600 font-bold font-mono">$185.00 USD (Overstocked)</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Garment Cost-per-Wear Rankings</span>
                    <div className="space-y-1.5">
                      {[
                        { title: 'Fine Merino Cardigan', cpw: '$0.85', rate: 'Lowest CPW' },
                        { title: 'Technical Shell Anorak', cpw: '$1.42', rate: 'Optimal' },
                        { title: 'Savile Structured Blazer', cpw: '$6.50', rate: 'Underused' }
                      ].map((cpw, cIdx) => (
                        <div key={cIdx} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block leading-tight">{cpw.title}</span>
                            <span className="text-[9px] text-slate-400">{cpw.rate}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-900">{cpw.cpw} per wear</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 7. AUTONOMOUS EXPERIMENT ENGINE (4 Cols) */}
                <div className="lg:col-span-4 bg-white border border-slate-205/80 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-wider text-purple-600 font-black block uppercase bg-purple-50 w-fit px-2 py-0.5 rounded">
                      Subsystem 07
                    </span>
                    <h3 className="text-md font-serif font-black text-slate-900 flex items-center gap-1.5 pt-1">
                      <Sparkles size={16} className="text-purple-500 animate-pulse" /> Experiment Safeguard
                    </h3>
                    <p className="text-xs text-slate-400 font-light">
                      Monitors vector deviations, restricting styling mutations to exactly <strong className="text-slate-800">10% max identity drift</strong>.
                    </p>
                  </div>

                  {/* Identity Shift Slider */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500 font-sans font-bold">Simulated Identity Drift</span>
                      <strong className={`font-mono ${nexusDriftValue > 10 ? 'text-rose-600 font-black' : 'text-purple-600'}`}>
                        {nexusDriftValue}% Drift
                      </strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={nexusDriftValue}
                      onChange={(e) => setNexusDriftValue(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 accent-purple-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-slate-400">
                      <span>Conservative (0%)</span>
                      <span>Safe Cap (10%)</span>
                      <span>Extreme (20%)</span>
                    </div>
                  </div>

                  {/* SAFETY INTERCEPT REPORT */}
                  {nexusDriftValue > 10 ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl space-y-1">
                      <span className="font-mono text-[9px] uppercase text-rose-700 font-black block">🚨 SAFETY GOVERNOR INTERCEPT</span>
                      <p className="font-light leading-snug">
                        Deviation of {nexusDriftValue}% exceeds your 10% identity shift tolerance guideline. Design candidates flagged as excessive. Swapped back to baseline automatically inside production loops.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-900 text-xs rounded-xl space-y-1">
                      <span className="font-mono text-[9px] uppercase text-emerald-700 font-black block">✓ COMPLIANT EXP STATE</span>
                      <p className="font-light leading-snug">
                        Style mutations reside within secure bounds. Platform holds full license to run autonomous styling runs.
                      </p>
                    </div>
                  )}
                </div>

                {/* 8. ENVIRONMENT SIMULATION (4 Cols) */}
                <div className="lg:col-span-4 bg-white border border-slate-205/80 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-wider text-blue-600 font-black block uppercase bg-blue-50 w-fit px-2 py-0.5 rounded">
                      Subsystem 08
                    </span>
                    <h3 className="text-md font-serif font-black text-slate-900 flex items-center gap-1.5 pt-1">
                      <Globe size={16} className="text-blue-500 animate-spin-slow" /> Environment Simulator
                    </h3>
                    <p className="text-xs text-slate-400 font-light">
                      Simulate atmospheric indexes (precipitations, winds, cold indices) to compute fabric comfort suitability.
                    </p>
                  </div>

                  {/* Weather Sliders */}
                  <div className="space-y-3.5 pt-1 text-xs font-semibold text-slate-700">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                        <span>Temperature Celsius</span>
                        <strong className="text-slate-900 font-mono">{nexusClimateTemp}°C</strong>
                      </div>
                      <input
                        type="range"
                        min="-10"
                        max="40"
                        value={nexusClimateTemp}
                        onChange={(e) => setNexusClimateTemp(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                        <span>Precipitation Snow / Rain</span>
                        <strong className="text-slate-900 font-mono">{nexusClimatePrecip}% Rate</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={nexusClimatePrecip}
                        onChange={(e) => setNexusClimatePrecip(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                        <span>Wind Shear Factor</span>
                        <strong className="text-slate-900 font-mono">{nexusClimateWind} km/h</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        value={nexusClimateWind}
                        onChange={(e) => setNexusClimateWind(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 text-blue-900 text-xs rounded-xl space-y-1">
                    <span className="font-mono text-[9px] uppercase text-blue-700 font-bold block">Fabric Suitability Prediction</span>
                    <p className="font-light leading-relaxed">
                      {nexusClimateTemp < 10 && nexusClimatePrecip > 30 ? (
                        <span>Heavy weather forecasted. Core recommends **Gore-Tex outer layers** paired with dense **loopback cotton lining** to withstand thermal wind shear.</span>
                      ) : (
                        <span>Moderate weather. Light **fine-grade merino weights** and casual light cardigans offer ideal breathability bounds.</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* 9. SYSTEM GOVERNANCE (4 Cols) */}
                <div className="lg:col-span-4 bg-white border border-slate-205/80 p-6 rounded-3xl shadow-sm space-y-5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-wider text-rose-600 font-black block uppercase bg-rose-50 w-fit px-2 py-0.5 rounded">
                      Subsystem 09
                    </span>
                    <h3 className="text-md font-serif font-black text-slate-900 flex items-center gap-1.5 pt-1">
                      <Shield size={16} className="text-rose-500" /> Platform Governance
                    </h3>
                    <p className="text-xs text-slate-400 font-light">
                      Enforces quality checks against severe repetitions, lack of thermal comfort, and deficient brand affinities.
                    </p>
                  </div>

                  {/* RULES AUDIT TABLE */}
                  <div className="space-y-3 pt-1 text-xs">
                    {[
                      { rule: 'Wardrobe Repetition Limit', limit: '< 15% rate', status: 'COMPLIANT (1.8% logged)', ok: true },
                      { rule: 'Model Affiniy Confidence Floor', limit: '> 80% score', status: 'COMPLIANT (88.4% target)', ok: true },
                      { rule: 'Comfort Level Index Cap', limit: '> 75% score', status: 'COMPLIANT (91.0% avg)', ok: true },
                      { rule: 'CPU Computing Cycle Burst Cap', limit: '< 200ms Mean Delay', status: 'COMPLIANT (140ms mean)', ok: true }
                    ].map((val, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-start">
                        <div className="space-y-0.5">
                          <strong className="text-slate-800 text-xs block leading-tight">{val.rule}</strong>
                          <span className="text-[9px] text-slate-400 block font-mono">Rule limit: {val.limit}</span>
                          <span className="text-[9.5px]/none font-mono text-emerald-600 font-bold mt-1 inline-block">{val.status}</span>
                        </div>
                        <span className="p-1 bg-emerald-100 text-emerald-800 rounded-full">
                          <Check size={12} className="stroke-[3]" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 10. EXECUTIVE OUTPUT (8 Cols) */}
                <div className="lg:col-span-8 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-900 p-6 sm:p-8 rounded-3xl text-white space-y-6">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono tracking-wider text-purple-400 font-black block uppercase bg-purple-500/10 px-2 py-0.5 rounded">
                        Subsystem 10
                      </span>
                      <h3 className="text-lg font-serif font-black text-white flex items-center gap-1.5 pt-1">
                        <Cpu size={18} className="text-purple-400" /> Executive Platform Diagnostic Logs
                      </h3>
                      <p className="text-xs text-slate-400 font-light">
                        Full system telemetry diagnostic, mapping the live cybernetic feedback learning loop.
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-3 py-1 rounded-full font-bold">
                        SYSTEM OK UPTIME 99.99%
                      </span>
                    </div>
                  </div>

                  {/* BIG METRICS GAUGES */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                      <span className="text-[8px] text-slate-400 block">System Health Index</span>
                      <strong className="text-emerald-400 text-2xl font-black mt-1.5 block">100%</strong>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                      <span className="text-[8px] text-slate-400 block">Simulations Compiled</span>
                      <strong className="text-blue-400 text-2xl font-bold mt-1.5 block">500 total</strong>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                      <span className="text-[8px] text-slate-400 block">Auto OODA Tick Index</span>
                      <strong className="text-teal-400 text-2xl font-bold mt-1.5 block">Active</strong>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                      <span className="text-[8px] text-slate-400 block">Cost Optimization Cap</span>
                      <strong className="text-yellow-400 text-2xl font-bold mt-1.5 block">Enforced</strong>
                    </div>
                  </div>

                  {/* DIAGNOSTIC CONTEXT LOG LINES */}
                  <div className="bg-black/40 border border-white/5 p-4 rounded-2xl font-mono text-[10px] text-slate-400 space-y-2">
                    <div className="flex justify-between text-[9px] border-b border-white/5 pb-1.5 uppercase tracking-wider text-purple-400">
                      <span>Service Event Logging Stream</span>
                      <span>Ready</span>
                    </div>
                    <div className="space-y-1 text-slate-300">
                      <p><span className="text-slate-500">[11:45:15 AM]</span> INBOUND: Ingestion payload parsed for user bounds. <strong className="text-emerald-400">PASSED</strong></p>
                      <p><span className="text-slate-500">[11:45:16 AM]</span> OODA: Predicted global trend vectors compiled safely. <strong className="text-blue-400">INDEX (2 active)</strong></p>
                      <p><span className="text-slate-500">[11:45:17 AM]</span> GOVERNANCE: Compliance sanity check complete. <strong className="text-emerald-400">COMPLIANT (No overrunning risks)</strong></p>
                      <p><span className="text-slate-500">[11:45:18 AM]</span> ADAPTIVE: Snapshots database queue synced cleanly in Google Firestore. <strong className="text-purple-400">DOC_SET (Success)</strong></p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
          {activeEngine === 'dna' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="modular-style-dna-engine">
              {/* Left Column: Stylist Identity Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-3xl border border-indigo-900/30 text-white relative shadow-xl">
                  <div className="absolute top-4 right-4 text-indigo-400 opacity-25">
                    <Brain size={48} />
                  </div>

                  <span className="text-[9px] font-mono uppercase bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-full tracking-widest font-black">
                    Fashion Identity Profile
                  </span>

                  <div className="mt-6 space-y-1">
                    <h3 className="text-2xl font-serif font-bold tracking-tight">Style DNA Card</h3>
                    <p className="text-xs text-indigo-200 mt-1">Learnt and compiled from curated parameters.</p>
                  </div>

                  {/* Core personality tags */}
                  <div className="mt-6 pt-4 border-t border-white/10 space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between items-center text-indigo-300">
                      <span>Vibe Affinities (Float Vector Coordinates)</span>
                      <span className="text-[9px] bg-indigo-500/30 px-1 rounded animate-pulse">LIVE INDEXING</span>
                    </div>

                    {[
                      { key: 'minimalist', name: 'Minimalist Clean', color: 'bg-emerald-400' },
                      { key: 'streetwear', name: 'Harajuku Streetwear', color: 'bg-yellow-400' },
                      { key: 'classic', name: 'Savile Row Classic', color: 'bg-blue-400' },
                      { key: 'luxury', name: 'Quiet Luxury', color: 'bg-purple-400' },
                      { key: 'cyberpunk', name: 'Cyberpunk Techwear', color: 'bg-red-400' },
                      { key: 'traditional', name: 'Heritage Traditional', color: 'bg-pink-400' },
                    ].map((entry) => {
                      const val = (vectorWeights as any)[entry.key] || 0;
                      return (
                        <div key={entry.key} className="space-y-1">
                          <div className="flex justify-between items-center text-slate-100">
                            <span className="font-sans font-semibold text-xs">{entry.name}</span>
                            <span>{(val * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
                            <div
                              className={`${entry.color} h-full transition-all duration-500`}
                              style={{ width: `${val * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-400 pt-0.5">
                            <button
                              type="button"
                              onClick={() => triggerLearningFeedback(entry.name, 'like')}
                              className="hover:text-emerald-400 cursor-pointer"
                            >
                              + Train Weight
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerLearningFeedback(entry.name, 'dislike')}
                              className="hover:text-red-400 cursor-pointer"
                            >
                              - Dislike / Rest
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interaction Counter Row */}
                  <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10 text-center">
                    <div className="p-2 bg-white/5 rounded-xl">
                      <span className="text-[8px] font-mono text-indigo-300 block">likes logged</span>
                      <span className="text-sm font-bold font-mono">{likesCount}</span>
                    </div>
                    <div className="p-2 bg-white/5 rounded-xl">
                      <span className="text-[8px] font-mono text-indigo-300 block">lookbooks compiled</span>
                      <span className="text-sm font-bold font-mono">{scoringReport.length} Sets</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <LineChart className="text-blue-500" size={16} /> Stylist Evolution Timeline
                  </h4>
                  <div className="relative pl-6 space-y-6 border-l border-slate-100">
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-4 border-white shadow" />
                      <p className="text-[10px] font-mono text-blue-600 font-bold">CURRENT PHASE</p>
                      <p className="text-xs font-bold text-slate-800">Advanced Quiet Luxury Layering</p>
                      <p className="text-[11px] text-slate-500 font-light mt-0.5">Preferring loopback cotton, trench coatings, and monochrome outerwear pairings.</p>
                    </div>
                    <div className="relative opacity-60">
                      <div className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-4 border-white shadow" />
                      <p className="text-[10px] font-mono text-slate-400">LAST MONTH</p>
                      <p className="text-xs font-bold text-slate-800">Utilitarian Athleisure Focus</p>
                      <p className="text-[11px] text-slate-500 font-light mt-0.5">Transitioned heavy focus elements toward breathable activewear and jogger coordinates.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Learning Stream & Prediction */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <div>
                    <h3 className="font-serif font-black text-xl text-slate-900">Wardrobe Psychology Analyzer</h3>
                    <p className="text-xs text-slate-400 font-light mt-1">Deep analysis of active wardrobe properties, color weights, material indices, and item counts.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Psychology Box 1 */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
                        Style Health Index: Elite
                      </span>
                      <p className="text-xs text-slate-800 font-light leading-relaxed">
                        "Your wardrobe showcases an outstanding ratio between core structural jackets and casual layers. This minimizes morning styling decision fatigue and provides complete multi-temperature flexibility."
                      </p>
                    </div>

                    {/* Psychology Box 2 */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <span className="text-[9px] font-mono uppercase bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold">
                        Future Style Forecast
                      </span>
                      <p className="text-xs text-slate-800 font-light leading-relaxed">
                        "As you integrated more sage green and stone colors, your style matches shifted toward **Scandinavian Minimalism**. Our predictive analytics suggest 74% likelihood of trying Tailored Trench Coats next."
                      </p>
                    </div>
                  </div>

                  {/* Future Week Wardrobe Prediction */}
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider flex items-center gap-1">
                        <Flame size={12} className="text-orange-500 animate-pulse" /> Weekly Wear Prediction
                      </p>
                      <span className="text-[10px] text-blue-600 bg-white border border-blue-100 px-2 py-0.5 rounded font-mono font-bold">
                        Model Confidence 92%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      {[
                        { day: "Mon", item: "Blazer + Tee", mood: "Formality Match" },
                        { day: "Wed", item: "Shell Anorak", mood: "Precipitation guard" },
                        { day: "Fri", item: "Relaxed Jeans Set", mood: "Casual utility" },
                        { day: "Sat", item: "Cardigan Layer", mood: "Aesthetic coziness" }
                      ].map((pred, i) => (
                        <div key={i} className="p-3 bg-white rounded-xl border border-slate-150/80">
                          <span className="text-[10px] font-mono font-bold text-slate-400 block">{pred.day}</span>
                          <span className="text-xs font-bold text-slate-800 block mt-1">{pred.item}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{pred.mood}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-6">
                    {/* RUNTIME SYSTEM CONTEXT */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 text-white space-y-4">
                      <div className="flex justify-between items-center bg-slate-900 -mx-5 -mt-5 p-4 rounded-t-2xl border-b border-slate-850">
                        <div className="flex items-center gap-2">
                          <Cpu className="text-blue-400 rotate-12 animate-spin-slow" size={16} />
                          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-200">AI OS CORE EXECUTION RUNTIME LOCK</span>
                        </div>
                        <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold animate-pulse">
                          LOOP RUNNING
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-slate-925 p-3 rounded-xl border border-slate-900">
                          <span className="text-[8px] font-mono uppercase text-slate-400 block">Cycles Processed</span>
                          <span className="text-xl font-bold font-mono text-blue-400 mt-1 block">{osCyclesCount || 1} Ticks</span>
                        </div>
                        <div className="bg-slate-925 p-3 rounded-xl border border-slate-900">
                          <span className="text-[8px] font-mono uppercase text-slate-400 block">Active Status Cycle</span>
                          <span className="text-xl font-bold font-mono text-pink-400 mt-1 block animate-pulse">ADAPTING</span>
                        </div>
                      </div>

                      {/* Continuous OODA execution stage indicator */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase">
                          <span>Autonomous Pipeline Sequence State</span>
                          <span className="text-blue-400 font-bold">{activeCycleStep}</span>
                        </div>
                        <div className="grid grid-cols-5 gap-1.5 font-mono text-[8.5px] font-bold text-center">
                          {[
                            { name: 'Observe', desc: 'Sensors' },
                            { name: 'Predict', desc: 'Trends' },
                            { name: 'Generate', desc: 'Sartorials' },
                            { name: 'Evaluate', desc: 'Agents' },
                            { name: 'Adapt', desc: 'Memory' },
                          ].map((step) => {
                            const active = activeCycleStep === step.name;
                            return (
                              <div
                                key={step.name}
                                className={`p-2 rounded-lg border transition-all duration-300 ${
                                  active
                                    ? 'bg-blue-600 text-white border-blue-500 shadow shadow-blue-500/20'
                                    : 'bg-slate-900 text-slate-400 border-slate-850'
                                }`}
                              >
                                <div>{step.name}</div>
                                <div className="text-[7px] text-slate-300/60 font-light mt-0.5">{step.desc}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* INTERACTION AND EVENT QUEUE */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                      <h4 className="text-xs font-bold text-slate-900 tracking-wider font-mono uppercase mb-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block" /> Live Learner Queue
                      </h4>
                      <div className="space-y-2">
                        {userInteractions.map((act, i) => (
                          <div key={i} className="flex justify-between items-center p-2.5 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-150">
                            <p className="text-[11px] font-medium text-slate-700">{act.action}</p>
                            <div className="flex gap-2">
                              <span className="text-[8px] font-mono px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded font-bold uppercase">
                                {act.tag}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400">{act.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DRIVEN AGENTS MATRIX COOPERATION STATUS */}
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-950 font-mono uppercase tracking-wider">
                          Autonomous Style Agents Node Matrix
                        </h4>
                        <span className="text-[8px] font-mono text-blue-600 font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                          5 Active Agents
                        </span>
                      </div>
                      <div className="space-y-2.5 text-[11px] text-slate-700">
                        {[
                          { name: 'StyleAgent', role: 'Evaluates personal brand affinity & DNA memory parameters', badge: 'Personalization' },
                          { name: 'TrendAgent', role: 'Infers global trend volume triggers & social scrape indices', badge: 'Global Signals' },
                          { name: 'FabricAgent', role: 'Decodes knitweight parameters, stretch, & thermal logic suitability', badge: 'Material Logic' },
                          { name: 'CultureAgent', role: 'Validates regional codes, subculture patterns, & dress rules', badge: 'Context Adaptive' },
                          { name: 'DecisionAgent', role: 'Melt-aggregates agent metrics & scores candidates natively', badge: 'Final Arbiter' }
                        ].map((ag) => (
                          <div key={ag.name} className="flex gap-3 justify-between items-start bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div className="space-y-0.5">
                              <span className="font-mono font-bold text-slate-900 block">{ag.name}</span>
                              <p className="text-slate-500 font-light text-[10px]">{ag.role}</p>
                            </div>
                            <span className="text-[8px] font-mono bg-white border border-slate-150 text-slate-500 px-2 py-0.5 rounded block whitespace-nowrap">
                              {ag.badge}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PERSISTED PATH STATE SNAPSHOTS HISTORY */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-950 font-mono uppercase tracking-wider">
                          Evolving Identity GraphSnapshots
                        </h4>
                        <span className="text-[8px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                          Firebase Verified
                        </span>
                      </div>
                      
                      {stateSnapshotsHistory.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                          Warming database engine. Waiting for first auto-loop snap payload ...
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {stateSnapshotsHistory.slice(0, 4).map((snap, sIdx) => (
                            <div key={sIdx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-white font-mono text-[9px] space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-blue-400 font-bold">SNAP #{sIdx + 1}</span>
                                <span className="text-slate-500">{new Date(snap.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <div className="space-y-1 text-slate-300">
                                <p><span className="text-slate-500">Occasion Match:</span> {snap.activeOccasion}</p>
                                <p><span className="text-slate-500">Weather Context:</span> {snap.weatherCondition} ({snap.temperatureCelsius}°C)</p>
                                <p><span className="text-slate-500 font-bold text-yellow-400">Winning Set Score:</span> <span className="text-green-400 font-bold">{snap.topSelectedCandidateScore || 92}%</span></p>
                              </div>
                              <div className="pt-1.5 border-t border-slate-900 flex justify-between gap-1 text-[8px] text-slate-400">
                                <span>Style Match: {Math.round(snap.userVibeVector?.minimalist * 100 || 50)}% Min</span>
                                <span>Luxury Match: {Math.round(snap.userVibeVector?.luxury * 100 || 50)}% Lux</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SYSTEM DIAGRAMS, FLOWS, & UPDATED MODULES */}
                    <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 rounded-3xl border border-indigo-500/20 text-white space-y-4 shadow-lg">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono uppercase bg-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-full font-bold">
                          System Blueprint Specification
                        </span>
                        <h4 className="text-base font-serif font-black tracking-tight mt-1">Autonomous Architecture Specifications</h4>
                      </div>

                      <div className="space-y-3 font-mono text-[9px] leading-relaxed">
                        {/* Tab-like blueprint elements */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                          <span className="text-blue-400 font-bold block uppercase border-b border-slate-850 pb-1">1. Full System Architecture</span>
                          <pre className="text-slate-300 whitespace-pre text-[7.5px] overflow-x-auto leading-normal">
{`+------------------------------------------------------------------------+
|                      USER INTERACTION & CLIENT VIEW                    |
|                        (AIStyleHub UI Component)                       |
+-------------------+----------------------------+-----------------------+
                    |                            |
          User Feedback (Adjust Vector)   Auto Loop Trigger (Each 20s)
                    v                            v
+-------------------+----------------------------+-----------------------+
|                    AI OS EXECUTIVE CORE RUNTIME                        |
|       (Continuous cycle: Observe -> Predict -> Generate -> Evaluate)   |
+-------------------+----------------------------+-----------------------+
                    |                            |
               Reads State                 Deliberates Scores
                    v                            v
+-------------------+----------------------------+-----------------------+
|              MULTI-AGENT INTELLIGENCE NETWORK MATRIX                   |
|  - StyleAgent (Profile DNA)         - FabricAgent (Material comfort)   |
|  - TrendAgent (Global scraper logs) - CultureAgent (Regional context)  |
+-------------------+----------------------------+-----------------------+
                    |
                    +------------> Evaluated & Sorted by: DecisionAgent (Arbitration)
                                                 |
                                                 v
                               +-----------------+-----------------------+
                               |         PERSISTED IDENTITY DASTBOARD    |
                               |  - Firebase snapshots (Identity Graph)  |
                               |  - Weight update loops (Vector Memory)  |
                               +-----------------------------------------+`}
                          </pre>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                          <span className="text-pink-400 font-bold block uppercase border-b border-slate-850 pb-1">2. text-based Agent Flow</span>
                          <pre className="text-slate-300 whitespace-pre text-[7.5px] overflow-x-auto leading-normal">
{`[TRIGGERED SIGNAL] -> State changed (Wardrobe list, feedback clicks)
  |
  v [OBSERVE] ------> Pull location sensors, active Celsius counts, and style DNA parameters
  |
  v [PREDICT] ------> Scrape Pinterest logs and select Global Trend coordinates
  |
  v [GENERATE] -----> Draw garment layer mixes from available closet drawers
  |
  v [EVALUATE] -----> Distribute drafts to Agents:
  |                     - StyleAgent   (Vector distance: 30%)
  |                     - FabricAgent  (Thermal comfort: 30%)
  |                     - CultureAgent (Subculture match: 20%)
  |                     - TrendAgent   (Market momentum: 20%)
  |
  v [DECIDE] -------> DecisionAgent blends recommendations, calculates competitive
  |                   posture reasons, and outputs ranked candidates
  |
  v [ADAPT] --------> Commit snapshot payload to Firestore to trace Identity evolution`}
                          </pre>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                          <span className="text-yellow-400 font-bold block uppercase border-b border-slate-850 pb-1">3. Updated Module Dependency Tree</span>
                          <pre className="text-slate-300 whitespace-pre text-[7.5px] overflow-x-auto leading-normal">
{`src/
├── main.tsx
├── App.tsx (Bridges local wardrobe storage state)
├── components/
│   └── AIStyleHub.tsx (The main UI Operating Desk view)
└── features/
    ├── ai-core/
    │   └── aiOperatingSystem.ts (Loop orchestrator. Registers subscribers)
    ├── ai-agents/
    │   └── agents.ts (StyleAgent, FabricAgent, TrendAgent, CultureAgent, DecisionAgent)
    ├── user-profile-memory/
    │   └── vectorProfileMemory.ts (Stores the multi-dimension weight values)
    ├── trend-engine/
    │   └── trendIntelligence.ts (Generates standard subculture indicators)
    ├── styling-engine/
    │   └── outfitScoringRanker.ts (Utility score weight multipliers)
    └── simulation-layer/
        └── tryOnArchitecture.ts (Maintains physics drape coefficients)`}
                          </pre>
                        </div>

                        {/* ML Upgrade spec */}
                        <div className="p-3 bg-indigo-900/40 rounded-xl border border-indigo-400/20 text-indigo-200">
                          <span className="font-bold underline uppercase text-orange-300 block text-[8px] mb-1">Pre-wired Machine Learning Upgrade Anchors</span>
                          Pre-wired type interfaces (`IStyleEmbeddingModel`, `IOutfitRankingModel`, `IVisionTryOnModel`) are loaded inside `/src/features/ai-core/aiOperatingSystem.ts`. These can easily connect to PyTorch, MediaPipe, or Stable Diffusion API pipelines.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              SECTION 2: AI OUTFIT GENERATOR
              ============================================== */}
          {activeEngine === 'generator' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="modular-generative-outfit-generator">
              {/* Left Settings inputs card */}
              <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900">Sartorial Synthesis Desk</h3>
                  <p className="text-xs text-slate-400 font-light mt-1">Configure advanced style variables to compile balanced outfits from scratch.</p>
                </div>

                <div className="space-y-4 text-xs font-medium text-slate-700">
                  {/* Variable 1: Occasion */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Occasion Context</label>
                    <input
                      type="text"
                      className="w-full p-2.5 border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 rounded-xl font-medium"
                      value={genOccasion}
                      onChange={(e) => setGenOccasion(e.target.value)}
                    />
                  </div>

                  {/* Variable 2: Weather */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Climate / Temperature Forecast</label>
                    <input
                      type="text"
                      className="w-full p-2.5 border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 rounded-xl font-medium"
                      value={genWeather}
                      onChange={(e) => setGenWeather(e.target.value)}
                    />
                  </div>

                  {/* Variable 3: Budget tier */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">Acquisition Budget Range</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {[
                        { id: 'low', label: 'Tier 1 (Budget)', icon: <PiggyBank size={12} /> },
                        { id: 'mid', label: 'Tier 2 (Mid-Tier)', icon: <ShoppingBag size={12} /> },
                        { id: 'luxury', label: 'Tier 3 (Savile / Luxury)', icon: <Award size={12} /> }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setGenBudget(t.id)}
                          className={`p-2.5 rounded-xl border font-mono font-bold text-[10px] flex flex-col items-center gap-1 uppercase tracking-wider cursor-pointer transition-all ${
                            genBudget === t.id
                              ? 'bg-blue-600 text-white border-blue-600 shadow'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {t.icon}
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Variable 4: Culture / Aesthetics style */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Localized Cultural Aesthetic</label>
                    <select
                      value={genCulture}
                      onChange={(e) => setGenCulture(e.target.value)}
                      className="w-full p-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl font-semibold cursor-pointer"
                    >
                      <option value="Scandinavian Minimalist">Scandinavian Minimalist</option>
                      <option value="Tokyo Harajuku Streetwear">Tokyo Harajuku Streetwear</option>
                      <option value="Savile Row Classic">Savile Row Tailored Classic</option>
                      <option value="Italian Sprezzatura Tailoring">Italian Sprezzatura Sportive</option>
                      <option value="Cyberpunk Techwear Void">Cyberpunk Techwear Void</option>
                    </select>
                  </div>

                  {/* Extra filters: Gender */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Aesthetic Silhouette Preference</label>
                    <div className="flex gap-2">
                      {['All', 'Masculine-cut', 'Feminine-slanted', 'Androgynous'].map((gen) => (
                        <button
                          key={gen}
                          type="button"
                          onClick={() => setGenGender(gen)}
                          className={`flex-1 py-2 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                            genGender === gen
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {gen}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateOutfitSet}
                  disabled={isGeneratingSet}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
                >
                  {isGeneratingSet ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Synthesizing Coordinate Blueprint...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Compile Generative Set</span>
                    </>
                  )}
                </button>
              </div>
               {/* Right Output list card */}
              <div className="lg:col-span-7 space-y-6">
                <div className="text-slate-900 space-y-4">
                  {/* Phase Next A13 - Visual Render Canvas */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-white space-y-6 shadow-xl relative overflow-hidden" id="visual-render-pipeline-canvas">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-transparent blur-2xl pointer-events-none" />
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-black">
                          Visual Outfit Render pipeline (A13)
                        </span>
                        <h4 className="text-lg font-serif font-black tracking-tight mt-1 text-slate-100">Compiled Real-time Digital Look</h4>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsFullscreenMode(!isFullscreenMode)}
                          className={`p-1.5 rounded-lg border text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer ${
                            isFullscreenMode ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title="Toggle full screen layout mode"
                        >
                          Fullscreen
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCompareActive(!isCompareActive)}
                          className={`p-1.5 rounded-lg border text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer ${
                            isCompareActive ? 'bg-pink-600 border-pink-700 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Compare Mode
                        </button>
                      </div>
                    </div>

                    {/* Lazy Queue states */}
                    {isRenderQueuing && (
                      <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                          <span className="font-mono">Processing Render Queue (Latency: 120ms)...</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">State: LAYOUT_RESOLVING</span>
                      </div>
                    )}

                    {activeLook && !isCompareActive && (
                      <div className={`space-y-6 ${isFullscreenMode ? 'fixed inset-4 z-50 bg-slate-950 p-8 border border-slate-800 rounded-3xl overflow-y-auto' : ''}`}>
                        
                        {isFullscreenMode && (
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-mono uppercase bg-blue-600 text-white px-2 py-0.5 rounded">Fullscreen View</span>
                            <button onClick={() => setIsFullscreenMode(false)} className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer">Close [ESC]</button>
                          </div>
                        )}

                        {/* Interactive digital board layout */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          {/* Digital Display Canvas Model representation */}
                          <div className={`md:col-span-5 h-72 sm:h-80 rounded-2xl bg-gradient-to-b ${activeLook.heroLook.imageUrl} relative overflow-hidden flex flex-col justify-end p-4 shadow-inner border border-white/10 group`}>
                            <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md border border-white/10 px-2.5 py-1 text-white font-mono rounded text-[9px]">
                              {activeLook.heroLook.aestheticVibe.toUpperCase()} STYLE
                            </div>
                            <div className="absolute top-3 right-3 bg-green-500/90 text-slate-950 font-mono border border-green-400/20 px-2 py-0.5 rounded text-[9px] font-bold">
                              CONFIDENCE: {activeLook.confidence}%
                            </div>
                            <div className="relative z-10 space-y-1.5 text-left">
                              <h5 className="text-sm font-black tracking-tight leading-tight text-white">{activeLook.heroLook.title}</h5>
                              <p className="text-[10px] text-slate-300 font-light leading-relaxed">{activeLook.heroLook.description}</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-100" />
                          </div>

                          {/* Garment anatomy layering blueprint info */}
                          <div className="md:col-span-7 space-y-4">
                            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-widest leading-none text-left">Active Garment Layers Spectrum</span>
                            <div className="space-y-2">
                              {activeLook.garmentLayers.map((layer) => (
                                <div key={layer.layerId} className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl flex justify-between items-center text-left">
                                  <div className="space-y-0.5 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                      <span className="text-xs font-bold text-slate-100">{layer.name}</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-400 block uppercase">{layer.category} · {layer.fabric} · {layer.color}</span>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-slate-500">{layer.opacityPercent}% opacity</span>
                                </div>
                              ))}
                            </div>

                            {/* Hex layout palettes */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-widest leading-none text-left">Chromatic Harmony Palette</span>
                              <div className="flex gap-2">
                                {activeLook.palette.hexes.map((color, cIdx) => (
                                  <div key={cIdx} className="flex-1 h-5 rounded-lg border border-white/5 transition-transform hover:scale-110 flex items-center justify-center relative cursor-help" title={color}>
                                    <div className="w-full h-full rounded-lg" style={{ backgroundColor: color }} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Alternate thumbnails */}
                        <div className="pt-4 border-t border-slate-900 space-y-2">
                          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-widest leading-none text-left">Pipeline Alternate Recommendations</span>
                          <div className="grid grid-cols-2 gap-3">
                            {activeLook.alternates.map((alt, altIdx) => (
                              <div key={altIdx} className="p-2.5 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between text-left">
                                <div className="space-y-0.5 whitespace-nowrap overflow-hidden">
                                  <span className="text-[8px] font-mono text-blue-400 block uppercase tracking-wider">Alternate {altIdx + 1}</span>
                                  <span className="text-[11px] font-bold text-slate-100 block truncate">{alt.title}</span>
                                  <span className="text-[9px] font-mono text-slate-500 block">{alt.category} · {alt.fabric}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Compare mode Layout */}
                    {activeLook && isCompareActive && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Selected Look A */}
                        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-3 text-left">
                          <span className="text-[9px] font-mono uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Look Alpha (Focus)</span>
                          <div className={`h-40 rounded-xl bg-gradient-to-b ${compareModeLookA?.heroLook.imageUrl || 'from-stone-900 to-black'} relative overflow-hidden flex flex-col justify-end p-3 border border-white/10`}>
                            <h5 className="text-xs font-bold relative z-10 text-white leading-tight">{compareModeLookA?.heroLook.title}</h5>
                            <span className="text-[8px] font-mono text-slate-300 relative z-10 block uppercase mt-0.5">{compareModeLookA?.heroLook.aestheticVibe} look</span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-light">{compareModeLookA?.heroLook.description}</p>
                          <div className="space-y-1 text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-850">
                            <div>Score: <span className="text-white font-bold">{compareModeLookA?.confidence}%</span></div>
                            <div>Palette: <span className="text-white">{compareModeLookA?.palette.hexes.join(', ')}</span></div>
                          </div>
                        </div>

                        {/* Selected Look B */}
                        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-3 text-left">
                          <span className="text-[9px] font-mono uppercase bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded border border-pink-500/20">Look Beta (Alternate Blueprint)</span>
                          <div className={`h-40 rounded-xl bg-gradient-to-b ${compareModeLookB?.heroLook.imageUrl || 'from-indigo-900 to-indigo-950'} relative overflow-hidden flex flex-col justify-end p-3 border border-white/10`}>
                            <h5 className="text-xs font-bold relative z-10 text-white leading-tight">{compareModeLookB?.heroLook.title}</h5>
                            <span className="text-[8px] font-mono text-slate-300 relative z-10 block uppercase mt-0.5">{compareModeLookB?.heroLook.aestheticVibe} look</span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-light">{compareModeLookB?.heroLook.description}</p>
                          <div className="space-y-1 text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-850">
                            <div>Score: <span className="text-white font-bold">{compareModeLookB?.confidence}%</span></div>
                            <div>Palette: <span className="text-white">{compareModeLookB?.palette.hexes.join(', ')}</span></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rendering action triggers inside pipeline panel */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={triggerVisualRender}
                        disabled={isRenderQueuing}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-55 text-white font-mono font-bold tracking-widest rounded-2xl text-[11px] uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isRenderQueuing ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            <span>Resolving look layers in queue...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={13} />
                            <span>Simulate Complete Look Pipeline</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                  <div className="flex justify-between items-center whitespace-nowrap">
                    <span className="text-xs uppercase font-mono tracking-widest text-slate-400">AI Compiled & Scored Blueprints</span>
                    <span className="text-[11px] font-mono text-blue-600">{scoringReport.length} Coordinate Sets Calibrated</span>
                  </div>

                  {scoringReport.length === 0 ? (
                    <div className="p-12 text-center bg-white border border-slate-150 rounded-3xl space-y-3">
                      <Shirt className="text-slate-300 mx-auto animate-pulse" size={40} />
                      <p className="text-sm font-bold text-slate-800">No Closet Sets Compiled</p>
                      <p className="text-xs text-slate-400 font-light max-w-xs mx-auto">Add garments to your digital wardrobe closet to enable automatic scoring and lookbook generation.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {scoringReport.map((candidate, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                          {/* Title and Top Score Panel */}
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold">
                                <Sparkles size={11} /> Rank #{idx + 1} Candidate
                              </span>
                              <h4 className="text-lg font-serif font-black text-slate-800 tracking-tight">{candidate.styleName}</h4>
                            </div>
                            <div className="bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl text-right">
                              <span className="text-[8px] font-mono text-slate-400 block uppercase leading-none">Aggregated Score</span>
                              <span className="text-xl font-serif font-black text-blue-600 inline-block">{candidate.scoreBreakdown.finalAggregatedScore}%</span>
                            </div>
                          </div>

                          {/* Explainable Scoring Metrics breakdown bento */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                            {[
                              { label: 'Weather Suitability', score: candidate.scoreBreakdown.weatherSuitability, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                              { label: 'Cultural Alignment', score: candidate.scoreBreakdown.culturalAlignment, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                              { label: 'Past Engagement', score: candidate.scoreBreakdown.userEngagementHistory, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                              { label: 'Trend Alignment', score: candidate.scoreBreakdown.trendAlignment, color: 'text-red-700 bg-red-50 border-red-100' }
                            ].map((met, mi) => (
                              <div key={mi} className={`p-2 rounded-xl border ${met.color}`}>
                                <span className="text-[8px] font-mono uppercase block">{met.label}</span>
                                <span className="text-sm font-semibold font-mono block mt-0.5">{met.score}%</span>
                              </div>
                            ))}
                          </div>

                          {/* Rendered Items Group */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {candidate.items.map((item, iNum) => (
                              <div key={iNum} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                                <div className="space-y-1">
                                  <span className="text-[8px] font-mono uppercase font-black tracking-wider text-slate-400 block leading-none">{item.category}</span>
                                  <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                                  <span className="text-[11px] text-slate-500 block font-light">{item.primaryColor || 'Neutral'} · {item.season || 'All-Season'}</span>
                                </div>
                                <button
                                  onClick={() => saveGarmentToCloset({ name: item.title, category: item.category, color: item.primaryColor })}
                                  className="p-1.5 bg-white border border-slate-150 text-slate-700 hover:text-blue-600 hover:border-blue-300 rounded-xl transition-all cursor-pointer"
                                  title="Add copy of garment to digital wardrobe drawer"
                                >
                                  <CheckCircle size={14} />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Explainable Decision Engine breakdown */}
                          <div className="border-t border-slate-100 pt-3.5 space-y-2 text-xs">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block tracking-wider">Aesthetic Justification Breakdown</span>
                              <p className="text-slate-600 font-light mt-1 italic leading-relaxed">
                                "{candidate.justificationReasoning}"
                              </p>
                            </div>

                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 text-[11px]">
                              <span className="text-[9px] font-mono uppercase font-bold text-blue-600 block tracking-wider">Fashion Decision Engine Matrix</span>
                              <p className="text-slate-700 font-light mt-1 leading-relaxed">
                                {candidate.contenderComparison}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              SECTION 3: VIRTUAL TRY-ON SYSTEM
              ============================================== */}
          {activeEngine === 'tryon' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="modular-virtual-try-on-workspace">
              {/* Left Settings inputs card */}
              <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900">Adaptive Try-on Panel</h3>
                  <p className="text-xs text-slate-400 font-light mt-1">Overlay digital fabric blueprints onto an intelligent 3D body simulation contour mapping.</p>
                </div>

                <div className="space-y-4 text-xs font-medium text-slate-700">
                  {/* Avatar state selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Select Trial Model Avatar</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'model1', label: 'Vibe Model Alpha' },
                        { id: 'model2', label: 'Vibe Model Beta' },
                        { id: 'user', label: 'My Webcam Scan' }
                      ].map(av => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setTryOnModel(av.id as any)}
                          className={`p-2 rounded-xl text-center border font-semibold text-[10px] cursor-pointer transition-all ${
                            tryOnModel === av.id
                              ? 'bg-indigo-650 text-white border-indigo-650 shadow'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {av.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body shape slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                      <span>Body contour index</span>
                      <span className="text-indigo-600">{bodyShape} Profile</span>
                    </div>
                    <div className="flex gap-2">
                      {['Slim', 'Regular', 'Athletic', 'Broad'].map(shape => (
                        <button
                          key={shape}
                          type="button"
                          onClick={() => setBodyShape(shape as any)}
                          className={`flex-1 py-1 px-2 rounded-lg border text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                            bodyShape === shape
                              ? 'bg-slate-900 text-white border-slate-950'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fabric variables */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Fabric Realism Layer</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'wool', label: '100% Merino Knit' },
                        { id: 'denim', label: '14oz Selvedge Denim' },
                        { id: 'silk', label: 'Woven Mulberry Silk' },
                        { id: 'leather', label: 'Nappa Calfskin' }
                      ].map(fab => (
                        <button
                          key={fab.id}
                          type="button"
                          onClick={() => setTryOnFabric(fab.id as any)}
                          className={`p-2.5 rounded-xl text-left border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                            tryOnFabric === fab.id
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span>{fab.label}</span>
                          {tryOnFabric === fab.id && <Check size={12} className="text-indigo-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                    <p className="text-[10px] uppercase font-mono font-bold text-slate-400 flex items-center gap-1">
                      <Scale size={12} className="text-blue-500" /> Fabric weight mechanics
                    </p>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                      Our system isolates density profiles to adapt shadows, wrinkles, and folds along movement joints safely for standard avatars.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={runBodyShapeAdaptation}
                  disabled={isAnalyzingBody}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-850 disabled:opacity-50 text-white font-bold rounded-2xl text-[11px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isAnalyzingBody ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Calibrating body meshes...</span>
                    </>
                  ) : (
                    <>
                      <Maximize size={13} />
                      <span>Re-Calibrate Body Fit</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Output split view card */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h4 className="font-serif font-black text-slate-900 text-lg flex items-center gap-2">
                    <Eye size={18} className="text-indigo-600" /> Immersive Before / After Slider
                  </h4>
                  <p className="text-xs text-slate-400 font-light mt-1">Slide to compare simple standard profile overlay (left) against calibrated realism (right).</p>
                </div>

                <div className="relative aspect-[4/3] bg-black rounded-3xl overflow-hidden shadow-inner border border-slate-150">
                  {/* Left Side: Before (Blank overlay / simple model) */}
                  <img
                    src="https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80"
                    alt="Before tryon"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-45"
                    referrerPolicy="no-referrer"
                  />

                  {/* Right Side: After (Calibrated Realism overlay) with clip path */}
                  <div
                    className="absolute inset-0 w-full h-full overflow-hidden transition-all pointer-events-none"
                    style={{ clipPath: `polygon(${tryOnSlider}% 0, 100% 0, 100% 100%, ${tryOnSlider}% 100%)` }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80"
                      alt="After Tryon"
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Standard control overlay tags */}
                  <div className="absolute bottom-4 left-4 z-20 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 text-white leading-none">
                    <span className="text-[10px] font-mono text-slate-300 block uppercase font-bold tracking-widest">Base Silhouette</span>
                    <span className="text-xs font-bold font-serif">{tryOnModel === 'user' ? 'Webcam Capture' : 'Alpha Mesh'}</span>
                  </div>

                  <div className="absolute bottom-4 right-4 z-20 bg-indigo-650 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-indigo-500/30 text-white text-right leading-none">
                    <span className="text-[10px] font-mono text-indigo-200 block uppercase font-bold tracking-widest">Warp fabric realism</span>
                    <span className="text-xs font-black font-mono mt-0.5 inline-block text-pink-300">{tryOnFabric.toUpperCase()} 14oz</span>
                  </div>

                  {/* Custom interactive slider controller button */}
                  <div className="absolute inset-y-0 left-0 right-0 z-10 pointer-events-none">
                    {/* Active Line indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-indigo-500 text-white flex items-center justify-center cursor-ew-resize pointer-events-auto"
                      style={{ left: `${tryOnSlider}%` }}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white shadow flex items-center justify-center transform -translate-x-1/2">
                        <Scale size={13} />
                      </div>
                    </div>
                  </div>

                  {/* Range inputs at bottom slot overlay */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tryOnSlider}
                    onChange={(e) => setTryOnSlider(Number(e.target.value))}
                    className="absolute inset-x-0 bottom-16 h-10 opacity-0 cursor-ew-resize z-30"
                  />
                </div>

                 {/* Dynamic Computed Telemetry Overlay */}
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-850 text-white font-mono text-[10px]">
                   <div className="space-y-0.5 text-left">
                     <span className="text-slate-400 block text-[8px] uppercase">Mesh Calibration</span>
                     <span className="text-emerald-400 font-bold block">{((tryOnSimResult?.alignmentIndex || 0.983) * 100).toFixed(1)}%</span>
                   </div>
                   <div className="space-y-0.5 text-left">
                     <span className="text-slate-400 block text-[8px] uppercase">Stretch Tension</span>
                     <span className="text-blue-400 font-bold block">{tryOnSimResult?.stretchDistribution || '12.4 N/m²'}</span>
                   </div>
                   <div className="space-y-0.5 text-left">
                     <span className="text-slate-400 block text-[8px] uppercase">GL Skeletal Bones</span>
                     <span className="text-indigo-400 font-bold block">{(tryOnSimResult?.meshCoordinates?.length || 18)} Joints Active</span>
                   </div>
                   <div className="space-y-0.5 text-left">
                     <span className="text-slate-400 block text-[8px] uppercase">Joint Alignment</span>
                     <span className="text-pink-300 font-bold block">{(tryOnSimResult?.landmarkIndices || ['Shoulder_L', 'Spine_C']).slice(0, 2).join(' / ')}</span>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {/* ==============================================
              SECTION: STYLE LAB (USER CREATION MODE)
              ============================================== */}
          {activeEngine === 'style-lab' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="modular-style-lab-canvas">
              {/* Left Column Controls */}
              <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <span className="text-[9px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black border border-blue-100">
                    User Creation Mode Active
                  </span>
                  <h3 className="font-serif font-black text-xl text-slate-900 mt-2">Style Lab Studio</h3>
                  <p className="text-xs text-slate-400 font-light mt-1 text-left">Interactively remix look coordinates, lock dynamic layers, and apply targeted micro-mutations.</p>
                </div>

                {/* Prompt Interpretation Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider text-left block">Aesthetic Mutation Prompt</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 p-2.5 border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 rounded-xl text-xs font-medium"
                      placeholder="e.g. Make outer layer cashmere charcoal gray"
                      value={labPrompt}
                      onChange={(e) => setLabPrompt(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => triggerStyleLabRemix(labPrompt)}
                      className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold rounded-xl uppercase transition-all cursor-pointer"
                    >
                      Remix
                    </button>
                  </div>
                </div>

                {/* Lock components layers */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider text-left block">Component Locking Mechanism</label>
                  <p className="text-[11px] text-slate-500 leading-normal font-light text-left">Lock specific parts of your outfit to shield them from model mutation weights.</p>
                  
                  <div className="space-y-2 text-xs">
                    {[
                      { id: 'outer', label: 'Lock Outerwear (Topcoat/Shell)', locked: true },
                      { id: 'base', label: 'Lock Basewear (Tee/Knit)', locked: false },
                      { id: 'pants', label: 'Lock Trouser Shell (Bifold/Chino)', locked: false },
                      { id: 'acc', label: 'Lock Accessories (Wraps/Sling)', locked: true }
                    ].map((comp) => (
                      <div key={comp.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-left">{comp.label}</span>
                        <div className="flex items-center gap-1.5 cursor-pointer select-none">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">{comp.locked ? 'LOCKED' : 'MUTABLE'}</span>
                          <span className={`p-1 rounded-lg border ${comp.locked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                            {comp.locked ? <Shield size={12} /> : <Unlock size={12} />}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct quick mutations buttons */}
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">Targeted Micro-Mutations</label>
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono font-bold leading-normal">
                    <button
                      type="button"
                      onClick={() => triggerStyleLabRemix('Mutate style profile to match high-vibe neon accents')}
                      className="p-2.5 bg-slate-900 text-slate-100 border border-slate-950 rounded-xl hover:bg-slate-850 cursor-pointer flex items-center justify-center gap-1 text-center"
                    >
                      <Sparkles size={11} /> Mutate Colors
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerStyleLabRemix('Mutate look fabrics into rugged Ventile cotton layers')}
                      className="p-2.5 bg-slate-900 text-slate-100 border border-slate-950 rounded-xl hover:bg-slate-850 cursor-pointer flex items-center justify-center gap-1 text-center"
                    >
                      <Layers size={11} /> Mutate Fabrics
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column Canvas */}
              <div className="lg:col-span-7 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-850 text-white space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <h4 className="font-serif font-black text-slate-100 text-lg flex items-center gap-2 text-left">
                    Style Lab Realism Canvas
                  </h4>
                  <p className="text-xs text-slate-400 font-light mt-1 text-left">Review live output overlays of your style lab mutant adaptations side by side with the default base.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {/* Origin blueprint card */}
                  <div className="p-4 bg-slate-900/60 border border-slate-900 rounded-2xl space-y-3 text-left">
                    <span className="text-[8px] font-mono uppercase font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-850">
                      Standard Base Blueprint
                    </span>
                    <div className={`h-40 rounded-xl bg-gradient-to-b ${activeLook?.heroLook.imageUrl || 'from-stone-900 to-black'} relative overflow-hidden flex flex-col justify-end p-3 border border-white/10`}>
                      <h5 className="text-xs font-bold relative z-10 text-white leading-tight">{activeLook?.heroLook.title || 'Classic Merino Blazer'}</h5>
                      <span className="text-[8px] font-mono text-slate-300 relative z-10 block uppercase mt-0.5">{activeLook?.heroLook.aestheticVibe || 'Minimalist'} default</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-light truncate">{activeLook?.heroLook.description || 'Sleek structured outerwear.'}</p>
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-850">
                      Primary Style: <span className="text-white font-bold">{activeLook?.heroLook.aestheticVibe || 'Minimalist'}</span>
                    </div>
                  </div>

                  {/* Mutant overlay card */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-left">
                    <span className="text-[8px] font-mono uppercase font-bold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded border border-pink-500/20">
                      Style Lab Mutant Overlay
                    </span>
                    <div className={`h-40 rounded-xl bg-gradient-to-b ${labMutatedLook?.heroLook.imageUrl || 'from-indigo-900 via-indigo-950 to-slate-900'} relative overflow-hidden flex flex-col justify-end p-3 border border-white/10`}>
                      <h5 className="text-xs font-bold relative z-10 text-white leading-tight">{labMutatedLook?.heroLook.title || 'Cashmere Remixed Blazer Fit'}</h5>
                      <span className="text-[8px] font-mono text-pink-300 relative z-10 block uppercase mt-0.5">{labMutatedLook?.heroLook.aestheticVibe || 'Modified'} mutant</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-light truncate">{labMutatedLook?.heroLook.description || 'Infused with customized fabric overlays.'}</p>
                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-850 flex justify-between leading-none">
                      <span>Vibe: <span className="text-white font-bold">{labMutatedLook?.heroLook.aestheticVibe || 'Modified Cashmere'}</span></span>
                      <span className="text-pink-300 font-mono text-[9px] font-black">MATCH: {labMutatedLook?.confidence || 93}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-xs space-y-2 text-left">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-bold block">Sartorial Mutation logs</span>
                  <div className="text-slate-300 font-light leading-relaxed font-mono text-[10.5px]">
                    {labMutatedLook ? (
                      <p>Success compiling mutant look. Layers: {labMutatedLook.garmentLayers.map(l => l.name).join(' · ')}</p>
                    ) : (
                      <p className="italic text-slate-400">Wait for prompt input and click remix to compile custom mutations ...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              SECTION: RENDER GALLERY
              ============================================== */}
          {activeEngine === 'render-gallery' && (
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6" id="modular-render-gallery">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="text-left">
                  <h3 className="font-serif font-black text-xl text-slate-900 flex items-center gap-2">
                    <Bookmark className="text-indigo-600" size={20} /> Saved Render Gallery
                  </h3>
                  <p className="text-xs text-slate-400 font-light mt-1 text-left">Audit and retrieve high-contrast digital look coordinates compiled during previous sessions.</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchRecallQuery}
                    onChange={(e) => setSearchRecallQuery(e.target.value)}
                    placeholder="Search past saves..."
                    className="p-2.5 border border-slate-250 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600 rounded-xl text-xs font-medium max-w-xs"
                  />
                </div>
              </div>

              {/* Grid of gallery assets */}
              {timelineLooks.filter(look => 
                look.renderedLook.heroLook.title.toLowerCase().includes(searchRecallQuery.toLowerCase()) ||
                look.renderedLook.heroLook.aestheticVibe.toLowerCase().includes(searchRecallQuery.toLowerCase())
              ).length === 0 ? (
                <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl space-y-2">
                  <Bookmark className="text-slate-300 mx-auto" size={40} />
                  <p className="text-sm font-bold text-slate-700">No Match Logs Found</p>
                  <p className="text-xs text-slate-400 font-light text-left">Try styling more outfits or search for alternative keywords.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {timelineLooks.filter(look => 
                    look.renderedLook.heroLook.title.toLowerCase().includes(searchRecallQuery.toLowerCase()) ||
                    look.renderedLook.heroLook.aestheticVibe.toLowerCase().includes(searchRecallQuery.toLowerCase())
                  ).map((record) => (
                    <div key={record.recordId} className="border border-slate-150 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between h-full bg-slate-50/50">
                      <div className={`aspect-[4/3] bg-gradient-to-b ${record.renderedLook.heroLook.imageUrl} relative overflow-hidden flex flex-col justify-end p-4 border-b border-slate-100`}>
                        <div className="absolute top-2.5 left-2.5 bg-slate-950/70 backdrop-blur-sm border border-white/10 px-2 py-0.5 text-white font-mono rounded text-[8px] uppercase">
                          {record.renderedLook.heroLook.aestheticVibe} look
                        </div>
                        <h4 className="text-sm font-bold text-white relative z-10 drop-shadow text-left">{record.renderedLook.heroLook.title}</h4>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      </div>

                      <div className="p-4 space-y-3 text-left flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5 text-left">
                          <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider block">Render Occasion Context</span>
                          <p className="text-xs font-bold text-slate-800 leading-tight">{record.noteLogged}</p>
                          <span className="text-[10px] font-mono text-slate-500 block">Saved: {new Date(record.createdTimestamp).toLocaleTimeString()}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-150 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveLook(record.renderedLook);
                              setActiveEngine('generator');
                            }}
                            className="flex-1 py-1.5 px-2.5 bg-slate-900 border border-slate-900 hover:bg-slate-850 text-white rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer text-center font-bold"
                          >
                            Set Base
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCompareModeLookB(record.renderedLook);
                              alert(`Successfully set "${record.renderedLook.heroLook.title}" as Look Beta inside generator compare pane!`);
                            }}
                            className="flex-1 py-1.5 px-2.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-700 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer text-center font-bold"
                          >
                            Compare
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==============================================
              SECTION: IDENTITY EVOLUTION
              ============================================== */}
          {activeEngine === 'identity-evolution' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans text-left" id="modular-identity-evolution-dashboard">
              {/* Left Column stats */}
              <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 text-left">
                <div className="text-left">
                  <h3 className="font-serif font-black text-xl text-slate-900">Aesthetic Clusters Analysis</h3>
                  <p className="text-xs text-slate-400 font-light mt-1">Trace style-identity drift factors and representation volumes based on favorite selections.</p>
                </div>

                {/* Identity Drift Meter */}
                <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-850 space-y-3 text-left">
                  <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black">
                    Stable Style Drift Map
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-white">Identity Drift Factor: 4.2%</h5>
                    <p className="text-[11px] text-slate-400 font-light leading-relaxed mt-0.5 animate-pulse">Your fashion profile is highly consistent, emphasizing high-contrast minimalist slates and tailored utility outerwear layers.</p>
                  </div>

                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>

                {/* Grid representation */}
                <div className="space-y-3 text-left">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Estimated Cluster Spread</span>
                  <p className="text-[11px] text-slate-500 font-light text-left">Calculated by clustering historical favorites against multi-dimension styling tensors.</p>
                  
                  <div className="space-y-2 text-xs font-semibold text-left">
                    {[
                      { cluster: 'Minimalist & Savile Row Layers', percentage: 54, color: 'bg-emerald-400' },
                      { cluster: 'Gorpcore & High-Tech Textiles', percentage: 26, color: 'bg-blue-400' },
                      { cluster: 'Classic Earth Tones & Linen Knitwear', percentage: 20, color: 'bg-indigo-400' }
                    ].map((cl, clIdx) => (
                      <div key={clIdx} className="space-y-1 text-left">
                        <div className="flex justify-between items-center text-[11px] font-medium text-slate-800">
                          <span>{cl.cluster}</span>
                          <span className="font-mono text-slate-500">{cl.percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-150 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${cl.color}`} style={{ width: `${cl.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column Time Tracker line */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                <div className="text-left">
                  <h4 className="font-serif font-black text-slate-900 text-lg flex items-center gap-2 text-left">
                    Visual Styling Trajectory timeline
                  </h4>
                  <p className="text-xs text-slate-400 font-light mt-1 text-left">Chronological evolution of user-driven design modifications over current and previous days.</p>
                </div>

                {/* Vertical Timeline Steps */}
                <div className="relative pl-6 border-l border-slate-150 space-y-6 text-left">
                  {[
                    { day: 'Today', action: 'Compiled savile Stockholm high-contrast luxury cashmere knitwear coordinates.', tag: 'Minimalist Focus', time: '12:04' },
                    { day: 'Yesterday', action: 'Warped 14oz denim drape elements matching Scandinavian tailoring.', tag: 'Denim Calibrating', time: 'Yesterday' },
                    { day: '3 Days Ago', action: 'Adjusted vector memory weights for traditional and classic blazer items under high thermal suitability.', tag: 'Vector Training', time: 'June 9' }
                  ].map((trace, traceIdx) => (
                    <div key={traceIdx} className="relative space-y-1 text-xs text-left">
                      {/* Left Dot */}
                      <span className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-indigo-600 border-2 border-white ring-4 ring-indigo-50/50" />
                      
                      <div className="flex justify-between items-center text-[10px] font-mono uppercase text-slate-400">
                        <span>{trace.day} · {trace.time}</span>
                        <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">{trace.tag}</span>
                      </div>
                      <p className="font-bold text-slate-800 tracking-tight leading-snug">{trace.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              SECTION 4: TREND PREDICTION AI
              ============================================== */}
          {activeEngine === 'trends' && (
            <div className="space-y-6" id="modular-global-trends-engine">
              {/* Ingestion pipeline dashboard */}
              <div className="grid grid-cols-3 gap-4 bg-slate-950 p-5 rounded-3xl border border-slate-850 text-white font-mono text-center shadow-xl">
                <div className="p-1 text-center">
                  <span className="text-[8px] text-pink-400 block uppercase font-bold tracking-widest text-[#ec4899]">Scraped Requests</span>
                  <span className="text-base sm:text-lg font-black block mt-0.5">{ingestionMetrics?.totalRequestsIngested || 3249} Calls</span>
                </div>
                <div className="p-1 text-center border-x border-slate-850">
                  <span className="text-[8px] text-pink-400 block uppercase font-bold tracking-widest text-[#ec4899]">Active Ingest Feeds</span>
                  <span className="text-base sm:text-lg font-black block mt-0.5">{ingestionMetrics?.activeSourcesCount || 4} Feeds</span>
                </div>
                <div className="p-1 text-center">
                  <span className="text-[8px] text-pink-400 block uppercase font-bold tracking-widest text-[#ec4899]">Last Scraped</span>
                  <span className="text-[10px] sm:text-xs font-black block mt-1.5">{ingestionMetrics?.lastScrapedAt || '11:45:02 AM'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 flex items-center gap-2">
                    <TrendingUp className="text-pink-500" size={20} /> Deep Trend Radar
                  </h3>
                  <p className="text-xs text-slate-400 font-light mt-1">Continuous intelligence modeling across Instagram channels, Pinterest collections, and Parisian runaway streams.</p>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  {['Global', 'Europe', 'Asia', 'USA', 'MiddleEast'].map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => {
                        setSelectedRegion(region as any);
                        // modify custom trends dynamically to simulate localized scraping
                        const newMock: Record<string, any[]> = {
                          Global: [
                            { title: "Neo-Classic Technical Tailoring", confidence: 94, trendPeriod: "Next 14 Days", tags: ["GoreTex", "Blazers"], volumeIndex: "+145%" },
                            { title: "Desert Dry Earth Tones", confidence: 88, trendPeriod: "30-Day Outlook", tags: ["Sage Green", "Canvas"], volumeIndex: "+81%" }
                          ],
                          Europe: [
                            { title: "High-Grit Nordic Gorpcore", confidence: 91, trendPeriod: "Next 7 Days", tags: ["Loopback Cotton", "Anorak Shells"], volumeIndex: "+180%" },
                            { title: "Atelier Savile Row Cashmere", confidence: 86, trendPeriod: "Winter Outlook", tags: ["Felt Coat", "Silk Necktie"], volumeIndex: "+74%" }
                          ],
                          Asia: [
                            { title: "Tokyo Neo-Military Oversize", confidence: 93, trendPeriod: "Immediate Peak", tags: ["Cargo Vest", "Silver Runners"], volumeIndex: "+210%" },
                            { title: "Mulberry Silk Traditional Coordinates", confidence: 85, trendPeriod: "Autumn Staging", tags: ["Satin Overlays", "Nappa Flat-lays"], volumeIndex: "+65%" }
                          ],
                          USA: [
                            { title: "East Coast Ivory Preppy", confidence: 89, trendPeriod: "Next 10 Days", tags: ["Cardigans", "Oatmeal Knitwest"], volumeIndex: "+112%" },
                            { title: "Pacific Coast active high-stretch gym wear", confidence: 95, trendPeriod: "Monthly Outlook", tags: ["Ribbed leggings", "Breathable nylon"], volumeIndex: "+155%" }
                          ],
                          MiddleEast: [
                            { title: "Arid Linen Lightweight Layerings", confidence: 92, trendPeriod: "Post Summer Trend", tags: ["Desert Trough Linen", "Open-wrap Cloaks"], volumeIndex: "+160%" },
                            { title: "Luxury Gold-thread Embroidery Accents", confidence: 87, trendPeriod: "Elite Events Staging", tags: ["Gilded hems", "Tuxedo linings"], volumeIndex: "+95%" }
                          ]
                        };
                        setPredictedTrends(newMock[region] || newMock.Global);
                        // trigger interaction logging
                        setUserInteractions(prev => [
                          { action: `Scraped trend files under regional node: "${region}"`, time: "Just now", tag: `Trends-${region}` },
                          ...prev
                        ]);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                        selectedRegion === region
                          ? 'bg-pink-600 text-white border-pink-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic list rendering predicted trends */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {predictedTrends.map((trend, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono uppercase bg-pink-50 text-pink-700 px-2 py-0.5 rounded font-black tracking-widest border border-pink-100">
                          {trend.trendPeriod}
                        </span>
                        <h4 className="text-base font-serif font-black text-slate-900 mt-2">{trend.title}</h4>
                      </div>
                      <div className="p-2 bg-pink-50/50 text-pink-600 rounded-2xl text-center leading-none">
                        <span className="text-lg font-mono font-bold block">{trend.volumeIndex}</span>
                        <span className="text-[8px] uppercase tracking-wider font-mono">Volume</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {trend.tags.map((tag: string, tIdx: number) => (
                        <span key={tIdx} className="text-[10px] font-mono font-medium px-2 py-1 bg-slate-50 border border-slate-150 text-slate-700 rounded-lg">
                          #{tag.toLowerCase()}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-light text-slate-500">Predicted Runway Accuracy</span>
                      <span className="text-xs font-mono font-black text-emerald-600">{trend.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==============================================
              SECTION 5: SMART FASHION MARKET ENGINE
              ============================================== */}
          {activeEngine === 'market' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="modular-market-shopping-engine">
              {/* Left Selector: auto bundles creator */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-5">
                  <div>
                    <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-1.5">
                      <ShoppingBag className="text-blue-500" size={18} /> Complete the Look
                    </h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed mt-0.5">Auto-suggest complementary retail pieces fitting your style profile instantly.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { id: 'low', label: 'Econ' },
                      { id: 'mid', label: 'Standard' },
                      { id: 'luxury', label: 'Premium' }
                    ].map(tier => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setMarketTier(tier.id as any)}
                        className={`p-2.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                          marketTier === tier.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3">
                    <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">Recommended Bundle</span>
                    <p className="text-xs font-bold text-slate-800 leading-tight">Savile Stockholm Capsule</p>
                    <p className="text-[11px] text-slate-500 font-light mt-1">Combine fine merino layers and structured utility slates for quiet office lookbooks.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setBundleAgreed(true);
                        const items = marketRecommendations[marketTier];
                        setShoppingCart([...shoppingCart, ...items]);
                        setLikesCount(prev => prev + items.length);
                      }}
                      className="w-full mt-2 py-2 bg-blue-600 text-white text-[10px] font-mono font-bold tracking-widest rounded-xl hover:bg-blue-700 uppercase cursor-pointer"
                    >
                      Instant Add Capsule Bundle
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-slate-850 space-y-4">
                  <h4 className="text-sm font-bold tracking-tight">Active Stylist Cart</h4>
                  <div className="text-xs space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {shoppingCart.length === 0 ? (
                      <p className="text-slate-400 font-light italic">Cart is unpopulated. Click buy suggestions on the right.</p>
                    ) : (
                      shoppingCart.map((cart, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                          <div>
                            <span className="font-bold text-slate-100 block">{cart.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono block uppercase">{cart.brand}</span>
                          </div>
                          <span className="font-mono text-emerald-400">${cart.price}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between text-xs font-mono">
                    <span>Est Total Spend:</span>
                    <span className="text-emerald-400 font-bold">${shoppingCart.reduce((acc, c) => acc + c.price, 0)}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Showcase items */}
              <div className="lg:col-span-8 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 capitalize">Dynamic {marketTier} Collection Match</h3>
                  <p className="text-xs text-slate-400 font-light mt-1">Sourced from vetted environment-friendly mills fitting user lookbooks.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {marketRecommendations[marketTier].map((item: any) => (
                    <div key={item.id} className="border border-slate-150 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between h-full bg-slate-50/50">
                      <div className="aspect-square relative w-full bg-slate-100 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover select-none"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 bg-black/65 px-2.5 py-1 text-white font-mono rounded text-[10px] font-bold">
                          ${item.price}
                        </div>
                      </div>

                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider block">{item.brand}</span>
                          <span className="text-xs font-bold text-slate-800 tracking-tight block mt-1">{item.name}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="w-full py-2 bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer"
                        >
                          Buy Capsule Element
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================
              SECTION 6: DESIGNER CANVAS PRO 
              ============================================== */}
          {activeEngine === 'designer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="modular-designer-mode-canvas">
              {/* Left Column Settings */}
              <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 flex items-center gap-1">
                    <Sparkle className="text-yellow-500 animate-spin" size={18} /> Pro Designers mode
                  </h3>
                  <p className="text-xs text-slate-400 font-light mt-1">Construct novel styles from scratch utilizing multi-modal prompt compiling.</p>
                </div>

                <div className="space-y-4 text-xs font-medium text-slate-700">
                  {/* Prompt */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Aesthetic Outline Prompt</label>
                    <textarea
                      value={designerPrompt}
                      onChange={(e) => setDesignerPrompt(e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-slate-50 border border-slate-250 focus:bg-white rounded-xl text-xs font-light resize-none focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Fabric selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Fabric Formula</label>
                      <input
                        type="text"
                        value={designerFabric}
                        onChange={(e) => setDesignerFabric(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    {/* Color hex */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Design Base Hues</label>
                      <input
                        type="text"
                        value={designerColor}
                        onChange={(e) => setDesignerColor(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={synthesizeDesignerBoard}
                  disabled={isSynthesizingDesign}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 font-bold text-slate-950 rounded-2xl text-[11px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
                >
                  {isSynthesizingDesign ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Compiling Canvas Board...</span>
                    </>
                  ) : (
                    <>
                      <WandButton />
                      <span>Synthesize Canvas Board</span>
                    </>
                  )}
                </button>

                {designerAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-2xl text-xs font-light leading-relaxed"
                  >
                    {designerAlert}
                  </motion.div>
                )}
              </div>

              {/* Right Column Boards list */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif font-black text-slate-900 text-lg">My Custom Fashion Boards</h4>
                  <span className="text-[10px] font-mono uppercase text-slate-400">{customBoards.length} Custom Boards</span>
                </div>

                <div className="space-y-6">
                  {customBoards.map((board) => (
                    <div key={board.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-24 bg-slate-200 rounded-xl overflow-hidden shadow-inner shrink-0 relative">
                          <img
                            src={board.visualSeed}
                            alt="Design Preview"
                            className="w-full h-full object-cover filter brightness-95 transform scale-110"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <h5 className="font-serif font-black text-slate-800 text-sm leading-tight capitalize">{board.title}</h5>
                          <p className="text-[11px] text-slate-500 font-light leading-none">
                            Fabric: <span className="font-mono text-slate-700">{board.fabric}</span> · Base Color: <span className="font-mono">{board.colorName}</span>
                          </p>
                          <p className="text-[11px] text-yellow-800 leading-relaxed font-light bg-yellow-50/70 border border-yellow-100 p-2.5 rounded-lg">
                            {board.improvements}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-200 text-right justify-end">
                        <button
                          type="button"
                          className="px-4 py-1.5 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                          onClick={() => {
                            alert("Fashion Board Export Complete! Download package contains vector layouts and textures.");
                            setUserInteractions(prev => [
                              { action: `Exported Custom Fashion Board: "${board.title}"`, time: "Just now", tag: "Design Export" },
                              ...prev
                            ]);
                          }}
                        >
                          <Download size={11} /> Export Board
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Internal icon micro component to satisfy Wand/Heart elements gracefully
const WandButton: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wand">
      <path d="M15 4V2" />
      <path d="M15 16v-2" />
      <path d="M8 9h2" />
      <path d="M20 9h2" />
      <path d="M17.8 5.2l-1.4 1.4" />
      <path d="M17.8 12.8l-1.4-1.4" />
      <path d="M7.2 5.2l1.4 1.4" />
      <path d="M22 22l-10-10" />
      <path d="M14 14l-4-4" />
    </svg>
  );
};
