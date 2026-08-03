/**
 * ARIA v2.5 Simulation Engine (Singleton Orchestrator)
 * Product: LOOK VISION v2.4
 */

import {
  SimulationReport,
  SimulationScenarioConfig,
  SimulationEngineStatus,
  SimulationScenarioType
} from './SimulationTypes';
import { ScenarioBuilder } from './ScenarioBuilder';
import { SimulationEvaluator } from './SimulationEvaluator';
import { SimulationStorage } from './SimulationStorage';
import { SimulationHistory } from './SimulationHistory';
import { digitalTwinEngine } from '../digitalTwin/DigitalTwinEngine';
import { agentOrchestrator } from '../agents/AgentOrchestrator';

export class SimulationEngine {
  private static instance: SimulationEngine;
  private status: SimulationEngineStatus = {
    isInitialized: false,
    isSimulating: false,
    totalSimulationsRun: 0
  };
  private currentReport: SimulationReport | null = null;

  private constructor() {}

  public static getInstance(): SimulationEngine {
    if (!SimulationEngine.instance) {
      SimulationEngine.instance = new SimulationEngine();
    }
    return SimulationEngine.instance;
  }

  public async initialize(userId: string = 'guest_user'): Promise<SimulationEngineStatus> {
    const history = SimulationHistory.getHistory(userId);
    this.status.totalSimulationsRun = history.length;
    if (history.length > 0) {
      this.currentReport = history[0];
      this.status.lastSimulatedAt = history[0].timestamp;
    }
    this.status.isInitialized = true;
    return { ...this.status };
  }

  public async runSimulation(
    userId: string = 'guest_user',
    scenarioType: SimulationScenarioType = 'capsule_conversion',
    parameters: SimulationScenarioConfig['parameters'] = {},
    customTitle?: string,
    customDesc?: string
  ): Promise<SimulationReport> {
    this.status.isSimulating = true;

    try {
      // Step 1: Ensure Digital Twin is initialized to provide context
      await digitalTwinEngine.initialize(userId);

      // Step 2: Build Scenario configuration
      const scenario = ScenarioBuilder.createScenario(scenarioType, parameters, customTitle, customDesc);

      // Step 3: Evaluate scenario through existing engines
      const report = await SimulationEvaluator.evaluateScenario(userId, scenario);

      // Step 4: Record history and storage
      SimulationHistory.record(report);
      this.currentReport = report;

      // Update engine status
      this.status.totalSimulationsRun += 1;
      this.status.isSimulating = false;
      this.status.lastSimulatedAt = report.timestamp;

      // Optional coordination with AgentOrchestrator without duplicating logic
      try {
        await agentOrchestrator.executeAgent({
          agentRole: 'CREATIVE_DIRECTOR',
          prompt: `Evaluate simulation results for scenario ${report.scenario.title}`,
          userId,
          contextParams: {
            simulationId: report.simulationId,
            scenarioType: report.scenario.type,
            score: report.versatilityScore
          }
        });
      } catch (agentErr) {
        console.warn('[SimulationEngine] Non-critical agent orchestrator notification:', agentErr);
      }

      return report;
    } catch (err: any) {
      this.status.isSimulating = false;
      this.status.lastError = err.message || 'Simulation execution failed';
      throw err;
    }
  }

  public getCurrentReport(): SimulationReport | null {
    return this.currentReport;
  }

  public getStatus(): SimulationEngineStatus {
    return { ...this.status };
  }

  public getHistory(userId: string): SimulationReport[] {
    return SimulationHistory.getHistory(userId);
  }

  public getReportById(userId: string, id: string): SimulationReport | null {
    return SimulationStorage.getReportById(userId, id);
  }
}

export const simulationEngine = SimulationEngine.getInstance();
