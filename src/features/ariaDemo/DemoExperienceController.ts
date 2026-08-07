/**
 * ARIA Demo Experience Controller
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import {
  DemoState,
  DemoProductMetrics,
  ARIAInvestorOverview,
  DemoScenarioId,
  DemoExecutionResult
} from './DemoSessionTypes';
import { DemoScenarioEngine } from './DemoScenarioEngine';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

const LOCAL_STORAGE_METRICS_KEY = 'aria_demo_metrics_v5.0';

export class DemoExperienceController {
  private static instance: DemoExperienceController;

  private state: DemoState = {
    isDemoModeActive: false,
    isInvestorViewActive: false,
    isExecutingScenario: false,
    metrics: {
      totalAIDecisions: 142850,
      totalStyleRecommendations: 48920,
      visualAnalysesCompleted: 23140,
      generationRequests: 18450,
      predictionRequests: 12890,
      agentCollaborations: 89400,
      knowledgeRetrievalOperations: 312000,
      lastUpdated: new Date().toISOString()
    },
    investorOverview: {
      systemStatus: 'OPERATIONAL',
      version: 'v2.4.0-telemetry',
      activeEngineCount: 17,
      knowledgeGraphNodesCount: 1425000,
      knowledgeGraphEdgesCount: 8900000,
      agentNetworkCount: 12,
      reasoningConfidenceAvg: 96.8,
      averageLatencyMs: 18,
      memoryNodesCount: 480000,
      visualModelsCount: 6,
      metrics: {
        totalAIDecisions: 142850,
        totalStyleRecommendations: 48920,
        visualAnalysesCompleted: 23140,
        generationRequests: 18450,
        predictionRequests: 12890,
        agentCollaborations: 89400,
        knowledgeRetrievalOperations: 312000,
        lastUpdated: new Date().toISOString()
      }
    },
    executionHistory: []
  };

  private listeners: Set<(state: DemoState) => void> = new Set();

  private constructor() {}

  public static getInstance(): DemoExperienceController {
    if (!DemoExperienceController.instance) {
      DemoExperienceController.instance = new DemoExperienceController();
    }
    return DemoExperienceController.instance;
  }

  public subscribe(listener: (state: DemoState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.state));
  }

  private updateState(partial: Partial<DemoState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  public getState(): DemoState {
    return this.state;
  }

  public async initialize(): Promise<void> {
    await this.loadMetrics();
  }

  public toggleDemoMode(active?: boolean): void {
    const next = active !== undefined ? active : !this.state.isDemoModeActive;
    this.updateState({ isDemoModeActive: next });
  }

  public toggleInvestorView(active?: boolean): void {
    const next = active !== undefined ? active : !this.state.isInvestorViewActive;
    this.updateState({ isInvestorViewActive: next });
  }

  /**
   * Run a demo scenario by ID
   */
  public async runDemoScenario(scenarioId: DemoScenarioId): Promise<DemoExecutionResult> {
    this.updateState({
      isExecutingScenario: true,
      activeScenarioId: scenarioId
    });

    try {
      const result = await DemoScenarioEngine.getInstance().executeScenario(scenarioId);

      // Increment metrics
      const updatedMetrics: DemoProductMetrics = {
        ...this.state.metrics,
        totalAIDecisions: this.state.metrics.totalAIDecisions + 1,
        totalStyleRecommendations:
          scenarioId === 'DEMO_1_PERSONAL_STYLIST'
            ? this.state.metrics.totalStyleRecommendations + 1
            : this.state.metrics.totalStyleRecommendations,
        visualAnalysesCompleted:
          scenarioId === 'DEMO_2_FASHION_VISION'
            ? this.state.metrics.visualAnalysesCompleted + 1
            : this.state.metrics.visualAnalysesCompleted,
        predictionRequests:
          scenarioId === 'DEMO_3_FUTURE_PREDICTION'
            ? this.state.metrics.predictionRequests + 1
            : this.state.metrics.predictionRequests,
        generationRequests:
          scenarioId === 'DEMO_4_CAPSULE_WARDROBE'
            ? this.state.metrics.generationRequests + 1
            : this.state.metrics.generationRequests,
        knowledgeRetrievalOperations:
          scenarioId === 'DEMO_5_CIVILIZATION_KNOWLEDGE'
            ? this.state.metrics.knowledgeRetrievalOperations + 1
            : this.state.metrics.knowledgeRetrievalOperations,
        agentCollaborations: this.state.metrics.agentCollaborations + 3,
        lastUpdated: new Date().toISOString()
      };

      const history = [result, ...this.state.executionHistory];

      this.updateState({
        isExecutingScenario: false,
        currentScenarioResult: result,
        metrics: updatedMetrics,
        investorOverview: {
          ...this.state.investorOverview,
          metrics: updatedMetrics
        },
        executionHistory: history
      });

      await this.persistMetrics(updatedMetrics);

      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.updateState({ isExecutingScenario: false });

      EnterpriseObservabilityEngine.logTrace({
        engine: 'DemoExperienceController',
        eventName: 'DEMO_SCENARIO_ERROR',
        category: 'Execution',
        payload: `Error executing demo scenario ${scenarioId}: ${msg}`,
        latencyMs: 0,
        status: 'Failure'
      });

      throw err;
    }
  }

  /* Persistence */
  private async persistMetrics(metrics: DemoProductMetrics): Promise<void> {
    // Save to LocalStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_METRICS_KEY, JSON.stringify(metrics));
    } catch (_) {}

    // Save to Firestore
    if (db) {
      try {
        const metricsRef = doc(db, 'global', 'aria', 'demoMetrics', 'summary');
        await setDoc(metricsRef, metrics, { merge: true });
      } catch (_) {}
    }
  }

  private async loadMetrics(): Promise<void> {
    // Try LocalStorage first
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_METRICS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.totalAIDecisions === 'number') {
          this.updateState({
            metrics: parsed,
            investorOverview: {
              ...this.state.investorOverview,
              metrics: parsed
            }
          });
        }
      }
    } catch (_) {}

    // Try Firestore
    if (db) {
      try {
        const metricsRef = doc(db, 'global', 'aria', 'demoMetrics', 'summary');
        const snap = await getDoc(metricsRef);
        if (snap.exists()) {
          const data = snap.data() as DemoProductMetrics;
          this.updateState({
            metrics: data,
            investorOverview: {
              ...this.state.investorOverview,
              metrics: data
            }
          });
        }
      } catch (_) {}
    }
  }
}
