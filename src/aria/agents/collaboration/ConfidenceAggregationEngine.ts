/**
 * ARIA v2.8 Confidence Aggregation Engine
 * Product: LOOK VISION v2.4
 * 
 * Combines individual agent confidence scores into a unified collective confidence metric
 * using agent reliability history, task relevance, evidence quality, and conflict penalties.
 */

import { AgentContribution, AgentConflict, ConfidenceBreakdown } from './CollaborationTypes';
import { agentRegistry } from '../AgentRegistry';

export class ConfidenceAggregationEngine {
  private static instance: ConfidenceAggregationEngine;

  private constructor() {}

  public static getInstance(): ConfidenceAggregationEngine {
    if (!ConfidenceAggregationEngine.instance) {
      ConfidenceAggregationEngine.instance = new ConfidenceAggregationEngine();
    }
    return ConfidenceAggregationEngine.instance;
  }

  /**
   * Calculates multi-factor collective confidence score (0 to 100)
   */
  public calculateCollectiveConfidence(
    contributions: AgentContribution[],
    conflicts: AgentConflict[],
    objective: string
  ): ConfidenceBreakdown {
    if (!contributions || contributions.length === 0) {
      return {
        averageConfidence: 0,
        weightedConfidence: 0,
        reliabilityFactor: 0,
        relevanceScore: 0,
        evidenceQualityScore: 0,
        conflictPenalty: 0,
        finalCollectiveConfidence: 0
      };
    }

    // 1. Average Confidence
    const rawConfidences = contributions.map((c) => Math.min(1.0, Math.max(0.0, c.confidence)));
    const averageConfidence = rawConfidences.reduce((acc, c) => acc + c, 0) / rawConfidences.length;

    // 2. Reliability Factor (from Agent Registry profiles)
    let totalReliability = 0;
    const weights: number[] = [];

    contributions.forEach((c) => {
      const profile = agentRegistry.getAgentByRole(c.agentRole);
      let agentReliability = 0.90;
      if (profile && profile.metrics && profile.metrics.totalExecutions > 0) {
        agentReliability = profile.metrics.successfulExecutions / profile.metrics.totalExecutions;
      }
      totalReliability += agentReliability;
      // Calculate weight per agent = self confidence * reliability
      weights.push(c.confidence * agentReliability);
    });

    const reliabilityFactor = Number((totalReliability / contributions.length).toFixed(2));

    // 3. Weighted Confidence
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    let weightedConfidence = averageConfidence;
    if (totalWeight > 0) {
      weightedConfidence = contributions.reduce((acc, c, idx) => {
        return acc + c.confidence * (weights[idx] / totalWeight);
      }, 0);
    }
    weightedConfidence = Number(weightedConfidence.toFixed(2));

    // 4. Task Relevance Score
    const objLower = objective.toLowerCase();
    let relevanceSum = 0;

    contributions.forEach((c) => {
      let rel = 0.85;
      const role = c.agentRole;
      if (role === 'PERSONAL_STYLIST' && (objLower.includes('outfit') || objLower.includes('style') || objLower.includes('wear'))) {
        rel = 0.98;
      } else if (role === 'FASHION_HISTORIAN' && (objLower.includes('heritage') || objLower.includes('history') || objLower.includes('era') || objLower.includes('designer'))) {
        rel = 0.98;
      } else if (role === 'TREND_INTELLIGENCE' && (objLower.includes('trend') || objLower.includes('runway') || objLower.includes('season'))) {
        rel = 0.98;
      } else if (role === 'WARDROBE_OPTIMIZER' && (objLower.includes('wardrobe') || objLower.includes('closet') || objLower.includes('capsule'))) {
        rel = 0.98;
      } else if (role === 'CREATIVE_DIRECTOR' && (objLower.includes('concept') || objLower.includes('editorial') || objLower.includes('mood'))) {
        rel = 0.98;
      } else if (role === 'VISUAL_ANALYSIS' && (objLower.includes('image') || objLower.includes('visual') || objLower.includes('photo'))) {
        rel = 0.98;
      }
      relevanceSum += rel;
    });

    const relevanceScore = Number((relevanceSum / contributions.length).toFixed(2));

    // 5. Evidence Quality Score
    const totalEvidenceCount = contributions.reduce((acc, c) => acc + (c.supportingEvidence?.length || 0) + (c.reasoning?.length || 0), 0);
    const avgEvidence = totalEvidenceCount / contributions.length;
    const evidenceQualityScore = Number(Math.min(1.0, 0.70 + (avgEvidence * 0.05)).toFixed(2));

    // 6. Conflict Penalty
    let conflictPenalty = 0;
    if (conflicts && conflicts.length > 0) {
      conflictPenalty = Number(Math.min(0.20, conflicts.length * 0.04).toFixed(2));
    }

    // 7. Final Collective Score (Scaled 0-100)
    // Formula: (weightedConfidence * 0.40 + reliabilityFactor * 0.25 + relevanceScore * 0.20 + evidenceQualityScore * 0.15 - conflictPenalty) * 100
    const rawCollectiveScore = (
      weightedConfidence * 0.40 +
      reliabilityFactor * 0.25 +
      relevanceScore * 0.20 +
      evidenceQualityScore * 0.15 -
      conflictPenalty
    );

    const finalCollectiveConfidence = Math.min(100, Math.max(1, Math.round(rawCollectiveScore * 100)));

    return {
      averageConfidence,
      weightedConfidence,
      reliabilityFactor,
      relevanceScore,
      evidenceQualityScore,
      conflictPenalty,
      finalCollectiveConfidence
    };
  }
}

export const confidenceAggregationEngine = ConfidenceAggregationEngine.getInstance();
