/**
 * ARIA v2.5 Decision Scorer
 * Product: LOOK VISION v2.4
 */

import { DecisionScoringBreakdown } from './DecisionTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';
import { FashionMemoryItem } from '../memory/MemoryTypes';

export class DecisionScorer {
  /**
   * Calculates comprehensive multi-vector scoring breakdown using Style DNA and Memory
   */
  public static calculateScores(
    styleDNA: StyleDNAProfile | null,
    memories: FashionMemoryItem[],
    requestedOccasion?: string,
    requestedPalette?: string[]
  ): DecisionScoringBreakdown {
    if (!styleDNA && memories.length === 0) {
      return {
        styleMatch: 0.65,
        colorMatch: 0.70,
        lifestyleMatch: 0.60,
        occasionMatch: 0.60,
        preferenceMatch: 0.65,
        wardrobeCompatibility: 0.70,
        overallScore: 0.65,
        confidence: 0.50
      };
    }

    // 1. Style Match (based on Silhouette and Style DNA overall confidence)
    const silhouetteConf = styleDNA?.silhouetteProfile[0]?.confidence || 0.7;
    const styleMatch = Number(Math.min(1.0, Math.max(0.4, silhouetteConf + 0.05)).toFixed(2));

    // 2. Color Match (based on Color Profile & requested palette match)
    let colorMatch = 0.75;
    if (styleDNA && styleDNA.colorProfile.length > 0) {
      const topColorConf = styleDNA.colorProfile[0].confidence;
      colorMatch = Math.min(1.0, topColorConf + 0.05);
      if (requestedPalette && requestedPalette.length > 0) {
        const hasMatchingColor = styleDNA.colorProfile.some(c => 
          requestedPalette.some(p => p.toLowerCase().includes(c.key) || c.key.includes(p.toLowerCase()))
        );
        if (hasMatchingColor) colorMatch = Math.min(1.0, colorMatch + 0.1);
      }
    }
    colorMatch = Number(colorMatch.toFixed(2));

    // 3. Lifestyle Match
    const lifestyleConf = styleDNA?.lifestyleAlignment[0]?.confidence || 0.70;
    const lifestyleMatch = Number(Math.min(1.0, Math.max(0.5, lifestyleConf)).toFixed(2));

    // 4. Occasion Match
    let occasionMatch = 0.75;
    if (requestedOccasion && styleDNA) {
      const matchedOccasion = styleDNA.occasionPreferences.find(o => 
        o.key.includes(requestedOccasion.toLowerCase()) || requestedOccasion.toLowerCase().includes(o.key)
      );
      if (matchedOccasion) {
        occasionMatch = Math.min(1.0, matchedOccasion.confidence + 0.1);
      }
    }
    occasionMatch = Number(occasionMatch.toFixed(2));

    // 5. Preference Match (derived from explicit memories)
    const explicitMemories = memories.filter(m => m.source === 'user_explicit' || m.source === 'correction');
    const preferenceMatch = explicitMemories.length > 0 ? 0.90 : 0.70;

    // 6. Wardrobe Compatibility
    const wardrobeMemories = memories.filter(m => (m.category as string) === 'wardrobe_behavior' || (m.category as string) === 'item_ownership');
    const wardrobeCompatibility = wardrobeMemories.length > 0 ? 0.88 : 0.75;

    // 7. Overall Score (weighted average)
    const weightedSum = 
      (styleMatch * 0.25) +
      (colorMatch * 0.20) +
      (lifestyleMatch * 0.15) +
      (occasionMatch * 0.15) +
      (preferenceMatch * 0.15) +
      (wardrobeCompatibility * 0.10);

    const overallScore = Number(weightedSum.toFixed(2));

    // 8. Confidence (weighted by evidence count and Style DNA overall confidence)
    const dnaConf = styleDNA?.overallConfidence || 0.6;
    const evidenceBonus = Math.min(0.2, (styleDNA?.totalEvidenceCount || memories.length) * 0.02);
    const confidence = Number(Math.min(0.98, Math.max(0.5, dnaConf + evidenceBonus)).toFixed(2));

    return {
      styleMatch,
      colorMatch,
      lifestyleMatch,
      occasionMatch,
      preferenceMatch,
      wardrobeCompatibility,
      overallScore,
      confidence
    };
  }
}
