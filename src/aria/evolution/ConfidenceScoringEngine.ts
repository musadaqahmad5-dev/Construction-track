/**
 * ARIA v2.5 Confidence Scoring Engine
 * Computes multi-factor intelligence confidence scores with evidence tracing and mathematical decay.
 * Product: LOOK VISION v2.4
 */

import {
  AttributeConfidenceScore,
  EvolutionConfidenceFactor
} from './StyleEvolutionTypes';
import { StyleDNAAttribute } from '../styleDNA/StyleDNATypes';

export class ConfidenceScoringEngine {
  /**
   * Calculates comprehensive multi-factor confidence score for a single attribute
   */
  public static calculateAttributeConfidence(
    attributeKey: string,
    attributeValue: string,
    category: string,
    rawConfidence: number,
    evidenceCount: number,
    source: string,
    lastConfirmedAt: string,
    wearCount: number = 0
  ): AttributeConfidenceScore {
    const factors: EvolutionConfidenceFactor[] = [];
    const reasons: string[] = [];

    // 1. Interaction Count Factor (0.0 to 1.0)
    const interactionScore = Math.min(1.0, 0.4 + evidenceCount * 0.1);
    factors.push({
      name: 'interaction_count',
      weight: 0.35,
      score: interactionScore,
      reason: `Accumulated ${evidenceCount} confirmation interactions.`
    });
    if (evidenceCount > 1) {
      reasons.push(`Selected/confirmed ${evidenceCount} times across sessions.`);
    }

    // 2. Recency Factor (Decay or Freshness boost)
    const lastDate = new Date(lastConfirmedAt);
    const now = new Date();
    const daysSince = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    let recencyScore = 1.0;
    if (daysSince > 30) {
      recencyScore = Math.max(0.4, 1.0 - (daysSince - 30) * 0.01);
    }
    factors.push({
      name: 'recency',
      weight: 0.25,
      score: recencyScore,
      reason: daysSince < 7 ? 'Recently updated within last 7 days.' : `Last confirmed ${Math.round(daysSince)} days ago.`
    });

    // 3. Direct Feedback / Source Factor
    let directFeedbackScore = 0.5;
    if (source === 'user_correction') {
      directFeedbackScore = 1.0;
      reasons.push('Direct explicit user correction.');
    } else if (source === 'user_explicit') {
      directFeedbackScore = 0.95;
      reasons.push('Explicit user preference entry.');
    } else if (source === 'confirmed_interaction') {
      directFeedbackScore = 0.85;
      reasons.push('Confirmed positive feedback interaction.');
    } else {
      directFeedbackScore = Math.min(0.8, Math.max(0.3, rawConfidence));
      reasons.push('Inferred from implicit fashion usage.');
    }
    factors.push({
      name: 'direct_feedback',
      weight: 0.25,
      score: directFeedbackScore,
      reason: `Source quality: ${source}`
    });

    // 4. Usage Frequency / Wear Count Factor
    const usageScore = Math.min(1.0, 0.2 + wearCount * 0.15);
    factors.push({
      name: 'usage_frequency',
      weight: 0.15,
      score: usageScore,
      reason: wearCount > 0 ? `Wore related garments ${wearCount} times.` : 'No physical wear instances recorded yet.'
    });
    if (wearCount > 0) {
      reasons.push(`Wore similar garments ${wearCount} times in active wardrobe.`);
    }

    // Weighted Score Sum
    let totalWeight = 0;
    let weightedSum = 0;
    for (const f of factors) {
      totalWeight += f.weight;
      weightedSum += f.score * f.weight;
    }

    const finalScore = Number((weightedSum / totalWeight).toFixed(2));

    return {
      attributeKey,
      attributeValue,
      category,
      confidenceScore: finalScore,
      interactionCount: evidenceCount,
      evidenceCount,
      factors,
      lastUpdatedTimestamp: lastConfirmedAt,
      reasons
    };
  }

  /**
   * Evaluates overall intelligence confidence score across profile vectors
   */
  public static evaluateOverallIntelligenceConfidence(
    attributes: StyleDNAAttribute<string>[],
    totalEvolutionsCount: number,
    totalFeedbackEvents: number
  ): {
    overallConfidence: number;
    maturityLabel: string;
    reasoningSummary: string[];
  } {
    if (attributes.length === 0) {
      return {
        overallConfidence: 0.5,
        maturityLabel: 'Initial Seed DNA',
        reasoningSummary: ['No active vectors established yet. Using baseline quiet elegance defaults.']
      };
    }

    const sum = attributes.reduce((acc, a) => acc + a.confidence, 0);
    const avgConfidence = sum / attributes.length;

    // Bonus for volume of evolutions & feedback events
    const feedbackBonus = Math.min(0.1, totalFeedbackEvents * 0.01);
    const evolutionBonus = Math.min(0.05, totalEvolutionsCount * 0.005);

    const overallConfidence = Number(Math.min(1.0, Math.max(0.3, avgConfidence + feedbackBonus + evolutionBonus)).toFixed(2));

    let maturityLabel = 'Initial Seed DNA';
    if (overallConfidence >= 0.85 && totalFeedbackEvents >= 8) {
      maturityLabel = 'Autonomous Signature DNA';
    } else if (overallConfidence >= 0.72 && totalFeedbackEvents >= 4) {
      maturityLabel = 'Established Personal DNA';
    } else if (overallConfidence >= 0.58) {
      maturityLabel = 'Evolving Style Identity';
    }

    const reasoningSummary: string[] = [
      `Evaluated ${attributes.length} active style vectors with average vector confidence of ${Math.round(avgConfidence * 100)}%.`,
      `Integrated ${totalFeedbackEvents} direct user feedback learning events.`,
      `Recorded ${totalEvolutionsCount} historical style evolution checkpoints.`,
      `Maturity classified as: "${maturityLabel}".`
    ];

    return {
      overallConfidence,
      maturityLabel,
      reasoningSummary
    };
  }
}
