import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { WardrobeItem } from '../types';
import { AutonomousExecutionEngine, AutonomousGoalRecord, ExecutionMetricsSummary, ExecutionTask } from './autonomousExecutionEngine';
import { EnterpriseWorkflowEngine, WorkflowDefinition, EnterpriseWorkflowMetrics } from './workflowEngine';
import { GenerationQueue, globalGenerationQueue, QueueSnapshot, QueueStatistics } from './generationQueue';
import { GenerationSessionManager, globalSessionManager, SessionManagerStatistics, GenerationSession } from './generationSessionManager';
import { EnterpriseResourceIntelligenceEngine, EnterpriseResourceMetrics } from './resourceIntelligenceEngine';
import { EnterpriseValidationEngine, EnterpriseReadinessReport } from './enterpriseValidationEngine';
import { EnterpriseObservabilityEngine, DiagnosticsSummary, TraceEvent } from './observabilityEngine';
import { EnterpriseGovernanceEngine, SystemHealthMetrics } from './governanceEngine';
import { StabilityEngine, SecurityAlert } from './stabilityEngine';
import { DeviceReactionEngine, DeviceTelemetryPayload, AdaptiveLayoutResponse } from './DeviceReactionEngine';
import { ComplianceGuard, SOC2EvidencePackage } from './complianceGuard';
import { GeneratorBridge, GeneratorType, GeneratorBridgeResult } from './GeneratorBridge';
import { DecisionInferenceEngine } from './DecisionInferenceEngine';
import { OptimizationEngine, TelemetryIngestion } from './optimizationEngine';
import { globalCognitiveCoordinator } from './globalCognitiveCoordinator';

export interface AutonomousOrchestratorSnapshot {
  userId: string;
  isInitialized: boolean;
  goals: AutonomousGoalRecord[];
  executionMetrics: ExecutionMetricsSummary;
  workflows: WorkflowDefinition[];
  workflowMetrics: EnterpriseWorkflowMetrics;
  queueSnapshot: QueueSnapshot;
  queueStatistics: QueueStatistics;
  sessionStatistics: SessionManagerStatistics;
  recentSessions: GenerationSession[];
  resourceMetrics: EnterpriseResourceMetrics;
  validationReport: EnterpriseReadinessReport;
  diagnostics: DiagnosticsSummary;
  governanceHealth: SystemHealthMetrics;
  securityAlerts: SecurityAlert[];
  deviceLayout: AdaptiveLayoutResponse;
  lastSyncTime: string;
}

export class GlobalAutonomousOrchestrator {
  private static instance: GlobalAutonomousOrchestrator | null = null;
  private initialized = false;
  private currentUserId = 'user-1';
  private listeners: Set<(snapshot: AutonomousOrchestratorSnapshot) => void> = new Set();

  private constructor() {}

  public static getInstance(): GlobalAutonomousOrchestrator {
    if (!GlobalAutonomousOrchestrator.instance) {
      GlobalAutonomousOrchestrator.instance = new GlobalAutonomousOrchestrator();
    }
    return GlobalAutonomousOrchestrator.instance;
  }

  public initialize(userId: string = 'user-1', items: WardrobeItem[] = []): void {
    if (this.initialized && this.currentUserId === userId) {
      return;
    }

    this.currentUserId = userId;

    const goals = AutonomousExecutionEngine.getGoals(userId);
    AutonomousExecutionEngine.getExecutionMetrics(goals);

    EnterpriseWorkflowEngine.getWorkflows();
    EnterpriseWorkflowEngine.getMetrics();

    globalGenerationQueue.exportSnapshot();
    globalSessionManager.searchSessions({});

    EnterpriseResourceIntelligenceEngine.getMetrics(userId, items);
    EnterpriseValidationEngine.runFullAudit(userId, items);
    EnterpriseObservabilityEngine.evaluateDiagnostics(userId, items);
    EnterpriseGovernanceEngine.evaluateSystemHealth(userId, items);

    DeviceReactionEngine.analyzeClientDevice({
      width: typeof window !== 'undefined' ? window.innerWidth : 1920,
      height: typeof window !== 'undefined' ? window.innerHeight : 1080,
      pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      viewportMode: 'AUTO'
    });

    this.initialized = true;

    globalCognitiveCoordinator.recordSyncEvent(
      'GlobalAutonomousOrchestrator',
      'UnifiedExecutionPipeline',
      'StateSync',
      'Activated Global Autonomous Orchestrator & synchronized workflow pipeline'
    );

    this.notifyListeners(items);
  }

