/**
 * ARIA Live Prototype Engine
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 * 
 * Implements the 11-step end-to-end prototype execution pipeline:
 * User Input -> Intent Detection -> Memory Retrieval -> Style DNA Context -> Adaptive Agent Selection -> Civilization Knowledge -> Visual Analysis -> Generative Fashion -> Prediction -> Decision Engine -> Explainable Response.
 */

import {
  ARIAPrototypeRequest,
  ARIAPrototypeResponse,
  ARIAExecutionTimeline,
  ARIARecommendationPayload,
  ARIAExecutionTimelineStep
} from './LivePrototypeTypes';
import { ARIAOrchestrator } from '../../aria/orchestrator/ARIAOrchestrator';
import { LivePrototypeTelemetry } from './LivePrototypeTelemetry';

export class LivePrototypeEngine {
  private static instance: LivePrototypeEngine;

  private constructor() {}

  public static getInstance(): LivePrototypeEngine {
    if (!LivePrototypeEngine.instance) {
      LivePrototypeEngine.instance = new LivePrototypeEngine();
    }
    return LivePrototypeEngine.instance;
  }

  /**
   * Primary entry point to execute fashion intelligence requests
   */
  public async executeFashionRequest(request: ARIAPrototypeRequest): Promise<ARIAPrototypeResponse> {
    const startTime = performance.now();

    // Execute via Orchestrator
    const orchestrator = ARIAOrchestrator.getInstance();
    const rawResponse = await orchestrator.executeRequest({
      requestId: request.requestId,
      userId: request.userId,
      userPrompt: request.prompt,
      intent: request.intent,
      imageUrl: request.imageUrl,
      imageBase64: request.imageBase64,
      imageName: request.imageName,
      context: request.context,
      createdAt: request.timestamp || new Date().toISOString()
    });

    const totalLatencyMs = Math.round(performance.now() - startTime);

    // Build timeline steps
    const steps: ARIAExecutionTimelineStep[] = rawResponse.reasoningTraces.map((trace) => ({
      stepId: trace.traceId,
      engineName: trace.engineName,
      stepName: trace.stepName,
      summary: trace.reasoningSummary,
      latencyMs: trace.latencyMs,
      confidenceScore: Math.round(trace.confidenceScore * 100),
      evidence: trace.evidence || [],
      status: 'COMPLETED'
    }));

    const executionTimeline: ARIAExecutionTimeline = {
      traceId: `tr_proto_${Date.now()}`,
      sessionId: request.sessionId,
      requestId: request.requestId,
      totalLatencyMs,
      steps,
      activeEngineNames: rawResponse.reasoningTraces.map((t) => t.engineName),
      overallConfidence: rawResponse.confidenceReport.finalConfidence
    };

    // Construct recommendation payload
    const recommendationPayload: ARIARecommendationPayload = {
      title: rawResponse.recommendation?.title || rawResponse.concept?.title || `ARIA Fashion Intelligence (${rawResponse.intent})`,
      description: rawResponse.recommendation?.description || rawResponse.concept?.description || rawResponse.summary,
      items: rawResponse.recommendation?.suggestedItems || rawResponse.capsule?.corePieces.map((p) => `${p.category}: ${p.description}`) || ['Tailored Silk Blazer', 'Pleated Trousers', 'Leather Loafers'],
      reasoning: rawResponse.reasoningTraces.map((t) => `${t.engineName}: ${t.reasoningSummary}`),
      aestheticTheme: rawResponse.concept?.aestheticTheme || 'Sartorial Elegance',
      colorPalette: rawResponse.concept?.colorPalette || ['#09090b', '#312e81', '#e0e7ff'],
      matchFactors: [
        { name: 'Style DNA Alignment', score: rawResponse.confidenceReport.styleDNAMatch },
        { name: 'Visual Harmony', score: rawResponse.confidenceReport.visualHarmony || 90 },
        { name: 'Civilization Evidence', score: rawResponse.confidenceReport.knowledgeEvidence },
        { name: 'Agent Consensus', score: rawResponse.confidenceReport.agentConsensus }
      ]
    };

    const formattedMarkdown = this.buildFormattedMarkdown(rawResponse, recommendationPayload, executionTimeline);

    const protoResponse: ARIAPrototypeResponse = {
      responseId: rawResponse.responseId,
      requestId: request.requestId,
      sessionId: request.sessionId,
      summary: rawResponse.summary,
      intent: rawResponse.intent,
      recommendationPayload,
      rawRecommendation: rawResponse.recommendation,
      rawConcept: rawResponse.concept,
      rawVisionAnalysis: rawResponse.visionAnalysis,
      rawSimulation: rawResponse.simulationScenario,
      rawCapsule: rawResponse.capsule,
      confidenceReport: rawResponse.confidenceReport,
      executionTimeline,
      formattedMarkdown,
      timestamp: rawResponse.timestamp
    };

    // Telemetry
    LivePrototypeTelemetry.logExecutionTrace({
      sessionId: request.sessionId,
      requestId: request.requestId,
      intent: rawResponse.intent,
      latencyMs: totalLatencyMs,
      confidenceScore: rawResponse.confidenceReport.finalConfidence,
      activeEnginesCount: rawResponse.reasoningTraces.length,
      visionProcessed: Boolean(rawResponse.visionAnalysis),
      generationTriggered: Boolean(rawResponse.concept || rawResponse.capsule),
      status: 'Success'
    });

    LivePrototypeTelemetry.logTimeline(executionTimeline);

    return protoResponse;
  }

  private buildFormattedMarkdown(
    raw: any,
    rec: ARIARecommendationPayload,
    timeline: ARIAExecutionTimeline
  ): string {
    const lines: string[] = [];
    lines.push(`### 🤖 ${rec.title}`);
    lines.push(`**Overall Confidence**: \`${timeline.overallConfidence}%\` | **Latency**: \`${timeline.totalLatencyMs}ms\``);
    lines.push('');
    lines.push(`> ${rec.description}`);
    lines.push('');

    if (rec.items && rec.items.length > 0) {
      lines.push('#### 💼 Curated Ensemble Pieces');
      rec.items.forEach((item) => lines.push(`- ${item}`));
      lines.push('');
    }

    if (raw.visionAnalysis) {
      lines.push('#### 👁️ Multimodal Visual Perception');
      const vis = raw.visionAnalysis;
      lines.push(`- Garments Detected: ${vis.garments.map((g: any) => `${g.name} (${g.category})`).join(', ')}`);
      lines.push('');
    }

    if (raw.simulationScenario) {
      lines.push('#### 🔮 Style Trajectory Prediction');
      lines.push(`- Phase: ${raw.simulationScenario.stylePrediction.styleTransitionPhase}`);
      lines.push('');
    }

    lines.push('#### 🧠 Reasoning Engine Traces');
    timeline.steps.forEach((s) => {
      lines.push(`- **${s.engineName}**: ${s.summary} (\`${s.confidenceScore}%\`)`);
    });

    return lines.join('\n');
  }
}
