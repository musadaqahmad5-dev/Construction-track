/**
 * ARIA v2.5 Style DNA Scorer
 * Product: LOOK VISION v2.4
 */

import { StyleDNAAttribute, StyleDNAProfile } from './StyleDNATypes';
import { MemoryConfidenceEvaluator } from '../memory/MemoryConfidence';

export class StyleDNAScorer {
  /**
   * Calculates attribute confidence score based on memory sources, evidence count, and user confirmation
   */
  public static calculateAttributeScore(
    baseConfidence: number,
    evidenceCount: number,
    isUserCorrection: boolean
  ): number {
    if (isUserCorrection) {
      return 0.98; // Highest weight for explicit correction
    }

    // Boost confidence slightly as evidence accumulates up to 1.0
    const evidenceBonus = Math.min(0.15, (evidenceCount - 1) * 0.03);
    const score = Math.min(1.0, Math.max(0.3, baseConfidence + evidenceBonus));
    return Number(score.toFixed(2));
  }

  /**
   * Calculates overall profile confidence score by taking a weighted average across all vector categories
   */
  public static calculateProfileConfidence(profile: Partial<StyleDNAProfile>): {
    overallConfidence: number;
    totalEvidenceCount: number;
  } {
    const categories: Array<StyleDNAAttribute<string>[] | undefined> = [
      profile.colorProfile,
      profile.silhouetteProfile,
      profile.materialProfile,
      profile.brandAffinity,
      profile.lifestyleAlignment,
      profile.occasionPreferences
    ];

    let totalScoreSum = 0;
    let attributeCount = 0;
    let totalEvidenceCount = 0;

    for (const cat of categories) {
      if (cat && Array.isArray(cat)) {
        for (const attr of cat) {
          totalScoreSum += attr.confidence;
          attributeCount++;
          totalEvidenceCount += attr.evidenceCount;
        }
      }
    }

    if (attributeCount === 0) {
      return {
        overallConfidence: 0.5,
        totalEvidenceCount: 0
      };
    }

    const overallConfidence = Number((totalScoreSum / attributeCount).toFixed(2));

    return {
      overallConfidence,
      totalEvidenceCount
    };
  }

  /**
   * Classifies profile maturity based on overall confidence and total evidence count
   */
  public static getMaturityLabel(overallConfidence: number, evidenceCount: number): string {
    if (overallConfidence >= 0.85 && evidenceCount >= 10) return 'Verified Signature DNA';
    if (overallConfidence >= 0.70 && evidenceCount >= 5) return 'Established Identity';
    if (overallConfidence >= 0.55) return 'Emerging Identity';
    return 'Initial Seed DNA';
  }
}
