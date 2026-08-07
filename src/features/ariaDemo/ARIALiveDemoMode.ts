/**
 * ARIA Live Demo Mode Utility
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import { DemoExperienceController } from './DemoExperienceController';
import { DEMO_SCENARIOS, DemoScenarioEngine } from './DemoScenarioEngine';
import { DemoScenarioId, DemoExecutionResult } from './DemoSessionTypes';

export class ARIALiveDemoMode {
  /**
   * Run one-click demo scenario with pre-packaged explainable output
   */
  public static async triggerOneClickDemo(scenarioId: DemoScenarioId = 'DEMO_1_PERSONAL_STYLIST'): Promise<DemoExecutionResult> {
    const controller = DemoExperienceController.getInstance();
    controller.toggleDemoMode(true);
    return controller.runDemoScenario(scenarioId);
  }

  /**
   * Get available demo scenarios
   */
  public static getScenarios() {
    return DEMO_SCENARIOS;
  }

  /**
   * Helper to format demo result into executive presentation card structure
   */
  public static formatExecutiveSummary(result: DemoExecutionResult) {
    const rec = result.response.recommendationPayload;
    return {
      title: result.title,
      confidence: result.confidenceReport.finalConfidence,
      latencyMs: result.executionTimeMs,
      summaryText: rec?.description || result.response.summary,
      items: rec?.items || [],
      reasoningTraces: result.response.executionTimeline.steps.map((s) => ({
        engine: s.engineName,
        score: s.confidenceScore,
        summary: s.summary
      }))
    };
  }
}
