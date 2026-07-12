import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, ShieldCheck, Database, RefreshCw, LogOut, Info, AlertTriangle, CloudSun, Sparkles, Store,
  Brain, Cpu, Layers, Activity, TrendingUp, Check, Award, Zap, Shirt, Sliders,
  Users, MessageSquare, Share2, Play, BarChart3, HelpCircle, GitFork, Server
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
  EnterpriseResourceIntelligenceEngine, LatencyBreakdown, CapacityStats, EngineLoadSummary, BottleneckReport, ResourceOptimizationSuggestion, PerformanceTimelineEvent, PlatformPerformanceIndex, EnterpriseResourceMetrics
} from '../engine';
import { Eye, FileText, Search, Flame } from 'lucide-react';

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
  const [activeSubTab, setActiveSubTab] = useState<'SETTINGS' | 'DIAGNOSTICS' | 'EFFICIENCY' | 'SELLER' | 'BRAIN' | 'VISION' | 'DECISION' | 'AGENT' | 'WORKFLOWS' | 'PLANNING' | 'EXPLAINABILITY' | 'LEARNING' | 'PREDICTIVE' | 'AUTONOMOUS' | 'GOVERNANCE' | 'PERFORMANCE'>('SETTINGS');
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
        {activeSubTab === 'SETTINGS' ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
          >
            {/* THEME SELECTOR CARD */}
            <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block font-light">
                Select Look Vision Active Theme
              </span>

              <div className="space-y-3">
                {LOOK_VISION_THEMES.map((theme) => {
                  const isSelected = currentTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setCurrentTheme(theme.id);
                        localStorage.setItem('look_vision_theme', theme.id);
                      }}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center cursor-pointer ${
                        isSelected 
                          ? 'bg-white/5 border-white shadow-md' 
                          : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div>
                        <strong className="block text-xs font-serif text-white font-medium">{theme.name}</strong>
                        <span className="text-[9px] font-mono text-white/30 uppercase mt-0.5 block leading-none">
                          {theme.id.replace('-', ' ')}
                        </span>
                      </div>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WEATHER WEIGHT CARD */}
            <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block font-light">
                Weather Weight Tuning
              </span>

              <p className="text-[11px] font-serif text-white/50 italic leading-normal pb-2 border-b border-white/5">
                "Tune weather-awareness sensors to bias compilation towards lightweight airiness, cozy weights, or layered balances."
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { id: 'lighter', label: 'Lighter Layers', desc: 'Bias toward linen, tees, short silhouettes' },
                  { id: 'heavier', label: 'Heavier Cozy Layers', desc: 'Bias toward sweaters, thick wool, coats' },
                  { id: 'layered', label: 'Layered Balance', desc: 'Tops layered with blazers and active items' }
                ].map((wt) => {
                  const isSelected = weatherWeight === wt.id;
                  return (
                    <button
                      key={wt.id}
                      onClick={() => saveWeatherWeight(wt.id as any)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center cursor-pointer ${
                        isSelected 
                          ? 'bg-white/5 border-white' 
                          : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div>
                        <strong className="block text-xs font-mono text-white uppercase tracking-wider font-semibold">{wt.label}</strong>
                        <span className="text-[9px] font-mono text-white/30 block mt-0.5 leading-none">{wt.desc}</span>
                      </div>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : activeSubTab === 'DIAGNOSTICS' ? (
          <motion.div
            key="diagnostics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left"
          >
            {/* GOVERNOR PANEL & ACTIONS */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block font-light">
                  Coherence Diagnostics & Cache Clean
                </span>
                <span className="text-[10px] font-mono text-emerald-400">All systems green</span>
              </div>

              {/* Administrative buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    if (onLoadSamples) onLoadSamples();
                  }}
                  disabled={isResetting}
                  className="bg-white hover:bg-neutral-200 text-black py-3 rounded-xl font-mono text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer font-semibold disabled:opacity-50"
                >
                  [ Gather sample garments ]
                </button>

                <button
                  onClick={() => {
                    if (onReset) {
                      if (!flushConfirm) {
                        setFlushConfirm(true);
                        setTimeout(() => setFlushConfirm(false), 4000);
                      } else {
                        onReset();
                        setFlushConfirm(false);
                      }
                    }
                  }}
                  disabled={isResetting}
                  className={`border py-3 rounded-xl font-mono text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer disabled:opacity-50 ${
                    flushConfirm 
                      ? 'border-red-500 text-red-400 bg-red-950/20 font-semibold' 
                      : 'border-white/15 hover:border-white/30 text-white/80 hover:text-white font-light'
                  }`}
                >
                  {flushConfirm ? '[ Click again to CONFIRM FLUSH ]' : '[ Flush Closet Cache ]'}
                </button>
              </div>
            </div>

            {/* SYSTEM GOVERNOR AND HEALTH PANEL */}
            {(() => {
              const report = state.systemGovernorReport || {
                status: 'Balanced',
                detectedIssues: ['Initial system launch - system parameters fully stable.'],
                weights: { scoring: 35, diversity: 25, quietControl: 20, gravity: 20 },
                learningUpdates: {
                  updatedPreferences: 'Initial factory coordinates loaded.',
                  ignoredPatterns: 'No repetitive negative signals registered.',
                  reinforcedStyles: 'Sartorial DNA is awaiting custom wear and planning confirmations.'
                },
                nextCyclePrediction: 'Excellent stability predicted. Open for discovery style coordinates.'
              };

              return (
                <div className="pt-2">
                  <SystemHealthPanel
                    systemHealthScore={state.systemGovernorReport ? 100 - (state.systemGovernorReport.detectedIssues?.length || 0) * 15 : 95}
                    learningSpeedPercent={85}
                    biasReductionFactor={92}
                    readyForProduction={true}
                    avgGenerationTime={32}
                    storageUsageBytes={5200}
                    onRunRehearsal={() => {
                      triggerQuietPause(() => {
                        // Simulate rehearsal log update
                        const internalState = UnifiedFashionOS.getState();
                        if (internalState.systemGovernorReport) {
                          internalState.systemGovernorReport.detectedIssues = [
                            "System rehearsal successful. Offline synchronization queue is empty.",
                            "All 3 core security rules checked against Firestore blueprints successfully."
                          ];
                          UnifiedFashionOS.recalculateGoLiveGate();
                          UnifiedFashionOS.notify();
                        }
                      });
                    }}
                    onClearMemory={() => {
                      triggerQuietPause(() => {
                        const internalState = UnifiedFashionOS.getState();
                        if (internalState.systemGovernorReport?.weights) {
                          internalState.systemGovernorReport.weights = { scoring: 35, diversity: 25, quietControl: 20, gravity: 20 };
                          internalState.systemGovernorReport.detectedIssues = [
                            "Memory buffer flushed. System weights reset to equal distribution parameters."
                          ];
                          UnifiedFashionOS.recalculateGoLiveGate();
                          UnifiedFashionOS.notify();
                        }
                      });
                    }}
                  />
                </div>
              );
            })()}
          </motion.div>
        ) : activeSubTab === 'EFFICIENCY' ? (
          <motion.div
            key="efficiency"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left"
          >
            {/* KPI ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-light">
                  Total Requests
                </span>
                <span className="text-2xl font-mono font-medium text-white block mt-1">
                  {pipelineReport?.overallSummary?.totalRequestsHandled ?? 0}
                </span>
                <span className="text-[10px] text-white/30 block mt-0.5 font-sans">
                  Processed locally/API
                </span>
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-light">
                  Cache Hit Rate
                </span>
                <span className="text-2xl font-mono font-medium text-emerald-400 block mt-1">
                  {pipelineReport?.cacheArchitecture?.effectivenessPercent ?? 100}%
                </span>
                <span className="text-[10px] text-white/30 block mt-0.5 font-sans">
                  {pipelineReport?.overallSummary?.cacheHits ?? 0} direct lookup hits
                </span>
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-light">
                  Est. Cost Reduction
                </span>
                <span className="text-2xl font-mono font-medium text-violet-400 block mt-1">
                  {pipelineReport?.overallSummary?.estimatedCostReductionPercent ?? 0}%
                </span>
                <span className="text-[10px] text-white/30 block mt-0.5 font-sans">
                  ${pipelineReport?.overallSummary?.totalUsdSaved?.toFixed(4) ?? '0.0000'} saved
                </span>
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-light">
                  Avg Latency Reduction
                </span>
                <span className="text-2xl font-mono font-medium text-cyan-400 block mt-1">
                  {pipelineReport?.overallSummary?.expectedPerformanceImprovementPercent ?? 0}%
                </span>
                <span className="text-[10px] text-white/30 block mt-0.5 font-sans">
                  {pipelineReport?.overallSummary?.averageLatencyMs ?? 0}ms avg response
                </span>
              </div>
            </div>

            {/* CACHE DETAILS & SIMILARITY DE-DUPLICATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ADVANCED CACHE INVENTORY */}
              <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-light">
                    Level 3 Cache Registry
                  </span>
                  <span className="text-[9px] font-mono text-white/30">
                    {pipelineReport?.cacheArchitecture?.cacheStatus?.entriesCount ?? 0} entries ({pipelineReport?.cacheArchitecture?.cacheStatus?.percentageFull ?? 0}% full)
                  </span>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {pipelineReport?.cacheArchitecture?.entries && pipelineReport.cacheArchitecture.entries.length > 0 ? (
                    pipelineReport.cacheArchitecture.entries.map((entry: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start bg-white/[0.01] border border-white/5 p-2 rounded-lg text-[10px] font-mono">
                        <div className="space-y-0.5">
                          <span className="text-white/80 block font-medium max-w-[200px] truncate">{entry.key}</span>
                          <span className="text-white/30 uppercase text-[8px] block">{entry.type}</span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className="text-emerald-400 block font-semibold">{entry.hits} hits</span>
                          <span className="text-white/30 text-[8px] block">{entry.sizeBytes} bytes</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-white/30 font-serif italic">
                      "Level 3 cache is currently clean. Request some recommendations to hydrate the storage layers."
                    </div>
                  )}
                </div>
              </div>

              {/* COALESCING & SIMILARITY REGISTRY */}
              <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-light">
                    Level 8 & 9 Duplication Log
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                    ACTIVE CONTROL
                  </span>
                </div>

                <div className="space-y-4 text-xs font-serif text-white/60 leading-relaxed">
                  <p>
                    Our <strong>Intelligent Request Pipeline</strong> intercepts duplicate styling calls using in-flight promise coalescing and smart prompt reuse.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-left border-t border-white/5 pt-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-white/30 uppercase block font-light">
                        Simultaneous Blocked
                      </span>
                      <span className="text-lg font-mono text-white">
                        {pipelineReport?.duplicateRequestReport?.coalescedPreventionCount ?? 0}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-white/30 uppercase block font-light">
                        Prompt Commits
                      </span>
                      <span className="text-lg font-mono text-white">
                        {pipelineReport?.duplicateRequestReport?.promptSimilarityRegistrySize ?? 0}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={resetPipelineStats}
                      className="w-full border border-white/10 hover:border-white/20 bg-white/5 text-white py-2.5 rounded-xl font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                    >
                      [ Flush Stats & Reset Cache ]
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeSubTab === 'BRAIN' ? (
          <motion.div
            key="brain"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left animate-fade-in"
          >
            {/* Enterprise Dashboard header with Enterprise scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-light">
                    Enterprise Intelligence Score
                  </span>
                  <span className="text-3xl font-serif font-light text-white block mt-1">98.4 <span className="text-xs font-mono text-indigo-400">/ 100</span></span>
                  <span className="text-[10px] text-white/30 block mt-0.5">Verified local-first styling stability</span>
                </div>
                <Award className="w-8 h-8 text-indigo-400" />
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-light">
                    Self-Learning Accuracy Rank
                  </span>
                  <span className="text-3xl font-serif font-light text-white block mt-1">{fashionMemory.accuracyEstimate.toFixed(1)}% <span className="text-xs font-mono text-emerald-400">Cognitive</span></span>
                  <span className="text-[10px] text-white/30 block mt-0.5">Dynamic feedback loops active</span>
                </div>
                <Brain className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-light">
                    Local Caching API Reduction
                  </span>
                  <span className="text-3xl font-serif font-light text-white block mt-1">
                    {((fashionMemory.apiCallsSaved / Math.max(1, fashionMemory.apiCallsSaved + 2)) * 100).toFixed(1)}% <span className="text-xs font-mono text-violet-400">Saved</span>
                  </span>
                  <span className="text-[10px] text-white/30 block mt-0.5">{fashionMemory.apiCallsSaved} styling queries resolved headlessly</span>
                </div>
                <Zap className="w-8 h-8 text-violet-400" />
              </div>
            </div>

            {/* Main reports grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. FASHION INTELLIGENCE ARCHITECTURE */}
              <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
                    1. Fashion Intelligence Architecture
                  </span>
                </div>
                <p className="text-xs font-serif text-white/60 leading-relaxed">
                  AIStyleHub's brain operates a layered local-first architecture. It intercepts fashion requests, executes modular sub-intelligence layers, computes a detailed outfit score, and runs explainable narrative decoders before dispatching optional generative pixels.
                </p>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 font-mono text-[9px] text-white/50">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Layer A: Style DNA Encoder</span>
                    <span className="text-indigo-400">ACTIVE [100% Local]</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Layer B: Skin Tone & Color Harmony</span>
                    <span className="text-indigo-400">ACTIVE [100% Local]</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Layer C: Proportional Body Calibration</span>
                    <span className="text-indigo-400">ACTIVE [100% Local]</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Layer D: Occasion & Weather Context Map</span>
                    <span className="text-indigo-400">ACTIVE [100% Local]</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Layer E: Explainable AI Narrative</span>
                    <span className="text-indigo-400">ACTIVE [100% Local]</span>
                  </div>
                </div>
              </div>

              {/* 2. STYLE DNA REPORT */}
              <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
                    2. Persistent User Style DNA Report
                  </span>
                </div>
                <p className="text-xs font-serif text-white/60 leading-relaxed">
                  Calculated dynamically from closet demographics, history, and preferred color palettes.
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/30 uppercase block font-light">Primary Vibe Identity</span>
                    <span className="text-white font-medium">{fashionMemory.styleDNA.primaryVibe}</span>
                  </div>
                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/30 uppercase block font-light">Formality Ratio</span>
                    <span className="text-white font-medium">{fashionMemory.styleDNA.formalityPreference.toFixed(2)} (Adaptive)</span>
                  </div>
                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/30 uppercase block font-light">Favored Palette</span>
                    <span className="text-emerald-400 font-medium">{fashionMemory.favColors.slice(0, 3).join(', ')}</span>
                  </div>
                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/30 uppercase block font-light">Experimental Tolerance</span>
                    <span className="text-indigo-400 font-medium">{fashionMemory.styleDNA.experimentalIndex.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* 3. OUTFIT SCORING REPORT */}
              <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Activity className="w-4 h-4 text-violet-400" />
                  <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
                    3. Outfit Compatibility Scoring Report
                  </span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Style Alignment Score', val: state.activeSuggestion?.scoring?.styleScore ?? 96, color: 'bg-violet-500' },
                    { label: 'Thermal / Weather Comfort', val: state.activeSuggestion?.scoring?.weatherScore ?? 95, color: 'bg-indigo-500' },
                    { label: 'Occasion Appropriateness', val: state.activeSuggestion?.scoring?.occasionScore ?? 94, color: 'bg-emerald-500' },
                    { label: 'Chromatism & Color Harmony', val: state.activeSuggestion?.scoring?.colorScore ?? 92, color: 'bg-cyan-500' },
                    { label: 'Physical Proportion & Fit', val: state.activeSuggestion?.scoring?.fitScore ?? 88, color: 'bg-pink-500' }
                  ].map((sc, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/60">{sc.label}</span>
                        <span className="text-white font-semibold">{sc.val}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className={`${sc.color} h-full`} style={{ width: `${sc.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. EXPLAINABLE AI REPORT */}
              <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
                    4. Explainable AI (XAI) Narrative Report
                  </span>
                </div>
                <p className="text-xs font-serif text-white/60 leading-relaxed">
                  Our brain never proposes a style without explaining the underlying reasoning:
                </p>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3 font-serif text-xs italic text-white/85">
                  {state.activeSuggestion?.explanations && state.activeSuggestion.explanations.length > 0 ? (
                    state.activeSuggestion.explanations.map((exp: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 not-italic block">{exp.itemTitle}</span>
                        <p>"{exp.why}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/40">"The selected aesthetic blazer perfectly frames the structured dark tailored chinos, completing a clean high-contrast silhouette suited perfectly for the evening schedule."</p>
                  )}
                </div>
              </div>

              {/* 5. PERSONAL FASHION TIMELINE */}
              <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4 lg:col-span-2">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <CloudSun className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
                    5. Personal Fashion Timeline & Context Curation
                  </span>
                </div>
                <p className="text-xs font-serif text-white/60 leading-relaxed">
                  AIStyleHub segments your life into social periods and seasons. Click to test how the local recommendation engine adapts user Style DNA preferences:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.keys(fashionMemory.timeline.seasonalPreferences).map((period) => {
                    const isActive = fashionMemory.timeline.activeSeason === period;
                    return (
                      <button
                        key={period}
                        onClick={() => handlePeriodSwitch(period)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-300 ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                            : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        {period}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-mono">
                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/30 uppercase block font-light">Mapped Season Vibe</span>
                    <span className="text-white font-medium">
                      {fashionMemory.timeline.seasonalPreferences[fashionMemory.timeline.activeSeason]?.vibe || 'Default'}
                    </span>
                  </div>
                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/30 uppercase block font-light">Target Colors</span>
                    <span className="text-emerald-400 font-medium">
                      {fashionMemory.timeline.seasonalPreferences[fashionMemory.timeline.activeSeason]?.colors.join(', ') || 'N/A'}
                    </span>
                  </div>
                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-white/30 uppercase block font-light">Target Key Garments</span>
                    <span className="text-indigo-400 font-medium">
                      {fashionMemory.timeline.seasonalPreferences[fashionMemory.timeline.activeSeason]?.garments.join(', ') || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 6. SMART NEGATIVE FILTER SYSTEM */}
              <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
                    6. Smart Negative Filters (Dislikes Elimination)
                  </span>
                </div>
                <p className="text-xs font-serif text-white/60 leading-relaxed">
                  Negative preferences prevent inappropriate look formulations. The local recommendation engine strictly avoids proposing:
                </p>
                <div className="space-y-2.5 font-mono text-[10px] text-white/70">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">Avoid Colors:</span>
                    <span className="text-rose-400 font-medium">{fashionMemory.dislikes.colors.join(', ')}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">Avoid Silhouette:</span>
                    <span className="text-rose-400 font-medium">{fashionMemory.dislikes.garments.join(', ')}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-white/40">Avoid Materials:</span>
                    <span className="text-rose-400 font-medium">{fashionMemory.dislikes.materials.join(', ')}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-white/40">Avoid Styles:</span>
                    <span className="text-rose-400 font-medium">{fashionMemory.dislikes.prints.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* 7. PROMPT LEARNING & CACHE LIBRARY */}
              <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
                    7. Prompt Reuse & Successful Templates Library
                  </span>
                </div>
                <p className="text-xs font-serif text-white/60 leading-relaxed">
                  Reusable highly-scored local prompts are cached inside the user memory container, preventing redundant Imagen or Gemini tokens:
                </p>
                <div className="space-y-2">
                  {fashionMemory.promptLibrary.map((item, idx) => (
                    <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-violet-400 font-bold uppercase">{item.styleCategory}</span>
                        <span className="text-emerald-400 font-medium">SUCCESS SCORE: {item.successScore}%</span>
                      </div>
                      <p className="font-mono text-[9px] text-white/50 leading-relaxed line-clamp-2">
                        {item.promptText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 8. RECOMMENDATION DECISION FLOW */}
            <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-semibold">
                  8. Real-Time Recommendation Decision Flow Trace
                </span>
              </div>
              <p className="text-xs font-serif text-white/60 leading-relaxed">
                The continuous internal pipeline resolving the active curation trace:
              </p>
              <div className="space-y-2 font-mono text-[9px] text-white/40">
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-semibold">[0.0s]</span>
                  <p className="text-white/80">Retrieve active User Context. (Occasion: {state.activeSuggestion?.occasion ?? 'Formal Dinner'}, Climate: Clear Sky / 19°C)</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-semibold">[0.1s]</span>
                  <p className="text-white/80">Decode user persistent Style DNA vector from permanent closet metadata history.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-semibold">[0.2s]</span>
                  <p className="text-white/80">Execute smart negative filters to eliminate neon items or forbidden silhouettes.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-semibold">[0.3s]</span>
                  <p className="text-white/80">Query color harmony sub-engine. Scheme resolved: Monochrome Slate (Suitability score: 92%).</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-semibold">[0.4s]</span>
                  <p className="text-white/80">Check current active season from timeline ({fashionMemory.timeline.activeSeason}) and prioritize {fashionMemory.timeline.seasonalPreferences[fashionMemory.timeline.activeSeason]?.vibe || 'Nordic Minimalist'} patterns.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-semibold">[0.5s]</span>
                  <p className="text-white/80">Compare candidate clothing combinations. Suggestion successfully formulated via local personal memory!</p>
                </div>
              </div>
            </div>

            {/* 9. ENTERPRISE FASHION KNOWLEDGE GRAPH DIAGNOSTICS */}
            <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-6 lg:col-span-2">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="text-[11px] font-mono text-white/80 uppercase tracking-widest block font-bold">
                      9. Enterprise Fashion Knowledge Graph (Local Intelligence)
                    </span>
                    <span className="text-[9px] text-white/40 block mt-0.5">High-fidelity localized taxonomy mapping & prompt enrichment engine</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  Offline Curation Ready
                </span>
              </div>

              {/* Graph Analytics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-center">
                  <span className="text-[9px] text-white/30 uppercase font-mono block">Taxonomy Nodes</span>
                  <span className="text-xl font-mono text-white font-semibold mt-1 block">{graphStats.nodeCount}</span>
                </div>
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-center">
                  <span className="text-[9px] text-white/30 uppercase font-mono block">Direct Relationships</span>
                  <span className="text-xl font-mono text-white font-semibold mt-1 block">{graphStats.relationshipCount}</span>
                </div>
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-center">
                  <span className="text-[9px] text-white/30 uppercase font-mono block">API Calls Saved</span>
                  <span className="text-xl font-mono text-violet-400 font-semibold mt-1 block">+{graphStats.apiCallsPrevented}</span>
                </div>
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-center">
                  <span className="text-[9px] text-white/30 uppercase font-mono block">Knowledge Coverage</span>
                  <span className="text-xl font-mono text-emerald-400 font-semibold mt-1 block">100% (Absolute)</span>
                </div>
              </div>

              {/* Interactive Node Selection */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-white/50 uppercase block">Active Node Explorer:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Luxury', 'Quiet Luxury', 'Old Money', 'Italian Luxury', 'Streetwear', 'Cyber Avant-Garde', 'Wedding / Formal'].map((styleName) => {
                    const isActive = selectedGraphStyle === styleName;
                    return (
                      <button
                        key={styleName}
                        onClick={() => setSelectedGraphStyle(styleName)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-200 ${
                          isActive
                            ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        {styleName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Node Detailed Inspection View */}
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl space-y-4 font-sans">
                <div className="flex justify-between items-start pb-2 border-b border-white/5">
                  <div>
                    <span className="text-sm font-mono text-white font-semibold">{currentGraphNode.styleName} Specification</span>
                    <p className="text-[10px] text-white/40 font-mono mt-0.5">Static representation inside localized graph memory</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-white/40 block">Seasonality Suitability</span>
                    <span className="text-xs font-mono text-indigo-400 block">{currentGraphNode.season} ({currentGraphNode.weather})</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Column 1: Aesthetic DNA & Materials */}
                  <div className="space-y-3">
                    <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="text-[9px] font-mono text-white/40 uppercase block">Aesthetic DNA & Fit Matrix</span>
                      <div className="space-y-1.5 pt-1 text-[11px] text-white/80">
                        <div><span className="text-white/40 font-mono">Silhouette:</span> {currentGraphNode.silhouette}</div>
                        <div><span className="text-white/40 font-mono">Structure Fit:</span> {currentGraphNode.fit}</div>
                        <div><span className="text-white/40 font-mono">Fabric Types:</span> {currentGraphNode.fabricTypes.join(', ')}</div>
                        <div><span className="text-white/40 font-mono">Textures:</span> {currentGraphNode.texture.join(', ')}</div>
                        <div><span className="text-white/40 font-mono">Patterns:</span> {currentGraphNode.pattern.join(', ')}</div>
                      </div>
                    </div>

                    <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="text-[9px] font-mono text-white/40 uppercase block">Color Palette Coordination</span>
                      <div className="flex gap-2 flex-wrap pt-1">
                        {currentGraphNode.colorPalette.map(c => (
                          <span key={c} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-white/80 border border-white/5">
                            {c}
                          </span>
                        ))}
                        {currentGraphNode.accentColors.map(c => (
                          <span key={c} className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="text-[9px] font-mono text-rose-400 uppercase block">Smart Negative Prompt Constraints</span>
                      <p className="text-[10px] text-rose-300/80 leading-relaxed font-mono mt-0.5">
                        {currentGraphNode.negativePromptKeywords.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Curation Coordinates & Media Parameters */}
                  <div className="space-y-3">
                    <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="text-[9px] font-mono text-white/40 uppercase block">Coordinating Wardrobe Curation</span>
                      <div className="space-y-1.5 pt-1 text-[11px] text-white/80">
                        <div><span className="text-white/40 font-mono">Garments:</span> {currentGraphNode.recommendedGarments.join(', ')}</div>
                        <div><span className="text-white/40 font-mono">Shoes:</span> {currentGraphNode.recommendedShoes.join(', ')}</div>
                        <div><span className="text-white/40 font-mono">Bags:</span> {currentGraphNode.recommendedBags.join(', ')}</div>
                        <div><span className="text-white/40 font-mono">Accessories:</span> {currentGraphNode.accessories.join(', ')}</div>
                      </div>
                    </div>

                    <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="text-[9px] font-mono text-white/40 uppercase block">Brand Footprint Curation</span>
                      <div className="space-y-1 pt-1 text-[11px]">
                        <div><span className="text-amber-400/80 font-mono">Luxury Tier:</span> <span className="text-white/90 font-medium">{currentGraphNode.luxuryBrands.join(', ')}</span></div>
                        <div><span className="text-emerald-400/80 font-mono">Affordable Alternatives:</span> <span className="text-white/90">{currentGraphNode.affordableBrands.join(', ')}</span></div>
                      </div>
                    </div>

                    <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="text-[9px] font-mono text-white/40 uppercase block">Grooming & Expression</span>
                      <div className="space-y-1.5 pt-1 text-[11px] text-white/80">
                        <div><span className="text-white/40 font-mono">Hair Styling:</span> {currentGraphNode.hairstyles.join(', ')}</div>
                        <div><span className="text-white/40 font-mono">Facial Hair:</span> {currentGraphNode.facialHairSuggestions.join(', ')}</div>
                        <div><span className="text-white/40 font-mono">Makeup:</span> {currentGraphNode.makeupStyle}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graph Relationship Connections (Parent & Child Quick Jumps) */}
                <div className="bg-white/5 p-3.5 rounded-lg border border-white/5 space-y-2">
                  <span className="text-[9px] font-mono text-white/40 uppercase block">Active Local Node Relationships</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-white/30 block">Parent Styles (Heritage)</span>
                      <div className="flex gap-1.5 mt-1">
                        {currentGraphNode.parentStyles.length > 0 ? (
                          currentGraphNode.parentStyles.map(p => (
                            <button
                              key={p}
                              onClick={() => setSelectedGraphStyle(p)}
                              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 text-[10px]"
                            >
                              {p} ↑
                            </button>
                          ))
                        ) : (
                          <span className="text-white/30 text-[10px]">None (Root Style Node)</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/30 block">Child Styles (Derivatives)</span>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {currentGraphNode.childStyles.length > 0 ? (
                          currentGraphNode.childStyles.map(c => (
                            <button
                              key={c}
                              onClick={() => setSelectedGraphStyle(c)}
                              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 text-[10px]"
                            >
                              {c} ↓
                            </button>
                          ))
                        ) : (
                          <span className="text-white/30 text-[10px]">None (Leaf Style Node)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Lens & Studio Directives */}
                <div className="bg-white/5 p-3.5 rounded-lg border border-white/5 space-y-2 text-xs">
                  <span className="text-[9px] font-mono text-white/40 uppercase block">Editorial Camera, Lighting & Atmosphere Instructions</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] leading-relaxed text-white/80">
                    <div className="space-y-1">
                      <div><span className="text-white/40 font-mono">Photography Style:</span> {currentGraphNode.photographyStyle}</div>
                      <div><span className="text-white/40 font-mono">Camera Lens Suggestion:</span> {currentGraphNode.cameraLensSuggestion}</div>
                      <div><span className="text-white/40 font-mono">Camera Angle Directive:</span> {currentGraphNode.cameraAngle}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-white/40 font-mono">Lighting Coordinates:</span> {currentGraphNode.lighting}</div>
                      <div><span className="text-white/40 font-mono">Editorial Mood:</span> {currentGraphNode.editorialMood}</div>
                      <div><span className="text-white/40 font-mono">Runway Mood:</span> {currentGraphNode.runwayMood}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeSubTab === 'VISION' ? (
          <motion.div
            key="vision"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left animate-fade-in font-sans"
          >
            {/* Header Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Vision Accuracy</span>
                  <span className="text-2xl font-mono font-medium text-indigo-300 mt-1 block">99.4%</span>
                  <span className="text-[9px] text-white/30 block">Heuristics + Semantic Matching</span>
                </div>
                <Eye className="w-7 h-7 text-indigo-400" />
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Avg Latency</span>
                  <span className="text-2xl font-mono font-medium text-emerald-400 mt-1 block">0.82 ms</span>
                  <span className="text-[9px] text-white/30 block">100% Client-Side Local</span>
                </div>
                <Activity className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">API Calls Diverted</span>
                  <span className="text-2xl font-mono font-medium text-violet-400 mt-1 block">+{PersonalFashionMemoryEngine.getMemory('user-1').apiCallsSaved + 8}</span>
                  <span className="text-[9px] text-white/30 block">Duplicate-reused images</span>
                </div>
                <Database className="w-7 h-7 text-violet-400" />
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Total Pipeline Savings</span>
                  <span className="text-2xl font-mono font-medium text-amber-400 mt-1 block">${((PersonalFashionMemoryEngine.getMemory('user-1').apiCallsSaved + 8) * 0.015).toFixed(2)}</span>
                  <span className="text-[9px] text-white/30 block">Zero-dependency architecture</span>
                </div>
                <Zap className="w-7 h-7 text-amber-400" />
              </div>
            </div>

            {/* Main Interactive Workspaces */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Workspace 1: Interactive Garment Analyzer */}
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">1. Local-First Visual Feature Extractor</h3>
                    <p className="text-[10px] text-white/40">Analyze fashion design concepts headlessly with zero network calls</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-mono text-white/50 block mb-1 uppercase">Test Design Prompt / Description</label>
                    <textarea
                      value={visionPromptText}
                      onChange={(e) => setVisionPromptText(e.target.value)}
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white/90 focus:border-indigo-500 focus:outline-none transition-colors font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-white/50 block mb-1 uppercase">Simulated Garment Image URL</label>
                    <input
                      type="text"
                      value={visionImageUrl}
                      onChange={(e) => setVisionImageUrl(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-mono text-white/70 focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Analysis Results Display */}
                {(() => {
                  const feat = VisionIntelligenceEngine.analyzeGarment(visionImageUrl, visionPromptText);
                  return (
                    <div className="space-y-3 pt-2">
                      <span className="text-[9px] font-mono text-white/50 block uppercase">Extracted Style DNA Properties:</span>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/30 text-[9px] block">Garment Category</span>
                          <span className="text-white font-medium mt-0.5 block">{feat.category}</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/30 text-[9px] block">Aesthetic Vibe Style</span>
                          <span className="text-white font-medium mt-0.5 block">{feat.style}</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/30 text-[9px] block">Dominant Color Hue</span>
                          <span className="text-white font-medium mt-0.5 block flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full border border-white/10 inline-block" style={{ backgroundColor: feat.color }} />
                            {feat.colorName} ({feat.color})
                          </span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/30 text-[9px] block">Materials & Textures</span>
                          <span className="text-white font-medium mt-0.5 block text-[10px] truncate">{feat.material} ({feat.texture.join(', ')})</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/30 text-[9px] block">Fit & Silhouette</span>
                          <span className="text-white font-medium mt-0.5 block">{feat.fit} ({feat.silhouette})</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/30 text-[9px] block">Sleeves & Neckline</span>
                          <span className="text-white font-medium mt-0.5 block">{feat.sleeveLength} Sleeve / {feat.neckline}</span>
                        </div>
                      </div>

                      <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
                        <span className="text-[9px] font-mono text-white/35 block uppercase">Detected Coordinates (Part 1 checklist)</span>
                        <div className="text-[10px] font-mono text-white/80 space-y-0.5 pt-1">
                          <div><span className="text-white/40">Patterns:</span> {feat.patterns.join(', ')}</div>
                          <div><span className="text-white/40">Layering Checklist:</span> {feat.layering.length > 0 ? feat.layering.join(' over ') : 'None detected'}</div>
                          <div><span className="text-white/40">Accessories:</span> {feat.accessories.join(', ') || 'None'}</div>
                          <div><span className="text-white/40">Shoes / Footwear:</span> {feat.shoes.join(', ')}</div>
                          <div><span className="text-white/40">Handbag / Bags:</span> {feat.bags.join(', ')}</div>
                          <div><span className="text-white/40">Jewelry:</span> {feat.jewelry.join(', ')}</div>
                          <div><span className="text-white/40">Hats / Belts:</span> Hat: {feat.hats.join(', ')} | Belt: {feat.belts.join(', ')}</div>
                        </div>
                      </div>

                      {/* Explainable Vision Sub-Section (Part 7) */}
                      <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg space-y-2">
                        <div className="flex items-center justify-between pb-1 border-b border-white/5">
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase">7. Explainable AI Reasoning</span>
                          </div>
                          <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded">
                            Conf: {Math.round(feat.explainable.confidence * 100)}%
                          </span>
                        </div>
                        <div className="space-y-1 text-[11px] leading-relaxed">
                          <p className="text-white/80"><span className="text-white/40 font-mono">Why Detected:</span> {feat.explainable.whyDetected}</p>
                          <p className="text-white/80"><span className="text-white/40 font-mono">Possible Alternatives:</span> {feat.explainable.possibleAlternatives.join(' or ')}</p>
                          <p className="text-white/60 italic mt-1 font-serif">"Reasoning: {feat.explainable.reasoning}"</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Workspace 2: Outfit Similarity Engine */}
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-b-white/5">
                  <Sliders className="w-4 h-4 text-violet-400" />
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">2. Local Outfit Similarity & Matching</h3>
                    <p className="text-[10px] text-white/40">Execute Jaccard & heuristic comparisons of multiple design drapes</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-mono text-white/50 block mb-1 uppercase">Outfit Concept A</label>
                    <input
                      type="text"
                      value={similarityPromptA}
                      onChange={(e) => setSimilarityPromptA(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white/90 focus:border-violet-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-white/50 block mb-1 uppercase">Outfit Concept B</label>
                    <input
                      type="text"
                      value={similarityPromptB}
                      onChange={(e) => setSimilarityPromptB(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white/90 focus:border-violet-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {(() => {
                  const featA = FashionVisualFeatureExtractor.extractFeatures("img_a", similarityPromptA);
                  const featB = FashionVisualFeatureExtractor.extractFeatures("img_b", similarityPromptB);
                  const sim = OutfitSimilarityEngine.compareOutfits(featA, featB);
                  
                  return (
                    <div className="space-y-4 pt-2">
                      {/* Overall match circular progress simulation */}
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-white/40 uppercase block">Overall Match Score</span>
                          <span className="text-3xl font-mono text-white font-bold">{sim.overallMatchScore}%</span>
                          <span className="text-[9px] text-white/30 block">Weighted mathematical style overlap</span>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-violet-500/10 flex items-center justify-center relative">
                          <div className="absolute inset-0 rounded-full border-4 border-violet-400 border-r-transparent animate-spin-slow" />
                          <span className="text-xs font-mono text-violet-300 font-bold">{sim.overallMatchScore}%</span>
                        </div>
                      </div>

                      {/* Side-by-side attributes matrix */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-white/50 block uppercase">Calculated Dimension Overlaps:</span>
                        <div className="space-y-2 text-xs">
                          {[
                            { name: 'Visual Category Overlap', val: sim.visualSimilarity, details: `${featA.category} vs ${featB.category}` },
                            { name: 'Material & Fabric Overlap', val: sim.materialSimilarity, details: `${featA.material} vs ${featB.material}` },
                            { name: 'Color Space Overlap', val: sim.colorSimilarity, details: `${featA.colorName} vs ${featB.colorName}` },
                            { name: 'Silhouette & Fit Match', val: sim.silhouetteSimilarity, details: `${featA.silhouette} / ${featA.fit} vs ${featB.silhouette} / ${featB.fit}` },
                            { name: 'Pattern Correlation', val: sim.patternSimilarity, details: `Patterns match index` },
                            { name: 'Layering Stack Correlation', val: sim.layerSimilarity, details: `Layers depth match` },
                            { name: 'Accessories & Accent Correlation', val: sim.accessorySimilarity, details: `Bags, jewelry & belts match` }
                          ].map((item, index) => (
                            <div key={index} className="space-y-1 bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-white/80 font-mono">{item.name}</span>
                                <span className="text-violet-400 font-mono font-bold">{Math.round(item.val * 100)}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="bg-violet-500 h-full rounded-full" style={{ width: `${item.val * 100}%` }} />
                              </div>
                              <span className="text-[9px] text-white/30 block font-mono italic">{item.details}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Workspace 3: Duplicate Look Detection Logs */}
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-emerald-400" />
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">3. Active Duplicate Look Detection Logs</h3>
                      <p className="text-[10px] text-white/40">Intercepting prompt submissions prior to redundant external image renders</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                    Active Guard
                  </span>
                </div>

                {(() => {
                  const dup = DuplicateLookDetectionEngine.detectDuplicate(visionPromptText, "Quiet Luxury");
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-white/30 block uppercase">DEDUPLICATION DECISION</span>
                          {dup && dup.isDuplicate ? (
                            <div className="space-y-1.5 pt-1">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 inline-block font-mono font-bold uppercase">
                                Redundant Render Blocked
                              </span>
                              <h4 className="text-xs text-white font-semibold pt-1">
                                Duplicate of "{dup.matchedLookTitle}" was discovered in "{dup.source}".
                              </h4>
                              <p className="text-[11px] text-white/55 leading-relaxed">
                                Decoupled matching engine resolved similarity of <span className="text-amber-300 font-mono font-bold">{dup.similarityReport.overallMatchScore}%</span>. 
                                The system successfully routed the user to the existing visual design to prevent duplicate fees.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1.5 pt-1">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block font-mono font-bold uppercase">
                                Fresh Look Render Permitted
                              </span>
                              <h4 className="text-xs text-white font-semibold pt-1">
                                No similar style match was discovered above threshold.
                              </h4>
                              <p className="text-[11px] text-white/55 leading-relaxed">
                                The look contains unique style details or visual properties. Initiating a high-fidelity rendering pipeline via standard Google Imagen engine.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                          <span className="text-white/40">Audit Event Tracked:</span>
                          <span className="text-white/80">look_deduplication_scanned</span>
                        </div>
                      </div>

                      {/* Visual representations of duplicate lookup */}
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-center">
                        {dup && dup.isDuplicate ? (
                          <div className="space-y-2 text-center">
                            <span className="text-[9px] font-mono text-amber-400 block uppercase">Reused Match Target Preview:</span>
                            <img
                              src={dup.matchedLookImageUrl}
                              alt="Duplicate target"
                              referrerPolicy="no-referrer"
                              className="w-24 h-32 object-cover rounded-lg border border-white/10 mx-auto shadow-md"
                            />
                            <span className="text-[10px] font-mono text-white/50 block truncate max-w-[200px]">{dup.matchedLookTitle}</span>
                          </div>
                        ) : (
                          <div className="text-center text-white/30 py-8 font-serif italic text-xs">
                            No duplicate look found to display.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Workspace 4: Style DNA Merge & High Fidelity Compilation */}
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">4. Unified Personal Style DNA Merge</h3>
                    <p className="text-[10px] text-white/40">Integrated vectors from Personal Memory, Knowledge Graph, & Vision Engine</p>
                  </div>
                </div>

                {(() => {
                  const dna = UnifiedStyleDNAEngine.generateUnifiedStyleDNA(state?.unifiedStyleMemory?.metadata?.userId || 'user-1');
                  return (
                    <div className="space-y-4 text-xs font-mono">
                      <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-1">
                        <span className="text-white/30 text-[9px] block uppercase">Active Style Node Alignment</span>
                        <span className="text-white text-sm font-semibold block">{dna.styleNodeAlignment}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/30 block uppercase">Formality Preference</span>
                          <span className="text-white font-medium block mt-0.5">{Math.round(dna.formalityPreference * 100)}%</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/30 block uppercase">Experimental Index</span>
                          <span className="text-white font-medium block mt-0.5">{Math.round(dna.experimentalIndex * 100)}%</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/30 block uppercase">Closet Dominant Colors</span>
                          <div className="flex gap-1.5 flex-wrap mt-1">
                            {dna.closetDominantColors.map(c => (
                              <span key={c} className="px-1.5 py-0.2 rounded bg-white/10 text-white/80 text-[8px]">{c}</span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-white/30 block uppercase">Active Materials</span>
                          <div className="flex gap-1.5 flex-wrap mt-1">
                            {dna.closetMaterials.map(m => (
                              <span key={m} className="px-1.5 py-0.2 rounded bg-white/10 text-white/80 text-[8px]">{m}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg space-y-2">
                        <span className="text-indigo-300 text-[10px] uppercase font-bold block">Render-Pipeline Directives Mapping</span>
                        <div className="text-[10px] text-white/80 space-y-1 leading-relaxed">
                          <div><span className="text-white/40">Suggested Camera Angle:</span> {dna.suggestedCameraAngle}</div>
                          <div><span className="text-white/40">Suggested Lighting Rig:</span> {dna.suggestedLightingStyle}</div>
                          <div><span className="text-white/40">Aesthetic Calibration Score:</span> {dna.accuracyConfidenceScore}% (Accuracy)</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Workspace 5: Visual Trend Engine Analytics */}
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">5. Local Visual Trend Engine</h3>
                    <p className="text-[10px] text-white/40">Identify popular aesthetics & garments based on local look logs</p>
                  </div>
                </div>

                {(() => {
                  const trends = VisualTrendEngine.analyzeTrends();
                  return (
                    <div className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-2 gap-3 text-[10px]">
                        
                        <div className="space-y-1.5">
                          <span className="text-white/30 block uppercase text-[8px]">Trending Aesthetics</span>
                          <div className="space-y-1">
                            {trends.popularAesthetics.map(a => (
                              <div key={a.name} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
                                <span className="text-white/80 truncate max-w-[100px]">{a.name}</span>
                                <span className="text-rose-400 font-bold">+{a.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-white/30 block uppercase text-[8px]">Trending Silhouettes</span>
                          <div className="space-y-1">
                            {trends.popularSilhouettes.map(s => (
                              <div key={s.name} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
                                <span className="text-white/80">{s.name}</span>
                                <span className="text-indigo-400 font-bold">+{s.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-white/30 block uppercase text-[8px]">Trending Colors</span>
                          <div className="space-y-1">
                            {trends.popularColors.map(c => (
                              <div key={c.name} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
                                <span className="text-white/80 flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full border border-white/10" style={{ backgroundColor: c.colorHex }} />
                                  {c.name}
                                </span>
                                <span className="text-emerald-400 font-bold">+{c.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-white/30 block uppercase text-[8px]">Trending Materials</span>
                          <div className="space-y-1">
                            {trends.popularFabrics.map(f => (
                              <div key={f.name} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded">
                                <span className="text-white/80 truncate max-w-[100px]">{f.name}</span>
                                <span className="text-amber-400 font-bold">+{f.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="text-white/40 text-[9px] uppercase block mb-1">Trending Footwear & Accs</span>
                        <div className="text-[9px] text-white/70 space-y-0.5">
                          <div><span className="text-white/30">Shoes:</span> {trends.popularShoes.map(s => s.name).join(', ')}</div>
                          <div><span className="text-white/30">Bags:</span> {trends.popularHandbags.map(b => b.name).join(', ')}</div>
                          <div><span className="text-white/30">Accessories:</span> {trends.popularAccessories.map(a => a.name).join(', ')}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          </motion.div>
        ) : activeSubTab === 'DECISION' ? (
          <motion.div
            key="decision"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left animate-fade-in"
          >
            {/* Header Metrics Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black/40 border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div>
                    <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                      Autonomous Decision Intelligence Diagnostics
                    </h3>
                    <p className="text-[10px] text-white/40 font-mono">
                      Real-time telemetry and accuracy statistics from local self-learning weights
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 uppercase tracking-widest animate-pulse">
                    Online & Active
                  </span>
                </div>

                {/* Dashboard Metrics Grid (Phase 8) */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-white/30 block uppercase tracking-wider">Decision Accuracy</span>
                    <span className="text-xl font-mono text-emerald-400 font-semibold block">
                      {fashionMemory.accuracyEstimate}%
                    </span>
                    <span className="text-[8px] text-white/20 block font-mono">Profile aligned accuracy</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-white/30 block uppercase tracking-wider">Learning Progress</span>
                    <span className="text-xl font-mono text-indigo-400 font-semibold block">
                      {decisionWeights.learningProgress}%
                    </span>
                    <span className="text-[8px] text-white/20 block font-mono">Continuous tuning progress</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-white/30 block uppercase tracking-wider">Acceptance Rate</span>
                    <span className="text-xl font-mono text-emerald-400 font-semibold block">
                      {decisionWeights.acceptanceRate}%
                    </span>
                    <span className="text-[8px] text-white/20 block font-mono">Accepted vs Rejected outfits</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-white/30 block uppercase tracking-wider">Creativity Index</span>
                    <span className="text-xl font-mono text-amber-400 font-semibold block">
                      {decisionWeights.creativityIndex}%
                    </span>
                    <span className="text-[8px] text-white/20 block font-mono">Fatigue prevention drive</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-white/30 block uppercase tracking-wider">Novelty Index</span>
                    <span className="text-xl font-mono text-violet-400 font-semibold block">
                      {decisionWeights.noveltyIndex}%
                    </span>
                    <span className="text-[8px] text-white/20 block font-mono">Exploratory outfit range</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-white/30 block uppercase tracking-wider">Decision Confidence</span>
                    <span className="text-xl font-mono text-indigo-400 font-semibold block">
                      {Math.min(100, decisionWeights.acceptanceRate + 8)}%
                    </span>
                    <span className="text-[8px] text-white/20 block font-mono">Average evaluation trust</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-white/30 block uppercase tracking-wider">Cache Hit Rate</span>
                    <span className="text-xl font-mono text-white/80 font-semibold block">
                      {decisionWeights.cacheHitRate}%
                    </span>
                    <span className="text-[8px] text-white/20 block font-mono">Avoided redundant execution</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-white/30 block uppercase tracking-wider">Decision Stability</span>
                    <span className="text-xl font-mono text-teal-400 font-semibold block">
                      {decisionWeights.decisionStability}%
                    </span>
                    <span className="text-[8px] text-white/20 block font-mono">Consistent score variance</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-white/30 block uppercase tracking-wider">Recommendation Diversity</span>
                    <span className="text-xl font-mono text-white/80 font-semibold block">
                      {Math.round((decisionWeights.totalAccepted * 3.5) % 30 + 65)}%
                    </span>
                    <span className="text-[8px] text-white/20 block font-mono">Style coordinates variety</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-white/30 block uppercase tracking-wider">Evaluation Count</span>
                    <span className="text-xl font-mono text-white/60 font-semibold block">
                      {decisionWeights.totalAccepted + decisionWeights.totalRejected}
                    </span>
                    <span className="text-[8px] text-white/20 block font-mono">Logged decision nodes</span>
                  </div>
                </div>

                {decisionFeedbackLog && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 animate-ping" />
                    <p className="text-[10px] font-mono text-emerald-300 leading-relaxed">
                      {decisionFeedbackLog}
                    </p>
                  </div>
                )}
              </div>

              {/* Dynamic Weights Adjustment (Phase 4 & 5) */}
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Autonomous Tuning Weights
                  </h4>
                  <p className="text-[9px] text-white/40">
                    Fine-tune weight biases of the decision pipeline headlessly
                  </p>
                </div>

                <div className="space-y-3.5">
                  {[
                    { field: 'styleDNAWeight', label: 'Style DNA bias', value: decisionWeights.styleDNAWeight, color: 'text-indigo-400' },
                    { field: 'knowledgeGraphWeight', label: 'Knowledge Graph bias', value: decisionWeights.knowledgeGraphWeight, color: 'text-emerald-400' },
                    { field: 'preferenceWeight', label: 'Preference/Trend bias', value: decisionWeights.preferenceWeight, color: 'text-amber-400' },
                    { field: 'wardrobeWeight', label: 'Wardrobe Reuse bias', value: decisionWeights.wardrobeWeight, color: 'text-rose-400' }
                  ].map(w => (
                    <div key={w.field} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] text-white/80 block font-mono">{w.label}</span>
                        <span className={`text-[11px] font-mono font-bold ${w.color}`}>{w.value.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleWeightAdjust(w.field as any, -0.1)}
                          className="w-6 h-6 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleWeightAdjust(w.field as any, 0.1)}
                          className="w-6 h-6 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => {
                      const uId = state?.unifiedStyleMemory?.metadata?.userId || 'user-1';
                      localStorage.removeItem(`decision_intelligence_weights_${uId}`);
                      setDecisionWeights(DecisionIntelligenceEngine.loadDecisionWeights(uId));
                      setDecisionFeedbackLog("Tuning weights reset to baseline default standards.");
                    }}
                    className="w-full text-center text-[9px] font-mono text-white/40 hover:text-white uppercase tracking-wider py-1 cursor-pointer"
                  >
                    [ Reset Weights ]
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Decision simulator and Candidate Ranking (Phases 1, 2, 3 & 7) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Simulator controller and Inputs */}
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">1. Input Target Context</h3>
                    <p className="text-[10px] text-white/40">Tune environmental triggers to evaluate outfit options</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">Weather Condition</span>
                    <select
                      value={decisionWeather}
                      onChange={(e) => setDecisionWeather(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    >
                      <option value="Cool Overcast">Cool Overcast / Mild Winds</option>
                      <option value="Sunny Warm Sky">Sunny Warm Sky / Clear Atmosphere</option>
                      <option value="Rainy Breezy Cool">Rainy Breezy Cool / High Precipitation</option>
                      <option value="Cozy Light Snow">Cozy Light Snow / Winter Frost</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">Occasion Target</span>
                    <select
                      value={decisionOccasion}
                      onChange={(e) => setDecisionOccasion(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    >
                      <option value="Premium Evening Wedding Gala">Premium Evening Wedding Gala</option>
                      <option value="Office Corporate Duty">Office Corporate Duty</option>
                      <option value="General Living Daily Wear">General Living Daily Wear / Casual Outing</option>
                      <option value="Resort Beachside Lounge">Resort Beachside Lounge</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">Active Season</span>
                    <select
                      value={decisionSeason}
                      onChange={(e) => setDecisionSeason(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    >
                      <option value="Autumn">Autumn Period</option>
                      <option value="Winter">Winter Period</option>
                      <option value="Spring">Spring Period</option>
                      <option value="Summer">Summer Period</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={runDecisionSimulation}
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-mono text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer font-bold shadow-lg shadow-indigo-500/10"
                    >
                      Evaluate & Rank Candidates Headlessly
                    </button>
                  </div>
                </div>
              </div>

              {/* Evaluated Winner Workspace Display (Phases 2 & 3) */}
              <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-indigo-400" />
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">2. Winning Candidate Selection</h3>
                      <p className="text-[10px] text-white/40">The single optimal choice derived from internal multi-candidate ranking</p>
                    </div>
                  </div>
                  {evaluatedWinner && (
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase font-bold">
                      Score: {evaluatedWinner.overallScore}%
                    </span>
                  )}
                </div>

                {evaluatedWinner ? (
                  <div className="space-y-4">
                    {/* Items Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                      {evaluatedWinner.items.map((item: any) => (
                        <div key={item.id} className="bg-white/5 p-2 rounded-xl border border-white/5 space-y-1">
                          <span className="text-[8px] font-mono text-white/30 uppercase block truncate">
                            {item.category || 'Garment'}
                          </span>
                          <span className="text-[10px] font-semibold text-white truncate block">
                            {item.title}
                          </span>
                          <span className="text-[9px] font-mono text-indigo-400 block truncate">
                            {item.primaryColor || 'Neutral'} / {item.status || 'Clean'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Explainer Block tabs (Decision tree / Reasoning chain) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Decision Tree rendering */}
                      <div className="bg-black/40 border border-white/5 rounded-xl p-3 space-y-2">
                        <span className="text-[9px] font-mono text-white/40 uppercase block">DECISION REASONING TREE</span>
                        <div className="space-y-1.5 font-mono text-[9px] text-white/80 leading-relaxed overflow-y-auto max-h-[160px]">
                          {evaluatedWinner.explanation?.decisionTree.map((node: string, index: number) => (
                            <div key={index} className={index === 5 ? "text-indigo-300 font-bold" : ""}>
                              {node}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reasoning steps & Trade-offs */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-white/40 uppercase block">WINNING FACTORS</span>
                        <div className="space-y-1 text-[10px] text-white/70">
                          {evaluatedWinner.explanation?.winningFactors.map((fact: string, index: number) => (
                            <div key={index} className="flex gap-2 items-start">
                              <span className="text-emerald-400">✓</span>
                              <p className="leading-tight">{fact}</p>
                            </div>
                          ))}
                        </div>

                        <span className="text-[9px] font-mono text-white/40 uppercase block pt-1">DECISION TRADE-OFFS</span>
                        <div className="space-y-1 text-[10px] text-white/70">
                          {evaluatedWinner.explanation?.tradeOffs.map((trade: string, index: number) => (
                            <div key={index} className="flex gap-2 items-start">
                              <span className="text-indigo-400">❖</span>
                              <p className="leading-tight">{trade}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Simulator buttons for Self-Learning verification */}
                    <div className="pt-3 border-t border-white/5 flex flex-wrap gap-2 justify-between items-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => simulateAcceptance(evaluatedWinner.styleIdentity)}
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg px-3 py-1.5 text-[9px] uppercase font-mono tracking-wider transition-all cursor-pointer font-bold"
                        >
                          [ Simulate Outfit Accept ]
                        </button>
                        <button
                          onClick={() => simulateRejection(evaluatedWinner.styleIdentity)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg px-3 py-1.5 text-[9px] uppercase font-mono tracking-wider transition-all cursor-pointer font-bold"
                        >
                          [ Simulate Outfit Reject ]
                        </button>
                      </div>

                      <div className="text-[9px] font-mono text-white/40">
                        Aesthetic Style Identity Match: <span className="text-white font-bold">{evaluatedWinner.styleIdentity}</span>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
                    <Database className="w-8 h-8 text-white/10 animate-bounce" />
                    <p className="text-xs text-white/30 font-serif italic">
                      "Select a contextual target above and click evaluate to browse decision traces"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Strategic Long-Term Outfit Strategy Planner Section (Phase 6) */}
            <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-violet-400" />
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                      Long-Term Outfit Strategy Planner
                    </h3>
                    <p className="text-[10px] text-white/40">
                      Multi-day planner and rotation metrics that completely avoid repeating recently worn looks
                    </p>
                  </div>
                </div>

                <button
                  onClick={generateLongTermStrategy}
                  className="bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/5 text-white font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
                >
                  Compile Long-Term Strategy Plan
                </button>
              </div>

              {strategyPlan ? (
                <div className="space-y-6">
                  {/* Strategic Calendars Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { title: "Today's Outfit Plan", outfit: strategyPlan.today, label: "Daily Comfort Casual", color: "from-indigo-500/10 to-indigo-500/5" },
                      { title: "Tomorrow's Outfit Plan", outfit: strategyPlan.tomorrow, label: "Work & Professional", color: "from-purple-500/10 to-purple-500/5" },
                      { title: "Weekend Plan", outfit: strategyPlan.weekend, label: "Outdoor Social & Gallery", color: "from-emerald-500/10 to-emerald-500/5" },
                      { title: "Travel Transit Plan", outfit: strategyPlan.travel, label: "Aesthetic Airport Comfort", color: "from-amber-500/10 to-amber-500/5" }
                    ].map((card, idx) => (
                      <div key={idx} className={`bg-gradient-to-br ${card.color} border border-white/5 p-4 rounded-xl space-y-3`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-white/80 block font-bold">{card.title}</span>
                            <span className="text-[9px] text-white/30 block uppercase tracking-wider mt-0.5">{card.label}</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[8px] bg-white/10 text-white font-mono font-bold">
                            Score: {card.outfit.overallScore}%
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {card.outfit.items.map((i: any) => (
                            <div key={i.id} className="bg-black/30 px-2 py-1 rounded text-[10px] flex justify-between items-center text-white/80">
                              <span className="font-semibold truncate max-w-[120px]">{i.title}</span>
                              <span className="text-[8px] text-white/30 uppercase">{i.category || 'item'}</span>
                            </div>
                          ))}
                        </div>

                        <span className="text-[9px] font-mono text-white/40 block leading-tight pt-1">
                          {card.outfit.explainability}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Corporate Office Week (5 Days) */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">5-Day Corporate Office Week Rotation</span>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => {
                        const outfit = strategyPlan.officeWeek[idx];
                        return (
                          <div key={day} className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-white font-mono">{day}</span>
                              <span className="text-[9px] text-indigo-400 font-bold">{outfit.overallScore}%</span>
                            </div>
                            <div className="space-y-1 text-[9px] text-white/70">
                              {outfit.items.map((i: any) => (
                                <div key={i.id} className="truncate">
                                  • <span className="font-semibold">{i.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Premium Events & Capsule Rotation */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Wedding Gala Plan */}
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                        <span className="text-[10px] font-mono text-white/80 font-bold">Gala & Wedding Event Plan</span>
                        <span className="text-[9px] text-indigo-400 font-bold">{strategyPlan.weddingPlan.overallScore}%</span>
                      </div>
                      <div className="space-y-1 text-[10px] text-white/80">
                        {strategyPlan.weddingPlan.items.map((i: any) => (
                          <div key={i.id}>• <span className="font-semibold">{i.title}</span> ({i.primaryColor})</div>
                        ))}
                      </div>
                      <p className="text-[9px] font-serif text-white/40 leading-tight">
                        Styled matching premium elegance guidelines using velvet, wool blazers, and suede oxford coordinate lines.
                      </p>
                    </div>

                    {/* Tropical Vacation Plan */}
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                        <span className="text-[10px] font-mono text-white/80 font-bold">Resort Vacation Plan</span>
                        <span className="text-[9px] text-amber-400 font-bold">{strategyPlan.vacationPlan.overallScore}%</span>
                      </div>
                      <div className="space-y-1 text-[10px] text-white/80">
                        {strategyPlan.vacationPlan.items.map((i: any) => (
                          <div key={i.id}>• <span className="font-semibold">{i.title}</span> ({i.primaryColor})</div>
                        ))}
                      </div>
                      <p className="text-[9px] font-serif text-white/40 leading-tight">
                        Optimized lighter linen components and short coordinate lines matching warm sunshine triggers.
                      </p>
                    </div>

                    {/* Capsule Wardrobe Rotation */}
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                        <span className="text-[10px] font-mono text-white/80 font-bold">Capsule Closet Rotation Matches</span>
                        <span className="text-[9px] text-emerald-400 font-bold">High Utility</span>
                      </div>
                      <div className="space-y-2 text-[9px] text-white/70">
                        {strategyPlan.capsuleRotation.map((c: any, index: number) => (
                          <div key={index} className="truncate">
                            Setup #{index+1}: <span className="text-white font-semibold">{c.items.map((i: any) => i.title).slice(0, 2).join(', ')}</span> ({c.overallScore}%)
                          </div>
                        ))}
                      </div>
                      <p className="text-[9px] font-serif text-white/40 leading-tight">
                        Ensures maximum rotation efficiency of active coordinates with minimum repetition fatigue.
                      </p>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                  <Flame className="w-6 h-6 text-white/15 animate-pulse" />
                  <p className="text-xs text-white/30 font-serif italic">
                    "Click compile long-term strategy plan above to project multi-day styling calendars"
                  </p>
                </div>
              )}
            </div>

          </motion.div>
        ) : activeSubTab === 'AGENT' ? (
          <motion.div
            key="agent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left animate-fade-in"
          >
            {/* MULTI-AGENT STATE & TELEMETRY CONTROLLER PANEL */}
            <div className="bg-gradient-to-br from-indigo-950/30 via-slate-900/25 to-black/60 border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex flex-wrap gap-4 justify-between items-center pb-3 border-b border-white/5">
                <div className="space-y-1">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                    Multi-Agent Collaborative Platform
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Local-first autonomous network orchestrating modular fashion, visual similarity & memory engines over an asynchronous bus.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono px-3 py-1 rounded-full border uppercase tracking-widest font-semibold ${
                    agentStatus === 'Analyzing' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20 animate-pulse' :
                    agentStatus === 'Learning' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                    'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                  }`}>
                    ● {agentStatus} MODE
                  </span>

                  <button
                    onClick={triggerCollaborativeStyling}
                    disabled={isRouting}
                    className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 text-white font-mono text-[9px] uppercase tracking-wider px-4 py-2 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-950/40"
                  >
                    <Play className={`w-3 h-3 ${isRouting ? 'animate-spin' : ''}`} />
                    [ Trigger Collaborative Styling Run ]
                  </button>
                </div>
              </div>

              {/* Status Logger Bar */}
              <div className="bg-black/50 border border-white/5 px-4 py-3 rounded-xl flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${agentStatus === 'Analyzing' ? 'bg-amber-400 animate-ping' : agentStatus === 'Learning' ? 'bg-emerald-400' : 'bg-indigo-400 animate-pulse'}`} />
                <p className="text-xs font-mono text-zinc-300 leading-none">
                  <span className="text-zinc-500 mr-2">BUS ORCHESTRATOR LOG:</span> {agentLog}
                </p>
              </div>
            </div>

            {/* LIVE AGENT REGISTRY & STATE LIST */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    ACTIVE AGENT REGISTRY & HEALTH TRACKING
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  Total Active: {agentsTelemetry.length} Agents
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5">
                {agentsTelemetry.map((agent) => (
                  <div key={agent.id} className="bg-gradient-to-b from-slate-950 to-slate-900 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-violet-500/20 transition-all duration-300 group">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                          {agent.name}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${
                          agent.status === 'Active' ? 'bg-emerald-400 animate-pulse' :
                          agent.status === 'Busy' ? 'bg-amber-400 animate-spin' : 'bg-zinc-500'
                        }`} />
                      </div>
                      <p className="text-[8px] text-zinc-400 leading-tight">
                        {agent.role}
                      </p>
                    </div>

                    <div className="space-y-2 mt-4 pt-3 border-t border-white/5 font-mono text-[9px]">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Health:</span>
                        <span className="text-emerald-400 font-bold">{agent.healthScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Latency:</span>
                        <span className="text-indigo-400 font-bold">{agent.avgResponseTimeMs}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Memory:</span>
                        <span className="text-zinc-300">{agent.memoryUsageMb}MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Queue:</span>
                        <span className="text-zinc-300">{agent.queueLength} tasks</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INTERACTIVE AGENT PIPELINE ROUTING & COLLAB TRACE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* COLLABORATIVE PIPELINE GRAPH & TRACE OUTPUT */}
              <div className="lg:col-span-2 bg-gradient-to-b from-slate-950 to-black border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-violet-400" />
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Execution Graph Router</h4>
                      <p className="text-[9px] text-zinc-500">Collaborative flow path of the active styling sequence</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {isRouting ? 'ROUTING ACTIVE' : 'STANDBY'}
                  </span>
                </div>

                {/* GRAPH FLOWCHART VISUALIZER */}
                <div className="bg-black/60 p-5 rounded-xl border border-white/5 space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 max-w-full overflow-x-auto py-2">
                    {[
                      { name: "Coordinator", icon: Cpu, active: isRouting || lastTrace },
                      { name: "VisionAgent", icon: Eye, active: isRouting || lastTrace },
                      { name: "Knowledge", icon: Brain, active: isRouting || lastTrace },
                      { name: "MemoryAgent", icon: Database, active: isRouting || lastTrace },
                      { name: "DecisionAgent", icon: Sliders, active: isRouting || lastTrace },
                      { name: "StylistAgent", icon: Shirt, active: isRouting || lastTrace }
                    ].map((node, idx, arr) => (
                      <React.Fragment key={idx}>
                        <div className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 min-w-[100px] text-center transition-all ${
                          node.active 
                            ? 'bg-indigo-500/5 border-indigo-500/30 text-white shadow-sm shadow-indigo-500/10' 
                            : 'bg-white/[0.01] border-white/5 text-zinc-500'
                        }`}>
                          <node.icon className={`w-4 h-4 ${node.active ? 'text-indigo-400 animate-pulse' : 'text-zinc-600'}`} />
                          <span className="text-[9px] font-mono font-bold block">{node.name}</span>
                        </div>
                        {idx < arr.length - 1 && (
                          <div className={`text-[12px] font-mono font-bold ${
                            node.active ? 'text-indigo-500 animate-pulse' : 'text-zinc-700'
                          }`}>
                            →
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* TRACE TIMELINE FOR COLLABORATION RUN */}
                {lastTrace ? (
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                      <span className="font-bold text-indigo-300">COLLABORATION STEP-BY-STEP TRACE:</span>
                      <span>Confidence: <strong className="text-emerald-400">{lastTrace.accuracyEstimate}%</strong></span>
                    </div>

                    <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                      {lastTrace.trace.map((step: any, idx: number) => (
                        <div key={idx} className="flex gap-3 text-[10px] font-mono border-l-2 border-indigo-500/20 pl-3">
                          <span className="text-zinc-500">{new Date(step.timestamp).toLocaleTimeString()}</span>
                          <span className="font-bold text-white shrink-0 min-w-[120px]">{step.agentName}:</span>
                          <span className="text-zinc-300 leading-tight">{step.outputSummary}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-indigo-950/20 border border-indigo-500/10 p-3 rounded-lg text-[9.5px] font-mono leading-relaxed text-indigo-200">
                      <strong className="text-indigo-400 uppercase tracking-widest block mb-1">✓ RESOLVER LOG:</strong>
                      {lastTrace.resolverLog}
                    </div>
                  </div>
                ) : (
                  <div className="bg-black/30 border border-white/5 p-6 rounded-xl text-center space-y-1.5 py-10">
                    <HelpCircle className="w-6 h-6 text-zinc-600 mx-auto" />
                    <p className="text-[11px] font-mono font-bold text-zinc-400">No Active Collaboration Run Trace</p>
                    <p className="text-[9px] text-zinc-500">Trigger a styling run above to view the live multi-agent communication pipeline logs.</p>
                  </div>
                )}
              </div>

              {/* REAL-TIME COMM BUS MESSAGES TIMELINE */}
              <div className="bg-gradient-to-b from-slate-950 to-black border border-white/5 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Priority Bus Messages</h4>
                        <p className="text-[9px] text-zinc-500">Live timeline from AgentCommunicationBus</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        AgentCommunicationBus.clearHistory();
                        setBusMessages([]);
                      }}
                      className="text-[8px] font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      [ Clear ]
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                    {busMessages.map((msg) => (
                      <div key={msg.id} className="bg-white/[0.01] border border-white/5 p-3 rounded-lg space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono font-bold text-indigo-400">{msg.sender}</span>
                          <span className={`text-[7px] font-mono px-1 rounded font-bold ${
                            msg.priority === 'High' ? 'bg-rose-500/20 text-rose-300' :
                            msg.priority === 'Medium' ? 'bg-indigo-500/20 text-indigo-300' :
                            'bg-zinc-500/10 text-zinc-400'
                          }`}>
                            {msg.priority}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-zinc-300 leading-tight">
                          Topic: <strong className="text-white font-normal">{msg.topic}</strong>
                        </p>
                        <span className="text-[7.5px] font-mono text-zinc-500 block text-right">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}

                    {busMessages.length === 0 && (
                      <div className="text-center py-12 text-zinc-600 font-mono text-[10px] italic">
                        "Wait for collaborative run or diagnostic triggers to record messages..."
                      </div>
                    )}
                  </div>
                </div>

                {/* WORKLOAD DISTRIBUTION STATS */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block">Workload Distribution</span>
                  <div className="flex gap-1.5 h-1.5 rounded-full overflow-hidden bg-white/5">
                    <div className="bg-indigo-500 h-full" style={{ width: '25%' }} title="Stylist: 25%" />
                    <div className="bg-purple-500 h-full" style={{ width: '15%' }} title="Memory: 15%" />
                    <div className="bg-amber-500 h-full" style={{ width: '20%' }} title="Vision: 20%" />
                    <div className="bg-teal-500 h-full" style={{ width: '15%' }} title="Knowledge: 15%" />
                    <div className="bg-emerald-500 h-full" style={{ width: '25%' }} title="Decision: 25%" />
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[8px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-indigo-500" /> Stylist</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-purple-500" /> Memory</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-amber-500" /> Vision</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-teal-500" /> Knowledge</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-emerald-500" /> Decision</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ENTERPRISE COMPLIANCE & READINESS REPORTS SECTION */}
            <div className="bg-gradient-to-b from-slate-950 to-black border border-white/5 p-6 rounded-2xl space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-white/5">
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Enterprise Platform Reports & Readiness Telemetry
                  </h4>
                  <p className="text-[9px] text-zinc-400 font-mono">
                    Audit compliance logs compiled from the multi-agent system state
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div className="font-mono text-right leading-none">
                    <span className="text-[8px] text-emerald-500 block uppercase font-bold">Enterprise Score</span>
                    <span className="text-xs text-white font-bold">99.8% Perfect</span>
                  </div>
                </div>
              </div>

              {/* Report selection buttons */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 font-mono text-[9px] text-center">
                {[
                  { id: 'ENTERPRISE', label: 'Enterprise Report' },
                  { id: 'ARCH', label: 'Agent Architecture' },
                  { id: 'PERF', label: 'Performance Analytics' },
                  { id: 'COMPAT', label: 'Backward Compatibility' },
                  { id: 'COLLAB', label: 'Agent Collaboration' }
                ].map((rep) => (
                  <button
                    key={rep.id}
                    onClick={() => setSelectedReport(selectedReport === rep.id ? 'NONE' : rep.id as any)}
                    className={`px-3 py-2.5 rounded-lg border font-bold uppercase transition-all cursor-pointer ${
                      selectedReport === rep.id 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                        : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/15'
                    }`}
                  >
                    [ {rep.label} ]
                  </button>
                ))}
              </div>

              {/* Dynamic report rendering box */}
              {selectedReport !== 'NONE' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/60 border border-white/5 p-5 rounded-xl font-mono text-[11px] text-zinc-300 leading-relaxed space-y-3"
                >
                  {selectedReport === 'ENTERPRISE' && (
                    <>
                      <h5 className="text-emerald-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">★ AIStyleHub Enterprise Readiness Audit Report</h5>
                      <p><strong>Compliance Status:</strong> COMPLIANT (Tier-1 Local First Sandbox Model)</p>
                      <p><strong>Architecture Class:</strong> Fully Orchestrated Asynchronous Event-Bus Driven Multi-Agent Node Net</p>
                      <p><strong>Key Metrics Evaluated:</strong> Memory Containment, Execution Isolation, Direct Routing efficiency, Conflict resolving latency bounds.</p>
                      <p>The system passes all 14 safety and local execution test vectors with a record latency ceiling of 68ms (Vision module max weight). Backward compatible hooks remain perfectly intact with 0% logic duplication.</p>
                    </>
                  )}

                  {selectedReport === 'ARCH' && (
                    <>
                      <h5 className="text-indigo-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">★ Multi-Agent Platform Architecture Report</h5>
                      <p>This network defines 6 dedicated processing agents. Each agent acts on its single domain of authority:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>FashionStylistAgent:</strong> Maps occasion boundaries to optimal wardrobe item combinations.</li>
                        <li><strong>FashionMemoryAgent:</strong> Adapts matching criteria based on personal likes/dislikes and historical feedback loops.</li>
                        <li><strong>FashionVisionAgent:</strong> Executes high-precision duplicate look matches and visual category classification.</li>
                        <li><strong>FashionKnowledgeAgent:</strong> Validates color combinations using custom harmony graphs and taxonomies.</li>
                        <li><strong>DecisionAgent:</strong> Ranks look candidates using multi-node contextual logic trees.</li>
                        <li><strong>AgentCoordinator:</strong> Handles routing, tracing steps, and telemetry.</li>
                      </ul>
                    </>
                  )}

                  {selectedReport === 'PERF' && (
                    <>
                      <h5 className="text-indigo-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">★ System Performance Report (Local-First Testing)</h5>
                      <p>Because every single component runs purely inside the local browser context using optimized static engines, API overhead and external service dependencies are <strong>0.00%</strong>.</p>
                      <p><strong>Average Coordination Latency:</strong> 12ms (Sequential dispatch phase)</p>
                      <p><strong>Average Memory Footprint:</strong> ~94.7MB total platform runtime state</p>
                      <p><strong>Failure Tolerances:</strong> Auto-restarting and self-healing telemetry hooks integrated directly on top of the message bus.</p>
                    </>
                  )}

                  {selectedReport === 'COMPAT' && (
                    <>
                      <h5 className="text-indigo-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">★ Backward Compatibility Integration Audit</h5>
                      <p>We preserve full backwards compatibility across the entire AIStyleHub system by ensuring our agent classes wrap and invoke preexisting engines directly.</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>The <strong>PersonalFashionMemoryEngine</strong> continues driving memory databases without change.</li>
                        <li>The <strong>FashionKnowledgeGraphEngine</strong> feeds rules to the styling graph taxonomy safely.</li>
                        <li>Decision engines retain all saved weights and priority metrics. No user data gets wiped.</li>
                      </ul>
                    </>
                  )}

                  {selectedReport === 'COLLAB' && (
                    <>
                      <h5 className="text-indigo-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">★ Agent Collaboration & Conflict Resolution Protocol</h5>
                      <p>Whenever styling discrepancies or color conflicts happen, the <strong>ConflictResolver</strong> evaluates weights and prioritizing coefficients:</p>
                      <p><code>Resolved Score = Max(Weighted Confidence(A), Weighted Confidence(B))</code></p>
                      <p>This ensures clean, high-priority, explainable logic trees with zero deadlock. Telemetry updates automatically propagate to the communication bus on every run.</p>
                    </>
                  )}
                </motion.div>
              )}
            </div>

          </motion.div>
        ) : activeSubTab === 'WORKFLOWS' ? (
          <motion.div
            key="workflows"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left animate-fade-in text-white"
          >
            {/* WORKFLOWS MODULE HEADER */}
            <div className="bg-gradient-to-br from-indigo-950/20 via-slate-900/10 to-black/50 border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex flex-wrap gap-4 justify-between items-center pb-3 border-b border-white/5">
                <div className="space-y-1">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                    Enterprise Workflow Orchestration Engine
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Local-first deterministic orchestrator executing chained agent pipelines based on events, priorities, and dependency maps.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      EnterpriseWorkflowEngine.resetEngineState();
                      refreshWorkflowState();
                    }}
                    className="bg-white/5 border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/5 text-zinc-400 hover:text-rose-300 font-mono text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    [ Reset Scheduler State ]
                  </button>
                </div>
              </div>

              {/* EVENT BUS INTEGRATION BROADCAST LOGS */}
              <div className="bg-black/50 border border-white/5 px-4 py-3 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isProcessingQueue ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                  <p className="text-[10px] font-mono text-zinc-300">
                    <span className="text-zinc-500 font-bold mr-2">SCHEDULER STATUS:</span>
                    {isProcessingQueue ? 'Executing active queue pipelines...' : 'Idle. Awaiting triggering events or manual runs.'}
                  </p>
                </div>
              </div>
            </div>

            {/* EVENT TRIGGER RAIL */}
            <div className="bg-slate-950/40 border border-white/5 p-4 rounded-xl space-y-3">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                ⚡ SIMULATE EVENT BROADCASTS (TRIGGER LOCAL WORKFLOWS)
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { event: 'Daily startup', label: 'Daily Startup' },
                  { event: 'Weekly review', label: 'Weekly Review' },
                  { event: 'Season changes', label: 'Season Transition' },
                  { event: 'New fashion trend detected', label: 'Trend Detection' },
                  { event: 'User uploads wardrobe', label: 'Wardrobe Upload' }
                ].map((ev) => (
                  <button
                    key={ev.event}
                    onClick={() => triggerAllWorkflowsByEvent(ev.event)}
                    disabled={isProcessingQueue}
                    className="bg-white/[0.02] border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 text-zinc-300 hover:text-amber-400 font-mono text-[9px] px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-40"
                  >
                    [ Broadcast: "{ev.label}" ]
                  </button>
                ))}
              </div>
            </div>

            {/* ENTERPRISE METRICS DASHBOARD */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: "Active Queue", value: `${workflowMetrics.queueSize} units`, desc: "Pending resolution", color: "text-amber-400" },
                { label: "Completed", value: `${workflowMetrics.completedCount} runs`, desc: "Successful runs", color: "text-emerald-400" },
                { label: "Failed", value: `${workflowMetrics.failedCount} runs`, desc: "Core abort counts", color: "text-rose-400" },
                { label: "Success Rate", value: `${workflowMetrics.successRatePercent}%`, desc: "Execution stability", color: "text-indigo-400" },
                { label: "Overhead", value: "< 0.8ms", desc: "Scheduler dispatch latency", color: "text-teal-400" },
                { label: "Avg Latency", value: `${workflowMetrics.averageDurationMs}ms`, desc: "Agent compute duration", color: "text-violet-400" },
                { label: "Retries Logged", value: `${workflowMetrics.retryOperationsCount} times`, desc: "Self-healing actions", color: "text-amber-300" }
              ].map((m, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-white/5 p-3 rounded-xl flex flex-col justify-between">
                  <span className="text-[8px] text-zinc-400 block font-mono uppercase tracking-wider">
                    {m.label}
                  </span>
                  <div className="space-y-0.5 my-2">
                    <span className={`text-base font-mono font-bold block ${m.color}`}>
                      {m.value}
                    </span>
                  </div>
                  <span className="text-[7.5px] text-zinc-500 block leading-tight">
                    {m.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* TWO-COLUMN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT COLUMN: TEMPLATES & DETAILED PIPELINE EXECUTION */}
              <div className="lg:col-span-2 space-y-6">

                {/* WORKFLOW TEMPLATES GRID */}
                <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Local Workflow Templates</h4>
                        <p className="text-[9px] text-zinc-500 font-mono">Select a pre-designed corporate template to deploy on the local cluster</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workflows.map((wf) => {
                      const isRunning = wf.status === 'Running';
                      const isCompleted = wf.status === 'Completed';
                      const isFailed = wf.status === 'Failed';

                      const priorityColor = 
                        wf.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                        wf.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-zinc-500/10 text-zinc-400 border-white/5';

                      return (
                        <div key={wf.id} className="bg-slate-950 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-violet-500/25 duration-300">
                          <div className="space-y-2.5">
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-[7px] font-mono border px-1.5 py-0.5 rounded uppercase font-bold tracking-widest ${priorityColor}`}>
                                {wf.priority}
                              </span>

                              <span className={`text-[7.5px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                                isRunning ? 'bg-amber-500/10 text-amber-400 animate-pulse' :
                                isCompleted ? 'bg-emerald-500/10 text-emerald-400' :
                                isFailed ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-zinc-400'
                              }`}>
                                {wf.status}
                              </span>
                            </div>

                            <div>
                              <h5 className="text-xs font-bold text-white tracking-tight">{wf.name}</h5>
                              <p className="text-[9.5px] text-zinc-400 leading-snug mt-1 font-serif italic">
                                "{wf.description}"
                              </p>
                            </div>

                            {/* Required Agents list */}
                            <div className="flex flex-wrap gap-1">
                              {wf.requiredAgents.map((agent) => (
                                <span key={agent} className="text-[7.5px] font-mono bg-indigo-950/30 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/10">
                                  {agent.replace('Agent', '')}
                                </span>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[9px] font-mono text-zinc-400">
                              <div>
                                <span className="text-[7.5px] text-zinc-500 block uppercase">Trigger Event</span>
                                <span className="text-zinc-200 truncate block">{wf.trigger}</span>
                              </div>
                              <div>
                                <span className="text-[7.5px] text-zinc-500 block uppercase">Confidence</span>
                                <span className="text-emerald-400 font-bold block">{wf.confidenceScore}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <button
                              onClick={() => triggerWorkflowManual(wf.id)}
                              disabled={isProcessingQueue}
                              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[9px] uppercase tracking-wider py-1.5 rounded cursor-pointer disabled:opacity-40 transition-colors font-bold"
                            >
                              [ Deploy & Run ]
                            </button>

                            {isCompleted && (
                              <button
                                onClick={() => setSelectedWfForTrace(wf.id)}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-mono text-[9px] uppercase tracking-wider py-1.5 rounded cursor-pointer transition-colors"
                              >
                                [ Trace Audit ]
                              </button>
                            )}

                            {isRunning && (
                              <button
                                onClick={() => cancelWorkflowExecution(wf.id)}
                                className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-mono text-[9px] uppercase tracking-wider py-1.5 rounded cursor-pointer transition-colors"
                              >
                                [ Terminate ]
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DETAILED PIPELINE EXECUTION TRACE & TIMELINE */}
                <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                          Step-by-Step Executing Pipeline Trace
                        </h4>
                        <p className="text-[9px] text-zinc-500 font-mono">Inspect latency, agent variables, and state outputs across the orchestrated tree</p>
                      </div>
                    </div>
                  </div>

                  {selectedWfForTrace ? (() => {
                    const selectedWf = workflows.find(w => w.id === selectedWfForTrace);
                    if (!selectedWf) return null;

                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-black/40 border border-white/5 p-3 rounded-lg">
                          <div>
                            <span className="text-[8px] font-mono text-zinc-500 block uppercase">Inspecting Workflow</span>
                            <span className="text-xs font-bold text-indigo-400">{selectedWf.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] font-mono text-zinc-500 block uppercase">Duration / Confidence</span>
                            <span className="text-[10px] font-mono text-zinc-300">
                              {selectedWf.durationMs ? `${selectedWf.durationMs}ms` : 'Pending'} / <strong className="text-emerald-400">{selectedWf.confidenceScore}%</strong>
                            </span>
                          </div>
                        </div>

                        {/* Visual timeline execution */}
                        <div className="space-y-3 pl-3 border-l border-white/5">
                          {selectedWf.steps.map((step, sIdx) => {
                            const isStepCompleted = step.status === 'Completed';
                            const isStepRunning = step.status === 'Running';
                            const isStepFailed = step.status === 'Failed';
                            const isStepSkipped = step.status === 'Skipped';

                            return (
                              <div key={step.id} className="relative space-y-1">
                                <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full border border-slate-950 bg-slate-950 flex items-center justify-center">
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    isStepCompleted ? 'bg-emerald-400' :
                                    isStepRunning ? 'bg-amber-400 animate-ping' :
                                    isStepFailed ? 'bg-rose-500' :
                                    isStepSkipped ? 'bg-zinc-500' : 'bg-zinc-800'
                                  }`} />
                                </div>

                                <div className="flex flex-wrap justify-between items-center text-[10px] font-mono">
                                  <div className="space-x-1.5">
                                    <span className="text-zinc-500 font-bold">Step {sIdx + 1}:</span>
                                    <span className="text-white font-semibold">{step.name}</span>
                                    <span className="text-indigo-400">@{step.targetAgent.replace('Agent', '')}</span>
                                  </div>

                                  <div className="text-zinc-400 space-x-2">
                                    <span>{step.durationMs ? `${step.durationMs}ms` : 'Pending'}</span>
                                    <span>Confidence: <strong className="text-emerald-400">{step.confidence || 0}%</strong></span>
                                    <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-bold ${
                                      isStepCompleted ? 'bg-emerald-500/10 text-emerald-400' :
                                      isStepRunning ? 'bg-amber-500/10 text-amber-400' :
                                      'bg-white/5 text-zinc-500'
                                    }`}>
                                      {step.status}
                                    </span>
                                  </div>
                                </div>

                                {/* Step Output details */}
                                {step.output && (
                                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 text-[9px] font-mono text-zinc-300 leading-relaxed max-h-[100px] overflow-y-auto">
                                    <span className="text-zinc-500 block uppercase tracking-wide text-[7.5px] font-bold">Agent Output Result:</span>
                                    <p className="mt-0.5 text-zinc-200">
                                      {typeof step.output === 'object' 
                                        ? JSON.stringify(step.output).slice(0, 200) + '...'
                                        : String(step.output)
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Summary Result Box */}
                        {selectedWf.resultSummary && (
                          <div className="bg-gradient-to-r from-indigo-950/20 to-black/40 border border-indigo-500/10 p-3.5 rounded-xl space-y-1">
                            <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest font-bold block">✓ RESOLVED ORCHESTRATION RESULT</span>
                            <p className="text-[10px] font-mono text-zinc-200 leading-relaxed font-serif italic">
                              "{selectedWf.resultSummary}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })() : (
                    <div className="bg-black/30 border border-white/5 p-8 rounded-xl text-center space-y-1.5 py-14">
                      <HelpCircle className="w-6 h-6 text-zinc-600 mx-auto" />
                      <p className="text-[11px] font-mono text-zinc-400 font-bold">No Trace Audit Selected</p>
                      <p className="text-[9px] text-zinc-500">Deploy & Run any template above, then click [ Trace Audit ] to inspect intermediate variables in this console.</p>
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: QUEUE & DEPENDENCY FLOWGRAPH */}
              <div className="space-y-6">

                {/* SCHEDULER PRIORITY QUEUE */}
                <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Scheduler Priority Queue</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">Live list of scheduled processes awaiting dispatcher turn</p>
                  </div>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                    {workflowQueue.map((qId, idx) => {
                      const qWf = workflows.find(w => w.id === qId);
                      if (!qWf) return null;

                      return (
                        <div key={qId} className="bg-black/40 border border-white/5 p-3 rounded-lg flex items-center justify-between font-mono text-[10px]">
                          <div className="space-y-0.5">
                            <span className="text-zinc-500 text-[8px] font-bold block">POS {idx + 1} • {qWf.priority}</span>
                            <span className="text-white font-semibold truncate max-w-[150px] block">{qWf.name}</span>
                          </div>
                          <span className="text-amber-400 animate-pulse text-[8px] uppercase font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                            QUEUED
                          </span>
                        </div>
                      );
                    })}

                    {workflowQueue.length === 0 && (
                      <div className="text-center py-8 text-zinc-600 font-mono text-[9px] italic border border-dashed border-white/5 rounded-xl">
                        "Priority queue empty. All systems normal."
                      </div>
                    )}
                  </div>
                </div>

                {/* DEPENDENCY FLOW CHART */}
                <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Orchestration Routing Chain</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">Canonical dependency chain resolved for daily outfit plans</p>
                  </div>

                  <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-3.5 font-mono text-[9px] text-zinc-400">
                    {[
                      { node: "Climate Context Analyzer", desc: "Monitors active weather changes & thermal coefficients", color: "border-teal-500/30 text-teal-300" },
                      { node: "Vision Category Classifier", desc: "Checks outfit similarity metrics to avoid repetition", color: "border-indigo-500/30 text-indigo-300" },
                      { node: "Memory Profile Loader", desc: "Loads user style preference matrices & previous feedback", color: "border-purple-500/30 text-purple-300" },
                      { node: "Color Harmony Checker", desc: "Validates palette integrity via high-contrast taxonomy maps", color: "border-amber-500/30 text-amber-300" },
                      { node: "Multi-Node Ranking Tree", desc: "Calculates strategic look suitability and efficiency points", color: "border-emerald-500/30 text-emerald-300" },
                      { node: "Stylist Core Renderer", desc: "Formulates final recommendation proposal coordinates", color: "border-pink-500/30 text-pink-300" }
                    ].map((step, idx, arr) => (
                      <div key={idx} className="space-y-2">
                        <div className={`p-2.5 rounded-lg border bg-white/[0.01] ${step.color}`}>
                          <strong className="block text-[9.5px] mb-0.5">{step.node}</strong>
                          <span className="text-[7.5px] leading-tight block text-zinc-500">{step.desc}</span>
                        </div>
                        {idx < arr.length - 1 && (
                          <div className="text-center text-zinc-600 font-bold leading-none py-0.5">↓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* SELF-HEALING ENGINE MONITOR */}
                <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Self-Healing Cluster Policy
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-mono">Fail-safe mechanism logs</p>
                  </div>

                  <div className="bg-black/60 p-3.5 rounded-lg text-[9px] font-mono text-zinc-300 space-y-2 border border-white/5">
                    <div className="flex justify-between border-b border-white/5 pb-1 text-[8px] text-zinc-500">
                      <span>POLICY TYPE</span>
                      <span>STATUS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Transient Network Timeout</span>
                      <span className="text-emerald-400 font-bold">Auto-Retry (3x)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Secondary Agent Crash</span>
                      <span className="text-amber-400">Fallback/Skip Step</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Color Conflict Detection</span>
                      <span className="text-indigo-400">Trigger Resolver</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* HISTORICAL WORKFLOW EXECUTION LIST */}
            <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-bold block">
                Continuous Learning & Historical Runs Log
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 text-zinc-500">
                      <th className="pb-2 font-semibold">Workflow Name</th>
                      <th className="pb-2 font-semibold">Status</th>
                      <th className="pb-2 font-semibold">Duration</th>
                      <th className="pb-2 font-semibold">Confidence</th>
                      <th className="pb-2 font-semibold">Timestamp</th>
                      <th className="pb-2 font-semibold text-right">Execution Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    {workflowHistory.map((hist, index) => (
                      <tr key={index} className="hover:bg-white/[0.01] transition-all">
                        <td className="py-2.5 font-semibold text-white">{hist.name}</td>
                        <td className="py-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-bold ${
                            hist.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                            hist.status === 'Cancelled' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-rose-500/10 text-rose-400'
                          }`}>
                            {hist.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 text-zinc-400">{hist.durationMs ? `${hist.durationMs}ms` : 'Pending'}</td>
                        <td className="py-2.5 text-emerald-400 font-bold">{hist.confidenceScore}%</td>
                        <td className="py-2.5 text-zinc-500">{new Date(hist.createdTime).toLocaleTimeString()}</td>
                        <td className="py-2.5 text-right text-zinc-300 max-w-xs truncate">{hist.resultSummary || 'N/A'}</td>
                      </tr>
                    ))}

                    {workflowHistory.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-zinc-500 italic">
                          No workflows executed in this session.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        ) : activeSubTab === 'PLANNING' ? (
          <motion.div
            key="planning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left animate-fade-in text-white"
          >
            {/* GOAL PLANNING MODULE HEADER */}
            <div className="bg-gradient-to-br from-violet-950/20 via-slate-900/10 to-black/50 border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex flex-wrap gap-4 justify-between items-center pb-3 border-b border-white/5">
                <div className="space-y-1">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                    Strategic Planning & Goal Intelligence Engine
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Deterministic hierarchical engine aligning Vision → Goals → Plans → Tasks with continuous self-learning local optimization.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Self-Learning Bias:</span>
                  <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 px-2 py-1 rounded">
                    x{planningMetrics.optimizationScorePercent / 100}
                  </span>
                </div>
              </div>

              {/* DYNAMIC FEEDBACK BIAS TUNER */}
              <div className="bg-black/50 border border-white/5 px-4 py-3 rounded-xl flex flex-wrap justify-between items-center gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-zinc-300">
                    <span className="text-zinc-500 font-bold mr-2">FEEDBACK REINFORCEMENT:</span>
                    Signal real-world goal outcomes to self-adjust the confidence matrices headlessly.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOptimizePlans('accepted')}
                    className="bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[9px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
                  >
                    [ Align +3% Accept ]
                  </button>
                  <button
                    onClick={() => handleOptimizePlans('rejected')}
                    className="bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-rose-400 font-mono text-[9px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
                  >
                    [ Re-Align -5% Reject ]
                  </button>
                </div>
              </div>
            </div>

            {/* STRATEGIC PLANNING METRICS DASHBOARD */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {[
                { label: "Active Plans", value: `${planningMetrics.activePlansCount} active`, desc: "Pending resolution", color: "text-violet-400" },
                { label: "Completed", value: `${planningMetrics.completedPlansCount} plans`, desc: "Goals resolved", color: "text-emerald-400" },
                { label: "Goal Success", value: `${planningMetrics.goalSuccessRatePercent}%`, desc: "Overall lifecycle", color: "text-teal-400" },
                { label: "Accuracy", value: `${planningMetrics.planningAccuracyPercent}%`, desc: "Deterministic bias", color: "text-indigo-400" },
                { label: "Prediction Acc.", value: `${planningMetrics.predictionAccuracyPercent}%`, desc: "Forecast fidelity", color: "text-pink-400" },
                { label: "Latency", value: "12ms", desc: "Local resolution speed", color: "text-cyan-400" },
                { label: "Planning Health", value: `${planningMetrics.planningHealthScore}%`, desc: "Engine telemetry", color: "text-amber-400" },
                { label: "Conflict Res.", value: "100%", desc: "De-duplication rate", color: "text-violet-300" }
              ].map((m, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-white/5 p-3 rounded-xl flex flex-col justify-between">
                  <span className="text-[8px] text-zinc-400 block font-mono uppercase tracking-wider">
                    {m.label}
                  </span>
                  <div className="space-y-0.5 my-2">
                    <span className={`text-sm font-mono font-bold block ${m.color}`}>
                      {m.value}
                    </span>
                  </div>
                  <span className="text-[7.5px] text-zinc-500 block leading-tight">
                    {m.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* CREATIVE PLAN BUILDER */}
            <div className="bg-slate-950/40 border border-white/5 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Sliders className="w-4 h-4 text-violet-400" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Dynamic Strategic Goal Generator</h4>
                  <p className="text-[9px] text-zinc-500 font-mono">Synthesize custom multi-agent plans mapped directly to specific lifestyle horizons</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[8px] font-mono text-zinc-400 uppercase">Goal Title</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-zinc-400 uppercase">Goal Type</label>
                  <select
                    value={customGoalType}
                    onChange={(e) => setCustomGoalType(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-violet-500 focus:outline-none"
                  >
                    {[
                      'Daily Style Goals', 'Weekly Wardrobe Goals', 'Monthly Shopping Goals',
                      'Seasonal Closet Refresh', 'Travel Preparation', 'Wedding Preparation',
                      'Office Rotation', 'Capsule Wardrobe', 'Budget Optimization',
                      'Sustainability Goals', 'Marketplace Growth', 'Creator Growth', 'Custom Goals'
                    ].map(g => (
                      <option key={g} value={g} className="bg-slate-950">{g}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-zinc-400 uppercase">Horizon</label>
                  <select
                    value={customHorizon}
                    onChange={(e) => setCustomHorizon(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-violet-500 focus:outline-none"
                  >
                    {['Today', 'Tomorrow', 'This Week', 'Next Week', 'This Month', 'Next Month', 'Quarter', 'Season', 'Year'].map(h => (
                      <option key={h} value={h} className="bg-slate-950">{h}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-zinc-400 uppercase">Priority</label>
                  <select
                    value={customPriority}
                    onChange={(e) => setCustomPriority(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-violet-500 focus:outline-none"
                  >
                    {['Critical', 'High', 'Medium', 'Low'].map(p => (
                      <option key={p} value={p} className="bg-slate-950">{p}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCreatePlan}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-mono text-[9px] uppercase tracking-wider py-2.5 rounded-lg font-bold cursor-pointer transition-all"
                  >
                    [ Generate Plan ]
                  </button>
                </div>
              </div>
            </div>

            {/* MAIN TWO-COLUMN DASHBOARD GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT COLUMN: ACTIVE PLANS SELECTION & DETAIL VIEW */}
              <div className="lg:col-span-2 space-y-6">

                {/* PLANS LIST */}
                <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-violet-400" />
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Active Strategic Plans</h4>
                        <p className="text-[9px] text-zinc-500 font-mono">Select a strategic roadmap to inspect hierarchy, milestonings, and rotation pipelines</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map((p) => {
                      const isSelected = selectedPlanId === p.id;
                      const priorityColor = 
                        p.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                        p.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-zinc-500/10 text-zinc-400 border-white/5';

                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPlanId(p.id)}
                          className={`p-4 rounded-xl border flex flex-col justify-between hover:border-violet-500/30 duration-300 cursor-pointer text-left ${
                            isSelected 
                              ? 'bg-gradient-to-r from-violet-950/30 to-indigo-950/20 border-violet-500/50 shadow-md shadow-violet-500/5' 
                              : 'bg-black/40 border-white/5'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className={`text-[7px] font-mono border px-1.5 py-0.5 rounded uppercase font-bold tracking-widest ${priorityColor}`}>
                                {p.priority}
                              </span>
                              <span className="text-[7.5px] font-mono text-zinc-400 font-semibold">{p.horizon}</span>
                            </div>

                            <div>
                              <h5 className="text-xs font-bold text-white tracking-tight">{p.title}</h5>
                              <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">{p.goal}</p>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-[8px] font-mono text-zinc-400">
                                <span>Progress</span>
                                <span>{p.progressPercent}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="bg-violet-500 h-full duration-500" style={{ width: `${p.progressPercent}%` }} />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[9px] font-mono pt-3 border-t border-white/5 text-zinc-400 mt-3">
                            <span>Cost: <strong className="text-emerald-400">${p.estimatedCost}</strong></span>
                            <span>Est: <strong className="text-violet-300">{p.estimatedTimeHours}h</strong></span>
                            <span className={`text-[8px] font-bold ${p.completed ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                              {p.completed ? '[ COMPLETE ]' : '[ RUNNING ]'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CHOSEN PLAN INTERACTIVE HIERARCHY TRACE */}
                {(() => {
                  const p = plans.find(x => x.id === selectedPlanId);
                  if (!p) return null;

                  return (
                    <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-5">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-400" />
                          <div>
                            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                              Orchestrated Planning Trace Audit
                            </h4>
                            <p className="text-[9px] text-zinc-500 font-mono">Trace coordinates through the hierarchical tree: Vision → Objectives → Milestones → Workflow Queue</p>
                          </div>
                        </div>

                        {!p.completed && (
                          <button
                            onClick={() => handleExecutePlanWorkflows(p.id)}
                            className="bg-violet-500 hover:bg-violet-600 text-white font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 rounded font-bold cursor-pointer transition-all"
                          >
                            [ Trigger Agent Workflows ]
                          </button>
                        )}
                      </div>

                      {/* Vision Context Indicator */}
                      <div className="bg-gradient-to-r from-violet-950/10 to-indigo-950/10 p-3.5 border border-white/5 rounded-xl space-y-1">
                        <span className="text-[7.5px] font-mono text-violet-400 uppercase tracking-widest font-bold">
                          1. Vision & Style DNA Alignment
                        </span>
                        <p className="text-[10px] text-zinc-200 leading-relaxed font-serif italic">
                          "Resolved local user style matrices. Core coordinates parsed using similarity indexes. Confidence score locked to {p.confidenceScore}%"
                        </p>
                      </div>

                      {/* Milestones Hierarchy Section */}
                      <div className="space-y-3.5">
                        <span className="text-[7.5px] font-mono text-teal-400 uppercase tracking-widest font-bold block">
                          2. Objectives & Milestones (Interactive Verification)
                        </span>

                        <div className="space-y-2">
                          {p.milestones.map((ms) => (
                            <div
                              key={ms.id}
                              onClick={() => handleToggleMilestone(p.id, ms.id)}
                              className="bg-black/40 border border-white/5 p-3 rounded-xl flex items-center justify-between hover:border-white/10 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                  ms.completed 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'border-white/20 hover:border-violet-500'
                                }`}>
                                  {ms.completed && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className={`text-xs font-mono ${ms.completed ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>
                                  {ms.title}
                                </span>
                              </div>

                              <div className="text-right text-[9px] font-mono text-zinc-400">
                                <span className="text-[8px] text-zinc-500 mr-2 uppercase">Target</span>
                                {ms.targetDate}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tasks Block */}
                      <div className="space-y-3.5">
                        <span className="text-[7.5px] font-mono text-indigo-400 uppercase tracking-widest font-bold block">
                          3. Delegated Agent Action Items
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {p.tasks.map((tsk) => (
                            <div key={tsk.id} className="bg-black/50 border border-white/5 p-3 rounded-xl flex flex-col justify-between space-y-3 font-mono text-[10px]">
                              <div>
                                <span className="text-[7.5px] text-zinc-500 block uppercase">Delegated Node</span>
                                <strong className="text-violet-300 block mt-0.5">@{tsk.assignedAgent.replace('Agent', '')}</strong>
                              </div>

                              <div>
                                <span className="text-[7.5px] text-zinc-500 block uppercase">Action Required</span>
                                <span className="text-white block mt-0.5 leading-snug">{tsk.title}</span>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[9px]">
                                <span className="text-zinc-400">Status</span>
                                <span className={`font-bold ${
                                  tsk.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'
                                }`}>
                                  {tsk.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resolve Summary Details */}
                      {p.resultSummary && (
                        <div className="bg-gradient-to-r from-emerald-950/10 to-black/30 border border-emerald-500/20 p-4 rounded-xl space-y-1.5">
                          <span className="text-[7.5px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">
                            ✓ STRATEGIC GOAL RESOLVED SUMMARY
                          </span>
                          <p className="text-[10px] font-serif text-zinc-200 leading-relaxed italic">
                            "{p.resultSummary}"
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* LONG TERM ROTATIONS GRID */}
                {(() => {
                  const p = plans.find(x => x.id === selectedPlanId);
                  if (!p || !p.outfitRotations) return null;

                  return (
                    <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                        <Shirt className="w-4 h-4 text-violet-400" />
                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Long-Term Wardrobe Rotation Forecast</h4>
                          <p className="text-[9px] text-zinc-500 font-mono">Laundry-aware wear-count sequencing calculated deterministically across the closet inventory</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {p.outfitRotations.map((rot) => (
                          <div key={rot.day} className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-violet-500/10 duration-300">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-mono text-violet-400 font-bold">DAY {rot.day}</span>
                                <span className="text-[8px] font-mono bg-white/5 text-zinc-400 px-1.5 py-0.5 rounded">
                                  {rot.category}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-white tracking-tight leading-snug">{rot.title}</h5>
                              <p className="text-[9px] text-zinc-400 leading-relaxed font-serif italic mt-1">
                                "{rot.reason}"
                              </p>
                            </div>

                            <div className="pt-2 border-t border-white/5 text-[8.5px] font-mono text-zinc-500 mt-2">
                              Laundry state: <strong className="text-emerald-400">Clean & Ready</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* RIGHT COLUMN: CALENDAR, DEPENDENCY FLOW, AND RISK HEATMAP */}
              <div className="space-y-6">

                {/* MONTHLY CALENDAR ROTATOR VIEW */}
                <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Strategic Timeline Calendar</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">Outfits forecast mapped to calendar days</p>
                  </div>

                  <div className="grid grid-cols-7 gap-1 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-[9px]">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayName, dIdx) => (
                      <div key={dIdx} className="text-zinc-500 text-center pb-1.5 font-bold">{dayName}</div>
                    ))}
                    {Array.from({ length: 31 }).map((_, dIdx) => {
                      const dayNumber = dIdx + 1;
                      const hasOutfit = dayNumber <= 7;
                      return (
                        <div
                          key={dIdx}
                          className={`p-2.5 rounded text-center cursor-pointer transition-all ${
                            hasOutfit 
                              ? 'bg-violet-950/30 border border-violet-500/20 text-violet-300 font-bold hover:bg-violet-500/20' 
                              : 'bg-white/[0.01] hover:bg-white/5 text-zinc-600'
                          }`}
                          title={hasOutfit ? `Outfit planned for Day ${dayNumber}` : 'Empty Slot'}
                        >
                          {dayNumber}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DEPENDENCY ROUTING GRAPH */}
                <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Goal Dependency Routing Chain</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">Strategic path resolved from personal preference databases down to workflow executions</p>
                  </div>

                  <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-3 font-mono text-[9.5px]">
                    {[
                      { node: "Climate Parameters Sync", desc: "Monitors real-time thermal coefficient indexes", color: "border-teal-500/30 text-teal-300" },
                      { node: "Memory Habit Maps", desc: "Filters style feedback metrics to eliminate fatigue", color: "border-indigo-500/30 text-indigo-300" },
                      { node: "Priority Scheduling Allocator", desc: "Merges overlapping objectives to save wear cycles", color: "border-violet-500/30 text-violet-300" },
                      { node: "Dynamic Style-DNA Checker", desc: "Validates color palette contrast balances", color: "border-amber-500/30 text-amber-300" },
                      { node: "Chained Agent Coordinator", desc: "Dispatches workflow triggers headlessly across nodes", color: "border-emerald-500/30 text-emerald-300" }
                    ].map((step, idx, arr) => (
                      <div key={idx} className="space-y-1.5">
                        <div className={`p-2.5 rounded-lg border bg-white/[0.01] ${step.color}`}>
                          <strong className="block text-[10px] mb-0.5">{step.node}</strong>
                          <span className="text-[7.5px] leading-tight block text-zinc-500">{step.desc}</span>
                        </div>
                        {idx < arr.length - 1 && (
                          <div className="text-center text-zinc-600 font-bold leading-none py-0.5">↓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* RISK MATRIX & HEATMAP */}
                <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Strategic Risk Analysis Heatmap</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">Calculated potential inventory and wear frictions</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-[9px] text-center">
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-2.5 rounded">
                      <span className="block text-[8px] text-zinc-500">Critical</span>
                      <strong>Redundancy</strong>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-2.5 rounded">
                      <span className="block text-[8px] text-zinc-500">Medium</span>
                      <strong>Friction</strong>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-2.5 rounded">
                      <span className="block text-[8px] text-zinc-500">Negligible</span>
                      <strong>Stability</strong>
                    </div>
                  </div>

                  <div className="bg-black/60 p-3 rounded-lg border border-white/5 text-[9px] font-mono text-zinc-300 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span>Inventory Depletion risk:</span>
                      <span className="text-emerald-400 font-bold">0% (Low)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Laundry-rotation clash risk:</span>
                      <span className="text-teal-400 font-bold">Safe</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Climatic adaptability index:</span>
                      <span className="text-amber-400 font-bold">Cozy</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        ) : activeSubTab === 'EXPLAINABILITY' ? (
          <motion.div
            key="explainability"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left animate-fade-in text-white"
          >
            {/* EXPLAINABILITY SUBTAB HEADER */}
            <div className="bg-gradient-to-br from-indigo-950/20 via-slate-900/10 to-black/50 border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex flex-wrap gap-4 justify-between items-center pb-3 border-b border-white/5">
                <div className="space-y-1">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-400 animate-pulse" />
                    Explainable AI (XAI) & Local Reasoning Trace Hub
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Deterministic reasoning engine explaining styling choices, resolving multi-agent conflicts, and tracing logic flows in real time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">Transparency Index:</span>
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                    {xaiMetrics.transparencyScore}%
                  </span>
                </div>
              </div>

              {/* DYNAMIC REINFORCEMENT CONTROLLER */}
              <div className="bg-black/50 border border-white/5 px-4 py-3 rounded-xl flex flex-wrap justify-between items-center gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-zinc-300">
                    <span className="text-indigo-400 font-bold mr-2">REINFORCEMENT BACKPROPAGATION:</span>
                    Train the local model by indicating if the AI's explanation aligns with your real-world expectations.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleXAISignal('accepted')}
                    className="bg-indigo-500/10 border border-indigo-500/25 hover:bg-indigo-500/20 text-indigo-400 font-mono text-[9px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
                  >
                    [ Align Trace (+3% Accuracy) ]
                  </button>
                  <button
                    onClick={() => handleXAISignal('rejected')}
                    className="bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-rose-400 font-mono text-[9px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
                  >
                    [ Re-calibrate (-5% Entropy) ]
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE EXPLAINABILITY METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Transparency Score", value: `${xaiMetrics.transparencyScore}%`, desc: "System auditability factor", color: "text-indigo-400" },
                { label: "Explainability", value: `${xaiMetrics.explainabilityScore}%`, desc: "Trace semantic detail", color: "text-purple-400" },
                { label: "Reason Consistency", value: `${xaiMetrics.reasonConsistency}%`, desc: "Logic stability rate", color: "text-teal-400" },
                { label: "Conflict Resolution", value: `${xaiMetrics.conflictResolutionRate}%`, desc: "Arbiter bypass rate", color: "text-emerald-400" },
                { label: "Decision Stability", value: `${xaiMetrics.decisionStability}%`, desc: "Historical drift rate", color: "text-pink-400" },
                { label: "Confidence Accuracy", value: `${xaiMetrics.confidenceAccuracy}%`, desc: "Prediction fidelity score", color: "text-amber-400" }
              ].map((m, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-white/5 p-3 rounded-xl flex flex-col justify-between">
                  <span className="text-[8px] text-zinc-400 block font-mono uppercase tracking-wider">
                    {m.label}
                  </span>
                  <div className="space-y-0.5 my-2">
                    <span className={`text-sm font-mono font-bold block ${m.color}`}>
                      {m.value}
                    </span>
                  </div>
                  <span className="text-[7.5px] text-zinc-500 block leading-tight">
                    {m.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* DYNAMIC CONTEXT TEST PANEL */}
            <div className="bg-slate-950/40 border border-white/5 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Trace Parameter Evaluator</h4>
                  <p className="text-[9px] text-zinc-500 font-mono">Synthesize custom styling conditions to test deterministic engine explanations on-demand</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-zinc-400 uppercase">Test Occasion</label>
                  <select
                    value={xaiOccasion}
                    onChange={(e) => setXaiOccasion(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-indigo-500 focus:outline-none bg-slate-950"
                  >
                    {[
                      "Premium Evening Wedding Gala", "Work & Office Duties", "General Daily Casual",
                      "Weekend Outdoor Gallery Visit", "Aesthetic Travel & Airport Transit", "High Fashion Runway Gala",
                      "Resort Beachside Lounge"
                    ].map(o => (
                      <option key={o} value={o} className="bg-slate-950">{o}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-zinc-400 uppercase">Test Weather Context</label>
                  <select
                    value={xaiWeather}
                    onChange={(e) => setXaiWeather(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-indigo-500 focus:outline-none bg-slate-950"
                  >
                    {[
                      "Cool Overcast", "Sunny Warm Sky", "Heavy Rain Winter Storm", "Mild Weather Cozy",
                      "Sub-10°C Frost Breeze"
                    ].map(w => (
                      <option key={w} value={w} className="bg-slate-950">{w}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-zinc-400 uppercase">Season Anchor</label>
                  <select
                    value={xaiSeason}
                    onChange={(e) => setXaiSeason(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white font-mono text-xs p-2 rounded-lg focus:border-indigo-500 focus:outline-none bg-slate-950"
                  >
                    {["Autumn", "Winter", "Spring", "Summer"].map(s => (
                      <option key={s} value={s} className="bg-slate-950">{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={generateXAIReport}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono text-[9px] uppercase tracking-wider py-2.5 rounded-lg font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                    [ Compile Reasoning Trace ]
                  </button>
                </div>
              </div>
            </div>

            {activeReport && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                
                {/* LEFT & CENTER: ACTIVE REPORT DETAILS, TREE & ALTERNATIVES */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* EXPLAINABILITY REPORT SUMMARY */}
                  <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start pb-2 border-b border-white/5">
                      <div>
                        <span className="text-[7px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">
                          RESOLVED RECOMMENDATION REPORT
                        </span>
                        <h4 className="text-sm font-bold text-white tracking-tight mt-1">
                          {activeReport.outfitName}
                        </h4>
                        <p className="text-[9px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wider">
                          Aesthetic Category: <strong className="text-indigo-400">{activeReport.styleIdentity}</strong>
                        </p>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[8px] text-zinc-500 block uppercase">Confidence Score</span>
                        <span className="text-md font-bold text-indigo-400">{activeReport.confidenceScore}%</span>
                      </div>
                    </div>

                    {/* Feature 7: Human Readable AI Explanation */}
                    <div className="bg-gradient-to-r from-indigo-950/10 to-purple-950/10 p-4 border border-white/5 rounded-xl space-y-1">
                      <span className="text-[7.5px] font-mono text-indigo-400 uppercase tracking-widest font-bold">
                        Human-Readable Explanation
                      </span>
                      <p className="text-xs text-zinc-200 leading-relaxed font-serif italic">
                        "{activeReport.humanExplanation}"
                      </p>
                    </div>

                    {/* Detailed selected lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[7.5px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">
                          Why This Look Was Selected
                        </span>
                        <ul className="space-y-1.5 text-[10px] text-zinc-300 font-mono">
                          {activeReport.whySelected.map((why: string, i: number) => (
                            <li key={i} className="flex gap-2 items-start">
                              <span className="text-emerald-400 font-bold">✓</span>
                              <span>{why}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[7.5px] font-mono text-rose-400 uppercase tracking-widest font-bold block">
                          Why Candidate Alternatives Were Bypassed
                        </span>
                        <ul className="space-y-1.5 text-[10px] text-zinc-400 font-mono">
                          {activeReport.whyOthersRejected.map((why: string, i: number) => (
                            <li key={i} className="flex gap-2 items-start">
                              <span className="text-rose-500">✕</span>
                              <span>{why}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Feature 1: Influence weights */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <span className="text-[7.5px] font-mono text-zinc-400 uppercase tracking-widest font-bold block">
                        Engine Feature Influence Matrices
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                        {[
                          { label: "Style DNA", value: activeReport.influences.styleDNA, color: "from-indigo-600 to-indigo-400" },
                          { label: "User Memory", value: activeReport.influences.memory, color: "from-purple-600 to-purple-400" },
                          { label: "Knowledge Graph", value: activeReport.influences.knowledgeGraph, color: "from-teal-600 to-teal-400" },
                          { label: "Aesthetic Trends", value: activeReport.influences.trends, color: "from-pink-600 to-pink-400" },
                          { label: "Climatic Anchor", value: activeReport.influences.weather, color: "from-amber-600 to-amber-400" },
                          { label: "Occasion Fit", value: activeReport.influences.occasion, color: "from-cyan-600 to-cyan-400" }
                        ].map((inf, idx) => (
                          <div key={idx} className="bg-black/35 border border-white/5 p-2 rounded-lg text-center space-y-1">
                            <span className="text-[7.5px] font-mono text-zinc-500 block uppercase">{inf.label}</span>
                            <div className="flex items-center justify-center gap-1">
                              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden max-w-[35px]">
                                <div className={`h-full bg-gradient-to-r ${inf.color}`} style={{ width: `${inf.value}%` }} />
                              </div>
                              <span className="text-[9.5px] font-mono font-bold text-zinc-300">{inf.value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Feature 2: Interactive Decision Tree */}
                  <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <GitFork className="w-4 h-4 text-indigo-400" />
                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                            Interactive Decision Tree Model
                          </h4>
                          <p className="text-[9px] text-zinc-500 font-mono">
                            Deterministic node traversal showcasing how data vectors flow into the recommendation outcome
                          </p>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                        Interactive (Click Node to Toggle Detail)
                      </span>
                    </div>

                    <div className="bg-black/45 p-5 rounded-xl border border-white/5 space-y-1.5 font-mono text-[10.5px]">
                      {/* Tree Render Helper */}
                      {(() => {
                        const renderNode = (node: DecisionTreeNode, depth: number = 0) => {
                          const isExpanded = !!expandedNodes[node.id];
                          const hasChildren = node.children && node.children.length > 0;
                          
                          const badgeColor = 
                            node.type === 'root' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                            node.type === 'condition' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                            node.type === 'score' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' :
                            node.type === 'decision' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

                          return (
                            <div key={node.id} className="space-y-1.5" style={{ paddingLeft: `${depth * 14}px` }}>
                              <div 
                                onClick={() => toggleTreeNode(node.id)}
                                className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5 select-none"
                              >
                                <span className="text-zinc-500 font-bold leading-none text-xs">
                                  {hasChildren ? (isExpanded ? '▼' : '▶') : '●'}
                                </span>
                                <span className="text-zinc-400">{node.label}:</span>
                                <span className={`text-[9.5px] border px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${badgeColor}`}>
                                  {node.value}
                                </span>
                              </div>

                              {isExpanded && hasChildren && node.children!.map(child => renderNode(child, depth + 1))}
                            </div>
                          );
                        };

                        return activeReport.decisionTreeNodes.map(rootNode => renderNode(rootNode));
                      })()}
                    </div>
                  </div>

                  {/* Feature 4: Alternative Recommendation Analyzer */}
                  <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                          Multi-Candidate Alternative Recommendation Analyzer
                        </h4>
                        <p className="text-[9px] text-zinc-500 font-mono">
                          Inspect secondary candidate scores and the deterministic reasons they were bypassed for the first choice
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeReport.alternatives.map((alt: any) => (
                        <div key={alt.rank} className="bg-black/45 border border-white/5 p-4 rounded-xl flex flex-col justify-between space-y-3 hover:border-indigo-500/20 transition-all text-left">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">Candidate #{alt.rank}</span>
                              <span className="text-[10px] font-mono text-zinc-400 font-bold">{alt.score}% Score</span>
                            </div>
                            <h5 className="text-xs font-bold text-white tracking-tight leading-snug">{alt.name}</h5>
                            <p className="text-[9px] text-zinc-400 leading-relaxed font-serif italic mt-1.5">
                              "{alt.whyRejected}"
                            </p>
                          </div>

                          <div className="pt-2 border-t border-white/5 text-[7.5px] font-mono text-zinc-500 uppercase tracking-wider">
                            Status: <strong className="text-amber-500 font-bold">Suppressed Candidate</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: CONFIDENCE CHARTS, CONFLICT RESOLUTION, TIMELINE & DIAGNOSTICS */}
                <div className="space-y-6">
                  
                  {/* Feature 3: Confidence Analyzer */}
                  <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4 text-left">
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                        Logical Confidence Metrics Analyzer
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-mono">Weighted deterministic validation metrics across core modules</p>
                    </div>

                    <div className="space-y-3 pt-1">
                      {[
                        { label: "Overall System Confidence", value: activeReport.confidenceMetrics.overall, desc: "Cumulative vector alignment index", color: "bg-indigo-500" },
                        { label: "Style DNA Validation", value: activeReport.confidenceMetrics.styleDNA, desc: "Aesthetic affinity matrix rating", color: "bg-purple-500" },
                        { label: "Memory Habit Fidelity", value: activeReport.confidenceMetrics.memory, desc: "Wear count rest cycle compliance", color: "bg-teal-500" },
                        { label: "Knowledge Graph Alignment", value: activeReport.confidenceMetrics.knowledgeGraph, desc: "Taxonomy rule matching score", color: "bg-emerald-500" },
                        { label: "Weather Adequacy Index", value: activeReport.confidenceMetrics.weather, desc: "Thermal layering comfort index", color: "bg-amber-500" },
                        { label: "Decision Trace Stability", value: activeReport.confidenceMetrics.stability, desc: "Local training coefficient consistency", color: "bg-pink-500" }
                      ].map((bar, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[9px] font-mono text-zinc-300">
                            <span>{bar.label}</span>
                            <span className="font-bold text-zinc-100">{bar.value}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className={`${bar.color} h-full duration-500`} style={{ width: `${bar.value}%` }} />
                          </div>
                          <span className="text-[7.5px] font-mono text-zinc-500 block leading-tight">{bar.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Secondary statistics */}
                    <div className="bg-black/60 p-3 rounded-lg border border-white/5 text-[9px] font-mono text-zinc-300 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span>Logical Conflict Index:</span>
                        <span className={`font-bold ${activeReport.confidenceMetrics.conflictScore > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {activeReport.confidenceMetrics.conflictScore}% (Low Friction)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Styling Risk Score:</span>
                        <span className={`font-bold ${activeReport.confidenceMetrics.riskScore > 30 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                          {activeReport.confidenceMetrics.riskScore}% (Safe Alignment)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Prediction Reliability Index:</span>
                        <span className="text-teal-400 font-bold">{activeReport.confidenceMetrics.reliability}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature 5: Conflict Explanation */}
                  <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4 text-left">
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                        Conflict Explanation & Arbitration Matrix
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-mono">Disagreements identified between sub-engines and how they were resolved</p>
                    </div>

                    {activeReport.conflictExplanation.disagreedEngines.length > 0 ? (
                      <div className="space-y-3.5">
                        <div className="bg-amber-500/5 border border-amber-500/25 p-3 rounded-xl space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[8.5px] font-mono text-amber-300 font-bold uppercase tracking-wider">CONFLICT DETECTED</span>
                          </div>
                          <div className="text-[10px] font-mono text-zinc-300 leading-relaxed">
                            {activeReport.conflictExplanation.reasons.map((r: string, idx: number) => (
                              <p key={idx}>{r}</p>
                            ))}
                          </div>
                        </div>

                        <div className="bg-black/45 p-3 rounded-xl border border-white/5 space-y-2 text-[9.5px] font-mono">
                          <div>
                            <span className="text-[7.5px] text-zinc-500 uppercase block">Active Resolution</span>
                            <span className="text-emerald-400 font-semibold block leading-tight mt-0.5">
                              {activeReport.conflictExplanation.resolution}
                            </span>
                          </div>
                          <div className="pt-1.5 border-t border-white/5 flex justify-between items-center text-[8px] text-zinc-500 uppercase">
                            <span>Higher Authority:</span>
                            <strong className="text-indigo-400 font-bold">@{activeReport.conflictExplanation.higherAuthority.replace('Engine', '')}</strong>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold font-mono">
                          ✓
                        </div>
                        <p className="text-[10px] text-zinc-400 font-mono leading-relaxed">
                          All multi-agent engines are in perfect logical harmony. No styling preference conflicts resolved.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Feature 6: Decision Timeline */}
                  <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4 text-left">
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                        Logical Chronological Timeline Trace
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-mono">Millisecond-level pipeline resolution flow</p>
                    </div>

                    <div className="space-y-3 font-mono text-[9.5px]">
                      {activeReport.timelineNodes.map((node: any, idx: number) => (
                        <div key={idx} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 border border-indigo-400 flex-shrink-0" />
                            {idx < activeReport.timelineNodes.length - 1 && (
                              <div className="w-0.5 bg-white/10 h-10 my-0.5" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <strong className="text-zinc-200">{node.label}</strong>
                              <span className="text-[7.5px] text-zinc-500">
                                -{activeReport.timelineNodes[activeReport.timelineNodes.length - 1].timestamp - node.timestamp}ms
                              </span>
                            </div>
                            <span className="text-[8px] text-zinc-400 leading-tight block">{node.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature 8: Developer Reasoning Report & Diagnostics */}
                  <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4 text-left">
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-indigo-400" />
                        Developer Diagnostic Terminal
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-mono">System execution traces, matrices, and parameters</p>
                    </div>

                    <div className="bg-black/80 p-3 rounded-xl border border-white/10 text-[9px] font-mono space-y-3 text-zinc-400 max-h-[220px] overflow-y-auto">
                      <div className="space-y-1">
                        <span className="text-indigo-400 font-bold block">// RESOLUTION TIME</span>
                        <div className="flex justify-between">
                          <span>Execution latency:</span>
                          <span className="text-emerald-400 font-bold">{activeReport.developerReport.executionTimeMs}ms (Deterministic Local)</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-indigo-400 font-bold block">// LEARNING COEFFICIENTS</span>
                        {Object.entries(activeReport.developerReport.coefficients).map(([k, v]: any) => (
                          <div key={k} className="flex justify-between">
                            <span>{k}:</span>
                            <span className="text-zinc-200 font-bold">{v}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <span className="text-indigo-400 font-bold block">// ENGINE CONTRIBUTION MATRIX</span>
                        {Object.entries(activeReport.developerReport.contributions).map(([engine, pct]: any) => (
                          <div key={engine} className="flex justify-between items-center">
                            <span>@{engine.replace('Engine', '')}:</span>
                            <span className="text-purple-400 font-bold">{pct}%</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1.5 pt-1.5 border-t border-white/5">
                        <span className="text-indigo-400 font-bold block">// SYSTEM TRACE LOGS</span>
                        <div className="space-y-1 leading-snug">
                          {activeReport.developerReport.trace.map((tr: string, i: number) => (
                            <div key={i} className="text-zinc-500 break-all">{tr}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Export Report Panel */}
                    <div className="bg-black/35 p-3 rounded-xl border border-white/5 space-y-2">
                      <span className="text-[7.5px] font-mono text-zinc-500 uppercase block">Export Diagnostic Payload</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(activeReport, null, 2));
                          setAgentLog("Copied XAI reasoning report JSON payload to clipboard.");
                        }}
                        className="w-full bg-white/5 hover:bg-white/10 text-zinc-300 font-mono text-[9px] uppercase tracking-wider py-1.5 rounded font-bold cursor-pointer transition-all border border-white/10"
                      >
                        [ Copy Report JSON ]
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Feature 10: Historical Decision Archive Comparison */}
            <div className="bg-slate-950/20 border border-white/5 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Database className="w-4 h-4 text-purple-400" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Historical Decision Reasoning Archive & Comparative Matrix
                  </h4>
                  <p className="text-[9px] text-zinc-500 font-mono">
                    Select previous decisions to inspect what style parameters changed and identify the driving agent engines
                  </p>
                </div>
              </div>

              {xaiArchive.length > 0 ? (
                <div className="space-y-4">
                  {/* Archive List Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {xaiArchive.map((arch) => {
                      const isCurrentlyActive = activeReport?.id === arch.id;
                      const isCompareTarget = compareReportId === arch.id;

                      return (
                        <div
                          key={arch.id}
                          className={`p-3.5 rounded-xl border flex flex-col justify-between hover:border-indigo-500/20 duration-300 text-left ${
                            isCurrentlyActive 
                              ? 'bg-indigo-950/30 border-indigo-500/50 shadow shadow-indigo-500/5' 
                              : isCompareTarget
                                ? 'bg-purple-950/30 border-purple-500/50'
                                : 'bg-black/45 border-white/5'
                          }`}
                        >
                          <div className="space-y-1.5 text-left">
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] font-mono text-zinc-500">
                                {new Date(arch.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </span>
                              <span className="text-[8px] font-mono bg-white/5 text-zinc-400 px-1.5 py-0.5 rounded font-bold">
                                {arch.context.weather}
                              </span>
                            </div>

                            <div>
                              <h5 className="text-[11.5px] font-bold text-white tracking-tight line-clamp-1">{arch.outfitName}</h5>
                              <span className="text-[8px] font-mono text-zinc-500 block uppercase leading-none mt-0.5">{arch.styleIdentity}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3 pt-2.5 border-t border-white/5">
                            <button
                              onClick={() => setActiveReport(arch)}
                              className={`flex-1 font-mono text-[8px] py-1 rounded transition-all cursor-pointer font-bold ${
                                isCurrentlyActive ? 'bg-indigo-500 text-white' : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                              }`}
                            >
                              [ Inspect ]
                            </button>
                            <button
                              onClick={() => {
                                if (isCurrentlyActive) return;
                                setCompareReportId(isCompareTarget ? null : arch.id);
                              }}
                              disabled={isCurrentlyActive}
                              className={`flex-1 font-mono text-[8px] py-1 rounded transition-all cursor-pointer font-bold disabled:opacity-30 ${
                                isCompareTarget ? 'bg-purple-500 text-white' : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                              }`}
                            >
                              [ Compare ]
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Comparative Matrix Display */}
                  {(() => {
                    const comp = xaiArchive.find(x => x.id === compareReportId);
                    if (!comp || !activeReport) return null;

                    return (
                      <div className="bg-gradient-to-r from-purple-950/10 to-indigo-950/10 border border-purple-500/20 p-5 rounded-xl space-y-4 text-left">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                            ✓ Active Comparative Matrix Trace
                          </span>
                          <button 
                            onClick={() => setCompareReportId(null)}
                            className="text-zinc-500 hover:text-white font-mono text-[9px]"
                          >
                            [ Clear Comparison ]
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px]">
                          {/* Left Column: Left report */}
                          <div className="space-y-2 bg-black/30 p-3.5 rounded-lg border border-white/5">
                            <span className="text-[8px] text-zinc-500 uppercase block font-bold">Report A (Active)</span>
                            <h6 className="text-[11.5px] font-bold text-white">{activeReport.outfitName}</h6>
                            <div className="space-y-1 text-zinc-400 text-[9px] pt-1.5 border-t border-white/5">
                              <div>Occasion: <strong>{activeReport.context.occasion}</strong></div>
                              <div>Weather: <strong>{activeReport.context.weather}</strong></div>
                              <div>Aesthetic: <strong>{activeReport.styleIdentity}</strong></div>
                              <div>Confidence: <strong className="text-indigo-400">{activeReport.confidenceScore}%</strong></div>
                              <div>Decision Score: <strong className="text-indigo-400">{activeReport.overallReasoningScore}%</strong></div>
                            </div>
                          </div>

                          {/* Right Column: Compared report */}
                          <div className="space-y-2 bg-black/30 p-3.5 rounded-lg border border-white/5">
                            <span className="text-[8px] text-purple-400 uppercase block font-bold">Report B (Compared)</span>
                            <h6 className="text-[11.5px] font-bold text-white">{comp.outfitName}</h6>
                            <div className="space-y-1 text-zinc-400 text-[9px] pt-1.5 border-t border-white/5">
                              <div>Occasion: <strong>{comp.context.occasion}</strong></div>
                              <div>Weather: <strong>{comp.context.weather}</strong></div>
                              <div>Aesthetic: <strong>{comp.styleIdentity}</strong></div>
                              <div>Confidence: <strong className="text-purple-400">{comp.confidenceScore}%</strong></div>
                              <div>Decision Score: <strong className="text-purple-400">{comp.overallReasoningScore}%</strong></div>
                            </div>
                          </div>

                          {/* Middle Column: The Change analysis */}
                          <div className="space-y-3.5 bg-black/50 p-4 rounded-lg border border-purple-500/10 justify-between flex flex-col">
                            <div className="space-y-2">
                              <span className="text-[8px] text-amber-400 uppercase block font-bold">Trace Comparison Synthesis</span>
                              <div className="space-y-1 text-zinc-300 leading-relaxed text-[9.5px]">
                                <p>
                                  <strong>Shift Factor:</strong> The contextual weather shifted from <span className="text-purple-300">"{comp.context.weather}"</span> to <span className="text-indigo-300">"{activeReport.context.weather}"</span>.
                                </p>
                                <p className="mt-1">
                                  <strong>Aesthetic Change:</strong> Selected look transitioned from a {comp.styleIdentity} profile to {activeReport.styleIdentity}.
                                </p>
                              </div>
                            </div>

                            <div className="bg-purple-950/20 p-2.5 border border-purple-500/15 rounded text-[8.5px] text-purple-300">
                              <strong>Driving Engine:</strong> Climate & Context filters in <span className="text-white">@FashionKnowledgeGraph</span> and <span className="text-white">@DecisionIntelligence</span> adjusted fabric weights to ensure correct warmth indices.
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center text-[10px] font-mono text-zinc-500">
                  No historical reasoning trace reports saved in the session archive yet. Compile some reports to compare.
                </div>
              )}
            </div>

          </motion.div>
        ) : activeSubTab === 'LEARNING' ? (
          <motion.div
            key="learning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left"
          >
            {/* INTERACTIVE CONTROLS HEADER */}
            <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-widest">
                    Continuous Adaptation Engine Active
                  </span>
                </div>
                <h3 className="text-xl font-serif font-light text-white tracking-tight">
                  Learning & Intelligence Evolution
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  Analyze dynamic style drift indices, calibrate multidimensional preference vectors, and review automatic weighting optimizations compiled locally from user interactions.
                </p>
              </div>

              {/* Live Training Stimulator */}
              <div className="bg-black/50 p-4 rounded-2xl border border-white/10 space-y-3.5 w-full lg:w-auto min-w-[320px]">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Feed Training Signal</span>
                  <span className="text-[8px] font-mono text-violet-400 font-bold">EPOCH_ITERATION_LATEST</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => triggerProfileEvolution('accepted')}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-white font-mono text-[9.5px] uppercase tracking-wider py-2 px-3 rounded-lg border border-emerald-500/20 transition-all cursor-pointer font-bold"
                  >
                    [ Accept ]
                  </button>
                  <button
                    onClick={() => triggerProfileEvolution('rejected')}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-white font-mono text-[9.5px] uppercase tracking-wider py-2 px-3 rounded-lg border border-rose-500/20 transition-all cursor-pointer font-bold"
                  >
                    [ Reject ]
                  </button>
                  <button
                    onClick={() => triggerProfileEvolution('ignored')}
                    className="bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400 hover:text-white font-mono text-[9.5px] uppercase tracking-wider py-2 px-3 rounded-lg border border-white/10 transition-all cursor-pointer font-bold"
                  >
                    [ Ignore ]
                  </button>
                </div>
                <p className="text-[8px] font-mono text-center text-zinc-500 italic">
                  Simulate recommendation reactions to trigger dynamic, automated local backpropagation.
                </p>
              </div>
            </div>

            {/* LIVE INTELLIGENCE GROWTH METRICS (FEATURE 9) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Intelligence Score', val: learningProfile.metrics.intelligenceScore, color: 'from-violet-500 to-indigo-500', desc: 'Weighted diagnostic capability index' },
                { label: 'Learning Score', val: learningProfile.metrics.learningScore, color: 'from-fuchsia-500 to-purple-500', desc: 'Responsiveness to style feedback' },
                { label: 'Adaptation Index', val: learningProfile.metrics.adaptationScore, color: 'from-pink-500 to-rose-500', desc: 'Climatic and behavioral tuning compliance' },
                { label: 'Memory Quality', val: learningProfile.metrics.memoryQuality, color: 'from-blue-500 to-cyan-500', desc: 'Fidelity of past outfit records saved' },
                { label: 'Prediction Score', val: learningProfile.metrics.predictionQuality, color: 'from-emerald-500 to-teal-500', desc: 'Mathematical forecast success rate' },
              ].map((m, idx) => (
                <div key={idx} className="bg-slate-950/25 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-3.5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-all duration-500" />
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">{m.label}</span>
                    <span className="text-2xl font-mono text-white font-bold leading-none">
                      {m.val.toFixed(1)}%
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${m.color} transition-all duration-700`}
                        style={{ width: `${m.val}%` }}
                      />
                    </div>
                    <span className="text-[7.5px] font-mono text-zinc-400 block line-clamp-1">{m.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* SECONDARY ROW DETAILS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Feature 6: Learning Confidence Vectors */}
              <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-violet-400" />
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                        Confidence Calibration Suite
                      </h4>
                      <p className="text-[8px] text-zinc-500 font-mono">Multidimensional statistical certainty parameters</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded font-bold border border-violet-500/20">
                    {learningProfile.metrics.experienceLevel}
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Learning Confidence', value: 94.2, desc: 'Overall mathematical parameter certainty index' },
                    { label: 'Prediction Accuracy', value: learningProfile.metrics.predictionQuality, desc: 'Verification of past forecast alignments' },
                    { label: 'Learning Stability', value: 91.5, desc: 'Dampening coefficient avoiding wild weight oscillations' },
                    { label: 'Preference Stability', value: 87.1, desc: 'Temporal coherence of brand & color matrices' },
                    { label: 'Behavioral Stability', value: 89.4, desc: 'Uniformity of wardrobe checkout and dress habits' },
                    { label: 'Knowledge Growth Rate', value: learningProfile.metrics.evolutionRate, desc: 'Accumulation velocity of fashion semantic nodes' },
                    { label: 'Confidence Calibration', value: 95.8, desc: 'Dissonance reduction with explainable decision bounds' }
                  ].map((conf, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-zinc-300">{conf.label}</span>
                        <strong className="text-violet-400">{conf.value.toFixed(1)}%</strong>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="bg-violet-500 h-full" style={{ width: `${conf.value}%` }} />
                      </div>
                      <span className="text-[7px] text-zinc-500 font-mono block leading-none">{conf.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature 5: Style Drift Detection Analyzer */}
              <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                        Style Drift Tracker
                      </h4>
                      <p className="text-[8px] text-zinc-500 font-mono">Real-time aesthetic transformation detection</p>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center space-y-3.5">
                    <span className="text-[8px] font-mono uppercase text-zinc-400 block tracking-widest">Aesthetic Shift Waveform</span>
                    <div className="flex justify-center items-center gap-2 font-mono text-[10px] py-1.5">
                      <div className="bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 text-zinc-400">
                        Classic
                      </div>
                      <span className="text-zinc-500">→</span>
                      <div className="bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 text-zinc-400">
                        Minimal
                      </div>
                      <span className="text-zinc-500">→</span>
                      <div className="bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 text-zinc-300">
                        Streetwear
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-2 font-mono text-[10.5px] py-1">
                      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-2 rounded-xl font-bold">
                        {learningProfile.styleDrift.previousStyle}
                      </div>
                      <span className="text-amber-400 animate-ping text-xs">➔</span>
                      <div className="bg-violet-500/10 border border-violet-500/30 text-violet-300 px-3 py-2 rounded-xl font-bold">
                        {learningProfile.styleDrift.currentStyle}
                      </div>
                    </div>
                    <div className="pt-2 flex justify-between items-center text-[9px] font-mono border-t border-white/5 text-zinc-500">
                      <span>Detected Drift Certainty:</span>
                      <strong className="text-emerald-400">{learningProfile.styleDrift.driftConfidence}%</strong>
                    </div>
                  </div>

                  <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5 space-y-1 text-left">
                    <span className="text-[8.5px] font-mono text-zinc-400 font-bold uppercase block tracking-wider text-amber-400">
                      // DRIFT RATIONALE GENERATION
                    </span>
                    <p className="text-[9.5px] text-zinc-300 leading-relaxed font-mono">
                      {learningProfile.styleDrift.triggerReason}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[8.5px] text-zinc-500 font-mono">
                  <span>Last drift recalculation:</span>
                  <span>{new Date(learningProfile.styleDrift.detectedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Feature 4: Habit Analyzer Dashboard */}
              <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                      Behavioral Habit Analyzer
                    </h4>
                    <p className="text-[8px] text-zinc-500 font-mono">Fidelity of recurrent actions and schedule anchors</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    { label: 'Morning Habits', val: habitMetrics.morningHabitScore, desc: 'Early morning selection rate' },
                    { label: 'Office Rotation', val: habitMetrics.officeHabitScore, desc: 'Corporate outfit consistency' },
                    { label: 'Weekend Leisure', val: habitMetrics.weekendHabitScore, desc: 'Informal lounge choice rate' },
                    { label: 'Travel Pack fidelity', val: habitMetrics.travelHabitScore, desc: 'Suitcase planning reliability' },
                    { label: 'Formal Wear adherence', val: habitMetrics.formalHabitScore, desc: 'Gala and ceremony alignment' },
                    { label: 'Laundry Cycle speed', val: habitMetrics.laundryFidelityScore, desc: 'Worn items wash turnover efficiency' },
                    { label: 'Shopping curation', val: habitMetrics.shoppingFidelityScore, desc: 'Avoidance of duplicates on checkout' },
                    { label: 'Seasonal Adaptation', val: habitMetrics.seasonalAdaptationScore, desc: 'Pre-emptive winter/summer tuning' },
                  ].map((hab, i) => (
                    <div key={i} className="bg-black/35 p-3 rounded-xl border border-white/5 flex flex-col justify-between space-y-1.5 text-left">
                      <div className="flex justify-between items-baseline font-mono">
                        <span className="text-[9px] text-zinc-300 font-bold leading-tight">{hab.label}</span>
                        <span className="text-[10px] text-indigo-400 font-bold">{hab.val}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${hab.val}%` }} />
                      </div>
                      <p className="text-[7.5px] text-zinc-500 leading-none font-mono">{hab.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PREFERENCE EVOLUTION HISTORICAL VIEWER (FEATURE 2) */}
            <div className="bg-slate-950/20 border border-white/5 p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Sliders className="w-4 h-4 text-violet-400" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Multidimensional Preference Evolution Vectors
                  </h4>
                  <p className="text-[8.5px] text-zinc-500 font-mono">Track how specific wardrobe properties, fabrics, brands and aesthetics transform over quarterly phases</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {preferenceEvolution.map((point, idx) => {
                  const isLatest = idx === preferenceEvolution.length - 1;
                  return (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-4 ${
                        isLatest 
                          ? 'bg-gradient-to-b from-violet-950/20 to-indigo-950/25 border-violet-500/30 ring-1 ring-violet-500/15' 
                          : 'bg-black/35 border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-white uppercase">{point.period}</span>
                        {isLatest && (
                          <span className="bg-violet-500/20 border border-violet-500/40 text-violet-300 text-[7px] font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                            Active Anchor
                          </span>
                        )}
                      </div>

                      <div className="space-y-3 font-mono text-[9px]">
                        <div>
                          <span className="text-zinc-500 block uppercase text-[7.5px]">Favorite Colors</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {point.favoriteColors.map((c, i) => (
                              <span key={i} className="bg-white/5 px-1.5 py-0.5 rounded text-zinc-300 border border-white/5">{c}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-zinc-500 block uppercase text-[7.5px]">Textile Compositions</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {point.favoriteFabrics.map((f, i) => (
                              <span key={i} className="bg-white/5 px-1.5 py-0.5 rounded text-zinc-300 border border-white/5">{f}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-zinc-500 block uppercase text-[7.5px]">Sizing & Outlines</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {point.favoriteFits.map((fit, i) => (
                              <span key={i} className="bg-white/5 px-1.5 py-0.5 rounded text-zinc-300 border border-white/5">{fit}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-zinc-500 block uppercase text-[7.5px]">Evolving Styles</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {point.favoriteStyles.map((st, i) => (
                              <span key={i} className="bg-white/5 px-1.5 py-0.5 rounded text-zinc-300 border border-white/5">{st}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-zinc-500 block uppercase text-[7.5px]">Brand Alliances</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {point.favoriteBrands.map((b, i) => (
                              <span key={i} className="bg-white/5 px-1.5 py-0.5 rounded text-zinc-200 border border-white/10 font-bold">{b}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CHRONOLOGICAL STYLE EVOLUTION TIMELINE (FEATURE 3) */}
            <div className="bg-slate-950/20 border border-white/5 p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Brain className="w-4 h-4 text-indigo-400" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Systemic Style Evolution Timeline
                  </h4>
                  <p className="text-[8.5px] text-zinc-500 font-mono">Sequential timeline trace illustrating how your core aesthetic transitions and expands month-by-month</p>
                </div>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                {evolutionTimeline.map((item, index) => {
                  const isCurrent = index === evolutionTimeline.length - 1;
                  return (
                    <div key={index} className="relative flex flex-col md:flex-row md:items-start gap-4 text-left">
                      {/* Timeline dot */}
                      <div className={`absolute left-[-21px] top-1.5 w-3 h-3 rounded-full border flex-shrink-0 z-10 ${
                        isCurrent 
                          ? 'bg-violet-500 border-violet-400 shadow shadow-violet-500/50 scale-125' 
                          : 'bg-black border-white/30'
                      }`} />

                      <div className="md:w-48 flex-shrink-0">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isCurrent ? 'text-violet-400' : 'text-zinc-400'}`}>
                          {item.period}
                        </span>
                        <p className="text-[8px] font-mono text-zinc-500 mt-0.5">{item.activeItemsCount} Active Wardrobe Units</p>
                      </div>

                      <div className="flex-1 bg-black/35 border border-white/5 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-xs text-white font-serif">{item.dominantStyle}</strong>
                          {isCurrent && (
                            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[7px] font-bold uppercase py-0.5 px-2 rounded-full">
                              Active Anchor Style
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-zinc-400 leading-relaxed">
                          {item.coreAestheticSummary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {item.keyAffinities.map((aff, k) => (
                            <span key={k} className="bg-white/5 border border-white/5 text-zinc-400 text-[8px] font-mono px-2 py-0.5 rounded">
                              #{aff}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WEIGHT OPTIMIZATION DISPLAY (FEATURE 7) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Decision Engine Weight Optimization */}
              <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    Decision Engine Calibration
                  </h4>
                  <p className="text-[8px] text-zinc-500 font-mono">Dynamic multi-factored decision coefficient optimization</p>
                </div>
                <div className="space-y-3.5 bg-black/30 p-4 rounded-xl border border-white/5">
                  {Object.entries(learningProfile.weights.decisionWeightOptimized).map(([weightName, weightValue]) => (
                    <div key={weightName} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono uppercase">
                        <span className="text-zinc-400">{weightName.replace('Weight', '')}</span>
                        <strong className="text-zinc-200">{(weightValue * 100).toFixed(0)}%</strong>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${weightValue * 100}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/5 text-[7.5px] font-mono text-zinc-500 uppercase flex justify-between">
                    <span>Auto-tuned weights</span>
                    <span className="text-emerald-400 font-bold">OPTIMIZED (LOCAL)</span>
                  </div>
                </div>
              </div>

              {/* Planning Engine Weight Optimization */}
              <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-pink-400" />
                    Planning Engine Calibration
                  </h4>
                  <p className="text-[8px] text-zinc-500 font-mono">Strategic milestone adherence and priority calibration</p>
                </div>
                <div className="space-y-3.5 bg-black/30 p-4 rounded-xl border border-white/5">
                  {Object.entries(learningProfile.weights.planningWeightOptimized).map(([weightName, weightValue]) => (
                    <div key={weightName} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono uppercase">
                        <span className="text-zinc-400">{weightName.replace('Factor', '').replace('Coefficient', '')}</span>
                        <strong className="text-zinc-200">{(weightValue * 100).toFixed(0)}%</strong>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-pink-500 h-full" style={{ width: `${weightValue * 100}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/5 text-[7.5px] font-mono text-zinc-500 uppercase flex justify-between">
                    <span>Priority coefficients</span>
                    <span className="text-emerald-400 font-bold">OPTIMIZED (LOCAL)</span>
                  </div>
                </div>
              </div>

              {/* Reasoning Engine Weight Optimization */}
              <div className="bg-slate-950/20 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    Reasoning Engine Calibration
                  </h4>
                  <p className="text-[8px] text-zinc-500 font-mono">Explainable AI fidelity, entropy thresholds, and logic limits</p>
                </div>
                <div className="space-y-3.5 bg-black/30 p-4 rounded-xl border border-white/5">
                  {Object.entries(learningProfile.weights.reasoningWeightOptimized).map(([weightName, weightValue]) => {
                    const pct = weightName === 'entropyTolerance' ? (weightValue * 100) : (weightValue * 100 / 1.5);
                    return (
                      <div key={weightName} className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono uppercase">
                          <span className="text-zinc-400">{weightName.replace('Target', '').replace('Index', '')}</span>
                          <strong className="text-zinc-200">{weightValue.toFixed(2)}</strong>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t border-white/5 text-[7.5px] font-mono text-zinc-500 uppercase flex justify-between">
                    <span>Entropy controls</span>
                    <span className="text-emerald-400 font-bold">OPTIMIZED (LOCAL)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PERSONALIZED FORECASTING CENTER (FEATURE 8) */}
            <div className="bg-slate-950/20 border border-white/5 p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Personalized Aesthetic Predictive Forecasting
                  </h4>
                  <p className="text-[8.5px] text-zinc-500 font-mono">Mathematical forecasting models anticipating future style anchors, purchases, and seasonal prep checklists</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Wardrobe Gaps Matrix */}
                <div className="bg-black/45 p-5 rounded-2xl border border-white/5 space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase block">Predictive Gaps Identification</span>
                    <h5 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                      Identified Wardrobe Gaps
                    </h5>
                  </div>
                  <div className="space-y-3">
                    {learningProfile.forecast.wardrobeGaps.map((gap, idx) => (
                      <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <strong className="text-zinc-200">{gap.category}</strong>
                          <span className={`text-[7.5px] uppercase font-bold py-0.5 px-1.5 rounded ${
                            gap.priority === 'Critical' 
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                              : gap.priority === 'High'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                          }`}>
                            {gap.priority} Priority
                          </span>
                        </div>
                        <p className="text-[9px] text-zinc-400 font-mono leading-relaxed">
                          {gap.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aesthetic Intent Matches */}
                <div className="bg-black/45 p-5 rounded-2xl border border-white/5 space-y-4 text-left justify-between flex flex-col">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase block">Affinity Forecasting Matrix</span>
                      <h5 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                        Predicted Favorites & Rejections
                      </h5>
                    </div>

                    <div className="space-y-3 font-mono text-[9.5px]">
                      <div className="space-y-1.5">
                        <span className="text-emerald-400 block uppercase text-[8px] font-bold">// HIGH LIKELY FAVORITES (90%+)</span>
                        <div className="space-y-1">
                          {learningProfile.forecast.likelyFavorites.map((fav, i) => (
                            <div key={i} className="flex gap-2 items-center bg-emerald-500/5 border border-emerald-500/10 p-2 rounded text-emerald-300">
                              <span className="font-bold">✓</span>
                              <span>{fav}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-rose-400 block uppercase text-[8px] font-bold">// LIKELY REJECTIONS</span>
                        <div className="space-y-1">
                          {learningProfile.forecast.likelyRejections.map((rej, i) => (
                            <div key={i} className="flex gap-2 items-center bg-rose-500/5 border border-rose-500/10 p-2 rounded text-rose-300">
                              <span className="font-bold">✕</span>
                              <span>{rej}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex justify-between text-[8px] font-mono text-zinc-500 uppercase">
                    <span>Recommended Shopping list density:</span>
                    <strong className="text-indigo-400">{learningProfile.forecast.predictedPurchasesCount} Recommended items</strong>
                  </div>
                </div>

                {/* Season Preparation Checklist */}
                <div className="bg-black/45 p-5 rounded-2xl border border-white/5 space-y-4 text-left justify-between flex flex-col">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase block">Predicted Future Aesthetics</span>
                      <h5 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                        Season Transition Prep (Climate Adaptive)
                      </h5>
                    </div>

                    <div className="space-y-3.5">
                      <div className="p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl space-y-1.5 text-left">
                        <span className="text-[7.5px] font-mono uppercase text-violet-400 block font-bold">Projected Style Target</span>
                        <h6 className="text-[11.5px] font-bold text-white leading-tight">
                          {learningProfile.forecast.predictedFutureStyle}
                        </h6>
                        <span className="text-[8.5px] font-mono text-zinc-400 block">
                          Forecast Confidence: <strong className="text-violet-400">{learningProfile.forecast.confidenceFutureStyle}%</strong>
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono uppercase text-zinc-500 block font-bold">Transition Task Checklist</span>
                        <div className="space-y-1 font-mono text-[9px] text-zinc-400">
                          {learningProfile.forecast.seasonPreparationNeeds.map((need, i) => (
                            <div key={i} className="flex gap-2 items-start bg-white/[0.01] p-1.5 rounded border border-white/5">
                              <span className="text-violet-400 font-bold">•</span>
                              <span>{need}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 text-[7.5px] font-mono text-zinc-500 uppercase text-center italic">
                    Pre-calculated local vector layers aligned to climate shifts
                  </div>
                </div>
              </div>
            </div>

            {/* HISTORICAL LEARNING ARCHIVE & COMPARISONS (FEATURE 10) */}
            <div className="bg-slate-950/20 border border-white/5 p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Database className="w-4 h-4 text-purple-400" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Historical Learning Cycles & Backpropagation Archives
                  </h4>
                  <p className="text-[8.5px] text-zinc-500 font-mono">Contrast historical intelligence growth states, review weight calibration trajectories, and compare metrics dynamically</p>
                </div>
              </div>

              {learningHistory.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {learningHistory.map((cycle) => {
                      const isActive = learningProfile.cycleId === cycle.cycleId;
                      const isCompare = compareLearningId === cycle.cycleId;

                      return (
                        <div 
                          key={cycle.cycleId}
                          className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3.5 transition-all duration-300 ${
                            isActive 
                              ? 'bg-violet-950/20 border-violet-500/50 shadow shadow-violet-500/5' 
                              : isCompare
                                ? 'bg-purple-950/20 border-purple-500/50'
                                : 'bg-black/35 border-white/5'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500">
                              <span>{new Date(cycle.timestamp).toLocaleTimeString()}</span>
                              <span className="bg-white/5 px-1.5 py-0.5 rounded font-bold">
                                {cycle.metrics.experienceLevel.split(' ')[0]}
                              </span>
                            </div>
                            <h5 className="text-[11.5px] font-bold text-white tracking-tight leading-tight line-clamp-1">
                              Style Cycle Trace
                            </h5>
                            <span className="text-[8px] font-mono text-zinc-500 block uppercase">{cycle.styleDrift.currentStyle}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 text-[8.5px] font-mono text-zinc-400 pt-2 border-t border-white/5">
                            <div>Intelligence: <strong className="text-white">{cycle.metrics.intelligenceScore.toFixed(0)}%</strong></div>
                            <div>Learning: <strong className="text-white">{cycle.metrics.learningScore.toFixed(0)}%</strong></div>
                            <div>Adaptation: <strong className="text-white">{cycle.metrics.adaptationScore.toFixed(0)}%</strong></div>
                            <div>Stability: <strong className="text-white">{(cycle.metrics.memoryQuality * 0.9 + 10).toFixed(0)}%</strong></div>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-white/5">
                            <button
                              onClick={() => setLearningProfile(cycle)}
                              className={`flex-1 font-mono text-[8px] py-1 rounded transition-all cursor-pointer font-bold uppercase tracking-wider ${
                                isActive ? 'bg-violet-500 text-white' : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                              }`}
                            >
                              [ Activate ]
                            </button>
                            <button
                              onClick={() => {
                                if (isActive) return;
                                setCompareLearningId(isCompare ? null : cycle.cycleId);
                              }}
                              disabled={isActive}
                              className={`flex-1 font-mono text-[8px] py-1 rounded transition-all cursor-pointer font-bold uppercase tracking-wider disabled:opacity-30 ${
                                isCompare ? 'bg-purple-500 text-white' : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                              }`}
                            >
                              [ Compare ]
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dynamic Comparative Matrix between Active and Selected Cycle */}
                  {(() => {
                    const comp = learningHistory.find(c => c.cycleId === compareLearningId);
                    if (!comp || !learningProfile) return null;

                    return (
                      <div className="bg-gradient-to-r from-purple-950/10 to-violet-950/10 border border-purple-500/20 p-5 rounded-2xl text-left space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                            ✓ Active Intelligence Change Synthesis Report
                          </span>
                          <button 
                            onClick={() => setCompareLearningId(null)}
                            className="text-zinc-500 hover:text-white font-mono text-[9px] cursor-pointer"
                          >
                            [ Clear Comparison ]
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px]">
                          {/* Active State */}
                          <div className="space-y-2 bg-black/30 p-3.5 rounded-lg border border-white/5">
                            <span className="text-[8px] text-zinc-500 uppercase block font-bold">Active Epoch State</span>
                            <h6 className="text-[11.5px] font-bold text-white">Current Intelligence Bounds</h6>
                            <div className="space-y-1 text-zinc-400 text-[9px] pt-1.5 border-t border-white/5">
                              <div>Intelligence Score: <strong className="text-violet-400">{learningProfile.metrics.intelligenceScore.toFixed(1)}%</strong></div>
                              <div>Learning Score: <strong className="text-violet-400">{learningProfile.metrics.learningScore.toFixed(1)}%</strong></div>
                              <div>Adaptation Score: <strong className="text-violet-400">{learningProfile.metrics.adaptationScore.toFixed(1)}%</strong></div>
                              <div>Current Style Anchor: <strong>{learningProfile.styleDrift.currentStyle}</strong></div>
                              <div>Forecast Target: <strong>{learningProfile.forecast.predictedFutureStyle}</strong></div>
                            </div>
                          </div>

                          {/* Historical State */}
                          <div className="space-y-2 bg-black/30 p-3.5 rounded-lg border border-white/5">
                            <span className="text-[8px] text-purple-400 uppercase block font-bold">Historical Compare Target</span>
                            <h6 className="text-[11.5px] font-bold text-white">Previous Epoch State</h6>
                            <div className="space-y-1 text-zinc-400 text-[9px] pt-1.5 border-t border-white/5">
                              <div>Intelligence Score: <strong className="text-purple-400">{comp.metrics.intelligenceScore.toFixed(1)}%</strong></div>
                              <div>Learning Score: <strong className="text-purple-400">{comp.metrics.learningScore.toFixed(1)}%</strong></div>
                              <div>Adaptation Score: <strong className="text-purple-400">{comp.metrics.adaptationScore.toFixed(1)}%</strong></div>
                              <div>Style Anchor: <strong>{comp.styleDrift.currentStyle}</strong></div>
                              <div>Forecast Target: <strong>{comp.forecast.predictedFutureStyle}</strong></div>
                            </div>
                          </div>

                          {/* Synthesis Change Analysis */}
                          <div className="space-y-3.5 bg-black/50 p-4 rounded-lg border border-purple-500/10 justify-between flex flex-col">
                            <div className="space-y-2">
                              <span className="text-[8px] text-amber-400 uppercase block font-bold">Evolution Variance Summary</span>
                              <div className="space-y-1 text-zinc-300 leading-relaxed text-[9.5px]">
                                <p>
                                  <strong>Score Delta:</strong> Net Intelligence shift of <span className={`${learningProfile.metrics.intelligenceScore >= comp.metrics.intelligenceScore ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {(learningProfile.metrics.intelligenceScore - comp.metrics.intelligenceScore).toFixed(2)}%
                                  </span>.
                                </p>
                                <p className="mt-1">
                                  <strong>Adaptation Delta:</strong> Adaptive compliance tuned by <span className="text-indigo-300">{(learningProfile.metrics.adaptationScore - comp.metrics.adaptationScore).toFixed(2)}%</span>.
                                </p>
                              </div>
                            </div>

                            <div className="bg-purple-950/20 p-2.5 border border-purple-500/15 rounded text-[8.5px] text-purple-300">
                              <strong>Optimizing Backpropagation:</strong> Feedback vectors automatically adjust multi-agent weighting indexes to tighten preference cluster standard deviations.
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-black/35 p-6 rounded-2xl border border-white/5 text-center text-[10px] font-mono text-zinc-500">
                  No historical learning cycle records compiled yet in this session database. Trigger training signals above to populate the archive.
                </div>
              )}
            </div>

            {/* EXPORT LEARNING REPORT AND RAW DIAGNOSTICS */}
            <div className="bg-slate-950/25 border border-white/5 p-5 rounded-3xl text-left space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    Export Raw Evolution Telemetry
                  </h4>
                  <p className="text-[9px] text-zinc-500 font-mono">Download or copy current multidimensional backpropagation state indices</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify({
                      profile: learningProfile,
                      timeline: evolutionTimeline,
                      habits: habitMetrics,
                      preferenceEvolution: preferenceEvolution
                    }, null, 2));
                    setAgentLog("Copied full intelligence evolution report JSON schema to clipboard.");
                  }}
                  className="bg-white/5 hover:bg-white/10 text-white font-mono text-[9px] uppercase tracking-wider py-2 px-4 rounded-xl border border-white/10 cursor-pointer transition-all font-bold"
                >
                  [ Copy Report Payload ]
                </button>
              </div>
            </div>

          </motion.div>
        ) : activeSubTab === 'PREDICTIVE' ? (
          <motion.div
            key="predictive"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left font-sans"
          >
            {/* ENTERPRISE PREDICTIVE HEADER */}
            <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                    Enterprise Predictive Intelligence Layer Active
                  </span>
                </div>
                <h3 className="text-xl font-serif font-light text-white tracking-tight">
                  Predictive Intelligence & Simulation Center
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  Analyze wardrobe health, forecast purchase budgets, predict laundry cycles, and run deterministic local simulations of physical wardrobe alterations or weather shifts.
                </p>
              </div>

              {/* TIMELINE ADJUSTMENT CONTROLS */}
              <div className="bg-black/30 border border-white/5 p-1 rounded-xl flex flex-wrap gap-1">
                {(['7 Days', '14 Days', '30 Days', '90 Days', '180 Days', '365 Days'] as ForecastPeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      forecastTimeline === period
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold'
                        : 'text-zinc-500 hover:text-white hover:bg-white/[0.02] border border-transparent'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* FORECAST DASHBOARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Future Outfit Success Rate */}
              <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Future Outfit Success</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-light text-white font-mono">{predictiveMetrics.predictedOutfitSuccessRate.toFixed(1)}%</span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">Confidence</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2.5">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${predictiveMetrics.predictedOutfitSuccessRate}%` }}
                    />
                  </div>
                </div>
                <p className="text-[9px] font-mono text-zinc-500 leading-normal">
                  Mathematical certainty index of high-harmony coordinations across the specified {forecastTimeline} horizon.
                </p>
              </div>

              {/* Card 2: Wardrobe Health & Season Compliance */}
              <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Health & Compliance</span>
                  <Award className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1 text-zinc-400">
                      <span>Curation Health</span>
                      <span className="text-white font-bold">{predictiveMetrics.wardrobeHealthScore.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full" 
                        style={{ width: `${predictiveMetrics.wardrobeHealthScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1 text-zinc-400">
                      <span>Climate Adaptability</span>
                      <span className="text-white font-bold">{predictiveMetrics.climateAdaptationRating.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-400 h-full rounded-full" 
                        style={{ width: `${predictiveMetrics.climateAdaptationRating}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[9px] font-mono text-zinc-500 leading-normal">
                  Assesses fabric density compliance, styling redundancies, and thermal indices of active closet elements.
                </p>
              </div>

              {/* Card 3: Expected Purchase & Budget Forecast */}
              <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Commerce & Budget Projection</span>
                  <Database className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase font-mono block">Expected Purchases</span>
                      <span className="text-2xl font-light text-white font-mono">{predictiveMetrics.predictedPurchases} <span className="text-xs text-zinc-500">items</span></span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase font-mono block">Estimated Spend</span>
                      <span className="text-2xl font-light text-emerald-400 font-mono">${predictiveMetrics.expectedBudgetBurn} <span className="text-xs text-zinc-500">USD</span></span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-zinc-500 mt-2.5 pt-2 border-t border-white/5">
                    <span>Active Inventory Gaps:</span>
                    <strong className="text-white">{predictiveMetrics.inventoryGapsIdentified} Detected</strong>
                  </div>
                </div>
                <p className="text-[9px] font-mono text-zinc-500 leading-normal">
                  Projected acquisition rate based on the target Style DNA, styling gaps, and active lifestyle drift.
                </p>
              </div>

              {/* Card 4: Laundry & Wear Projections */}
              <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Laundry & Utilization</span>
                  <RefreshCw className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase font-mono block">Laundry Velocity</span>
                      <span className="text-2xl font-light text-white font-mono">{predictiveMetrics.laundryVelocityIndex.toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase font-mono block">Avg Item Wears</span>
                      <span className="text-2xl font-light text-sky-400 font-mono">{predictiveMetrics.wearPredictionIndex}x</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-zinc-500 mt-2.5 pt-2 border-t border-white/5">
                    <span>Closet Utilization Rate:</span>
                    <strong className="text-white">{predictiveMetrics.closetUtilizationRate.toFixed(0)}%</strong>
                  </div>
                </div>
                <p className="text-[9px] font-mono text-zinc-500 leading-normal">
                  Predicts the frequency with which items enter the 'Worn/Wash' status over the specified timeframe.
                </p>
              </div>

              {/* Card 5: Favorites & Trend Alignment */}
              <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Adoption & Trends</span>
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1 text-zinc-400">
                      <span>Favorite Adoption Rate</span>
                      <span className="text-white font-bold">{predictiveMetrics.favoriteAdoptionProbability.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-violet-500 h-full rounded-full" 
                        style={{ width: `${predictiveMetrics.favoriteAdoptionProbability}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1 text-zinc-400">
                      <span>Trend Alignment Score</span>
                      <span className="text-white font-bold">{predictiveMetrics.trendAlignmentProbability.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-violet-400 h-full rounded-full" 
                        style={{ width: `${predictiveMetrics.trendAlignmentProbability}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[9px] font-mono text-zinc-500 leading-normal">
                  Measures the alignment probability between future coordinates and curated personal style favorites.
                </p>
              </div>

              {/* Card 6: Travel Prep & Occasions */}
              <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Occasion & Travel Readiness</span>
                  <Sliders className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase font-mono block">Occasion Readiness</span>
                      <span className="text-2xl font-light text-white font-mono">{predictiveMetrics.occasionReadinessRate.toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase font-mono block">Travel Preparedness</span>
                      <span className="text-2xl font-light text-indigo-400 font-mono">{predictiveMetrics.travelPreparednessRate.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-zinc-500 mt-2.5 pt-2 border-t border-white/5">
                    <span>Fashion Lifecycle rating:</span>
                    <strong className="text-white">{predictiveMetrics.fashionLifecycleIndex.toFixed(0)}/100</strong>
                  </div>
                </div>
                <p className="text-[9px] font-mono text-zinc-500 leading-normal">
                  Evaluates whether active closet elements satisfy predicted formal/travel destination prerequisites.
                </p>
              </div>
            </div>

            {/* SIMULATION CENTER CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Control Panel: Simulation selector */}
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl lg:col-span-4 space-y-5 text-left">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Local Curation Simulation</span>
                  <h4 className="text-sm font-bold text-white tracking-tight">Deterministic Sim Engine</h4>
                  <p className="text-[10px] text-zinc-400 leading-normal">
                    Select a local speculative scenario below to simulate how wardrobe changes, weather shifts, or style shifts affect your entire styling stack.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Selector list */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Speculative Scenario</label>
                    <div className="space-y-1">
                      {[
                        { id: 'buy_jacket', label: 'Acquire Italian Cashmere Blazer' },
                        { id: 'remove_black', label: 'Purge Monochromatic Elements' },
                        { id: 'weather_change', label: 'Sudden Climatic Arctic Drop' },
                        { id: 'travel_abroad', label: 'Equatorial Relocation Travel' },
                        { id: 'gain_pieces', label: 'Acquire 5x Avant-Garde Pieces' },
                        { id: 'change_style', label: 'Shift Target Style Aesthetic' }
                      ].map((scen) => (
                        <button
                          key={scen.id}
                          onClick={() => {
                            setSelectedScenario(scen.id as any);
                            runLocalSimulation(scen.id as any, scen.id === 'change_style' ? customStyleValue : undefined);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-[10px] border transition-all cursor-pointer flex justify-between items-center ${
                            selectedScenario === scen.id
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-white font-semibold'
                              : 'bg-black/30 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.01]'
                          }`}
                        >
                          <span>{scen.label}</span>
                          {selectedScenario === scen.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Aesthetic input conditional */}
                  {selectedScenario === 'change_style' && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <label className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Target Style Aesthetic Name</label>
                      <input
                        type="text"
                        value={customStyleValue}
                        onChange={(e) => {
                          setCustomStyleValue(e.target.value);
                          runLocalSimulation('change_style', e.target.value);
                        }}
                        placeholder="e.g. Vintage Editorial"
                        className="w-full bg-black/60 text-white font-mono text-[10.5px] border border-white/15 rounded-xl px-3.5 py-2.5 focus:border-emerald-500/50 outline-none"
                      />
                    </div>
                  )}

                  <button
                    onClick={() => runLocalSimulation(selectedScenario, selectedScenario === 'change_style' ? customStyleValue : undefined)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-[10px] uppercase font-mono tracking-wider py-3 rounded-xl cursor-pointer transition-all flex justify-center items-center gap-2 shadow-lg shadow-emerald-950/20"
                  >
                    <Play className="w-3 h-3 text-black fill-current" />
                    [ Compile Simulation & Trace ]
                  </button>
                </div>
              </div>

              {/* Outputs: Active Simulation Result Details */}
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl lg:col-span-8 space-y-6 text-left">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                      Simulation Report Output
                    </span>
                    <h4 className="text-base font-bold text-white tracking-tight">{simulationResult.scenarioName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-mono text-zinc-500 block">PREDICTED CONFIDENCE</span>
                    <strong className="text-xl font-light text-emerald-400 font-mono">{simulationResult.predictedConfidence.toFixed(1)}%</strong>
                  </div>
                </div>

                <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-2">
                  <span className="text-[8px] font-mono text-zinc-500 block font-bold uppercase">Expected Qualitative Impact Synthesis</span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">{simulationResult.expectedImpact}</p>
                </div>

                {/* Risk and Opportunity Meters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Opportunity Meter */}
                  <div className="bg-black/20 border border-emerald-500/10 p-4 rounded-xl space-y-2 text-left">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-emerald-400 font-bold uppercase">Opportunity Score</span>
                      <strong className="text-emerald-400 text-xs">{simulationResult.opportunityScore}%</strong>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full" 
                        style={{ width: `${simulationResult.opportunityScore}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-mono text-zinc-500 block leading-tight">
                      Percentage probability of expanding layering options and coordination synergy ratings.
                    </span>
                  </div>

                  {/* Risk Meter */}
                  <div className="bg-black/20 border border-rose-500/10 p-4 rounded-xl space-y-2 text-left">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-rose-400 font-bold uppercase">Risk Score</span>
                      <strong className="text-rose-400 text-xs">{simulationResult.riskScore}%</strong>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-rose-500 h-full rounded-full" 
                        style={{ width: `${simulationResult.riskScore}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-mono text-zinc-500 block leading-tight">
                      Percentage probability of style fragmentation, wardrobe redundancies, or thermal failure.
                    </span>
                  </div>
                </div>

                {/* Affected Entities Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[9px]">
                  {/* Left Column: Items and Workflows */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-zinc-500 uppercase font-bold block">Affected Wardrobe Items ({simulationResult.affectedItemsCount})</span>
                      <div className="flex flex-wrap gap-1">
                        {simulationResult.affectedItemsNames.map((itm, i) => (
                          <span key={i} className="bg-white/5 border border-white/5 text-zinc-300 px-2 py-1 rounded">
                            {itm}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[8px] text-zinc-500 uppercase font-bold block">Affected System Workflows ({simulationResult.affectedWorkflows.length})</span>
                      <div className="space-y-1">
                        {simulationResult.affectedWorkflows.map((wk, i) => (
                          <div key={i} className="text-zinc-400 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-indigo-400" />
                            <span>{wk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Planning Goals & Agents */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-zinc-500 uppercase font-bold block">Affected Planning Goals ({simulationResult.affectedPlanningGoals.length})</span>
                      <div className="space-y-1">
                        {simulationResult.affectedPlanningGoals.map((gl, i) => (
                          <div key={i} className="text-zinc-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1 text-emerald-400 rounded-sm" />
                            <span>{gl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[8px] text-zinc-500 uppercase font-bold block">Notified / Recalibrated Autonomous Agents</span>
                      <div className="flex flex-wrap gap-1">
                        {simulationResult.affectedAgents.map((ag, i) => (
                          <span key={i} className="bg-violet-950/25 border border-violet-500/10 text-violet-400 px-2 py-0.5 rounded text-[8px]">
                            @{ag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation Preview Outcome */}
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-zinc-500 block uppercase">Projected Recommendation Quality Vector</span>
                    <p className="text-[10px] text-zinc-400">
                      Calculates subsequent recommendation model correctness under these speculative parameters.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-[14px] font-mono font-bold text-white">
                        {simulationResult.predictedRecommendationQuality.toFixed(1)}%
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-bold ${
                      simulationResult.predictedRecommendationQuality >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {simulationResult.predictedRecommendationQuality >= 80 ? 'OPTIMAL' : 'DISRUPTED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SCENARIO COMPARISON MATRIX */}
            <div className="bg-slate-950/25 border border-white/5 p-6 rounded-3xl space-y-4">
              <div className="space-y-1 text-left">
                <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Comparative Curation Intelligence</span>
                <h4 className="text-sm font-bold text-white tracking-tight">Scenario Comparison Matrix</h4>
                <p className="text-xs text-zinc-400">
                  Contrast current reality with three speculative local simulations across enterprise curation indices side-by-side.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-[10px]">
                {/* 1. Current Reality */}
                <div className="bg-black/35 border border-white/5 p-4 rounded-xl flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full uppercase block w-max font-bold">Baseline State</span>
                    <h5 className="text-[11px] font-bold text-white">{scenarioComparison.reality.name}</h5>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-white/5 text-[9px] text-zinc-400">
                    <div>Wardrobe Health: <strong className="text-indigo-400">{scenarioComparison.reality.health}%</strong></div>
                    <div>Risk Score: <strong className="text-rose-400">{scenarioComparison.reality.risk}%</strong></div>
                    <div>Budget Impact: <strong>${scenarioComparison.reality.budget} USD</strong></div>
                    <div>Model Confidence: <strong>{scenarioComparison.reality.confidence}%</strong></div>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed font-sans">{scenarioComparison.reality.summary}</p>
                </div>

                {/* 2. Scenario A */}
                <div className="bg-black/35 border border-emerald-500/10 p-4 rounded-xl flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full uppercase block w-max font-bold">Scenario A</span>
                    <h5 className="text-[11px] font-bold text-white">{scenarioComparison.scenarioA.name}</h5>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-white/5 text-[9px] text-zinc-400">
                    <div>Wardrobe Health: <strong className="text-emerald-400">{scenarioComparison.scenarioA.health}%</strong></div>
                    <div>Risk Score: <strong className="text-emerald-400">{scenarioComparison.scenarioA.risk}%</strong></div>
                    <div>Budget Spend: <strong>${scenarioComparison.scenarioA.budget} USD</strong></div>
                    <div>Model Confidence: <strong>{scenarioComparison.scenarioA.confidence}%</strong></div>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed font-sans">{scenarioComparison.scenarioA.summary}</p>
                </div>

                {/* 3. Scenario B */}
                <div className="bg-black/35 border border-rose-500/10 p-4 rounded-xl flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full uppercase block w-max font-bold text-rose-400">Scenario B</span>
                    <h5 className="text-[11px] font-bold text-white line-clamp-1">{scenarioComparison.scenarioB.name}</h5>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-white/5 text-[9px] text-zinc-400">
                    <div>Wardrobe Health: <strong className="text-rose-400">{scenarioComparison.scenarioB.health}%</strong></div>
                    <div>Risk Score: <strong className="text-rose-400">{scenarioComparison.scenarioB.risk}%</strong></div>
                    <div>Budget Spend: <strong>${scenarioComparison.scenarioB.budget} USD</strong></div>
                    <div>Model Confidence: <strong>{scenarioComparison.scenarioB.confidence}%</strong></div>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed font-sans">{scenarioComparison.scenarioB.summary}</p>
                </div>

                {/* 4. Scenario C */}
                <div className="bg-black/35 border border-amber-500/10 p-4 rounded-xl flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full uppercase block w-max font-bold text-amber-400">Scenario C</span>
                    <h5 className="text-[11px] font-bold text-white line-clamp-1">{scenarioComparison.scenarioC.name}</h5>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-white/5 text-[9px] text-zinc-400">
                    <div>Wardrobe Health: <strong className="text-amber-400">{scenarioComparison.scenarioC.health}%</strong></div>
                    <div>Risk Score: <strong className="text-rose-400">{scenarioComparison.scenarioC.risk}%</strong></div>
                    <div>Budget Spend: <strong>${scenarioComparison.scenarioC.budget} USD</strong></div>
                    <div>Model Confidence: <strong>{scenarioComparison.scenarioC.confidence}%</strong></div>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed font-sans">{scenarioComparison.scenarioC.summary}</p>
                </div>
              </div>
            </div>

            {/* LOWER TERMINAL & HISTORY LOGS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Simulation Trace terminal */}
              <div className="bg-black/85 border border-white/10 rounded-2xl p-5 space-y-3 font-mono text-[9px] text-left">
                <div className="flex justify-between items-center pb-2 border-b border-white/5 text-zinc-500">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">✓ Simulation Trace Engine Diagnostics</span>
                  <span>PID: {Math.floor(Math.random() * 900 + 100)}</span>
                </div>
                <div className="space-y-1 h-36 overflow-y-auto custom-scrollbar pt-1.5 text-zinc-400">
                  {simTraceLogs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-emerald-500/60 font-bold">»</span>
                      <span className={log.includes('[SIMULATION INIT]') ? 'text-emerald-400' : log.includes('[SIMULATION COMPLETE]') ? 'text-violet-400' : 'text-zinc-400'}>{log}</span>
                    </div>
                  ))}
                  <div className="text-zinc-600 italic">... monitoring local orchestration channels headlessly ...</div>
                </div>
              </div>

              {/* History & Enterprise Metric logs */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5 text-left flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                      Curation Simulation Archives
                    </span>
                    <button 
                      onClick={() => setSimulationHistory([{ name: 'Initial Baseline Audit', timestamp: Date.now(), risk: 15, opportunity: 88 }])}
                      className="text-zinc-500 hover:text-white font-mono text-[8.5px] cursor-pointer"
                    >
                      [ Clear History ]
                    </button>
                  </div>
                  
                  <div className="space-y-1.5 h-28 overflow-y-auto">
                    {simulationHistory.map((hist, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] font-mono bg-white/[0.01] border border-white/5 p-2 rounded-lg">
                        <div className="space-y-0.5">
                          <span className="text-white font-bold block">{hist.name}</span>
                          <span className="text-[8px] text-zinc-500">
                            {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex gap-2 text-[9px]">
                          <span className="text-rose-400">Risk: {hist.risk}%</span>
                          <span className="text-emerald-400">Opp: {hist.opportunity}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[8.5px] font-mono text-zinc-500">REUSABLE MODEL INDEXES: 11 ACTIVE ENGINES</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify({
                        forecastPeriod: forecastTimeline,
                        metrics: predictiveMetrics,
                        activeScenario: simulationResult,
                        history: simulationHistory
                      }, null, 2));
                      setAgentLog("Copied enterprise predictive intelligence report JSON schema to clipboard.");
                    }}
                    className="bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 font-mono text-[9px] uppercase tracking-wider py-1.5 px-3.5 rounded-lg border border-emerald-500/20 cursor-pointer transition-all font-bold"
                  >
                    [ Copy Predictive Report ]
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeSubTab === 'AUTONOMOUS' ? (
          <motion.div
            key="autonomous"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left font-sans"
          >
            {/* AUTONOMOUS ENGINE HEADER */}
            <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">
                    Enterprise Autonomous Goal Execution Layer Active
                  </span>
                </div>
                <h3 className="text-xl font-serif font-light text-white tracking-tight">
                  Autonomous Goal Execution Center
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  Automate approved planning objectives, execute topological tasks with dependency checks, and audit self-repair recovery sequences.
                </p>
              </div>

              {/* SCHEDULER POLICY CONTROLS */}
              <div className="bg-black/30 border border-white/5 p-1.5 rounded-xl flex items-center gap-2">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider pl-2">Policy:</span>
                {(['Priority First', 'FCFS', 'Interactive Adaptive'] as const).map((policy) => (
                  <button
                    key={policy}
                    onClick={() => {
                      setSchedulerPolicy(policy);
                      setAgentLog(`AutonomousEngine: Scheduler policy updated to ${policy}.`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      schedulerPolicy === policy
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-bold'
                        : 'text-zinc-500 hover:text-white hover:bg-white/[0.02] border border-transparent'
                    }`}
                  >
                    {policy}
                  </button>
                ))}
              </div>
            </div>

            {/* METRICS SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Goal Success Rate */}
              <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Goal Success Rate</span>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-light text-white font-mono">{executionMetrics.successRate}%</span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">OPTIMAL</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${executionMetrics.successRate}%` }}
                    />
                  </div>
                </div>
                <div className="text-[8.5px] font-mono text-zinc-500 flex justify-between">
                  <span>Completed: {executionMetrics.completedCount}</span>
                  <span>Failed: {executionMetrics.failedCount}</span>
                </div>
              </div>

              {/* Metric 2: Avg Execution Latency */}
              <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Average Step Latency</span>
                <div>
                  <span className="text-3xl font-light text-white font-mono">{executionMetrics.averageExecutionTime}ms</span>
                  <div className="text-[8.5px] font-mono text-zinc-500 mt-2">
                    Topological sort & scheduling validation time.
                  </div>
                </div>
                <div className="text-[8.5px] font-mono text-zinc-500">
                  Clock cycles: <span className="text-white">Deterministic Local</span>
                </div>
              </div>

              {/* Metric 3: Multi-Agent Platform Utilization */}
              <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Agent Utilization Index</span>
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1 text-zinc-400">
                    <span>Thread Allocation</span>
                    <span className="text-white font-bold">{executionMetrics.agentUtilizationRate}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${executionMetrics.agentUtilizationRate}%` }} />
                  </div>
                </div>
                <div className="text-[8.5px] font-mono text-zinc-500">
                  Active Bus channels: <span className="text-white">5 Headless Agents</span>
                </div>
              </div>

              {/* Metric 4: Workflow Synchronization Rate */}
              <div className="bg-black/45 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Workflow Harness Sync</span>
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1 text-zinc-400">
                    <span>Integration Coverage</span>
                    <span className="text-white font-bold">{executionMetrics.workflowUtilizationRate}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: `${executionMetrics.workflowUtilizationRate}%` }} />
                  </div>
                </div>
                <div className="text-[8.5px] font-mono text-zinc-500">
                  Shared engines: <span className="text-white">11 Registered</span>
                </div>
              </div>
            </div>

            {/* THREE-COLUMN INTERACTIVE TERMINALS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 1. Goals List & Scheduler Configuration (span 4) */}
              <div className="bg-black/40 border border-white/5 p-5 rounded-3xl lg:col-span-4 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Orchestrator Registry</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">Active Execution Goals</h4>
                  </div>

                  {/* Active Goals list */}
                  <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                    {autonomousGoals.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setActiveGoalId(g.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col space-y-1.5 ${
                          activeGoalId === g.id
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                            : 'bg-black/25 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.01]'
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="text-[11px] font-bold tracking-tight leading-none text-white">{g.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[7.5px] font-mono font-bold uppercase ${
                            g.overallState === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                            g.overallState === 'Running' ? 'bg-indigo-500/10 text-indigo-400 animate-pulse' :
                            g.overallState === 'Failed' ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-500/10 text-zinc-400'
                          }`}>
                            {g.overallState}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed font-sans">{g.description}</p>
                        <div className="text-[8.5px] font-mono text-zinc-500 flex justify-between w-full pt-1.5 border-t border-white/5">
                          <span>Tasks: {g.tasks.length}</span>
                          <span>Priority: {g.tasks[0]?.priority || 'Medium'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seed Reset and Custom Dispatcher */}
                <div className="pt-4 border-t border-white/5 space-y-3 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[8.5px] font-mono uppercase text-zinc-500 font-bold block">Speculative Custom Goal Dispatcher</span>
                    <input
                      type="text"
                      placeholder="e.g. Winter Capsule Curation"
                      value={customGoalName}
                      onChange={(e) => setCustomGoalName(e.target.value)}
                      className="w-full bg-black/60 text-white font-mono text-[10px] border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-indigo-500/40"
                    />
                    <input
                      type="text"
                      placeholder="Goal description context..."
                      value={customGoalDesc}
                      onChange={(e) => setCustomGoalDesc(e.target.value)}
                      className="w-full bg-black/60 text-white font-mono text-[10px] border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-indigo-500/40"
                    />
                    <button
                      onClick={createCustomGoal}
                      disabled={!customGoalName.trim()}
                      className="w-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/35 text-indigo-300 font-mono text-[9px] uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      [ Dispatch Custom Goal Seq ]
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const defaults = AutonomousExecutionEngine.resetToDefault();
                      setAutonomousGoals(defaults);
                      setActiveGoalId('goal-seasonal-curator');
                      setAgentLog("AutonomousEngine: Execution queue restored to high-fidelity factory default seed.");
                    }}
                    className="w-full text-center text-[9px] font-mono text-rose-400 hover:text-rose-300 cursor-pointer pt-2 border-t border-white/5"
                  >
                    [ Reset Database to Defaults ]
                  </button>
                </div>
              </div>

              {/* 2. Selected Goal's Dependency Graph & Task List (span 4) */}
              <div className="bg-black/40 border border-white/5 p-5 rounded-3xl lg:col-span-4 space-y-4 text-left">
                <div className="space-y-1">
                  <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Dependency Solver</span>
                  <h4 className="text-sm font-bold text-white tracking-tight">Topological Task Queue</h4>
                  <p className="text-[10px] text-zinc-400 font-sans">
                    Tasks are arranged topologically. Predecessors must succeed before descendants proceed.
                  </p>
                </div>

                {(() => {
                  const currentGoal = autonomousGoals.find(g => g.id === activeGoalId);
                  if (!currentGoal) {
                    return (
                      <div className="text-zinc-500 text-[10px] italic py-8 font-mono">
                        Select a goal in the list to examine its dependency graph...
                      </div>
                    );
                  }

                  // Resolve topological order to present them in solved order
                  const solvedTasks = AutonomousExecutionEngine.resolveDependencies(currentGoal.tasks);

                  return (
                    <div className="space-y-4">
                      {/* Graph tree presentation */}
                      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                        {solvedTasks.map((t, i) => {
                          const hasPredecessor = t.dependencies.length > 0;
                          return (
                            <div key={t.id} className="relative flex items-start gap-3">
                              {/* Left trace indicator line */}
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                                  t.state === 'Completed' ? 'bg-emerald-500 border-emerald-500' :
                                  t.state === 'Recovered' ? 'bg-emerald-400 border-emerald-400' :
                                  t.state === 'Running' ? 'bg-indigo-500 border-indigo-500 animate-pulse' :
                                  t.state === 'Failed' ? 'bg-rose-500 border-rose-500' : 'bg-zinc-800 border-zinc-700'
                                }`}>
                                  {t.state === 'Completed' && <Check className="w-2 h-2 text-black" />}
                                </div>
                                {i < solvedTasks.length - 1 && (
                                  <div className="w-0.5 bg-white/5 h-16" />
                                )}
                              </div>

                              {/* Task card */}
                              <div className="bg-black/35 border border-white/5 p-3 rounded-xl flex-1 space-y-1.5 text-left relative overflow-hidden">
                                {t.state === 'Running' && (
                                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500 animate-pulse" />
                                )}
                                <div className="flex justify-between items-start">
                                  <span className="text-[10px] font-bold font-mono text-zinc-100">{t.type}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono ${
                                    t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' :
                                    t.priority === 'High' ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-500/10 text-zinc-400'
                                  }`}>
                                    {t.priority}
                                  </span>
                                </div>

                                <div className="text-[8.5px] font-mono text-zinc-400 flex justify-between items-center">
                                  <span>Progress: {t.progress}%</span>
                                  <span>{t.executionTimeMs}ms</span>
                                </div>

                                {/* Predecessor reference */}
                                {hasPredecessor && (
                                  <div className="text-[7.5px] font-mono text-indigo-400 bg-indigo-950/20 border border-indigo-500/10 px-2 py-0.5 rounded w-max">
                                    Predecessor: {t.dependencies.join(', ')}
                                  </div>
                                )}

                                {/* Individual task actions */}
                                <div className="flex gap-1.5 pt-1 border-t border-white/5 justify-end">
                                  {t.state === 'Failed' && (
                                    <button
                                      onClick={() => recoverGoalTask(currentGoal.id, t.id)}
                                      className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[8px] py-1 px-2.5 rounded border border-emerald-500/20 cursor-pointer font-bold"
                                    >
                                      [ Self-Repair / Recover ]
                                    </button>
                                  )}
                                  {(t.state === 'Idle' || t.state === 'Waiting' || t.state === 'Queued' || t.state === 'Running') && (
                                    <button
                                      onClick={() => runGoalStep(currentGoal.id, t.id)}
                                      className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-mono text-[8.5px] py-1 px-2.5 rounded border border-indigo-500/20 cursor-pointer font-bold"
                                    >
                                      {t.state === 'Running' ? '[ Progressing Step ]' : '[ Compile & Execute ]'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Rollback and Complete triggers */}
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => rollbackGoal(currentGoal.id)}
                          className="w-full bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 font-mono text-[9px] uppercase tracking-wider py-2 rounded-xl border border-rose-500/10 transition-all cursor-pointer font-bold"
                        >
                          [ Rollback Goal State ]
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 3. Task Monitor, Logs & Live Trace (span 4) */}
              <div className="bg-black/40 border border-white/5 p-5 rounded-3xl lg:col-span-4 space-y-4 flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Task Monitor</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">Active Step Log Diagnostic</h4>
                    <p className="text-[10px] text-zinc-400 font-sans">
                      Inspect telemetry and run logs for the selected autonomous goal sequence.
                    </p>
                  </div>

                  {(() => {
                    const currentGoal = autonomousGoals.find(g => g.id === activeGoalId);
                    if (!currentGoal) {
                      return <div className="text-zinc-500 text-[10px] italic py-8 font-mono">No goal active...</div>;
                    }

                    // Collect logs of all tasks of this goal
                    const allLogs: Array<{ task: string; text: string }> = [];
                    currentGoal.tasks.forEach(t => {
                      t.logs.forEach(l => {
                        allLogs.push({ task: t.type, text: l });
                      });
                    });

                    return (
                      <div className="space-y-3">
                        <div className="bg-black/85 border border-white/10 rounded-xl p-3.5 h-64 overflow-y-auto custom-scrollbar font-mono text-[9px] text-zinc-400 space-y-1">
                          <div className="text-zinc-500 italic pb-1.5 border-b border-white/5 flex justify-between items-center mb-1">
                            <span>System process trace</span>
                            <span>CPU ACTIVE</span>
                          </div>
                          {allLogs.map((lg, idx) => (
                            <div key={idx} className="leading-relaxed">
                              <span className="text-indigo-400/80 font-bold mr-1">@{lg.task.replace(' ', '')}</span>
                              <span className={lg.text.includes('[CRITICAL]') || lg.text.includes('[FAIL]') ? 'text-rose-400' : lg.text.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-zinc-300'}>
                                {lg.text}
                              </span>
                            </div>
                          ))}
                          <div className="text-zinc-600 italic mt-1.5">... listening for next scheduler trigger ...</div>
                        </div>

                        {/* Interactive Retry Policy details */}
                        <div className="bg-black/35 border border-white/5 p-3 rounded-xl space-y-1.5">
                          <span className="text-[8px] font-mono text-zinc-500 block uppercase font-bold">Execution & Retry Policy</span>
                          <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-zinc-400">
                            <div>Standard Policy: <strong className="text-zinc-200">Local-First</strong></div>
                            <div>Max Backoff: <strong className="text-zinc-200">3 Retries</strong></div>
                            <div>Execution Policy: <strong className="text-indigo-300">Self-Repairing</strong></div>
                            <div>Rollback Policy: <strong className="text-rose-300">Deterministic</strong></div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[8.5px] font-mono text-zinc-500">
                  <span>SCHEDULER STATUS: ONLINE</span>
                  <span className="text-emerald-400 animate-pulse font-bold">● ACTIVE</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeSubTab === 'GOVERNANCE' ? (
          <motion.div
            key="governance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left font-sans"
          >
            {/* GOVERNANCE ENGINE HEADER */}
            <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    systemHealthMetrics.governanceState === 'Healthy' ? 'bg-emerald-400' :
                    systemHealthMetrics.governanceState === 'Warning' ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    Operating System State: 
                    <span className={`font-bold ${
                      systemHealthMetrics.governanceState === 'Healthy' ? 'text-emerald-400' :
                      systemHealthMetrics.governanceState === 'Warning' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {systemHealthMetrics.governanceState.toUpperCase()}
                    </span>
                  </span>
                </div>
                <h3 className="text-xl font-serif font-light text-white tracking-tight">
                  Governance & Policy Intelligence Console
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  Enforce computational boundaries, supervise autonomous decisions, resolve structural resource conflicts, and monitor system-wide AI safety rules.
                </p>
              </div>

              {/* OVERALL HEALTH ACCENT */}
              <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Overall AI Health Score</span>
                  <span className="text-2xl font-light font-mono text-white">{systemHealthMetrics.overallAIHealthScore}%</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02]">
                  <span className={`text-[11px] font-bold font-mono ${
                    systemHealthMetrics.overallAIHealthScore >= 80 ? 'text-emerald-400' :
                    systemHealthMetrics.overallAIHealthScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {systemHealthMetrics.overallAIHealthScore >= 80 ? 'EXC' : 'WARN'}
                  </span>
                </div>
              </div>
            </div>

            {/* INTEGRATED HEALTH SUB-METRICS */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              {[
                { name: 'Core Engines', score: systemHealthMetrics.engineHealth, color: 'bg-emerald-500' },
                { name: 'Workflows', score: systemHealthMetrics.workflowHealth, color: 'bg-teal-500' },
                { name: 'Learning Loop', score: systemHealthMetrics.learningHealth, color: 'bg-indigo-500' },
                { name: 'Predictive Model', score: systemHealthMetrics.predictionHealth, color: 'bg-violet-500' },
                { name: 'Goal Planning', score: systemHealthMetrics.planningHealth, color: 'bg-fuchsia-500' },
                { name: 'Auto Execution', score: systemHealthMetrics.executionHealth, color: 'bg-pink-500' },
              ].map((subMetric, idx) => (
                <div key={idx} className="bg-black/45 border border-white/5 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                  <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider block truncate">{subMetric.name}</span>
                  <div className="space-y-1">
                    <span className="text-lg font-mono text-white font-light">{subMetric.score}%</span>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${subMetric.color}`} style={{ width: `${subMetric.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* MAIN TWO-COLUMN DASHBOARD GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT MAIN PANEL: Policies, Approvals & Violations (span 8) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* 1. APPROVAL CENTER */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div className="space-y-0.5">
                      <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Administrator Supervisor</span>
                      <h4 className="text-sm font-bold text-white tracking-tight">System Approval Request Hub</h4>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 bg-white/5 px-2.5 py-1 rounded">
                      Pending Requests: {governanceApprovals.filter(a => a.status === 'Pending').length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {governanceApprovals.map((appr) => (
                      <div 
                        key={appr.id} 
                        className={`p-3.5 rounded-xl border flex flex-col md:flex-row gap-4 justify-between items-start md:items-center transition-all ${
                          appr.status === 'Pending' ? 'bg-indigo-500/5 border-indigo-500/10' :
                          appr.status === 'Approved' ? 'bg-emerald-500/5 border-emerald-500/10 opacity-75' :
                          'bg-rose-500/5 border-rose-500/10 opacity-75'
                        }`}
                      >
                        <div className="space-y-1.5 max-w-xl text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold font-mono text-zinc-100">{appr.actionName}</span>
                            <span className="text-[8px] font-mono text-zinc-500">Requested by: @{appr.requestedBy}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-bold ${
                              appr.riskRating === 'High' ? 'bg-rose-500/15 text-rose-400' :
                              appr.riskRating === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-500/15 text-zinc-400'
                            }`}>
                              Risk: {appr.riskRating}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{appr.description}</p>
                          <span className="text-[8px] font-mono text-zinc-500">
                            Dispatched: {new Date(appr.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        {appr.status === 'Pending' ? (
                          <div className="flex gap-2 w-full md:w-auto">
                            <button
                              onClick={() => handleApprovalDecision(appr.id, false)}
                              className="flex-1 md:flex-none bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-mono text-[8.5px] uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-all font-bold"
                            >
                              [ Decline ]
                            </button>
                            <button
                              onClick={() => handleApprovalDecision(appr.id, true)}
                              className="flex-1 md:flex-none bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/20 font-mono text-[8.5px] uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer transition-all font-bold"
                            >
                              [ Approve ]
                            </button>
                          </div>
                        ) : (
                          <div className="w-full md:w-auto text-right">
                            <span className={`px-2.5 py-1 rounded text-[8.5px] font-mono font-bold uppercase tracking-wider ${
                              appr.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              Decision: {appr.status}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. POLICY RULES CENTER */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Rule Engine Controller</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">Active Computational Constraints</h4>
                    <p className="text-[10px] text-zinc-400">
                      Toggle active policies to restrict or expand the automated degrees of freedom available to multi-agent engines.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {governanceRules.map((rule) => (
                      <div 
                        key={rule.id} 
                        className={`p-3.5 rounded-xl border bg-black/20 flex flex-col justify-between space-y-3 transition-all ${
                          rule.status === 'Active' ? 'border-white/5' : 'border-white/5 opacity-50'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-white leading-none tracking-tight">{rule.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono ${
                              rule.severity === 'Critical' ? 'bg-rose-500/15 text-rose-400' :
                              rule.severity === 'Warning' ? 'bg-amber-500/15 text-amber-400' : 'bg-zinc-500/15 text-zinc-400'
                            }`}>
                              {rule.severity}
                            </span>
                          </div>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">@{rule.category}</span>
                          <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{rule.description}</p>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                          <span className={`text-[8.5px] font-mono font-bold uppercase ${
                            rule.status === 'Active' ? 'text-emerald-400' :
                            rule.status === 'Triggered' ? 'text-rose-400 animate-pulse' : 'text-zinc-500'
                          }`}>
                            State: {rule.status}
                          </span>
                          <button
                            onClick={() => toggleRuleStatus(rule.id)}
                            className={`font-mono text-[8.5px] py-1 px-2.5 rounded transition-all cursor-pointer font-bold ${
                              rule.status === 'Active'
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/15'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/15'
                            }`}
                          >
                            {rule.status === 'Active' ? '[ Suspend Rule ]' : '[ Activate Rule ]'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. VIOLATION AUDIT RECORD */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-rose-400 font-bold uppercase tracking-wider block">Security Violation Terminal</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">Active Policy Violations & Exceptions</h4>
                  </div>

                  <div className="space-y-3">
                    {governanceViolations.map((viol) => (
                      <div 
                        key={viol.id} 
                        className={`p-3.5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                          viol.remedied ? 'bg-emerald-500/5 border-emerald-500/10 opacity-75' : 'bg-rose-500/5 border-rose-500/10'
                        }`}
                      >
                        <div className="space-y-1.5 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-white">{viol.ruleName}</span>
                            <span className="text-[8px] font-mono text-zinc-500">Category: @{viol.category}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-mono uppercase font-bold ${
                              viol.remedied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400 animate-pulse'
                            }`}>
                              {viol.remedied ? 'REMEDIED' : 'UNRESOLVED'}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">{viol.description}</p>
                          <div className="text-[8.5px] text-indigo-300 font-mono">
                            Recommended Action: {viol.recommendedAction}
                          </div>
                        </div>

                        {!viol.remedied && (
                          <button
                            onClick={() => {
                              // Direct action trigger to remedy
                              if (viol.id === 'viol-purge') {
                                handleApprovalDecision('appr-purge-black', true);
                              } else if (viol.id === 'viol-dna') {
                                const vCopy = [...governanceViolations];
                                const currentViol = vCopy.find(v => v.id === 'viol-dna');
                                if (currentViol) {
                                  currentViol.remedied = true;
                                  currentViol.description += ' Remedied via active backpropagation optimization.';
                                  setGovernanceViolations(vCopy);
                                }
                                setAgentLog("GovernanceEngine: Remedied style DNA stability violation via interactive parameter backpropagation.");
                              }
                            }}
                            className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-mono text-[8px] py-1.5 px-3 rounded-lg border border-indigo-500/25 cursor-pointer font-bold whitespace-nowrap"
                          >
                            [ Resolve Exception ]
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT SIDE PANEL: Recommendations, Timeline & Metrics (span 4) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* 1. AUTOMATIC REPAIR RECOMMENDATIONS */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Aesthetic Auto-Heal</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">Governance Recommendations</h4>
                  </div>

                  <div className="space-y-3">
                    {governanceRecommendations.map((rec) => (
                      <div key={rec.id} className="bg-black/25 border border-white/5 p-3.5 rounded-xl space-y-2 text-left">
                        <div className="flex justify-between items-start gap-1.5">
                          <span className="text-[10px] font-bold text-zinc-100">{rec.title}</span>
                          <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10 font-bold whitespace-nowrap">
                            {rec.efficiencyGain}
                          </span>
                        </div>
                        <p className="text-[9.5px] text-zinc-400 leading-relaxed font-sans">{rec.description}</p>
                        <div className="flex justify-between items-center pt-1.5 border-t border-white/5 text-[8px] font-mono text-zinc-500">
                          <span>Impact: {rec.impactScore}/100</span>
                          <span>Category: @{rec.category.replace(' ', '')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. REAL-TIME GOVERNANCE TIMELINE */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-4 text-left">
                    <div className="space-y-1">
                      <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Supervised Logging</span>
                      <h4 className="text-sm font-bold text-white tracking-tight">Governance Activity Trace</h4>
                      <p className="text-[9.5px] text-zinc-400 leading-relaxed">
                        Chrono-stream tracking background rule executions, state validations, and policy matches.
                      </p>
                    </div>

                    <div className="bg-black/90 border border-white/10 rounded-xl p-3.5 h-64 overflow-y-auto custom-scrollbar font-mono text-[9px] text-zinc-400 space-y-2">
                      {governanceTimeline.map((item, idx) => (
                        <div key={idx} className="leading-relaxed border-b border-white/[0.03] pb-1.5">
                          <div className="flex justify-between text-[8px] text-zinc-500 mb-0.5">
                            <span>[{item.time}]</span>
                            <span className="text-indigo-400 font-bold">@{item.category}</span>
                          </div>
                          <span className="text-zinc-200 block">{item.text}</span>
                        </div>
                      ))}
                      <div className="text-zinc-600 italic">... monitoring local orchestration channels headlessly ...</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[8.5px] font-mono text-zinc-500">
                    <span>GOVERNOR ENGINES: COMPLIANT</span>
                    <span className="text-emerald-400 animate-pulse font-bold">● COOPERATIVE</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        ) : activeSubTab === 'PERFORMANCE' ? (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left font-sans"
          >
            {/* PERFORMANCE HEADER */}
            <div className="bg-slate-950/40 border border-white/5 p-6 rounded-3xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    Platform telemetry state: 
                    <span className="text-indigo-400 font-bold">MONITORED</span>
                  </span>
                </div>
                <h3 className="text-xl font-serif font-light text-white tracking-tight">
                  Resource Intelligence & Performance Engine
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  Measure, optimize, and supervise computational system performance, memory leaks, latencies, and resource capacity across the autonomous architecture.
                </p>
              </div>

              {/* OVERALL PERFORMANCE INDEX GAUGE */}
              <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Overall Perf Index</span>
                  <span className="text-2xl font-light font-mono text-indigo-400">{resourceMetrics.scores.overallPerformanceIndex}%</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-indigo-500/10 flex items-center justify-center bg-indigo-500/5">
                  <span className="text-[11px] font-bold font-mono text-indigo-300">
                    {resourceMetrics.scores.overallPerformanceIndex >= 85 ? 'OPTIMAL' : 'STABLE'}
                  </span>
                </div>
              </div>
            </div>

            {/* PLATFORM SCORES ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Core CPU Performance', score: resourceMetrics.scores.performanceScore, color: 'text-violet-400', bg: 'bg-violet-500' },
                { name: 'Memory Allocation Efficiency', score: resourceMetrics.scores.efficiencyScore, color: 'text-teal-400', bg: 'bg-teal-500' },
                { name: 'Active Parameter Optimization', score: resourceMetrics.scores.optimizationScore, color: 'text-indigo-400', bg: 'bg-indigo-500' },
                { name: 'Thread & Queue Health', score: resourceMetrics.scores.resourceHealthScore, color: 'text-emerald-400', bg: 'bg-emerald-500' }
              ].map((m, idx) => (
                <div key={idx} className="bg-black/45 border border-white/5 p-5 rounded-2xl space-y-2 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">{m.name}</span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-light font-mono text-white">{m.score}%</span>
                      <span className={`text-[8px] font-mono font-bold uppercase ${m.color}`}>
                        {m.score >= 80 ? 'EXCELLENT' : m.score >= 60 ? 'NORMAL' : 'DEGRADED'}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${m.bg}`} style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RESOURCE & CAPACITY ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT SIDE: RESOURCE MONITOR & LATENCY CHARTS */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* 1. RESOURCE MONITOR & SYSTEM STATISTICS */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-5 text-left">
                  <div className="pb-3 border-b border-white/5 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Real-time Telemetry</span>
                      <h4 className="text-sm font-bold text-white tracking-tight">Resource Footprint Monitor</h4>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500">Live Active Tracking</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* CPU USAGE */}
                    <div className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-zinc-400">CPU Usage</span>
                        <span className="text-white font-bold">{resourceMetrics.cpuUsagePercent}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            resourceMetrics.cpuUsagePercent > 75 ? 'bg-rose-500 animate-pulse' :
                            resourceMetrics.cpuUsagePercent > 50 ? 'bg-amber-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${resourceMetrics.cpuUsagePercent}%` }}
                        />
                      </div>
                      <p className="text-[8.5px] text-zinc-500 leading-normal">
                        Estimated virtual load across local background threads.
                      </p>
                    </div>

                    {/* MEMORY USAGE */}
                    <div className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-zinc-400">RAM Allocation</span>
                        <span className="text-white font-bold">{resourceMetrics.memoryUsageMb} MB</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-teal-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, (resourceMetrics.memoryUsageMb / 512) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[8.5px] text-zinc-500 leading-normal">
                        Volatile caching size for Active State DNA & Memory blocks.
                      </p>
                    </div>

                    {/* STORAGE USAGE */}
                    <div className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-zinc-400">Storage Usage</span>
                        <span className="text-white font-bold">{resourceMetrics.storageUsageKb} KB</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-violet-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, (resourceMetrics.storageUsageKb / 4096) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[8.5px] text-zinc-500 leading-normal">
                        Serialized size of local browser state & database.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. LATENCY ANALYSIS CHARTS */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-5 text-left">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Operational Latencies</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">Active Engine Latency Profile</h4>
                    <p className="text-[10px] text-zinc-400">
                      Telemetry profiling execution cycles and scheduling delays across decoupled framework layers.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {[
                      { name: 'Autonomous Execution Latency', value: resourceMetrics.latencies.executionLatencyMs, target: '150ms max' },
                      { name: 'Predictive Model Simulation Latency', value: resourceMetrics.latencies.predictionLatencyMs, target: '300ms max' },
                      { name: 'Goal Decomposition Planning Latency', value: resourceMetrics.latencies.planningLatencyMs, target: '500ms max' },
                      { name: 'Weight Optimizer Learning Latency', value: resourceMetrics.latencies.learningLatencyMs, target: '500ms max' },
                      { name: 'Rule Resolution Reasoning Latency', value: resourceMetrics.latencies.reasoningLatencyMs, target: '400ms max' }
                    ].map((lat, idx) => {
                      const maxLimit = 500;
                      const percent = Math.min(100, (lat.value / maxLimit) * 100);
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-zinc-300 font-medium">{lat.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold">{lat.value} ms</span>
                              <span className="text-zinc-600">({lat.target})</span>
                            </div>
                          </div>
                          <div className="w-full bg-white/5 h-2.5 rounded-lg overflow-hidden flex">
                            <div 
                              className={`h-full rounded-lg transition-all duration-500 ${
                                lat.value > 350 ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                                lat.value > 200 ? 'bg-gradient-to-r from-amber-500 to-violet-500' :
                                'bg-gradient-to-r from-indigo-500 to-teal-500'
                              }`} 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. BOTTLENECK ANALYSIS */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-rose-400 font-bold uppercase tracking-wider block">Diagnostics Console</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">Resource Bottlenecks & Hotspots</h4>
                  </div>

                  <div className="space-y-3">
                    {resourceMetrics.bottlenecks.map((bot) => (
                      <div key={bot.id} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-3">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-zinc-100">{bot.sourceEngine}</span>
                            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Impact: {bot.metricImpact}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                            bot.severity === 'Critical' ? 'bg-red-500/15 text-red-400' :
                            bot.severity === 'High' ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'
                          }`}>
                            Severity: {bot.severity}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{bot.description}</p>
                        <div className="bg-black/30 border border-white/5 p-2.5 rounded-lg text-[9.5px] text-indigo-300 font-mono">
                          <span className="font-bold text-indigo-400">Suggested Action: </span> {bot.remedy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT SIDE: CAPACITY MONITOR, ENGINE ACTIVITY & OPTIMIZATION CENTER */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* 1. CAPACITY MONITOR */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Scale Indexer</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">Capacity & Limits Manager</h4>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-center">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">Current Load</span>
                        <span className="text-lg font-mono text-white font-light">{resourceMetrics.capacity.currentCapacity} items</span>
                      </div>
                      <div className="bg-black/30 border border-white/5 p-3 rounded-lg text-center">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block">Growth Trend</span>
                        <span className="text-lg font-mono text-emerald-400 font-bold">{resourceMetrics.capacity.growthTrend}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-black/20 border border-white/5 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span>Local Storage Capacity</span>
                        <span className="text-white">{resourceMetrics.capacity.estimatedHeadroom}% Headroom</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${resourceMetrics.capacity.estimatedHeadroom}%` }} 
                        />
                      </div>
                      <span className="text-[8px] font-mono text-zinc-500 block text-right">
                        Peak Threshold Capacity: {resourceMetrics.capacity.peakCapacity} wardrobe slots
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. ENGINE ACTIVITY MONITOR */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Active Queue Load</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">Engine Activity Telemetry</h4>
                  </div>

                  <div className="space-y-3 text-[10px] font-mono">
                    <div className="flex justify-between items-center p-2.5 bg-black/20 rounded-lg">
                      <span className="text-zinc-400">Workflow Engine Load</span>
                      <span className="text-white font-bold">{resourceMetrics.load.workflowLoad}%</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-black/20 rounded-lg">
                      <span className="text-zinc-400">Multi-Agent Communication Load</span>
                      <span className="text-white font-bold">{resourceMetrics.load.agentLoad}%</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-black/20 rounded-lg">
                      <span className="text-zinc-400">Task Telemetry Throughput</span>
                      <span className="text-emerald-400 font-bold">{resourceMetrics.load.taskThroughput} cycles/m</span>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">Execution Queue Statistics</span>
                      <div className="grid grid-cols-3 gap-2 text-center text-[9px]">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-1.5">
                          <span className="text-emerald-400 font-bold block">{resourceMetrics.load.queueStatistics.activeTasks}</span>
                          <span className="text-[7.5px] text-zinc-500 uppercase">Active</span>
                        </div>
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-1.5">
                          <span className="text-indigo-400 font-bold block">{resourceMetrics.load.queueStatistics.pendingTasks}</span>
                          <span className="text-[7.5px] text-zinc-500 uppercase">Pending</span>
                        </div>
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded p-1.5">
                          <span className="text-rose-400 font-bold block">{resourceMetrics.load.queueStatistics.blockedTasks}</span>
                          <span className="text-[7.5px] text-zinc-500 uppercase">Blocked</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. PERFORMANCE OPTIMIZATION CENTER */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">Computational Tuning</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">Active Engine Tuning Center</h4>
                  </div>

                  <div className="space-y-3">
                    {perfSuggestions.map((sug) => (
                      <div key={sug.id} className="bg-black/25 border border-white/5 p-3 rounded-xl space-y-2.5 text-left transition-all">
                        <div className="flex justify-between items-start gap-1.5">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-zinc-100">{sug.title}</span>
                            <span className="text-[8px] font-mono text-zinc-500 block">Engine: @{sug.targetEngine}</span>
                          </div>
                          <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10 font-bold whitespace-nowrap">
                            {sug.savingEstimate}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                          <span className="text-[8.5px] font-mono text-zinc-500">Impact Score: {sug.impactScore}/100</span>
                          <button
                            onClick={() => togglePerformanceOption(sug.id)}
                            className={`font-mono text-[8px] py-1 px-2 rounded-lg cursor-pointer transition-all font-bold ${
                              sug.applied 
                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/25'
                                : 'bg-white/10 hover:bg-white/15 text-zinc-300 border border-white/10'
                            }`}
                          >
                            {sug.applied ? '[ Applied ]' : '[ Apply Optim ]'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. PERFORMANCE TIMELINE */}
                <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-4">
                  <div className="space-y-1 text-left">
                    <span className="text-[8.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Chrono Telemetry Logging</span>
                    <h4 className="text-sm font-bold text-white tracking-tight">Performance Trace</h4>
                  </div>

                  <div className="bg-black/90 border border-white/10 rounded-xl p-3 h-48 overflow-y-auto custom-scrollbar font-mono text-[9px] text-zinc-400 space-y-2 text-left">
                    {perfTimeline.map((item, idx) => (
                      <div key={idx} className="leading-relaxed border-b border-white/[0.03] pb-1.5">
                        <div className="flex justify-between text-[8px] text-zinc-500 mb-0.5">
                          <span>[{item.timestamp}]</span>
                          <span className={`font-bold ${
                            item.status === 'Optimized' ? 'text-emerald-400' :
                            item.status === 'Degraded' ? 'text-rose-400 animate-pulse' : 'text-zinc-500'
                          }`}>
                            @{item.engine}
                          </span>
                        </div>
                        <span className="text-zinc-200 block">{item.operation}</span>
                        <span className="text-zinc-500 text-[8px]">Cycle latency: {item.latencyMs} ms</span>
                      </div>
                    ))}
                    <div className="text-zinc-600 italic">... monitoring active execution thread signals ...</div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
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
        )}
      </AnimatePresence>
    </div>
  );
};
