import { WardrobeItem } from '../../types';
import { PersistentStyleProfile } from '../../features/style-memory/styleProfile';

export interface ConfidencePayload {
  predictionConfidence: number;  // 0.0 to 1.0 representing mathematical correctness
  uncertainty: number;           // 0.0 to 1.0 representing missing features or environment outliers
  trustScore: number;            // 0.0 to 1.0 representing compatibility alignment
  fallbackIndicators: {
    isOffline: boolean;
    hasEmptyCloset: boolean;
    missingCategoryCoverage: boolean;
  };
}

export class ConfidenceCalculator {
  /**
   * Evaluates the absolute visual confidence of styling suggestion sets.
   */
  static calculate(
    items: WardrobeItem[],
    profile: PersistentStyleProfile,
    isOffline: boolean,
    weatherCondition?: string
  ): ConfidencePayload {
    const hasEmptyCloset = items.length === 0;

    // Check category coverage
    const categoriesPresented = new Set(items.map(i => i.category));
    const missingCategoryCoverage = !categoriesPresented.has('Casual') && !categoriesPresented.has('Formal') && !categoriesPresented.has('Outerwear');

    // 1. Calculate prediction confidence [0, 1]
    let baseConfidence = 0.85;
    if (isOffline) baseConfidence -= 0.15;
    if (hasEmptyCloset) baseConfidence -= 0.50;
    if (missingCategoryCoverage) baseConfidence -= 0.15;

    // Wardrobe size modifier: having more items gives better styling possibilities
    const itemBonus = Math.min(0.15, items.length * 0.015);
    const predictionConfidence = Math.max(0.1, Math.min(0.98, baseConfidence + itemBonus));

    // 2. Compute uncertainty [0, 1]
    let uncertainty = 0.1;
    // Stormy or cold weather increases situational model uncertainty
    const weatherLower = (weatherCondition || '').toLowerCase();
    if (weatherLower.includes('storm') || weatherLower.includes('rain') || weatherLower.includes('snow') || weatherLower.includes('freeze')) {
      uncertainty += 0.25;
    }
    if (hasEmptyCloset || items.length < 3) {
      uncertainty += 0.45;
    }

    // 3. Compute long-term profile Trust Score [0, 1]
    // Trust score is high if recommended items fit the style profile favorite colors or vibe
    let trustScore = 0.70;
    let preferredColorMatches = 0;
    items.forEach(item => {
      if (item.primaryColor && profile.favoriteColors.includes(item.primaryColor)) {
        preferredColorMatches++;
      }
    });

    const trustBonus = items.length > 0 ? (preferredColorMatches / items.length) * 0.3 : 0;
    trustScore = Math.max(0.2, Math.min(1.0, trustScore + trustBonus));

    return {
      predictionConfidence: parseFloat(predictionConfidence.toFixed(2)),
      uncertainty: parseFloat(uncertainty.toFixed(2)),
      trustScore: parseFloat(trustScore.toFixed(2)),
      fallbackIndicators: {
        isOffline,
        hasEmptyCloset,
        missingCategoryCoverage
      }
    };
  }
}
