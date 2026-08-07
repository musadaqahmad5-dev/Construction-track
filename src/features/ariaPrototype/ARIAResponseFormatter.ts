/**
 * ARIA Response Formatter
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 * 
 * Formats raw ARIA intelligence engine output into structured, explainable human-friendly summaries.
 */

import {
  ARIAResponse,
  ARIAConfidenceReport,
  ARIAReasoningTrace
} from '../../aria/orchestrator/ARIAOrchestratorTypes';
import { ARIARecommendationResult, ARIAReasoningTimeline } from './ARIAPrototypeTypes';

export class ARIAResponseFormatter {
  /**
   * Formats a raw ARIAResponse into an ARIA Recommendation Result with rich Markdown
   */
  public static formatResponse(response: ARIAResponse): ARIARecommendationResult {
    const reasoningTimeline: ARIAReasoningTimeline = {
      sessionId: response.requestId,
      requestId: response.requestId,
      totalLatencyMs: response.executionTimeMs,
      steps: response.reasoningTraces.map((t) => ({
        stepId: t.traceId,
        engineName: t.engineName,
        stepName: t.stepName,
        summary: t.reasoningSummary,
        latencyMs: t.latencyMs,
        confidenceScore: Math.round(t.confidenceScore * 100),
        evidence: t.evidence || []
      })),
      activeEngines: response.reasoningTraces.map((t) => t.engineName),
      finalConfidence: response.confidenceReport.finalConfidence
    };

    const formattedMarkdown = this.buildMarkdownOutput(response);

    return {
      resultId: response.responseId,
      title: this.extractTitle(response),
      summary: response.summary,
      recommendation: response.recommendation,
      concept: response.concept,
      visionAnalysis: response.visionAnalysis,
      simulationScenario: response.simulationScenario,
      trendForecasts: response.trendForecasts,
      capsuleCollection: response.capsule,
      confidenceReport: response.confidenceReport,
      reasoningTimeline,
      formattedMarkdown,
      timestamp: response.timestamp
    };
  }

  private static extractTitle(response: ARIAResponse): string {
    if (response.recommendation?.title) return response.recommendation.title;
    if (response.concept?.title) return response.concept.title;
    if (response.visionAnalysis?.imageName) return `Analysis: ${response.visionAnalysis.imageName}`;
    if (response.simulationScenario?.stylePrediction) return `Trajectory: ${response.simulationScenario.stylePrediction.styleTransitionPhase}`;
    if (response.capsule?.collectionName) return response.capsule.collectionName;
    return `ARIA Fashion Intelligence (${response.intent})`;
  }

  /**
   * Constructs rich explainable Markdown string for UI presentation
   */
  private static buildMarkdownOutput(response: ARIAResponse): string {
    const lines: string[] = [];

    lines.push(`### ${this.extractTitle(response)}`);
    lines.push(`**ARIA Confidence Score**: \`${response.confidenceReport.finalConfidence}%\` | **Execution Latency**: \`${response.executionTimeMs}ms\``);
    lines.push('');
    lines.push(`> ${response.summary}`);
    lines.push('');

    // Recommendation Section
    if (response.recommendation) {
      lines.push('#### 👗 Recommended Ensemble');
      if (response.recommendation.description) {
        lines.push(response.recommendation.description);
      }
      if (response.recommendation.suggestedItems && response.recommendation.suggestedItems.length > 0) {
        lines.push('**Key Pieces:**');
        response.recommendation.suggestedItems.forEach((item) => {
          lines.push(`- ${item}`);
        });
      }
      lines.push('');
    }

    // Concept Section
    if (response.concept) {
      lines.push('#### ✨ Creative Concept');
      lines.push(`**Theme**: *${response.concept.aestheticTheme}*`);
      lines.push(response.concept.description);
      lines.push(`**Palette**: ${response.concept.colorPalette.join(', ')}`);
      lines.push('');
    }

    // Vision Analysis Section
    if (response.visionAnalysis) {
      lines.push('#### 👁️ Multimodal Visual Perception');
      const vis = response.visionAnalysis;
      lines.push(`- **Garments Detected**: ${vis.garments.map((g) => `${g.name} (${g.category})`).join(', ')}`);
      lines.push(`- **Materials**: ${vis.garments.map((g) => g.material).join(', ')}`);
      lines.push('');
    }

    // Simulation & Prediction Section
    if (response.simulationScenario) {
      lines.push('#### 🔮 Predictive Style Trajectory');
      const sim = response.simulationScenario;
      lines.push(`- **Transition Phase**: ${sim.stylePrediction.styleTransitionPhase}`);
      lines.push(`- **Key Insights**: ${sim.keyInsights.slice(0, 2).join('; ')}`);
      lines.push('');
    }

    // Confidence Breakdown
    lines.push('#### 📊 Explainable Confidence Breakdown');
    const cr = response.confidenceReport;
    lines.push(`- Style DNA Match: **${cr.styleDNAMatch}%**`);
    lines.push(`- Visual Composition: **${cr.visualHarmony || 90}%**`);
    lines.push(`- Civilization Evidence: **${cr.knowledgeEvidence}%**`);
    lines.push(`- Agent Consensus: **${cr.agentConsensus}%**`);

    return lines.join('\n');
  }
}
