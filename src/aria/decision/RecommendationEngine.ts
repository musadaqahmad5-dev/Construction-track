/**
 * ARIA v2.5 Recommendation Engine
 * Product: LOOK VISION v2.4
 * 
 * Generates structured contextual outfit decisions backed by
 * Style DNA, Personal Fashion Memory, Wardrobe Synergy, and Context.
 */

import { 
  FashionRecommendation, 
  DecisionQueryRequest 
} from './DecisionTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';
import { FashionMemoryItem } from '../memory/MemoryTypes';
import { DecisionContextBuilder } from './DecisionContextBuilder';
import { WardrobeSynergyEngine } from './WardrobeSynergyEngine';
import { DecisionScorer } from './DecisionScorer';

export class RecommendationEngine {
  /**
   * Generates a fully structured Contextual Outfit Decision (Task 1 - 4)
   */
  public static generateRecommendation(
    userId: string,
    styleDNA: StyleDNAProfile | null,
    memories: FashionMemoryItem[],
    request?: DecisionQueryRequest
  ): FashionRecommendation {
    const now = new Date().toISOString();
    const recId = `rec_${userId}_${Date.now()}`;

    // 1. Build Context Profile (Task 1)
    const contextProfile = DecisionContextBuilder.buildContextProfile(
      request,
      WardrobeSynergyEngine.getActiveWardrobeItems().length,
      userId
    );

    // 2. Assemble Synergistic Outfit prioritizing owned items (Task 4)
    const { outfitComposition, ownedItemRatio } = WardrobeSynergyEngine.assembleSynergisticOutfit(
      contextProfile,
      styleDNA,
      memories
    );

    // 3. Calculate 0-100 Decision Score & Breakdown (Task 2)
    const decisionScore = DecisionScorer.calculateDecisionScore(
      recId,
      contextProfile,
      styleDNA,
      memories,
      outfitComposition,
      ownedItemRatio,
      request?.preferredPalette
    );

    // 4. Build Rationale Signals & Structured Reasoning (Task 3)
    const reasonSignals = DecisionContextBuilder.buildReasonSignals(
      styleDNA,
      memories,
      contextProfile,
      ownedItemRatio
    );

    const title = `${contextProfile.occasion} • ${outfitComposition.top?.title || 'Tailored Look'}`;
    const description = request?.userPrompt
      ? `Tailored direction addressing prompt: "${request.userPrompt}". Combines ${outfitComposition.top?.color || 'neutral'} tones with ${Math.round(ownedItemRatio * 100)}% owned wardrobe items.`
      : `Harmonizes ${outfitComposition.top?.color || 'neutral'} tones with ${outfitComposition.bottom?.title || 'trousers'}, tailored for ${contextProfile.occasion} (${Math.round(ownedItemRatio * 100)}% owned closet synergy).`;

    const stylingAdvice = `Ensure clean visual balance by anchoring the outfit with ${outfitComposition.top?.color || 'neutral'} tones. Focus on precise drape and proportion alignment for ${contextProfile.occasion}.`;

    const reasoning = DecisionContextBuilder.buildStructuredReasoning(
      title,
      description,
      outfitComposition,
      ownedItemRatio,
      reasonSignals,
      stylingAdvice,
      contextProfile
    );

    // Suggested Items array for backward compatibility
    const suggestedItems: string[] = [];
    if (outfitComposition.top) suggestedItems.push(`${outfitComposition.top.title} (${outfitComposition.top.isOwned ? 'Owned' : 'Suggested'})`);
    if (outfitComposition.bottom) suggestedItems.push(`${outfitComposition.bottom.title} (${outfitComposition.bottom.isOwned ? 'Owned' : 'Suggested'})`);
    if (outfitComposition.outerwear) suggestedItems.push(`${outfitComposition.outerwear.title} (${outfitComposition.outerwear.isOwned ? 'Owned' : 'Suggested'})`);
    if (outfitComposition.footwear) suggestedItems.push(`${outfitComposition.footwear.title} (${outfitComposition.footwear.isOwned ? 'Owned' : 'Suggested'})`);

    const evidenceCount = (styleDNA?.totalEvidenceCount || 0) + memories.length + reasonSignals.length;

    return {
      recommendationId: recId,
      userId,
      title,
      description,
      category: request?.targetCategory || contextProfile.eventType,
      suggestedItems,
      stylingAdvice,
      confidence: decisionScore.confidenceLevel,
      overallScore: Number((decisionScore.overallScore / 100).toFixed(2)),
      styleAlignment: decisionScore.breakdown.styleMatch,
      memoryAlignment: decisionScore.breakdown.preferenceMatch,
      occasionMatch: decisionScore.breakdown.occasionMatch,
      colorHarmony: decisionScore.breakdown.colorMatch,
      scoringBreakdown: decisionScore.breakdown,
      reasonSignals,
      evidenceCount,
      createdAt: now,
      contextProfile,
      decisionScore,
      reasoning,
      status: 'pending',
      metadata: {
        identityName: styleDNA?.identityName || 'Default Identity',
        promptContext: request?.userPrompt || '',
        ownedItemRatio
      }
    };
  }
}
