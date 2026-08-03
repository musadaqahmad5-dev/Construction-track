/**
 * ARIA v2.5 Simulation Evaluator
 * Product: LOOK VISION v2.4
 */

import { SimulationScenarioConfig, SimulationReport } from './SimulationTypes';
import { WardrobeSimulation } from './WardrobeSimulation';
import { PurchaseImpactSimulator } from './PurchaseImpactSimulator';
import { StyleEvolutionSimulator } from './StyleEvolutionSimulator';
import { OutcomeAnalyzer } from './OutcomeAnalyzer';

export class SimulationEvaluator {
  public static async evaluateScenario(
    userId: string,
    scenario: SimulationScenarioConfig
  ): Promise<SimulationReport> {
    let result: {
      impactText: string;
      compatibility: number;
      versatility: number;
      dnaEffect: any;
      creativeEffect: any;
      evidence: string[];
      signals: string[];
    };

    if (
      scenario.type === 'add_item' ||
      scenario.type === 'remove_item' ||
      scenario.type === 'capsule_conversion' ||
      scenario.type === 'wardrobe_optimization'
    ) {
      result = WardrobeSimulation.simulate(scenario);
    } else if (scenario.type === 'budget_plan' || scenario.type === 'brand_shift') {
      result = PurchaseImpactSimulator.simulate(scenario);
    } else {
      result = StyleEvolutionSimulator.simulate(scenario);
    }

    const alternatives = OutcomeAnalyzer.generateAlternativeOutcomes(scenario);

    return {
      simulationId: `sim_report_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      scenario,
      expectedStyleImpact: result.impactText,
      wardrobeCompatibilityScore: result.compatibility,
      versatilityScore: result.versatility,
      styleDNAEffect: result.dnaEffect,
      creativeEffect: result.creativeEffect,
      confidence: 0.92,
      supportingEvidence: result.evidence,
      reasonSignals: result.signals,
      alternativeOutcomes: alternatives,
      timestamp: new Date().toISOString()
    };
  }
}
