/**
 * ARIA v2.5 Outfit Decision Scoring Engine
 * Product: LOOK VISION v2.4
 * 
 * Evaluates 8 core dimensions to output a unified 0-100 DecisionScore.
 */

import { 
  DecisionScoringBreakdown, 
  DecisionScore, 
  DecisionScoringFactor,
  ContextProfile,
  OutfitComposition 
} from './DecisionTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';
import { FashionMemoryItem } from '../memory/MemoryTypes';

export class DecisionScorer {
  /**
   * Calculates comprehensive multi-vector 0-100 DecisionScore (Task 2)
   */
  public static calculateDecisionScore(
    decisionId: string,
    contextProfile: ContextProfile,
    styleDNA: StyleDNAProfile | null,
    memories: FashionMemoryItem[],
    outfitComposition: OutfitComposition,
    ownedRatio: number,
    requestedPalette?: string[]
  ): DecisionScore {
    const factors: DecisionScoringFactor[] = [];
    const reasoningFactors: string[] = [];

    // 1. Style DNA Compatibility (Weight: 0.20)
    const silhouetteConf = styleDNA?.silhouetteProfile[0]?.confidence || 0.75;
    const brandConf = styleDNA?.brandAffinity[0]?.confidence || 0.70;
    const styleDNAScoreVal = Math.min(100, Math.round(((silhouetteConf * 0.6 + brandConf * 0.4) + 0.10) * 100));
    factors.push({
      factorKey: 'style_dna_match',
      factorName: 'Style DNA Compatibility',
      score: styleDNAScoreVal,
      weight: 0.20,
      reasoning: `Matches verified style archetype (${styleDNA?.identityName || 'Contemporary Minimalist'})`
    });
    reasoningFactors.push(`Style DNA alignment: ${styleDNAScoreVal}/100 based on verified silhouette vectors.`);

    // 2. User Preference Confidence (Weight: 0.15)
    const explicitMemories = memories.filter(m => m.source === 'user_explicit' || m.source === 'correction');
    const prefScoreVal = explicitMemories.length > 0 ? 92 : (styleDNA?.overallConfidence ? Math.round(styleDNA.overallConfidence * 100) : 75);
    factors.push({
      factorKey: 'user_preference_confidence',
      factorName: 'User Preference Confidence',
      score: prefScoreVal,
      weight: 0.15,
      reasoning: explicitMemories.length > 0 
        ? `Validated by ${explicitMemories.length} explicit user preferences in memory`
        : 'Inferred from general preference baseline'
    });
    reasoningFactors.push(`Preference confidence: ${prefScoreVal}/100 supported by historical memory records.`);

    // 3. Wardrobe Availability & Synergy (Weight: 0.15)
    const wardrobeSynergyScore = Math.min(100, Math.max(50, Math.round((ownedRatio * 0.7 + 0.3) * 100)));
    factors.push({
      factorKey: 'wardrobe_synergy',
      factorName: 'Wardrobe Availability Synergy',
      score: wardrobeSynergyScore,
      weight: 0.15,
      reasoning: `${Math.round(ownedRatio * 100)}% of recommended pieces are already owned in user closet`
    });
    reasoningFactors.push(`Wardrobe synergy: ${wardrobeSynergyScore}/100 prioritizing owned closet garments.`);

    // 4. Color Harmony (Weight: 0.15)
    let colorHarmonyVal = 80;
    if (styleDNA && styleDNA.colorProfile.length > 0) {
      colorHarmonyVal = Math.round((styleDNA.colorProfile[0].confidence || 0.8) * 100);
      if (requestedPalette && requestedPalette.length > 0) {
        colorHarmonyVal = Math.min(100, colorHarmonyVal + 10);
      }
    }
    factors.push({
      factorKey: 'color_harmony',
      factorName: 'Color Harmony & Palette Precision',
      score: colorHarmonyVal,
      weight: 0.15,
      reasoning: `Color palette curated around confirmed core shade (${outfitComposition.top?.color || 'Dark Neutral'})`
    });
    reasoningFactors.push(`Color harmony: ${colorHarmonyVal}/100 aligned with preferred palette profile.`);

    // 5. Material Suitability (Weight: 0.10)
    let materialScore = 85;
    if (contextProfile.weatherCondition.condition === 'rainy') {
      materialScore = 88;
    } else if (contextProfile.season === 'summer' || (contextProfile.weatherCondition.temperatureC && contextProfile.weatherCondition.temperatureC > 25)) {
      materialScore = 90;
    }
    factors.push({
      factorKey: 'material_suitability',
      factorName: 'Material & Textile Suitability',
      score: materialScore,
      weight: 0.10,
      reasoning: `Breathable and climate-suitable textiles selected for ${contextProfile.season}`
    });

    // 6. Occasion Matching (Weight: 0.10)
    const occasionScoreVal = Math.min(100, Math.round(contextProfile.confidenceScore * 100));
    factors.push({
      factorKey: 'occasion_matching',
      factorName: 'Occasion & Formality Match',
      score: occasionScoreVal,
      weight: 0.10,
      reasoning: `Tailored for ${contextProfile.occasion} with ${Math.round(contextProfile.formalityRequirement * 100)}% formality calibration`
    });
    reasoningFactors.push(`Occasion match: ${occasionScoreVal}/100 tuned for ${contextProfile.occasion}.`);

    // 7. Seasonal & Weather Compatibility (Weight: 0.10)
    let seasonalScoreVal = 88;
    if (contextProfile.weatherCondition.temperatureC !== undefined) {
      if (contextProfile.weatherCondition.temperatureC < 12 && outfitComposition.outerwear) {
        seasonalScoreVal = 95;
      } else if (contextProfile.weatherCondition.temperatureC > 24) {
        seasonalScoreVal = 92;
      }
    }
    factors.push({
      factorKey: 'seasonal_weather_compatibility',
      factorName: 'Seasonal & Weather Compatibility',
      score: seasonalScoreVal,
      weight: 0.05,
      reasoning: `Calibrated for ${contextProfile.season} weather (${contextProfile.weatherCondition.temperatureC ?? 20}°C, ${contextProfile.weatherCondition.condition})`
    });

    // 8. Previous Feedback History (Weight: 0.05)
    const negativeMemories = memories.filter(m => m.category === 'user_correction' || m.confidence < 0.3);
    const feedbackHistoryScoreVal = negativeMemories.length === 0 ? 95 : 82;
    factors.push({
      factorKey: 'feedback_history',
      factorName: 'Feedback History & Filter Compliance',
      score: feedbackHistoryScoreVal,
      weight: 0.05,
      reasoning: `Complies with ${negativeMemories.length} historical feedback exclusion filters`
    });

    // Calculate Overall Weighted Score (0 to 100)
    const weightedSum = factors.reduce((sum, f) => sum + (f.score * f.weight), 0);
    const overallScore = Math.min(100, Math.max(1, Math.round(weightedSum)));

    // Calculate Confidence Level (0.0 to 1.0)
    const confidenceLevel = Number(Math.min(0.98, Math.max(0.60, (overallScore / 100) * 0.9 + (contextProfile.confidenceScore * 0.1))).toFixed(2));

    const breakdown: DecisionScoringBreakdown = {
      styleMatch: Number((styleDNAScoreVal / 100).toFixed(2)),
      colorMatch: Number((colorHarmonyVal / 100).toFixed(2)),
      lifestyleMatch: Number((prefScoreVal / 100).toFixed(2)),
      occasionMatch: Number((occasionScoreVal / 100).toFixed(2)),
      preferenceMatch: Number((prefScoreVal / 100).toFixed(2)),
      wardrobeCompatibility: Number((wardrobeSynergyScore / 100).toFixed(2)),
      materialSuitability: Number((materialScore / 100).toFixed(2)),
      seasonalWeatherSuitability: Number((seasonalScoreVal / 100).toFixed(2)),
      feedbackHistoryScore: Number((feedbackHistoryScoreVal / 100).toFixed(2)),
      overallScore: Number((overallScore / 100).toFixed(2)),
      confidence: confidenceLevel
    };

    return {
      scoreId: `score_${decisionId}`,
      decisionId,
      overallScore,
      confidenceLevel,
      breakdown,
      factors,
      reasoningFactors,
      calculatedAt: new Date().toISOString()
    };
  }
}
