/**
 * ARIA v2.5 Recommendation Engine
 * Product: LOOK VISION v2.4
 */

import { 
  FashionRecommendation, 
  DecisionQueryRequest 
} from './DecisionTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';
import { FashionMemoryItem } from '../memory/MemoryTypes';
import { DecisionScorer } from './DecisionScorer';
import { DecisionContextBuilder } from './DecisionContextBuilder';

export class RecommendationEngine {
  /**
   * Generates a structured Fashion Recommendation using Memory + Style DNA + User Context
   */
  public static generateRecommendation(
    userId: string,
    styleDNA: StyleDNAProfile | null,
    memories: FashionMemoryItem[],
    request?: DecisionQueryRequest
  ): FashionRecommendation {
    const now = new Date().toISOString();
    const recId = `rec_${userId}_${Date.now()}`;

    // 1. Calculate Scores
    const scoringBreakdown = DecisionScorer.calculateScores(
      styleDNA,
      memories,
      request?.occasion,
      request?.preferredPalette
    );

    // 2. Build Reason Signals
    const reasonSignals = DecisionContextBuilder.buildReasonSignals(styleDNA, memories, request);

    // 3. Derive Recommendation Titles & Copy
    const occasionTitle = request?.occasion ? `${request.occasion} Ensemble` : 'Curated Sartorial Direction';
    const topSilhouette = styleDNA?.silhouetteProfile[0]?.value || 'Tailored Structured Layering';
    const topColor = styleDNA?.colorProfile[0]?.value || 'Deep Neutral Monochrome';
    const topBrand = styleDNA?.brandAffinity[0]?.value || 'Contemporary Designer House';

    const title = `${occasionTitle} • ${topSilhouette}`;
    const description = request?.userPrompt
      ? `Tailored direction answering: "${request.userPrompt}". Harmonizes ${topColor} palette with ${topSilhouette} framing.`
      : `Harmonizes ${topColor} tones with ${topSilhouette} proportions, tailored specifically based on verified Style DNA vectors and historical memory.`;

    const suggestedItems = [
      `${topSilhouette} in ${topColor}`,
      `Structured Accent Piece aligned with ${topBrand} aesthetic`,
      `Tailored Trousers in Complementary Tones`,
      `Architectural Footwear & Leather Accessories`
    ];

    const stylingAdvice = `Ensure clean visual balance by anchoring the outfit with ${topColor}. Maintain focus on precise drape and silhouette proportions.`;

    const evidenceCount = (styleDNA?.totalEvidenceCount || 0) + memories.length + reasonSignals.length;

    return {
      recommendationId: recId,
      userId,
      title,
      description,
      category: request?.targetCategory || 'Outfit Recommendation',
      suggestedItems,
      stylingAdvice,
      confidence: scoringBreakdown.confidence,
      overallScore: scoringBreakdown.overallScore,
      styleAlignment: scoringBreakdown.styleMatch,
      memoryAlignment: scoringBreakdown.preferenceMatch,
      occasionMatch: scoringBreakdown.occasionMatch,
      colorHarmony: scoringBreakdown.colorMatch,
      scoringBreakdown,
      reasonSignals,
      evidenceCount,
      createdAt: now,
      metadata: {
        identityName: styleDNA?.identityName || 'Default Identity',
        promptContext: request?.userPrompt || ''
      }
    };
  }
}
