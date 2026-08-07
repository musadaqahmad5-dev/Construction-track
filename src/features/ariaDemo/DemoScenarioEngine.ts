/**
 * ARIA Demo Scenario Engine
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import { DemoScenarioDefinition, DemoScenarioId, DemoExecutionResult } from './DemoSessionTypes';
import { LivePrototypeController } from '../ariaLivePrototype/LivePrototypeController';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export const DEMO_SCENARIOS: readonly DemoScenarioDefinition[] = [
  {
    id: 'DEMO_1_PERSONAL_STYLIST',
    title: 'AI Personal Stylist Experience',
    category: 'Styling & Curation',
    description: 'Autonomous high-fidelity outfit creation tailored to executive travel, weather, and Style DNA.',
    prompt: 'Curate an ultra-luxurious, tailored summer executive travel wardrobe for Milan and Monaco.',
    iconName: 'Sparkles',
    accentColor: 'from-indigo-500 to-purple-600',
    contextData: { occasion: 'Executive Travel', season: 'Summer', temperatureC: 28 }
  },
  {
    id: 'DEMO_2_FASHION_VISION',
    title: 'Multimodal Fashion Vision Analysis',
    category: 'Computer Vision',
    description: 'Deconstruct garment construction, fabric drape, color palette, and micro-aesthetic features.',
    prompt: 'Perform detailed vision decomposition and garment analysis on this unstructured Italian linen jacket.',
    iconName: 'Eye',
    accentColor: 'from-purple-500 to-pink-600',
    sampleImageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    sampleImageName: 'Unstructured Italian Linen Jacket'
  },
  {
    id: 'DEMO_3_FUTURE_PREDICTION',
    title: '12-Month Style Evolution Prediction',
    category: 'Predictive Intelligence',
    description: 'Simulate micro-trend trajectories and forecast long-term personal style migration over 12 months.',
    prompt: 'Simulate my personal fashion trajectory and aesthetic evolution over the next 12 months.',
    iconName: 'TrendingUp',
    accentColor: 'from-amber-500 to-orange-600',
    contextData: { timeHorizonMonths: 12 }
  },
  {
    id: 'DEMO_4_CAPSULE_WARDROBE',
    title: 'Autonomous Capsule Wardrobe Optimizer',
    category: 'Generative Intelligence',
    description: 'Synthesize a perfectly mathematical 12-piece modular capsule maximizing outfit combinations.',
    prompt: 'Generate an optimal 12-piece capsule wardrobe for transitional seasons with maximum combination entropy.',
    iconName: 'Grid',
    accentColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'DEMO_5_CIVILIZATION_KNOWLEDGE',
    title: 'Fashion Civilization Knowledge Graph Query',
    category: 'Knowledge Retrieval',
    description: 'Query 5,000+ years of fashion history, textiles, cultural provenance, and sartorial heritage.',
    prompt: 'Explain the historical provenance and technical craftsmanship of Savile Row bespoke canvasing versus Neapolitan shoulder construction.',
    iconName: 'BookOpen',
    accentColor: 'from-cyan-500 to-blue-600'
  }
];

export class DemoScenarioEngine {
  private static instance: DemoScenarioEngine;

  private constructor() {}

  public static getInstance(): DemoScenarioEngine {
    if (!DemoScenarioEngine.instance) {
      DemoScenarioEngine.instance = new DemoScenarioEngine();
    }
    return DemoScenarioEngine.instance;
  }

  public getScenarios(): readonly DemoScenarioDefinition[] {
    return DEMO_SCENARIOS;
  }

  public getScenarioById(id: DemoScenarioId): DemoScenarioDefinition | undefined {
    return DEMO_SCENARIOS.find((s) => s.id === id);
  }

  /**
   * Execute a specified demo scenario
   */
  public async executeScenario(scenarioId: DemoScenarioId): Promise<DemoExecutionResult> {
    const def = this.getScenarioById(scenarioId);
    if (!def) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }

    const startTime = performance.now();

    EnterpriseObservabilityEngine.logTrace({
      engine: 'DemoScenarioEngine',
      eventName: 'DEMO_SCENARIO_STARTED',
      category: 'Workflow',
      payload: `Executing Demo Scenario: ${def.title} (${scenarioId})`,
      latencyMs: 0,
      status: 'Success'
    });

    const liveController = LivePrototypeController.getInstance();

    const response = await liveController.executeRequest({
      prompt: def.prompt,
      imageUrl: def.sampleImageUrl,
      imageName: def.sampleImageName,
      context: def.contextData
    });

    const executionTimeMs = Math.round(performance.now() - startTime);

    const result: DemoExecutionResult = {
      scenarioId,
      title: def.title,
      response,
      executionTimeMs,
      confidenceReport: response.confidenceReport,
      timestamp: new Date().toISOString()
    };

    EnterpriseObservabilityEngine.logTrace({
      engine: 'DemoScenarioEngine',
      eventName: 'DEMO_SCENARIO_COMPLETED',
      category: 'Workflow',
      payload: `Completed Demo Scenario ${def.title} in ${executionTimeMs}ms (Confidence: ${response.confidenceReport.finalConfidence}%)`,
      latencyMs: executionTimeMs,
      status: 'Success'
    });

    return result;
  }
}
