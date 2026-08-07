/**
 * ARIA v3.2 Central Orchestrator
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Architecture
 * 
 * Orchestrates requests across Decision Engine, Generative Engine, Vision Engine,
 * Prediction Engine, Civilization Knowledge, Agent Collaboration, Adaptive Selection,
 * and Personal Fashion Memory.
 */

import {
  ARIARequest,
  ARIAResponse,
  ARIAIntent,
  ARIAReasoningTrace,
  ARIAConfidenceReport,
  ARIAOrchestratorStatus
} from './ARIAOrchestratorTypes';
import { DecisionEngine } from '../decision/DecisionEngine';
import { FashionRecommendation } from '../decision/DecisionTypes';
import { GenerativeFashionEngine } from '../generation/GenerativeFashionEngine';
import { FashionConcept, CapsuleCollection } from '../generation/GenerativeTypes';
import { VisualFashionEngine } from '../vision/VisualFashionEngine';
import { VisualFashionAnalysis } from '../vision/VisionTypes';
import { PredictionEngine } from '../prediction/PredictionEngine';
import { SimulationScenario, TrendForecast } from '../prediction/PredictiveTypes';
import { TrendPredictionEngine } from '../prediction/TrendPredictionEngine';
import { knowledgeRetrievalEngine } from '../civilization/KnowledgeRetrievalEngine';
import { agentCollaborationManager } from '../agents/collaboration/AgentCollaborationManager';
import { AdaptiveAgentSelector } from '../agents/adaptive/AdaptiveAgentSelector';
import { PersonalFashionMemoryEngine } from '../../engine/personalMemory';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class ARIAOrchestrator {
  private static instance: ARIAOrchestrator;

  private totalExecutionsLogged = 0;
  private accumulativeLatencyMs = 0;
  private lastExecutionAt?: string;

  private constructor() {}

  public static getInstance(): ARIAOrchestrator {
    if (!ARIAOrchestrator.instance) {
      ARIAOrchestrator.instance = new ARIAOrchestrator();
    }
    return ARIAOrchestrator.instance;
  }

  /**
   * Main entry point: receives user requests, detects intent, routes to intelligence modules,
   * aggregates reasoning, and produces structured explainable ARIA response.
   */
  public async executeRequest(request: ARIARequest): Promise<ARIAResponse> {
    const startTime = performance.now();
    const userId = request.userId || 'guest_user';
    const requestId = request.requestId || `aria_req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const responseId = `aria_res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // 1. Intent Detection & Resolution
    const intent = this.detectIntent(request);

    // 2. Fetch Personal Memory Context
    const userMemory = PersonalFashionMemoryEngine.getMemory(userId);

    // 3. Select Adaptive Agents
    const selectionResult = await AdaptiveAgentSelector.getInstance().selectAgentsAdaptively(
      request.userPrompt,
      userId
    );

    const reasoningTraces: ARIAReasoningTrace[] = [];
    const knowledgeNodes: string[] = [];

    // Calculate team reliability score average
    const reliabilityScores = Object.values(selectionResult.agentReliabilityScores || {});
    const avgReliability = reliabilityScores.length > 0
      ? reliabilityScores.reduce((a, b) => (a || 0) + (b || 0), 0) / reliabilityScores.length
      : 88;

    // Memory Trace
    reasoningTraces.push({
      traceId: `tr_mem_${Date.now()}`,
      engineName: 'PersonalFashionMemoryEngine',
      stepName: 'Retrieve User Preferences',
      reasoningSummary: `Retrieved memory profile for ${userId} with ${userMemory.favColors.length} preferred colors (${userMemory.favColors.slice(0, 3).join(', ')}) and ${userMemory.favBrands.length} brands.`,
      latencyMs: 3,
      confidenceScore: userMemory.accuracyEstimate / 100,
      evidence: [
        `Style DNA Primary Vibe: ${userMemory.styleDNA.primaryVibe}`,
        `Formality Preference: ${Math.round(userMemory.styleDNA.formalityPreference * 100)}%`,
        `Experimental Index: ${Math.round(userMemory.styleDNA.experimentalIndex * 100)}%`
      ]
    });

    // Adaptive Agent Trace
    reasoningTraces.push({
      traceId: `tr_agent_${Date.now()}`,
      engineName: 'AdaptiveAgentSelector',
      stepName: 'Adaptive Agent Selection',
      reasoningSummary: `Adaptively selected ${selectionResult.primaryAgents.length} primary agents (${selectionResult.primaryAgents.join(', ')}) with average reliability ${Math.round(avgReliability)}%.`,
      latencyMs: 6,
      confidenceScore: avgReliability / 100,
      evidence: selectionResult.reasoning.length > 0 ? selectionResult.reasoning : [selectionResult.explanation]
    });

    let recommendation: FashionRecommendation | undefined;
    let concept: FashionConcept | undefined;
    let visionAnalysis: VisualFashionAnalysis | undefined;
    let simulationScenario: SimulationScenario | undefined;
    let trendForecasts: readonly TrendForecast[] | undefined;
    let capsule: CapsuleCollection | undefined;
    let summary = '';

    // 4. Intent-Based Routing Execution
    switch (intent) {
      case 'IMAGE_ANALYSIS': {
        const visStart = performance.now();
        visionAnalysis = await VisualFashionEngine.getInstance().analyzeVisual({
          userId,
          imageName: request.imageName || 'Fashion Outfit Analysis',
          imageUrl: request.imageUrl
        });
        const visLatency = Math.round(performance.now() - visStart);

        summary = `Visual Fashion Analysis completed for "${visionAnalysis.imageName}": Detected ${visionAnalysis.garments.length} garment items with ${Math.round(visionAnalysis.confidence.finalVisualConfidence)}% visual confidence.`;
        
        reasoningTraces.push({
          traceId: `tr_vis_${Date.now()}`,
          engineName: 'VisualFashionEngine',
          stepName: 'Multimodal Visual Perception',
          reasoningSummary: summary,
          latencyMs: visLatency,
          confidenceScore: visionAnalysis.confidence.finalVisualConfidence / 100,
          evidence: visionAnalysis.supportingEvidence
        });

        knowledgeNodes.push(...visionAnalysis.referencedKnowledgeNodes);
        break;
      }

      case 'STYLE_CREATION': {
        const genStart = performance.now();
        concept = await GenerativeFashionEngine.getInstance().generateConcept({
          userId,
          userPrompt: request.userPrompt,
          occasion: request.context?.occasion || 'Editorial Concept',
          season: request.context?.season || 'Autumn/Winter'
        });
        const genLatency = Math.round(performance.now() - genStart);

        summary = `Generated bespoke fashion concept "${concept.title}" adhering to aesthetic theme "${concept.aestheticTheme}" with ${Math.round(concept.confidence.finalCreativeConfidence)}% creative confidence.`;

        reasoningTraces.push({
          traceId: `tr_gen_${Date.now()}`,
          engineName: 'GenerativeFashionEngine',
          stepName: 'Generative Concept Synthesis',
          reasoningSummary: summary,
          latencyMs: genLatency,
          confidenceScore: concept.confidence.finalCreativeConfidence / 100,
          evidence: [
            concept.description,
            `Palette: ${concept.colorPalette.join(', ')}`,
            `Styling: ${concept.stylingDirections.join('; ')}`
          ]
        });

        knowledgeNodes.push(...concept.referencedKnowledgeNodes);
        break;
      }

      case 'WARDROBE_OPTIMIZATION': {
        const capStart = performance.now();
        capsule = await GenerativeFashionEngine.getInstance().generateCapsuleCollection(
          userId,
          request.context?.season || 'Autumn/Winter'
        );
        const capLatency = Math.round(performance.now() - capStart);

        summary = `Generated modular capsule collection "${capsule.collectionName}" with ${capsule.corePieces.length} core garments providing high capsule versatility.`;

        reasoningTraces.push({
          traceId: `tr_capsule_${Date.now()}`,
          engineName: 'GenerativeFashionEngine (Capsule)',
          stepName: 'Wardrobe Capsule Design',
          reasoningSummary: summary,
          latencyMs: capLatency,
          confidenceScore: capsule.confidence.finalCreativeConfidence / 100,
          evidence: capsule.optimizationStrategy
        });
        break;
      }

      case 'STYLE_PREDICTION': {
        const predStart = performance.now();
        const horizon = request.context?.timeHorizonMonths || 6;
        simulationScenario = await PredictionEngine.getInstance().runSimulationScenario(
          userId,
          horizon,
          request.userPrompt
        );
        const predLatency = Math.round(performance.now() - predStart);

        summary = `Simulated ${horizon}-month style trajectory scenario: Predicted transition phase "${simulationScenario.stylePrediction.styleTransitionPhase}" with ${simulationScenario.confidence.finalPredictionConfidence}% prediction confidence.`;

        reasoningTraces.push({
          traceId: `tr_pred_${Date.now()}`,
          engineName: 'PredictionEngine',
          stepName: 'Predictive Style Trajectory',
          reasoningSummary: summary,
          latencyMs: predLatency,
          confidenceScore: simulationScenario.confidence.finalPredictionConfidence / 100,
          evidence: simulationScenario.keyInsights
        });
        break;
      }

      case 'TREND_ANALYSIS': {
        const trendStart = performance.now();
        const horizon = request.context?.timeHorizonMonths || 6;
        trendForecasts = await TrendPredictionEngine.getInstance().forecastTrendsForUser(userId, horizon);
        const trendLatency = Math.round(performance.now() - trendStart);

        summary = `Evaluated ${trendForecasts.length} fashion trend forecasts for horizon ${horizon} months. Dominant peak growth trend: "${trendForecasts[0]?.trendName}".`;

        reasoningTraces.push({
          traceId: `tr_trend_${Date.now()}`,
          engineName: 'TrendPredictionEngine',
          stepName: 'Trend Cycle Forecasting',
          reasoningSummary: summary,
          latencyMs: trendLatency,
          confidenceScore: (trendForecasts[0]?.compatibilityScore || 90) / 100,
          evidence: trendForecasts.map((t) => `${t.trendName} (${t.cyclePhase}): ${t.compatibilityScore}% compatibility`)
        });
        break;
      }

      case 'OUTFIT_RECOMMENDATION':
      default: {
        const decStart = performance.now();
        recommendation = await DecisionEngine.getInstance().generateRecommendation({
          userId,
          userPrompt: request.userPrompt,
          occasion: request.context?.occasion || 'Daily Styling',
          weatherContext: request.context?.weatherContext || 'Mild',
          temperatureC: request.context?.temperatureC || 20
        });
        const decLatency = Math.round(performance.now() - decStart);

        summary = `Generated bespoke outfit recommendation "${recommendation.title}" with ${Math.round(recommendation.overallScore * 100)}% overall score.`;

        reasoningTraces.push({
          traceId: `tr_dec_${Date.now()}`,
          engineName: 'DecisionEngine',
          stepName: 'Contextual Outfit Decision',
          reasoningSummary: summary,
          latencyMs: decLatency,
          confidenceScore: recommendation.confidence,
          evidence: recommendation.reasonSignals ? recommendation.reasonSignals.map(s => s.signalText) : [recommendation.description]
        });
        break;
      }
    }

    // 5. Civilization Knowledge Verification
    const kwStart = performance.now();
    const knowledgeResult = await knowledgeRetrievalEngine.retrieveKnowledge({
      queryText: request.userPrompt,
      userId,
      limit: 4
    });
    const kwLatency = Math.round(performance.now() - kwStart);

    const retrievedNodeIds = knowledgeResult.matchedNodes.map((n) => n.id);
    knowledgeNodes.push(...retrievedNodeIds);

    reasoningTraces.push({
      traceId: `tr_kw_${Date.now()}`,
      engineName: 'KnowledgeRetrievalEngine',
      stepName: 'Civilization Memory Graph Verification',
      reasoningSummary: `Cross-referenced query against Civilization Knowledge graph, matching ${knowledgeResult.matchedNodes.length} historical nodes (${knowledgeResult.matchedNodes.map((n) => n.name).slice(0, 2).join(', ')}).`,
      latencyMs: kwLatency,
      confidenceScore: 0.92,
      evidence: knowledgeResult.matchedNodes.map((n) => `${n.name} (${n.type}) [Confidence: ${Math.round(n.confidence * 100)}%]`)
    });

    // 6. Multi-Agent Consensus Verification
    const collabStart = performance.now();
    const collab = await agentCollaborationManager.initializeCollaboration({
      requestId: `collab_orch_${Date.now()}`,
      objective: `Evaluate aggregated ARIA execution for request "${request.userPrompt.substring(0, 40)}"`,
      context: { intent, summary },
      userId
    });
    const collabLatency = Math.round(performance.now() - collabStart);

    reasoningTraces.push({
      traceId: `tr_collab_${Date.now()}`,
      engineName: 'AgentCollaborationManager',
      stepName: 'Multi-Agent Consensus Protocol',
      reasoningSummary: `Multi-agent team evaluated final execution consensus score at ${collab.confidenceScore}%.`,
      latencyMs: collabLatency,
      confidenceScore: collab.confidenceScore / 100,
      evidence: collab.contributions ? collab.contributions.map((d) => `${d.agentName || d.agentRole}: ${d.reasoning[0] || d.recommendation}`) : collab.detailedReasoning
    });

    const executionTimeMs = Math.round(performance.now() - startTime);

    // 7. Aggregate Multi-Factor Confidence Report
    const styleDNAMatch = Math.round(userMemory.styleDNA.formalityPreference * 100);
    const visualHarmony = visionAnalysis ? Math.round(visionAnalysis.outfitProfile.overallHarmonyScore * 100) : 92;
    const knowledgeEvidence = 90;
    const predictionScore = simulationScenario ? simulationScenario.confidence.finalPredictionConfidence : undefined;
    const agentConsensus = collab.confidenceScore;

    const scores = [styleDNAMatch, visualHarmony, knowledgeEvidence, agentConsensus];
    if (predictionScore !== undefined) scores.push(predictionScore);

    const finalConfidence = Math.min(99, Math.max(70, Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)));

    const confidenceReport: ARIAConfidenceReport = {
      styleDNAMatch,
      visualHarmony,
      knowledgeEvidence,
      predictionScore,
      agentConsensus,
      finalConfidence
    };

    const uniqueKnowledgeNodes = Array.from(new Set(knowledgeNodes));

    const response: ARIAResponse = {
      responseId,
      requestId,
      intent,
      userId,
      summary,
      recommendation,
      concept,
      visionAnalysis,
      simulationScenario,
      trendForecasts,
      capsule,
      confidenceReport,
      reasoningTraces,
      referencedKnowledgeNodes: uniqueKnowledgeNodes,
      executionTimeMs,
      timestamp: new Date().toISOString()
    };

    // Update internal telemetry metrics
    this.totalExecutionsLogged++;
    this.accumulativeLatencyMs += executionTimeMs;
    this.lastExecutionAt = response.timestamp;

    // Log Enterprise Trace
    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'ARIAOrchestrator',
        eventName: 'ARIA_EXECUTION_COMPLETED',
        category: 'Reasoning',
        payload: `Executed request "${requestId}" (Intent: ${intent}, Confidence: ${finalConfidence}%, Latency: ${executionTimeMs}ms)`,
        latencyMs: executionTimeMs,
        status: 'Success'
      });
    } catch (_) {}

    return response;
  }

  /**
   * Intelligently detects intent if omitted or validates given intent
   */
  private detectIntent(request: ARIARequest): ARIAIntent {
    if (request.intent) {
      return request.intent;
    }

    if (request.imageUrl || request.imageBase64 || request.imageName) {
      return 'IMAGE_ANALYSIS';
    }

    const promptLower = request.userPrompt.toLowerCase();

    if (promptLower.includes('capsule') || promptLower.includes('wardrobe') || promptLower.includes('closet') || promptLower.includes('organize')) {
      return 'WARDROBE_OPTIMIZATION';
    }

    if (promptLower.includes('predict') || promptLower.includes('future') || promptLower.includes('trajectory') || promptLower.includes('forecast 6') || promptLower.includes('12 months')) {
      return 'STYLE_PREDICTION';
    }

    if (promptLower.includes('trend') || promptLower.includes('runway') || promptLower.includes('macro') || promptLower.includes('upcoming')) {
      return 'TREND_ANALYSIS';
    }

    if (promptLower.includes('create') || promptLower.includes('design') || promptLower.includes('concept') || promptLower.includes('moodboard') || promptLower.includes('editorial')) {
      return 'STYLE_CREATION';
    }

    return 'OUTFIT_RECOMMENDATION';
  }

  /**
   * Returns health status of the ARIA Orchestrator and active engines
   */
  public getStatus(): ARIAOrchestratorStatus {
    const avgLatency = this.totalExecutionsLogged > 0
      ? Math.round(this.accumulativeLatencyMs / this.totalExecutionsLogged)
      : 18;

    return {
      isInitialized: true,
      status: 'OPERATIONAL',
      version: 'ARIA v3.2 Production',
      activeEngines: [
        'DecisionEngine',
        'GenerativeFashionEngine',
        'VisualFashionEngine',
        'PredictionEngine',
        'TrendPredictionEngine',
        'KnowledgeRetrievalEngine',
        'AgentCollaborationManager',
        'AdaptiveAgentSelector',
        'PersonalFashionMemoryEngine',
        'EnterpriseObservabilityEngine'
      ],
      totalExecutionsLogged: this.totalExecutionsLogged,
      averageLatencyMs: avgLatency,
      lastExecutionAt: this.lastExecutionAt
    };
  }
}

export const ariaOrchestrator = ARIAOrchestrator.getInstance();