  public isFullyInitialized(): boolean {
    return this.initialized;
  }

  public dispatchTask(goalId: string, taskId: string, userId: string = this.currentUserId): void {
    AutonomousExecutionEngine.triggerRecovery(userId, goalId, taskId);
    globalCognitiveCoordinator.recordSyncEvent(
      'GlobalAutonomousOrchestrator',
      'AutonomousExecutionEngine',
      'StateSync',
      `Dispatched task recovery pass for goal ${goalId}, task ${taskId}`
    );
    this.notifyListeners();
  }

  public dispatchWorkflow(workflowId: string, items: WardrobeItem[] = [], userId: string = this.currentUserId): void {
    EnterpriseWorkflowEngine.runWorkflow(workflowId, items, userId);
    globalCognitiveCoordinator.recordSyncEvent(
      'GlobalAutonomousOrchestrator',
      'EnterpriseWorkflowEngine',
      'StateSync',
      `Dispatched workflow execution: ${workflowId}`
    );
    this.notifyListeners(items);
  }

  public dispatchGeneration(
    generatorType: GeneratorType,
    promptSnippet: string = 'high-performance style generation'
  ): GeneratorBridgeResult {
    const result = GeneratorBridge(generatorType, promptSnippet);

    TelemetryIngestion.ingest({
      timestamp: new Date().toISOString(),
      namespace: generatorType,
      latencyMs: result.simulatedLatencyMs,
      successRate: result.success ? 1 : 0,
      memoryPressure: 20
    });

    globalCognitiveCoordinator.recordSyncEvent(
      'GlobalAutonomousOrchestrator',
      'GeneratorBridge',
      'ResourceAllocation',
      `Dispatched AI generation workload on ${generatorType} namespace (${result.endpointUsed})`
    );

    this.notifyListeners();
    return result;
  }

  public processDeviceReaction(payload: DeviceTelemetryPayload): AdaptiveLayoutResponse {
    const layout = DeviceReactionEngine.analyzeClientDevice(payload);
    this.notifyListeners();
    return layout;
  }

  public getSnapshot(userId: string = this.currentUserId, items: WardrobeItem[] = []): AutonomousOrchestratorSnapshot {
    if (!this.initialized) {
      this.initialize(userId, items);
    }

    const goals = AutonomousExecutionEngine.getGoals(userId);
    const executionMetrics = AutonomousExecutionEngine.getExecutionMetrics(goals);
    const workflows = EnterpriseWorkflowEngine.getWorkflows();
    const workflowMetrics = EnterpriseWorkflowEngine.getMetrics();
    const queueSnapshot = globalGenerationQueue.exportSnapshot();
    const queueStatistics = globalGenerationQueue.getStatistics();
    const sessionStatistics = globalSessionManager.getStatistics();
    const recentSessions = globalSessionManager.searchSessions({}).slice(0, 10);
    const resourceMetrics = EnterpriseResourceIntelligenceEngine.getMetrics(userId, items);
    const validationReport = EnterpriseValidationEngine.runFullAudit(userId, items);
    const diagnostics = EnterpriseObservabilityEngine.evaluateDiagnostics(userId, items);
    const governanceHealth = EnterpriseGovernanceEngine.evaluateSystemHealth(userId, items);
    const securityAlerts = StabilityEngine.getAlertLogs();
    const deviceLayout = DeviceReactionEngine.analyzeClientDevice({
      width: typeof window !== 'undefined' ? window.innerWidth : 1920,
      height: typeof window !== 'undefined' ? window.innerHeight : 1080,
      pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      viewportMode: 'AUTO'
    });

    return {
      userId,
      isInitialized: this.initialized,
      goals,
      executionMetrics,
      workflows,
      workflowMetrics,
      queueSnapshot,
      queueStatistics,
      sessionStatistics,
      recentSessions,
      resourceMetrics,
      validationReport,
      diagnostics,
      governanceHealth,
      securityAlerts,
      deviceLayout,
      lastSyncTime: new Date().toLocaleTimeString()
    };
  }

