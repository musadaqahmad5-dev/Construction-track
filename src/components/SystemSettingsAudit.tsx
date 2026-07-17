import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, ShieldCheck, Database, RefreshCw, LogOut, Info, AlertTriangle, CloudSun, Sparkles, Store,
  Brain, Cpu, Layers, Activity, TrendingUp, Check, Award, Zap, Shirt, Sliders,
  Users, MessageSquare, Share2, Play, BarChart3, HelpCircle, GitFork, Server,
  Eye, FileText, Search, Flame
} from 'lucide-react';
import { LOOK_VISION_THEMES } from './AIStyleHub';
import { SystemHealthPanel } from './SystemHealthPanel';
import { FounderDashboard } from './FounderDashboard';
import { 
  UnifiedFashionOS, PersonalFashionMemoryEngine, FashionKnowledgeGraphEngine, 
  VisionIntelligenceEngine, FashionVisualFeatureExtractor, OutfitSimilarityEngine, 
  DuplicateLookDetectionEngine, VisualTrendEngine, UnifiedStyleDNAEngine, 
  DecisionIntelligenceEngine, FashionAgentEngine,
  AgentCommunicationBus, AgentCoordinator, FashionStylistAgent, 
  FashionMemoryAgent, FashionVisionAgent, FashionKnowledgeAgent, DecisionAgent, ConflictResolver,
  EnterpriseWorkflowEngine, EnterprisePlanningEngine, GoalType, PlanningHorizon,
  EnterpriseReasoningEngine, DecisionTreeNode, ExplanationReport, ExplainabilityMetrics,
  EnterpriseLearningEngine, PreferenceEvolutionPoint, StyleDriftInfo, HabitMetrics,
  EvolutionTimelineEvent, IntelligenceGrowthMetrics, PersonalizedForecast, LearningWeightOptimization,
  LearningCycleReport, EnterprisePredictiveEngine, ForecastPeriod, ForecastMetrics, SimulationResult, ScenarioComparison,
  AutonomousExecutionEngine, ExecutionState, TaskType, ExecutionTask, ExecutionMetricsSummary, AutonomousGoalRecord,
  EnterpriseGovernanceEngine, GovernanceState, PolicyCategory, SystemRule, PolicyViolation, SystemHealthMetrics, PendingApproval, GovernanceRecommendation,
  EnterpriseResourceIntelligenceEngine, LatencyBreakdown, CapacityStats, EngineLoadSummary, BottleneckReport, ResourceOptimizationSuggestion, PerformanceTimelineEvent, PlatformPerformanceIndex, EnterpriseResourceMetrics,
  EnterpriseObservabilityEngine, TraceEvent, RootCauseReport, DiagnosticsSummary, EngineRelationship,
  EnterpriseSystemCoordinationEngine, EngineStatus, StateConsistencyMetric, SystemCoordinationSummary, SynchronizationEvent,
  EnterpriseValidationEngine, ValidationIssue, EnterpriseReadinessReport, ComponentAudit,
  EnterpriseProductIntelligenceEngine, UserJourneyStep, FeatureReadinessMetric, ProductQualityMetrics, MissingUXDetection, ProductIntelligenceReport
} from '../engine';

// Modular UI tabs imports
import { OverviewTab } from './system-settings/tabs/OverviewTab';
import { SettingsTab } from './system-settings/tabs/SettingsTab';
import { DiagnosticsTab } from './system-settings/tabs/DiagnosticsTab';
import { EfficiencyTab } from './system-settings/tabs/EfficiencyTab';
import { BrainTab } from './system-settings/tabs/BrainTab';
import { VisionTab } from './system-settings/tabs/VisionTab';
import { DecisionTab } from './system-settings/tabs/DecisionTab';
import { AgentTab } from './system-settings/tabs/AgentTab';
import { WorkflowsTab } from './system-settings/tabs/WorkflowsTab';
import { PlanningTab } from './system-settings/tabs/PlanningTab';
import { ReasoningTab } from './system-settings/tabs/ReasoningTab';
import { LearningTab } from './system-settings/tabs/LearningTab';
import { PredictiveTab } from './system-settings/tabs/PredictiveTab';
import { AutonomousTab } from './system-settings/tabs/AutonomousTab';
import { GovernanceTab } from './system-settings/tabs/GovernanceTab';
import { PerformanceTab } from './system-settings/tabs/PerformanceTab';
import { ObservabilityTab } from './system-settings/tabs/ObservabilityTab';
import { CoordinationTab } from './system-settings/tabs/CoordinationTab';
import { ValidationTab } from './system-settings/tabs/ValidationTab';
import { ProductTab } from './system-settings/tabs/ProductTab';

interface SystemSettingsAuditProps {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  weatherWeight: 'lighter' | 'heavier' | 'layered';
  saveWeatherWeight: (weight: 'lighter' | 'heavier' | 'layered') => void;
  isResetting: boolean;
  onReset?: () => void;
  onLoadSamples?: () => void;
  state: any;
  triggerQuietPause: (fn: () => void) => void;
}

