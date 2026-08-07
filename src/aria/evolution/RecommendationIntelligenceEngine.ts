/**
 * ARIA v2.5 Recommendation Intelligence Engine
 * Evaluates target outfit compatibility against active Style DNA, Wardrobe Memory, and Contextual Parameters.
 * Product: LOOK VISION v2.4
 */

import {
  RecommendationScoreRequest,
  RecommendationConfidenceResult,
  RecommendationMatchLevel
} from './StyleEvolutionTypes';
import { PersonalFashionMemoryEngine } from '../../engine/personalMemory';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';

export class RecommendationIntelligenceEngine {
  private static instance: RecommendationIntelligenceEngine;

  private constructor() {}

  public static getInstance(): RecommendationIntelligenceEngine {
    if (!RecommendationIntelligenceEngine.instance) {
      RecommendationIntelligenceEngine.instance = new RecommendationIntelligenceEngine();
    }
    return RecommendationIntelligenceEngine.instance;
  }

  /**
   * Calculates recommendation confidence score and compatibility breakdown for an outfit
   */
  public evaluateRecommendation(
    request: RecommendationScoreRequest
  ): RecommendationConfidenceResult {
    const { userId, targetOutfit, currentSeason, currentOccasion } = request;

    const memory = PersonalFashionMemoryEngine.getMemory(userId);
    const profile = styleDNAEngine.getProfile();

    const reasons: string[] = [];

    // 1. Color Match Score (0 - 100)
    let colorMatch = 70;
    const targetColors = (targetOutfit.colors || []).map(c => c.toLowerCase().trim());
    const favColors = (memory.favColors || []).map(c => c.toLowerCase().trim());
    const dislikeColors = (memory.dislikes?.colors || []).map(c => c.toLowerCase().trim());

    const hasDislikedColor = targetColors.some(c => dislikeColors.includes(c));
    const matchingColors = targetColors.filter(c => favColors.some(fc => fc.includes(c) || c.includes(fc)));

    if (hasDislikedColor) {
      colorMatch = 25;
      reasons.push('Contains a color from your explicitly disliked color filter.');
    } else if (matchingColors.length > 0) {
      colorMatch = Math.min(100, 75 + matchingColors.length * 10);
      reasons.push(`Features your preferred color palette (${matchingColors.join(', ')}).`);
    } else {
      colorMatch = 65;
    }

    // 2. Garment & Silhouette Match Score (0 - 100)
    let garmentMatch = 70;
    const targetGarments = (targetOutfit.garmentTypes || []).map(g => g.toLowerCase().trim());
    const favGarments = (memory.favGarmentTypes || []).map(g => g.toLowerCase().trim());
    const dislikeGarments = (memory.dislikes?.garments || []).map(g => g.toLowerCase().trim());

    const hasDislikedGarment = targetGarments.some(g => dislikeGarments.includes(g));
    const matchingGarments = targetGarments.filter(g => favGarments.some(fg => fg.includes(g) || g.includes(fg)));

    if (hasDislikedGarment) {
      garmentMatch = 20;
      reasons.push('Contains a garment silhouette you previously rejected.');
    } else if (matchingGarments.length > 0) {
      garmentMatch = Math.min(100, 80 + matchingGarments.length * 10);
      reasons.push(`Aligns with your signature garment silhouettes (${matchingGarments.join(', ')}).`);
    } else {
      garmentMatch = 68;
    }

    // 3. Style & Vibe Match (0 - 100)
    let styleMatch = 75;
    if (targetOutfit.styleVibe && memory.styleDNA?.primaryVibe) {
      if (targetOutfit.styleVibe.toLowerCase().includes(memory.styleDNA.primaryVibe.toLowerCase())) {
        styleMatch = 95;
        reasons.push(`Direct match with your primary aesthetic vibe (${memory.styleDNA.primaryVibe}).`);
      }
    } else if (profile?.overallConfidence && profile.overallConfidence > 0.8) {
      styleMatch = 88;
    }

    // 4. Season Match (0 - 100)
    let seasonMatch = 80;
    const activeSeason = currentSeason || targetOutfit.season || 'transition';
    if (activeSeason) {
      seasonMatch = 88;
      reasons.push(`Optimized for current seasonal context (${activeSeason}).`);
    }

    // 5. Occasion Match (0 - 100)
    let occasionMatch = 80;
    if (currentOccasion || targetOutfit.occasion) {
      occasionMatch = 90;
      reasons.push(`Tailored for occasion: ${currentOccasion || targetOutfit.occasion}.`);
    }

    // 6. Wardrobe Density Match (0 - 100)
    let wardrobeMatch = 85;
    if (request.availableWardrobeIds && request.availableWardrobeIds.length > 0) {
      wardrobeMatch = 92;
      reasons.push('High compatibility with items currently in your digital wardrobe.');
    }

    // Composite Weighted Recommendation Score
    const compositeScore = Math.round(
      styleMatch * 0.25 +
      colorMatch * 0.25 +
      garmentMatch * 0.20 +
      seasonMatch * 0.10 +
      occasionMatch * 0.10 +
      wardrobeMatch * 0.10
    );

    let matchLevel: RecommendationMatchLevel = 'moderate_match';
    if (compositeScore >= 88) {
      matchLevel = 'ideal_match';
    } else if (compositeScore >= 75) {
      matchLevel = 'strong_match';
    } else if (compositeScore >= 60) {
      matchLevel = 'moderate_match';
    } else if (compositeScore >= 45) {
      matchLevel = 'experimental_match';
    } else {
      matchLevel = 'low_match';
    }

    const confidenceScore = Number((compositeScore / 100).toFixed(2));

    return {
      recommendationScore: compositeScore,
      confidenceScore,
      recommendationLevel: matchLevel,
      compatibilityBreakdown: {
        styleMatch,
        colorMatch,
        garmentMatch,
        seasonMatch,
        occasionMatch,
        wardrobeMatch
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };
  }
}

export const recommendationIntelligenceEngine = RecommendationIntelligenceEngine.getInstance();
