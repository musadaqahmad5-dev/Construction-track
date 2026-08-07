/**
 * ARIA v2.8 Collective Reasoning Engine
 * Product: LOOK VISION v2.4
 * 
 * Synthesizes multi-agent outputs, reasoning trees, and resolved conflicts into a unified,
 * highly explainable collective fashion decision.
 */

import {
  AgentCollaborationRequest,
  AgentContribution,
  AgentConflict,
  ConfidenceBreakdown,
  CollectiveDecision
} from './CollaborationTypes';

export class CollectiveReasoningEngine {
  private static instance: CollectiveReasoningEngine;

  private constructor() {}

  public static getInstance(): CollectiveReasoningEngine {
    if (!CollectiveReasoningEngine.instance) {
      CollectiveReasoningEngine.instance = new CollectiveReasoningEngine();
    }
    return CollectiveReasoningEngine.instance;
  }

  /**
   * Synthesizes all agent contributions and conflict resolutions into a unified collective decision
   */
  public synthesizeDecision(
    request: AgentCollaborationRequest,
    contributions: AgentContribution[],
    conflicts: AgentConflict[],
    confidenceBreakdown: ConfidenceBreakdown,
    latencyMs: number
  ): CollectiveDecision {
    const collaborationId = `collab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const userId = request.userId || 'guest_user';
    const objective = request.objective;

    // Collect agent roles
    const contributingAgents = contributions.map((c) => c.agentRole);

    // Extract individual agent highlights
    let stylistHighlight = '';
    let historianHighlight = '';
    let trendHighlight = '';
    let wardrobeHighlight = '';
    let creativeHighlight = '';
    let visualHighlight = '';

    contributions.forEach((c) => {
      const summary = typeof c.recommendation === 'string'
        ? c.recommendation
        : (c.recommendation as any)?.title || (c.recommendation as any)?.description || JSON.stringify(c.recommendation);

      switch (c.agentRole) {
        case 'PERSONAL_STYLIST':
          stylistHighlight = summary;
          break;
        case 'FASHION_HISTORIAN':
          historianHighlight = summary;
          break;
        case 'TREND_INTELLIGENCE':
          trendHighlight = summary;
          break;
        case 'WARDROBE_OPTIMIZER':
          wardrobeHighlight = summary;
          break;
        case 'CREATIVE_DIRECTOR':
          creativeHighlight = summary;
          break;
        case 'VISUAL_ANALYSIS':
          visualHighlight = summary;
          break;
      }
    });

    // Construct Final Recommendation Title & Summary
    let finalRecommendation = stylistHighlight || `Tailored Outfit Direction for "${objective}"`;
    if (wardrobeHighlight && wardrobeHighlight.includes('synergy')) {
      finalRecommendation += ` (Capsule Synergy Direction)`;
    }

    // Build Unified Reasoning Summary
    const reasoningClauses: string[] = [];

    if (wardrobeHighlight) {
      reasoningClauses.push(`your wardrobe contains matching registered capsule pieces`);
    } else {
      reasoningClauses.push(`aligned with your personal Style DNA profile`);
    }

    if (historianHighlight) {
      reasoningClauses.push(`rooted in classic fashion heritage & iconic design influences`);
    }

    if (trendHighlight) {
      reasoningClauses.push(`incorporating current seasonal runway tailoring trends`);
    }

    if (creativeHighlight) {
      reasoningClauses.push(`framed by a synthesized editorial color story`);
    }

    const reasoningSummary = `Recommended because ${reasoningClauses.join(', ')}.`;

    // Compile Detailed Reasoning Chain
    const detailedReasoning: string[] = [
      `Objective: "${objective}" evaluated across ${contributions.length} specialized ARIA fashion agents.`,
      `Collective Confidence Score: ${confidenceBreakdown.finalCollectiveConfidence}% (Weighted: Math.round(${confidenceBreakdown.weightedConfidence * 100})%, Evidence Quality: Math.round(${confidenceBreakdown.evidenceQualityScore * 100})%).`
    ];

    contributions.forEach((c) => {
      detailedReasoning.push(`[${c.agentRole}] (${Math.round(c.confidence * 100)}% Confidence): ${c.reasoning?.[0] || 'Executed reasoning pass'}`);
    });

    if (conflicts && conflicts.length > 0) {
      conflicts.forEach((conf) => {
        detailedReasoning.push(`[Conflict Resolved - ${conf.topic}]: ${conf.explanation}`);
      });
    }

    return {
      collaborationId,
      requestId: request.requestId,
      objective,
      finalRecommendation,
      confidenceScore: confidenceBreakdown.finalCollectiveConfidence,
      confidenceBreakdown,
      reasoningSummary,
      detailedReasoning,
      contributingAgents,
      contributions,
      conflictsResolved: conflicts,
      userId,
      createdAt: new Date().toISOString(),
      latencyMs
    };
  }
}

export const collectiveReasoningEngine = CollectiveReasoningEngine.getInstance();