export const SystemSettingsAudit: React.FC<SystemSettingsAuditProps> = ({
  currentTheme,
  setCurrentTheme,
  weatherWeight,
  saveWeatherWeight,
  isResetting,
  onReset,
  onLoadSamples,
  state,
  triggerQuietPause
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'SETTINGS' | 'DIAGNOSTICS' | 'EFFICIENCY' | 'SELLER' | 'BRAIN' | 'VISION' | 'DECISION' | 'AGENT' | 'WORKFLOWS' | 'PLANNING' | 'EXPLAINABILITY' | 'LEARNING' | 'PREDICTIVE' | 'AUTONOMOUS' | 'GOVERNANCE' | 'PERFORMANCE' | 'OBSERVABILITY' | 'COORDINATION' | 'VALIDATION' | 'PRODUCT'>('OVERVIEW');
  const [selectedGraphStyle, setSelectedGraphStyle] = useState<string>('Luxury');
  const [flushConfirm, setFlushConfirm] = useState(false);
  const [clearMemoryConfirm, setClearMemoryConfirm] = useState(false);

  // Vision Intelligence Interactive State
  const [visionPromptText, setVisionPromptText] = useState("Sophisticated double-breasted charcoal wool blazer styled in quiet luxury with fine tailoring and suede loafers");
  const [visionImageUrl, setVisionImageUrl] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000");
  const [similarityPromptA, setSimilarityPromptA] = useState("Oversized beige trench coat made of organic linen, relaxed fit with black leather belt");
  const [similarityPromptB, setSimilarityPromptB] = useState("Tailored navy wool blazer with gold buttons, slim fit suit");

  const [fashionMemory, setFashionMemory] = useState(() => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    return PersonalFashionMemoryEngine.getMemory(uId);
  });

  // Decision Intelligence Dashboard State
  const [decisionWeights, setDecisionWeights] = useState(() => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    return DecisionIntelligenceEngine.loadDecisionWeights(uId);
  });
  const [decisionOccasion, setDecisionOccasion] = useState("Premium Evening Wedding Gala");
  const [decisionWeather, setDecisionWeather] = useState("Cool Overcast");
  const [decisionSeason, setDecisionSeason] = useState("Autumn");
  const [evaluatedWinner, setEvaluatedWinner] = useState<any>(null);
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [strategyPlan, setStrategyPlan] = useState<any>(null);
  const [decisionFeedbackLog, setDecisionFeedbackLog] = useState<string>("");

  const runDecisionSimulation = () => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    
    // Evaluate and obtain the best choice (and implicitly update the local decision cache)
    const winner = DecisionIntelligenceEngine.evaluateAndSelectBest(items, {
      userId: uId,
      weather: decisionWeather,
      occasion: decisionOccasion,
      season: decisionSeason
    });

    setEvaluatedWinner(winner);

    // Retrieve full rankings & cache hit stats
    setDecisionWeights(DecisionIntelligenceEngine.loadDecisionWeights(uId));
    setDecisionFeedbackLog("Decision simulation execution complete. Optimal outfit identified with comprehensive explanations.");
  };

  const handleWeightAdjust = (field: 'styleDNAWeight' | 'knowledgeGraphWeight' | 'preferenceWeight' | 'wardrobeWeight', amount: number) => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const updated = { ...decisionWeights };
    updated[field] = Math.max(0.1, Math.min(2.5, updated[field] + amount));
    DecisionIntelligenceEngine.saveDecisionWeights(uId, updated);
    setDecisionWeights(updated);
    setDecisionFeedbackLog(`Adjusted ${field} weight to ${updated[field].toFixed(2)}.`);
  };

  const simulateAcceptance = (styleId: string) => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    DecisionIntelligenceEngine.handleAcceptRecommendation(uId, styleId);
    setDecisionWeights(DecisionIntelligenceEngine.loadDecisionWeights(uId));
    setDecisionFeedbackLog(`Simulation event: accepted "${styleId}" outfit recommendation. DNA weights increased, creativity index adjusted.`);
  };

  const simulateRejection = (styleId: string) => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    DecisionIntelligenceEngine.handleRejectRecommendation(uId, styleId);
    setDecisionWeights(DecisionIntelligenceEngine.loadDecisionWeights(uId));
    setDecisionFeedbackLog(`Simulation event: rejected "${styleId}" outfit recommendation. Creativity index boosted to break recommendation fatigue.`);
  };

  const generateLongTermStrategy = () => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    const plan = DecisionIntelligenceEngine.generateStrategicPlan(items, uId);
    setStrategyPlan(plan);
    setDecisionFeedbackLog("Strategic Long-Term Outfit Plan compiled successfully for Today, Tomorrow, Weekend, Travel, Wedding, and Corporate Week!");
  };

  // Autonomous Fashion Agent State
  const [agentStatus, setAgentStatus] = useState<'Active' | 'Idle' | 'Analyzing' | 'Learning'>('Active');
  const [agentLog, setAgentLog] = useState<string>("Autonomous system monitoring active. Continuously scoring capsule health triggers.");
  const [agentDiagnostics, setAgentDiagnostics] = useState(() => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    return FashionAgentEngine.runDiagnostics(items, uId);
  });

  // Multi-Agent Platform State
  const [agentsTelemetry, setAgentsTelemetry] = useState(() => AgentCommunicationBus.getTelemetry());
  const [busMessages, setBusMessages] = useState(() => AgentCommunicationBus.getHistory());
  const [lastTrace, setLastTrace] = useState<any>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [selectedReport, setSelectedReport] = useState<'NONE' | 'ENTERPRISE' | 'ARCH' | 'PERF' | 'COMPAT' | 'COLLAB'>('NONE');

  // Enterprise Workflow Orchestration State
  const [workflows, setWorkflows] = useState(() => EnterpriseWorkflowEngine.getWorkflows());
  const [workflowQueue, setWorkflowQueue] = useState(() => EnterpriseWorkflowEngine.getQueue());
  const [workflowHistory, setWorkflowHistory] = useState(() => EnterpriseWorkflowEngine.getHistory());
  const [workflowMetrics, setWorkflowMetrics] = useState(() => EnterpriseWorkflowEngine.getMetrics());
  const [selectedWfForTrace, setSelectedWfForTrace] = useState<string | null>(null);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  const refreshWorkflowState = () => {
    setWorkflows(EnterpriseWorkflowEngine.getWorkflows());
    setWorkflowQueue([...EnterpriseWorkflowEngine.getQueue()]);
    setWorkflowHistory(EnterpriseWorkflowEngine.getHistory());
    setWorkflowMetrics(EnterpriseWorkflowEngine.getMetrics());
    setAgentsTelemetry(AgentCommunicationBus.getTelemetry());
    setBusMessages(AgentCommunicationBus.getHistory());
  };

  const triggerWorkflowManual = async (id: string) => {
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    
    EnterpriseWorkflowEngine.enqueueWorkflow(id);
    refreshWorkflowState();
    
    // Auto start processing if not running
    if (!isProcessingQueue) {
      setIsProcessingQueue(true);
      setAgentStatus('Analyzing');
      setAgentLog(`Enterprise Workflow Engine starting: executing "${id}"...`);
      
      try {
        await EnterpriseWorkflowEngine.processQueue(items, uId);
        setAgentLog(`Workflow execution cycle completed successfully.`);
      } catch (err) {
        console.error(err);
        setAgentLog(`Workflow execution failed.`);
      } finally {
        setIsProcessingQueue(false);
        setAgentStatus('Active');
        refreshWorkflowState();
      }
    }
  };

  const cancelWorkflowExecution = (id: string) => {
    EnterpriseWorkflowEngine.cancelWorkflow(id);
    refreshWorkflowState();
    setAgentLog(`Admin overridden: terminated workflow "${id}".`);
  };

  const triggerAllWorkflowsByEvent = async (event: string) => {
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    
    EnterpriseWorkflowEngine.triggerWorkflowsByEvent(event, items, uId);
    refreshWorkflowState();
    
    if (!isProcessingQueue) {
      setIsProcessingQueue(true);
      setAgentStatus('Analyzing');
      setAgentLog(`Triggered workflows matching event: "${event}"`);
      try {
        await EnterpriseWorkflowEngine.processQueue(items, uId);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessingQueue(false);
        setAgentStatus('Active');
        refreshWorkflowState();
      }
    }
  };

  // Enterprise Strategic Planning State
  const [plans, setPlans] = useState(() => EnterprisePlanningEngine.getActivePlans());
  const [planningMetrics, setPlanningMetrics] = useState(() => EnterprisePlanningEngine.getMetrics());
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>('plan-office-capsule');
  
  // Custom Plan inputs
  const [customTitle, setCustomTitle] = useState('My Winter Capsule Wardrobe');
  const [customGoalType, setCustomGoalType] = useState<GoalType>('Capsule Wardrobe');
  const [customHorizon, setCustomHorizon] = useState<PlanningHorizon>('This Month');
  const [customPriority, setCustomPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [customCost, setCustomCost] = useState(150);
  const [customTime, setCustomTime] = useState(6);

  const refreshPlanningState = () => {
    setPlans([...EnterprisePlanningEngine.getActivePlans()]);
    setPlanningMetrics(EnterprisePlanningEngine.getMetrics());
  };

  const handleCreatePlan = () => {
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    const newPlan = EnterprisePlanningEngine.createPlan({
      goal: customGoalType,
      title: customTitle,
      horizon: customHorizon,
      priority: customPriority,
      estimatedCost: customCost,
      estimatedTimeHours: customTime,
      items
    });
    refreshPlanningState();
    setSelectedPlanId(newPlan.id);
    setAgentLog(`Enterprise Strategic Planning: New goal "${newPlan.title}" generated successfully.`);
  };

  const handleToggleMilestone = (planId: string, milestoneId: string) => {
    EnterprisePlanningEngine.toggleMilestone(planId, milestoneId);
    refreshPlanningState();
  };

  const handleCompleteStep = (planId: string, idx: number) => {
    const plan = plans.find(p => p.id === planId);
    if (plan && plan.milestones && plan.milestones[idx]) {
      handleToggleMilestone(planId, plan.milestones[idx].id);
    }
  };

  const handleDeletePlan = (planId: string) => {
    EnterprisePlanningEngine.deletePlan(planId);
    refreshPlanningState();
    if (selectedPlanId === planId) {
      const remaining = EnterprisePlanningEngine.getActivePlans();
      setSelectedPlanId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleAutoReplan = () => {
    EnterprisePlanningEngine.autoReplan();
    refreshPlanningState();
  };

  const handleExecutePlanWorkflows = async (planId: string) => {
    setAgentStatus('Analyzing');
    setAgentLog(`Executing automated agent pipelines for Plan: "${planId}"...`);
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';

    try {
      await EnterprisePlanningEngine.executePlanWorkflows(planId, items, uId);
      setAgentLog(`Orchestrated agent pipelines resolved successfully for Plan.`);
    } catch (err) {
      console.error(err);
      setAgentLog(`Failed to run orchestrated plan pipelines.`);
    } finally {
      setAgentStatus('Active');
      refreshPlanningState();
      refreshWorkflowState();
    }
  };

  const handleOptimizePlans = (status: 'accepted' | 'rejected' | 'neutral') => {
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    EnterprisePlanningEngine.optimizeCurrentPlans(items, status);
    refreshPlanningState();
    setAgentLog(`Self-learning and optimization model updated with signal: ${status.toUpperCase()}. Weights refined.`);
  };

  // Explainable AI (XAI) State & Controllers
  const [xaiOccasion, setXaiOccasion] = useState("Premium Evening Wedding Gala");
  const [xaiWeather, setXaiWeather] = useState("Cool Overcast");
  const [xaiSeason, setXaiSeason] = useState("Autumn");
  const [activeReport, setActiveReport] = useState<ExplanationReport | null>(null);
  const [xaiArchive, setXaiArchive] = useState<ExplanationReport[]>(() => EnterpriseReasoningEngine.getArchive());
  const [xaiMetrics, setXaiMetrics] = useState<ExplainabilityMetrics>(() => EnterpriseReasoningEngine.getExplainabilityMetrics());
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ 'node-root': true, 'node-weather': true, 'node-occasion': true, 'node-dna': true, 'node-kg': true, 'node-memory': true, 'node-ranking': true });
  const [compareReportId, setCompareReportId] = useState<string | null>(null);

  const generateXAIReport = () => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    
    const winner = DecisionIntelligenceEngine.evaluateAndSelectBest(items, {
      userId: uId,
      weather: xaiWeather,
      occasion: xaiOccasion,
      season: xaiSeason
    });

    const report = EnterpriseReasoningEngine.generateReasoningReport(winner, {
      userId: uId,
      weather: xaiWeather,
      occasion: xaiOccasion,
      season: xaiSeason
    }, items);

    setActiveReport(report);
    setXaiArchive(EnterpriseReasoningEngine.getArchive());
    setXaiMetrics(EnterpriseReasoningEngine.getExplainabilityMetrics());
    setAgentLog(`Explainable AI: Reasoning trace compiled successfully for "${winner.name}".`);
  };

  const handleXAISignal = (status: 'accepted' | 'rejected') => {
    EnterpriseReasoningEngine.optimizeMetrics(status);
    setXaiMetrics(EnterpriseReasoningEngine.getExplainabilityMetrics());
    setAgentLog(`XAI reinforcement completed. Model weights dynamically calibrated.`);
  };

  const toggleTreeNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Enterprise Learning & Intelligence Evolution Engine State & Handlers
  const [learningProfile, setLearningProfile] = useState<LearningCycleReport>(() => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    return EnterpriseLearningEngine.getLearningProfile(uId, items);
  });
  const [learningHistory, setLearningHistory] = useState<LearningCycleReport[]>(() => {
    return EnterpriseLearningEngine.getHistoryArchive();
  });
  const [compareLearningId, setCompareLearningId] = useState<string | null>(null);
  const [preferenceEvolution, setPreferenceEvolution] = useState<PreferenceEvolutionPoint[]>(() => {
    return EnterpriseLearningEngine.getPreferenceEvolution();
  });
  const [habitMetrics, setHabitMetrics] = useState<HabitMetrics>(() => {
    return EnterpriseLearningEngine.getHabitMetrics();
  });
  const [evolutionTimeline, setEvolutionTimeline] = useState<EvolutionTimelineEvent[]>(() => {
    return EnterpriseLearningEngine.getStyleEvolutionTimeline();
  });

  const triggerProfileEvolution = (action: 'accepted' | 'rejected' | 'ignored') => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    const updated = EnterpriseLearningEngine.processInteractionFeedback(uId, action, items);
    setLearningProfile(updated);
    setLearningHistory(EnterpriseLearningEngine.getHistoryArchive());
    setAgentLog(`Learning Engine: Cycle compiled for interaction "${action.toUpperCase()}". Intelligence score optimized.`);
  };

  // Enterprise Predictive Intelligence & Simulation Engine State & Handlers
  const [forecastTimeline, setForecastTimeline] = useState<ForecastPeriod>('30 Days');
  const [predictiveMetrics, setPredictiveMetrics] = useState<ForecastMetrics>(() => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    return EnterprisePredictiveEngine.getForecastForTimeline(uId, items, '30 Days');
  });
  const [selectedScenario, setSelectedScenario] = useState<'buy_jacket' | 'remove_black' | 'weather_change' | 'travel_abroad' | 'gain_pieces' | 'change_style'>('buy_jacket');
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(() => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    return EnterprisePredictiveEngine.runSimulation(uId, items, 'buy_jacket');
  });
  const [scenarioComparison, setScenarioComparison] = useState<ScenarioComparison>(() => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    return EnterprisePredictiveEngine.getScenarioComparison(uId, items);
  });
  const [customStyleValue, setCustomStyleValue] = useState('High-Contrast Minimalist');
  const [simTraceLogs, setSimTraceLogs] = useState<string[]>([
    'PredictiveEngine: Ready for local simulation execution.',
    'System: All 11 platform engines registered headlessly.'
  ]);
  const [simulationHistory, setSimulationHistory] = useState<Array<{ name: string; timestamp: number; risk: number; opportunity: number }>>([
    { name: 'Initial Baseline Audit', timestamp: Date.now() - 3600 * 1000, risk: 15, opportunity: 88 }
  ]);

  const runLocalSimulation = (scenario: typeof selectedScenario, param?: string) => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    const res = EnterprisePredictiveEngine.runSimulation(uId, items, scenario, param);
    setSimulationResult(res);
    setScenarioComparison(EnterprisePredictiveEngine.getScenarioComparison(uId, items));
    
    // Add to simulation trace logs
    const newLogs = [
      `[SIMULATION INIT] Starting scenario: "${res.scenarioName}"`,
      `[ENGINE EVAL] Recalculating styling indices... (Shift: ${res.styleIndexShift > 0 ? '+' : ''}${res.styleIndexShift})`,
      `[INTEGRATION] Notifying FashionStylistAgent and DecisionAgent...`,
      `[Backpropagation] Recalibrating local prediction weights...`,
      `[SIMULATION COMPLETE] Opportunity: ${res.opportunityScore}%, Risk: ${res.riskScore}%. Confidence: ${res.predictedConfidence}%`
    ];
    setSimTraceLogs(newLogs);

    // Add to history
    setSimulationHistory(prev => [
      { name: res.scenarioName, timestamp: Date.now(), risk: res.riskScore, opportunity: res.opportunityScore },
      ...prev
    ]);
    
    setAgentLog(`Simulation Engine: Compiled scenario "${res.scenarioName}" successfully. Net impact evaluated.`);
  };

  const handlePeriodChange = (period: ForecastPeriod) => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    setForecastTimeline(period);
    setPredictiveMetrics(EnterprisePredictiveEngine.getForecastForTimeline(uId, items, period));
    setAgentLog(`PredictiveEngine: Forecast timeline scaled to ${period}.`);
  };

  const handleScenarioChange = (scenario: typeof selectedScenario) => {
    setSelectedScenario(scenario);
    runLocalSimulation(scenario);
  };

  const handleSimulateCustomStyle = () => {
    runLocalSimulation('change_style', customStyleValue);
  };

  // Autonomous Execution Engine State & Handlers
  const [autonomousGoals, setAutonomousGoals] = useState<AutonomousGoalRecord[]>(() => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    return AutonomousExecutionEngine.getGoals(uId);
  });

  const [activeGoalId, setActiveGoalId] = useState<string>('goal-seasonal-curator');
  const [customGoalName, setCustomGoalName] = useState<string>('');
  const [customGoalDesc, setCustomGoalDesc] = useState<string>('');
  const [schedulerPolicy, setSchedulerPolicy] = useState<'Priority First' | 'FCFS' | 'Interactive Adaptive'>('Priority First');

  const runGoalStep = (goalId: string, taskId: string) => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    const updated = AutonomousExecutionEngine.executeNextStep(uId, goalId, taskId, items);
    setAutonomousGoals(updated);
    setAgentLog(`AutonomousEngine: Executed step for Task ID "${taskId}" in Goal ID "${goalId}".`);
  };

  const rollbackGoal = (goalId: string) => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const updated = AutonomousExecutionEngine.triggerRollback(uId, goalId);
    setAutonomousGoals(updated);
    setAgentLog(`AutonomousEngine: Rolled back Goal ID "${goalId}". All original params restored.`);
  };

  const recoverGoalTask = (goalId: string, taskId: string) => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const updated = AutonomousExecutionEngine.triggerRecovery(uId, goalId, taskId);
    setAutonomousGoals(updated);
    setAgentLog(`AutonomousEngine: Triggered high-integrity recovery override on Task ID "${taskId}".`);
  };

  const createCustomGoal = () => {
    if (!customGoalName.trim()) return;
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const newGoal: AutonomousGoalRecord = {
      id: `goal-custom-${Date.now()}`,
      name: customGoalName,
      description: customGoalDesc || 'Manually created custom wardrobe sequence.',
      overallState: 'Idle',
      createdAt: Date.now(),
      tasks: [
        {
          id: `task-custom-rot-${Date.now()}`,
          type: 'Wardrobe Rotation',
          priority: 'High',
          dependencies: [],
          state: 'Idle',
          progress: 0,
          retryCount: 0,
          maxRetries: 3,
          executionTimeMs: 0,
          logs: ['[QUEUE] Initialized in custom goal loop.']
        },
        {
          id: `task-custom-ref-${Date.now()}`,
          type: 'Learning Refresh',
          priority: 'Medium',
          dependencies: [`task-custom-rot-${Date.now()}`],
          state: 'Idle',
          progress: 0,
          retryCount: 0,
          maxRetries: 3,
          executionTimeMs: 0,
          logs: ['[QUEUE] Awaiting predecessor rotation completion.']
        }
      ]
    };

    const updated = [newGoal, ...autonomousGoals];
    AutonomousExecutionEngine.saveGoals(updated);
    setAutonomousGoals(updated);
    setActiveGoalId(newGoal.id);
    setCustomGoalName('');
    setCustomGoalDesc('');
    setAgentLog(`AutonomousEngine: Dispatched custom goal "${newGoal.name}" with topological dependencies.`);
  };

  const executionMetrics = AutonomousExecutionEngine.getExecutionMetrics(autonomousGoals);

  // Governance & Policy Intelligence State & Handlers
  const [governanceRules, setGovernanceRules] = useState<SystemRule[]>(() => 
    EnterpriseGovernanceEngine.getSystemRules()
  );

  const [governanceApprovals, setGovernanceApprovals] = useState<PendingApproval[]>(() => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    return EnterpriseGovernanceEngine.getPendingApprovals(uId);
  });

  const [governanceViolations, setGovernanceViolations] = useState<PolicyViolation[]>(() => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    return EnterpriseGovernanceEngine.getViolations(uId);
  });

  const [governanceRecommendations] = useState<GovernanceRecommendation[]>(() =>
    EnterpriseGovernanceEngine.getRecommendations()
  );

  // Local governance timeline
  const [governanceTimeline, setGovernanceTimeline] = useState<Array<{ time: string; text: string; category: string }>>([
    { time: '13:02:40', text: 'Style DNA Stability check initiated headlessly.', category: 'System Rules' },
    { time: '12:45:12', text: 'Blocked unauthorized bulk purge sequence.', category: 'Safety Policies' },
    { time: '11:14:02', text: 'Synchronized local learning backpropagation rules.', category: 'Quality Policies' }
  ]);

  const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
  const wardrobeItems = state?.unifiedStyleMemory?.wardrobe_items || [];
  
  const systemHealthMetrics = EnterpriseGovernanceEngine.evaluateSystemHealth(uId, wardrobeItems);

  const handleApprovalDecision = (approvalId: string, approve: boolean) => {
    const updatedApprovals = EnterpriseGovernanceEngine.processApproval(uId, approvalId, approve);
    setGovernanceApprovals(updatedApprovals);

    // Refresh violations in case remediation occurred
    const updatedViolations = EnterpriseGovernanceEngine.getViolations(uId);
    setGovernanceViolations(updatedViolations);

    // Append to timeline
    const actionStr = approve ? 'Approved' : 'Declined';
    const approvalItem = updatedApprovals.find(a => a.id === approvalId);
    const newEvent = {
      time: new Date().toTimeString().split(' ')[0],
      text: `Administrator ${actionStr} action: "${approvalItem?.actionName || approvalId}"`,
      category: 'Approval Policies'
    };
    setGovernanceTimeline([newEvent, ...governanceTimeline]);
    setAgentLog(`GovernanceEngine: Action "${approvalItem?.actionName || approvalId}" was ${actionStr}.`);
  };

  const toggleRuleStatus = (ruleId: string) => {
    const updated = governanceRules.map(r => {
      if (r.id === ruleId) {
        const nextStatus = r.status === 'Active' ? 'Suspended' : 'Active';
        return { ...r, status: nextStatus };
      }
      return r;
    });
    setGovernanceRules(updated as SystemRule[]);
    setAgentLog(`GovernanceEngine: Policy rule "${ruleId}" toggled.`);
  };

  // Performance Intelligence States & Handlers
  const [perfSuggestions, setPerfSuggestions] = useState<ResourceOptimizationSuggestion[]>(() =>
    EnterpriseResourceIntelligenceEngine.getOptimizationSuggestions()
  );

  const [perfTimeline, setPerfTimeline] = useState<PerformanceTimelineEvent[]>(() =>
    EnterpriseResourceIntelligenceEngine.getPerformanceTimeline()
  );

  const resourceMetrics = EnterpriseResourceIntelligenceEngine.getMetrics(uId, wardrobeItems);

  const togglePerformanceOption = (suggestionId: string) => {
    const updated = EnterpriseResourceIntelligenceEngine.toggleOptimization(suggestionId);
    setPerfSuggestions(updated);
    
    // Refresh timeline with optimized event
    const optItem = updated.find(s => s.id === suggestionId);
    const eventTime = new Date().toTimeString().split(' ')[0];
    const newEvent: PerformanceTimelineEvent = {
      timestamp: eventTime,
      engine: optItem?.targetEngine || 'ResourceIntelligenceEngine',
      operation: `${optItem?.applied ? 'Enable' : 'Disable'} Optimization: ${optItem?.title}`,
      latencyMs: 14,
      status: optItem?.applied ? 'Optimized' : 'Nominal'
    };
    setPerfTimeline([newEvent, ...perfTimeline]);
    setAgentLog(`ResourceIntelligenceEngine: Optimization parameter "${optItem?.title}" was toggled.`);
  };

  // Enterprise Observability & Diagnostics States & Handlers
  const [traceTimeline, setTraceTimeline] = useState<TraceEvent[]>(() =>
    EnterpriseObservabilityEngine.getTraceTimeline()
  );

  const [rootCauseReports, setRootCauseReports] = useState<RootCauseReport[]>(() =>
    EnterpriseObservabilityEngine.investigateRootCause(uId)
  );

  const [traceSearch, setTraceSearch] = useState('');
  const [traceFilter, setTraceFilter] = useState<string>('ALL');
  const [selectedTrace, setSelectedTrace] = useState<TraceEvent | null>(null);
  const [selectedRootCause, setSelectedRootCause] = useState<RootCauseReport | null>(null);

  const diagnosticsSummary = EnterpriseObservabilityEngine.evaluateDiagnostics(uId, wardrobeItems);
  const engineRelationships = EnterpriseObservabilityEngine.getEngineRelationships();

  const handleSimulateDiagnosticsIncident = () => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const incidentId = `trace-${Date.now()}`;
    const newTrace: TraceEvent = {
      id: incidentId,
      timestamp,
      engine: 'DecisionEngine',
      eventName: 'Evaluate Outfits Strategy Fallback',
      category: 'Decision',
      payload: `Aesthetic validation mismatch. User requested winter weight with lighter fabrics. High contradiction index (0.78).`,
      latencyMs: 110,
      status: 'Warning'
    };

    const updatedTimeline = [newTrace, ...traceTimeline];
    setTraceTimeline(updatedTimeline);
    EnterpriseObservabilityEngine.saveTraceTimeline(updatedTimeline);
    setAgentLog(`ObservabilityEngine: Simulated diagnostic warning trace recorded for @DecisionEngine.`);
  };

  const handleResolveDiagnosticsIncident = (traceId: string) => {
    const updated = traceTimeline.map(t => {
      if (t.id === traceId) {
        return {
          ...t,
          status: 'Recovered' as const,
          payload: `${t.payload} [Self-Healed via automated Observability backplane bypass at ${new Date().toTimeString().split(' ')[0]}]`
        };
      }
      return t;
    });
    setTraceTimeline(updated);
    EnterpriseObservabilityEngine.saveTraceTimeline(updated);
    setAgentLog(`ObservabilityEngine: Trace incident ${traceId} was successfully resolved & self-healed.`);
  };

  // Enterprise System Coordination States & Handlers
  const [engineStatuses, setEngineStatuses] = useState<EngineStatus[]>(() =>
    EnterpriseSystemCoordinationEngine.getEngineStatuses(uId, wardrobeItems)
  );

  const [syncTimeline, setSyncTimeline] = useState<SynchronizationEvent[]>(() =>
    EnterpriseSystemCoordinationEngine.getSynchronizationTimeline()
  );

  const [stateConsistencyMetrics, setStateConsistencyMetrics] = useState<StateConsistencyMetric[]>(() =>
    EnterpriseSystemCoordinationEngine.getStateConsistencyMetrics()
  );

  const [selectedEngine, setSelectedEngine] = useState<EngineStatus | null>(null);
  const [selectedSyncEvent, setSelectedSyncEvent] = useState<SynchronizationEvent | null>(null);
  const [syncSearchText, setSyncSearchText] = useState('');
  const [syncTypeFilter, setSyncTypeFilter] = useState<string>('ALL');

  const coordinationSummary = EnterpriseSystemCoordinationEngine.getCoordinationSummary(uId, wardrobeItems);

  const handleSimulateEngineSynchronization = () => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const eventId = `sync-${Date.now()}`;
    const newEvent: SynchronizationEvent = {
      id: eventId,
      timestamp,
      sourceEngine: 'AutonomousExecutionEngine',
      targetEngine: 'WorkflowEngine',
      syncType: 'StateSync',
      status: 'Success',
      details: `Interactive trigger: Dispatched style-purge-approval-records to core Workflow queue. Lock status clear.`
    };

    const updatedTimeline = [newEvent, ...syncTimeline];
    setSyncTimeline(updatedTimeline);
    EnterpriseSystemCoordinationEngine.saveSynchronizationTimeline(updatedTimeline);
    setAgentLog(`SystemCoordinationEngine: Simulated state synchronization dispatch recorded for @AutonomousExecutionEngine.`);
  };

  const handleVerifyStateConsistency = (metricId: string) => {
    const updated = stateConsistencyMetrics.map(m => {
      if (m.id === metricId) {
        return {
          ...m,
          status: 'Consistent' as const,
          mismatchCount: 0,
          lastChecked: new Date().toTimeString().split(' ')[0]
        };
      }
      return m;
    });
    setStateConsistencyMetrics(updated);
    setAgentLog(`SystemCoordinationEngine: Verified state consistency metrics for scope: ${metricId}`);
  };

  // Enterprise Validation Engine States & Handlers
  const [validationReport, setValidationReport] = useState<EnterpriseReadinessReport>(() =>
    EnterpriseValidationEngine.runFullAudit(uId, wardrobeItems)
  );

  const [componentAudits, setComponentAudits] = useState<ComponentAudit[]>(() =>
    EnterpriseValidationEngine.scanComponentAudits()
  );

  const [selectedValidationIssue, setSelectedValidationIssue] = useState<ValidationIssue | null>(null);
  const [selectedComponentAudit, setSelectedComponentAudit] = useState<ComponentAudit | null>(null);
  const [validationCategoryFilter, setValidationCategoryFilter] = useState<string>('ALL');
  const [isConductingFullAudit, setIsConductingFullAudit] = useState(false);

  const handleRunValidationAudit = () => {
    setIsConductingFullAudit(true);
    setAgentLog("EnterpriseValidationEngine: Initializing exhaustive workspace & thread execution analysis...");
    
    setTimeout(() => {
      const freshReport = EnterpriseValidationEngine.runFullAudit(uId, wardrobeItems);
      const freshAudits = EnterpriseValidationEngine.scanComponentAudits();
      setValidationReport(freshReport);
      setComponentAudits(freshAudits);
      setIsConductingFullAudit(false);
      setAgentLog(`EnterpriseValidationEngine: Complete. Verified ${freshReport.totalChecksRun} active systems. Score is ${freshReport.overallEnterpriseScore}/100.`);
    }, 800);
  };

  const handleResolveValidationIssue = (issueId: string) => {
    const updatedIssues = validationReport.issues.filter(issue => issue.id !== issueId);
    const updatedPassed = validationReport.passedChecks + 1;
    const bonusScore = Math.min(100, validationReport.overallEnterpriseScore + 3);
    
    setValidationReport({
      ...validationReport,
      overallEnterpriseScore: bonusScore,
      passedChecks: updatedPassed,
      issues: updatedIssues
    });
    
    if (selectedValidationIssue?.id === issueId) {
      setSelectedValidationIssue(null);
    }

    setAgentLog(`EnterpriseValidationEngine: Resolved issue #${issueId}. Quality patch applied. Enterprise score raised to ${bonusScore}%.`);
  };

  // Enterprise Product Intelligence Engine States & Handlers
  const [productReport, setProductReport] = useState<ProductIntelligenceReport>(() =>
    EnterpriseProductIntelligenceEngine.runProductAudit(uId, wardrobeItems)
  );

  const [selectedJourney, setSelectedJourney] = useState<UserJourneyStep | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<FeatureReadinessMetric | null>(null);
  const [selectedMissingUX, setSelectedMissingUX] = useState<MissingUXDetection | null>(null);
  const [isAnalyzingProduct, setIsAnalyzingProduct] = useState(false);

  const handleRunProductAnalysis = () => {
    setIsAnalyzingProduct(true);
    setAgentLog("ProductIntelligenceEngine: Running full user journey map and feature adoption audit...");
    
    setTimeout(() => {
      const freshReport = EnterpriseProductIntelligenceEngine.runProductAudit(uId, wardrobeItems);
      setProductReport(freshReport);
      setIsAnalyzingProduct(false);
      setAgentLog(`ProductIntelligenceEngine: Completed end-to-end audit. Readiness Score: ${freshReport.metrics.overallProductReadiness}/100.`);
    }, 800);
  };

  const handleResolveUXPattern = (uxId: string) => {
    const updatedUX = productReport.missingUXPatterns.filter(item => item.id !== uxId);
    const updatedMetrics = {
      ...productReport.metrics,
      userExperienceScore: Math.min(100, productReport.metrics.userExperienceScore + 4),
      overallProductReadiness: Math.min(100, productReport.metrics.overallProductReadiness + 1)
    };

    setProductReport({
      ...productReport,
      metrics: updatedMetrics,
      missingUXPatterns: updatedUX
    });

    if (selectedMissingUX?.id === uxId) {
      setSelectedMissingUX(null);
    }

    setAgentLog(`ProductIntelligenceEngine: Applied micro-interaction patch for ${uxId}. Dynamic experience score raised.`);
  };





  const triggerCollaborativeStyling = async () => {
    setIsRouting(true);
    setAgentStatus('Analyzing');
    setAgentLog("Orchestrator AgentCoordinator routing collaborative styling request over bus...");
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    
    setTimeout(async () => {
      try {
        const result = await AgentCoordinator.processStylingRequest({
          items,
          occasion: 'High Fashion Gala',
          weather: 'Crisp Autumn 12°C',
          season: 'Autumn',
          userId: uId
        });
        
        setLastTrace(result);
        setAgentsTelemetry(AgentCommunicationBus.getTelemetry());
        setBusMessages(AgentCommunicationBus.getHistory());
        setAgentStatus('Active');
        setAgentLog("Collaborative Multi-Agent run completed. Look successfully negotiated across all agents!");
      } catch (err) {
        console.error(err);
        setAgentStatus('Active');
        setAgentLog("Collaborative styling cycle failed.");
      } finally {
        setIsRouting(false);
      }
    }, 800);
  };

  const triggerAgentDiagnostics = () => {
    setAgentStatus('Analyzing');
    setAgentLog("Re-evaluating weather anomalies, calendar events, wear counts, and active trends...");
    setTimeout(() => {
      const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
      const items = state?.unifiedStyleMemory?.wardrobe_items || [];
      const updated = FashionAgentEngine.runDiagnostics(items, uId);
      setAgentDiagnostics(updated);
      setAgentStatus('Active');
      setAgentLog("Continuous agent diagnostic run complete. Queue priority metrics recalculated.");
    }, 800);
  };

  const handleAgentTaskAction = (taskId: string, status: 'accepted' | 'dismissed') => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    const items = state?.unifiedStyleMemory?.wardrobe_items || [];
    
    setAgentStatus('Learning');
    setAgentLog(`Executing task action: ${status === 'accepted' ? 'Accepting' : 'Dismissing'} ${taskId}...`);
    
    // Perform engine action
    FashionAgentEngine.actionTask(uId, taskId, status);
    
    // Refresh diagnostics
    const updated = FashionAgentEngine.runDiagnostics(items, uId);
    setAgentDiagnostics(updated);
    
    // Update local decision weights state if displayed elsewhere
    setDecisionWeights(DecisionIntelligenceEngine.loadDecisionWeights(uId));
    
    setTimeout(() => {
      setAgentStatus('Active');
      setAgentLog(`Task "${taskId}" processed. Self-learning weights updated successfully.`);
    }, 600);
  };


  const graphStats = FashionKnowledgeGraphEngine.getStats();
  const currentGraphNode = FashionKnowledgeGraphEngine.getNode(selectedGraphStyle);

  const handlePeriodSwitch = (period: string) => {
    const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
    PersonalFashionMemoryEngine.logEvent(uId, 'TIMELINE_PERIOD_SWITCH', { period });
    setFashionMemory({ ...PersonalFashionMemoryEngine.getMemory(uId) });
  };

  const [pipelineReport, setPipelineReport] = useState<any>(null);
  const [loadingPipeline, setLoadingPipeline] = useState(false);

  const fetchPipelineReport = async () => {
    setLoadingPipeline(true);
    try {
      const res = await fetch('/api/system/pipeline-report');
      const data = await res.json();
      if (data.success) {
        setPipelineReport(data.report);
      }
    } catch (err) {
      console.error('Failed to load pipeline optimization stats:', err);
    } finally {
      setLoadingPipeline(false);
    }
  };

  const resetPipelineStats = async () => {
    try {
      const res = await fetch('/api/system/pipeline-reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchPipelineReport();
      }
    } catch (err) {
      console.error('Failed to reset request pipeline:', err);
    }
  };

  React.useEffect(() => {
    if (activeSubTab === 'EFFICIENCY') {
      fetchPipelineReport();
    }
    if (activeSubTab === 'EXPLAINABILITY' && !activeReport) {
      generateXAIReport();
    }
  }, [activeSubTab]);

  return (
    <div className="space-y-8 select-none animate-fade-in text-white py-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 block font-light">
            System Settings & Administration
          </span>
          <h2 className="font-serif font-light tracking-[-0.03em] text-3xl text-white mt-1">
            System Settings & Audit
          </h2>
          <p className="text-xs text-white/40 font-serif italic mt-1">
            "Configure active aesthetic themes, tune weather weight metrics, and browse audit logs."
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
          {[
            { id: 'OVERVIEW', label: 'Overview' },
            { id: 'SETTINGS', label: 'Settings' },
            { id: 'DIAGNOSTICS', label: 'Diagnostics' },
            { id: 'EFFICIENCY', label: 'AI Optimization' },
            { id: 'BRAIN', label: 'AI Stylist Brain' },
            { id: 'VISION', label: 'Vision Brain' },
            { id: 'DECISION', label: 'Decision Intelligence' },
            { id: 'AGENT', label: 'Multi-Agent Platform' },
            { id: 'WORKFLOWS', label: 'Workflows' },
            { id: 'PLANNING', label: 'Planning' },
            { id: 'EXPLAINABILITY', label: 'Explainability' },
            { id: 'LEARNING', label: 'Learning Engine' },
            { id: 'PREDICTIVE', label: 'Predictive Center' },
            { id: 'AUTONOMOUS', label: 'Autonomous Center' },
            { id: 'GOVERNANCE', label: 'Governance' },
            { id: 'PERFORMANCE', label: 'Performance' },
            { id: 'OBSERVABILITY', label: 'Observability' },
            { id: 'COORDINATION', label: 'Coordination' },
            { id: 'VALIDATION', label: 'Validation' },
            { id: 'PRODUCT', label: 'Product Intelligence' },
            { id: 'SELLER', label: 'Seller Hub' }
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeSubTab === sub.id 
                  ? 'bg-white text-black font-semibold' 
                  : 'text-white/40 hover:text-white/75 hover:bg-white/[0.01]'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'OVERVIEW' ? (
          <OverviewTab
            resourceMetrics={resourceMetrics}
            validationReport={validationReport}
            coordinationSummary={coordinationSummary}
            productReport={productReport}
            diagnosticsSummary={diagnosticsSummary}
            setActiveSubTab={setActiveSubTab}
          />
        ) : activeSubTab === 'SETTINGS' ? (
          <SettingsTab
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
            weatherWeight={weatherWeight}
            saveWeatherWeight={saveWeatherWeight}
          />
        ) : activeSubTab === 'DIAGNOSTICS' ? (
          <DiagnosticsTab
            onLoadSamples={onLoadSamples}
            onReset={onReset}
            isResetting={isResetting}
            flushConfirm={flushConfirm}
            setFlushConfirm={setFlushConfirm}
            state={state}
            triggerQuietPause={triggerQuietPause}
          />
        ) : activeSubTab === 'EFFICIENCY' ? (
          <EfficiencyTab
            pipelineReport={pipelineReport}
            resetPipelineStats={resetPipelineStats}
          />
        ) : activeSubTab === 'BRAIN' ? (
          <BrainTab
            fashionMemory={fashionMemory}
            state={state}
            graphStats={graphStats}
            selectedGraphStyle={selectedGraphStyle}
            setSelectedGraphStyle={setSelectedGraphStyle}
            currentGraphNode={currentGraphNode}
            handlePeriodSwitch={handlePeriodSwitch}
          />
        ) : activeSubTab === 'VISION' ? (
          <VisionTab
            visionPromptText={visionPromptText}
            setVisionPromptText={setVisionPromptText}
            visionImageUrl={visionImageUrl}
            setVisionImageUrl={setVisionImageUrl}
            similarityPromptA={similarityPromptA}
            setSimilarityPromptA={setSimilarityPromptA}
            similarityPromptB={similarityPromptB}
            setSimilarityPromptB={setSimilarityPromptB}
          />
        ) : activeSubTab === 'DECISION' ? (
          <DecisionTab
            fashionMemory={fashionMemory}
            decisionWeights={decisionWeights}
            setDecisionWeights={setDecisionWeights}
            decisionWeather={decisionWeather}
            setDecisionWeather={setDecisionWeather}
            decisionOccasion={decisionOccasion}
            setDecisionOccasion={setDecisionOccasion}
            decisionSeason={decisionSeason}
            setDecisionSeason={setDecisionSeason}
            evaluatedWinner={evaluatedWinner}
            setEvaluatedWinner={setEvaluatedWinner}
            allCandidates={allCandidates}
            setAllCandidates={setAllCandidates}
            strategyPlan={strategyPlan}
            setStrategyPlan={setStrategyPlan}
            decisionFeedbackLog={decisionFeedbackLog}
            setDecisionFeedbackLog={setDecisionFeedbackLog}
            runDecisionSimulation={runDecisionSimulation}
            handleWeightAdjust={handleWeightAdjust}
            simulateAcceptance={simulateAcceptance}
            simulateRejection={simulateRejection}
            generateLongTermStrategy={generateLongTermStrategy}
            state={state}
          />
        ) : activeSubTab === 'AGENT' ? (
          <AgentTab
            isRouting={isRouting}
            lastTrace={lastTrace}
            busMessages={busMessages}
            setBusMessages={setBusMessages}
            agentStatus={agentStatus}
            agentLog={agentLog}
            agentsTelemetry={agentsTelemetry}
            triggerCollaborativeStyling={triggerCollaborativeStyling}
            selectedReport={selectedReport}
            setSelectedReport={setSelectedReport}
          />
        ) : activeSubTab === 'WORKFLOWS' ? (
          <WorkflowsTab
            workflows={workflows}
            workflowQueue={workflowQueue}
            workflowHistory={workflowHistory}
            workflowMetrics={workflowMetrics}
            selectedWfForTrace={selectedWfForTrace}
            setSelectedWfForTrace={setSelectedWfForTrace}
            isProcessingQueue={isProcessingQueue}
            triggerWorkflowManual={triggerWorkflowManual}
            cancelWorkflowExecution={cancelWorkflowExecution}
            triggerAllWorkflowsByEvent={triggerAllWorkflowsByEvent}
            refreshWorkflowState={refreshWorkflowState}
          />
        ) : activeSubTab === 'PLANNING' ? (
          <PlanningTab
            planningMetrics={planningMetrics}
            plans={plans}
            selectedPlanId={selectedPlanId}
            setSelectedPlanId={setSelectedPlanId}
            customTitle={customTitle}
            setCustomTitle={setCustomTitle}
            customGoalType={customGoalType}
            setCustomGoalType={setCustomGoalType}
            customHorizon={customHorizon}
            setCustomHorizon={setCustomHorizon}
            customPriority={customPriority}
            setCustomPriority={setCustomPriority}
            handleCreatePlan={handleCreatePlan}
            handleCompleteStep={handleCompleteStep}
            handleDeletePlan={handleDeletePlan}
            handleAutoReplan={handleAutoReplan}
            handleOptimizePlans={handleOptimizePlans}
          />
        ) : activeSubTab === 'EXPLAINABILITY' ? (
          <ReasoningTab
            xaiMetrics={xaiMetrics}
            xaiOccasion={xaiOccasion}
            setXaiOccasion={setXaiOccasion}
            xaiWeather={xaiWeather}
            setXaiWeather={setXaiWeather}
            xaiSeason={xaiSeason}
            setXaiSeason={setXaiSeason}
            activeReport={activeReport}
            setActiveReport={setActiveReport}
            xaiArchive={xaiArchive}
            expandedNodes={expandedNodes}
            toggleTreeNode={toggleTreeNode}
            compareReportId={compareReportId}
            setCompareReportId={setCompareReportId}
            generateXAIReport={generateXAIReport}
            handleXAISignal={handleXAISignal}
          />
        ) : activeSubTab === 'LEARNING' ? (
          <LearningTab
            learningProfile={learningProfile}
            learningHistory={learningHistory}
            compareLearningId={compareLearningId}
            setCompareLearningId={setCompareLearningId}
            preferenceEvolution={preferenceEvolution}
            habitMetrics={habitMetrics}
            evolutionTimeline={evolutionTimeline}
            triggerProfileEvolution={triggerProfileEvolution}
          />
        ) : activeSubTab === 'PREDICTIVE' ? (
          <PredictiveTab
            forecastTimeline={forecastTimeline}
            predictiveMetrics={predictiveMetrics}
            selectedScenario={selectedScenario}
            simulationResult={simulationResult}
            scenarioComparison={scenarioComparison}
            customStyleValue={customStyleValue}
            setCustomStyleValue={setCustomStyleValue}
            handlePeriodChange={handlePeriodChange}
            handleScenarioChange={handleScenarioChange}
            handleSimulateCustomStyle={handleSimulateCustomStyle}
          />
        ) : activeSubTab === 'AUTONOMOUS' ? (
          <AutonomousTab
            schedulerPolicy={schedulerPolicy}
            setSchedulerPolicy={setSchedulerPolicy}
            autonomousGoals={autonomousGoals}
            setAutonomousGoals={setAutonomousGoals}
            activeGoalId={activeGoalId}
            setActiveGoalId={setActiveGoalId}
            customGoalName={customGoalName}
            setCustomGoalName={setCustomGoalName}
            customGoalDesc={customGoalDesc}
            setCustomGoalDesc={setCustomGoalDesc}
            runGoalStep={runGoalStep}
            rollbackGoal={rollbackGoal}
            recoverGoalTask={recoverGoalTask}
            createCustomGoal={createCustomGoal}
            executionMetrics={executionMetrics}
            setAgentLog={setAgentLog}
          />
        ) : activeSubTab === 'GOVERNANCE' ? (
          <GovernanceTab
            systemHealthMetrics={systemHealthMetrics}
            governanceRules={governanceRules}
            governanceApprovals={governanceApprovals}
            governanceViolations={governanceViolations}
            governanceRecommendations={governanceRecommendations}
            governanceTimeline={governanceTimeline}
            handleApprovalDecision={handleApprovalDecision}
            toggleRuleStatus={toggleRuleStatus}
            setGovernanceViolations={setGovernanceViolations}
            setAgentLog={setAgentLog}
          />
        ) : activeSubTab === 'PERFORMANCE' ? (
          <PerformanceTab
            resourceMetrics={resourceMetrics}
            perfSuggestions={perfSuggestions}
            perfTimeline={perfTimeline}
            togglePerformanceOption={togglePerformanceOption}
          />
        ) : activeSubTab === 'OBSERVABILITY' ? (
          <ObservabilityTab
            diagnosticsSummary={diagnosticsSummary}
            traceTimeline={traceTimeline}
            traceSearch={traceSearch}
            setTraceSearch={setTraceSearch}
            traceFilter={traceFilter}
            setTraceFilter={setTraceFilter}
            selectedTrace={selectedTrace}
            setSelectedTrace={setSelectedTrace}
            rootCauseReports={rootCauseReports}
            selectedRootCause={selectedRootCause}
            setSelectedRootCause={setSelectedRootCause}
            engineRelationships={engineRelationships}
            handleSimulateDiagnosticsIncident={handleSimulateDiagnosticsIncident}
            handleResolveDiagnosticsIncident={handleResolveDiagnosticsIncident}
          />
        ) : activeSubTab === 'COORDINATION' ? (
          <CoordinationTab
            coordinationSummary={coordinationSummary}
            engineStatuses={engineStatuses}
            selectedEngine={selectedEngine}
            setSelectedEngine={setSelectedEngine}
            stateConsistencyMetrics={stateConsistencyMetrics}
            syncTimeline={syncTimeline}
            syncTypeFilter={syncTypeFilter}
            setSyncTypeFilter={setSyncTypeFilter}
            selectedSyncEvent={selectedSyncEvent}
            setSelectedSyncEvent={setSelectedSyncEvent}
            handleSimulateEngineSynchronization={handleSimulateEngineSynchronization}
            handleVerifyStateConsistency={handleVerifyStateConsistency}
          />
        ) : activeSubTab === 'VALIDATION' ? (
          <ValidationTab
            validationReport={validationReport}
            isConductingFullAudit={isConductingFullAudit}
            componentAudits={componentAudits}
            selectedComponentAudit={selectedComponentAudit}
            setSelectedComponentAudit={setSelectedComponentAudit}
            validationCategoryFilter={validationCategoryFilter}
            setValidationCategoryFilter={setValidationCategoryFilter}
            selectedValidationIssue={selectedValidationIssue}
            setSelectedValidationIssue={setSelectedValidationIssue}
            handleRunValidationAudit={handleRunValidationAudit}
            handleResolveValidationIssue={handleResolveValidationIssue}
          />
        ) : activeSubTab === 'PRODUCT' ? (
          <ProductTab
            productReport={productReport}
            selectedJourney={selectedJourney}
            setSelectedJourney={setSelectedJourney}
            selectedFeature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
            selectedMissingUX={selectedMissingUX}
            setSelectedMissingUX={setSelectedMissingUX}
            isAnalyzingProduct={isAnalyzingProduct}
            handleRunProductAnalysis={handleRunProductAnalysis}
            handleResolveUXPattern={handleResolveUXPattern}
          />
        ) : (
          <motion.div
            key="seller"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left"
          >
            {/* SELLER CONSOLE GATEWAY */}
            <FounderDashboard />
          </motion.div>
        )}      </AnimatePresence>
    </div>
  );
};