  public subscribe(listener: (snapshot: AutonomousOrchestratorSnapshot) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(items: WardrobeItem[] = []): void {
    const snapshot = this.getSnapshot(this.currentUserId, items);
    this.listeners.forEach(listener => listener(snapshot));
  }
}

export const globalAutonomousOrchestrator = GlobalAutonomousOrchestrator.getInstance();

export interface AutonomousOrchestratorContextValue {
  orchestrator: GlobalAutonomousOrchestrator;
  snapshot: AutonomousOrchestratorSnapshot;
  isInitialized: boolean;
  dispatchTask: (goalId: string, taskId: string) => void;
  dispatchWorkflow: (workflowId: string, items?: WardrobeItem[]) => void;
  dispatchGeneration: (generatorType: GeneratorType, promptSnippet?: string) => GeneratorBridgeResult;
  processDeviceReaction: (payload: DeviceTelemetryPayload) => AdaptiveLayoutResponse;
  synchronize: (items?: WardrobeItem[]) => AutonomousOrchestratorSnapshot;
}

const AutonomousOrchestratorContext = createContext<AutonomousOrchestratorContextValue | null>(null);

export interface AutonomousOrchestratorProviderProps {
  children: React.ReactNode;
  userId?: string;
  items?: WardrobeItem[];
}

export const AutonomousOrchestratorProvider: React.FC<AutonomousOrchestratorProviderProps> = ({
  children,
  userId = 'user-1',
  items = []
}) => {
  const existingContext = useContext(AutonomousOrchestratorContext);

  if (existingContext) {
    return <>{children}</>;
  }

  const [snapshot, setSnapshot] = useState<AutonomousOrchestratorSnapshot>(() => {
    globalAutonomousOrchestrator.initialize(userId, items);
    return globalAutonomousOrchestrator.getSnapshot(userId, items);
  });

  useEffect(() => {
    globalAutonomousOrchestrator.initialize(userId, items);
    setSnapshot(globalAutonomousOrchestrator.getSnapshot(userId, items));

    const unsubscribe = globalAutonomousOrchestrator.subscribe((updatedSnapshot) => {
      setSnapshot(updatedSnapshot);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const dispatchTask = useCallback((goalId: string, taskId: string) => {
    globalAutonomousOrchestrator.dispatchTask(goalId, taskId, userId);
  }, [userId]);

  const dispatchWorkflow = useCallback((workflowId: string, overrideItems?: WardrobeItem[]) => {
    globalAutonomousOrchestrator.dispatchWorkflow(workflowId, overrideItems || items, userId);
  }, [userId, items]);

  const dispatchGeneration = useCallback((generatorType: GeneratorType, promptSnippet?: string) => {
    return globalAutonomousOrchestrator.dispatchGeneration(generatorType, promptSnippet);
  }, []);

  const processDeviceReaction = useCallback((payload: DeviceTelemetryPayload) => {
    return globalAutonomousOrchestrator.processDeviceReaction(payload);
  }, []);

  const synchronize = useCallback((overrideItems?: WardrobeItem[]) => {
    globalAutonomousOrchestrator.initialize(userId, overrideItems || items);
    const updated = globalAutonomousOrchestrator.getSnapshot(userId, overrideItems || items);
    setSnapshot(updated);
    return updated;
  }, [userId, items]);

  const value = useMemo<AutonomousOrchestratorContextValue>(() => ({
    orchestrator: globalAutonomousOrchestrator,
    snapshot,
    isInitialized: snapshot.isInitialized,
    dispatchTask,
    dispatchWorkflow,
    dispatchGeneration,
    processDeviceReaction,
    synchronize
  }), [snapshot, dispatchTask, dispatchWorkflow, dispatchGeneration, processDeviceReaction, synchronize]);

  return (
    <AutonomousOrchestratorContext.Provider value={value}>
      {children}
    </AutonomousOrchestratorContext.Provider>
  );
};

export function useAutonomousOrchestrator(): AutonomousOrchestratorContextValue {
  const context = useContext(AutonomousOrchestratorContext);
  if (!context) {
    globalAutonomousOrchestrator.initialize('user-1');
    const snapshot = globalAutonomousOrchestrator.getSnapshot('user-1');
    return {
      orchestrator: globalAutonomousOrchestrator,
      snapshot,
      isInitialized: snapshot.isInitialized,
      dispatchTask: (goalId, taskId) => globalAutonomousOrchestrator.dispatchTask(goalId, taskId, 'user-1'),
      dispatchWorkflow: (workflowId, items) => globalAutonomousOrchestrator.dispatchWorkflow(workflowId, items, 'user-1'),
      dispatchGeneration: (type, snippet) => globalAutonomousOrchestrator.dispatchGeneration(type, snippet),
      processDeviceReaction: (payload) => globalAutonomousOrchestrator.processDeviceReaction(payload),
      synchronize: (items) => globalAutonomousOrchestrator.getSnapshot('user-1', items)
    };
  }
  return context;
}
