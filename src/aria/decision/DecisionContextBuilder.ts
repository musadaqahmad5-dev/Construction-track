/**
 * ARIA v2.5 Context Understanding Layer & Reason Signal Builder
 * Product: LOOK VISION v2.4
 */

import { 
  ContextProfile, 
  DecisionQueryRequest, 
  DecisionReasonSignal,
  StructuredDecisionReasoning,
  OutfitComposition
} from './DecisionTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';
import { FashionMemoryItem } from '../memory/MemoryTypes';

export class DecisionContextBuilder {
  /**
   * Evaluates user context, wardrobe availability, and environment to produce a ContextProfile (Task 1)
   */
  public static buildContextProfile(
    request?: DecisionQueryRequest,
    wardrobeCount: number = 0,
    userId: string = 'guest_user'
  ): ContextProfile {
    const now = new Date();
    const isoTimestamp = now.toISOString();

    const occasion = request?.occasion || 'Everyday Curated Styling';

    // Infer Event Type
    let eventType: ContextProfile['eventType'] = request?.eventType || 'everyday';
    if (!request?.eventType && request?.occasion) {
      const lower = request.occasion.toLowerCase();
      if (lower.includes('business') || lower.includes('meeting') || lower.includes('work') || lower.includes('office') || lower.includes('presentation')) {
        eventType = 'business';
      } else if (lower.includes('gala') || lower.includes('black tie') || lower.includes('formal') || lower.includes('wedding')) {
        eventType = 'formal';
      } else if (lower.includes('dinner') || lower.includes('party') || lower.includes('cocktail') || lower.includes('date')) {
        eventType = 'social';
      } else if (lower.includes('art') || lower.includes('gallery') || lower.includes('fashion') || lower.includes('creative')) {
        eventType = 'creative';
      } else if (lower.includes('gym') || lower.includes('workout') || lower.includes('hike') || lower.includes('sport')) {
        eventType = 'active';
      } else if (lower.includes('weekend') || lower.includes('casual') || lower.includes('brunch')) {
        eventType = 'casual';
      }
    }

    // Infer Formality Requirement (0.0 to 1.0)
    let formalityRequirement = request?.formalityRequirement ?? 0.5;
    if (request?.formalityRequirement === undefined) {
      switch (eventType) {
        case 'formal': formalityRequirement = 0.90; break;
        case 'business': formalityRequirement = 0.75; break;
        case 'social': formalityRequirement = 0.60; break;
        case 'creative': formalityRequirement = 0.55; break;
        case 'casual': formalityRequirement = 0.30; break;
        case 'active': formalityRequirement = 0.15; break;
        default: formalityRequirement = 0.50; break;
      }
    }

    // Infer Season
    let season: ContextProfile['season'] = request?.season || 'transition';
    if (!request?.season) {
      const month = now.getMonth(); // 0 - 11
      if (month >= 2 && month <= 4) season = 'spring';
      else if (month >= 5 && month <= 7) season = 'summer';
      else if (month >= 8 && month <= 10) season = 'autumn';
      else season = 'winter';
    }

    // Parse Weather Context
    const weatherCondition = {
      temperatureC: request?.temperatureC ?? (season === 'summer' ? 26 : season === 'winter' ? 8 : 18),
      condition: (request?.weatherContext?.toLowerCase().includes('rain') ? 'rainy' 
        : request?.weatherContext?.toLowerCase().includes('hot') ? 'hot'
        : request?.weatherContext?.toLowerCase().includes('cold') ? 'cold'
        : request?.weatherContext?.toLowerCase().includes('sun') ? 'sunny' : 'mild') as ContextProfile['weatherCondition']['condition'],
      indoorOutdoor: request?.indoorOutdoor || 'mixed'
    };

    // User Goals
    const userGoals = request?.userGoals && request.userGoals.length > 0 
      ? request.userGoals 
      : ['Maximize owned wardrobe synergy', 'Refine personal style DNA', 'Contextual appropriateness'];

    // Importance Level
    const importanceLevel = (eventType === 'formal' || eventType === 'business' || (request?.userPrompt && request.userPrompt.length > 20)) 
      ? 'high' : 'medium';

    // Confidence Score calculation for Context understanding
    let confidence = 0.65;
    if (request?.occasion) confidence += 0.15;
    if (request?.weatherContext || request?.temperatureC) confidence += 0.10;
    if (wardrobeCount > 0) confidence += 0.08;

    return {
      contextId: `ctx_${userId}_${Date.now()}`,
      userId,
      occasion,
      eventType,
      formalityRequirement: Number(formalityRequirement.toFixed(2)),
      season,
      weatherCondition,
      userGoals,
      importanceLevel,
      wardrobeAvailabilityCount: wardrobeCount,
      timestamp: isoTimestamp,
      confidenceScore: Number(Math.min(0.98, confidence).toFixed(2))
    };
  }

  /**
   * Constructs reason signals linked strictly to verified Memory, Style DNA, and Context vectors (Task 3)
   */
  public static buildReasonSignals(
    styleDNA: StyleDNAProfile | null,
    memories: FashionMemoryItem[],
    contextProfile: ContextProfile,
    ownedRatio: number = 0.8
  ): DecisionReasonSignal[] {
    const signals: DecisionReasonSignal[] = [];

    // 1. Color Signal from Style DNA
    if (styleDNA && styleDNA.colorProfile && styleDNA.colorProfile.length > 0) {
      const topColor = styleDNA.colorProfile[0];
      signals.push({
        id: `sig_col_${Date.now()}_1`,
        category: 'style_dna',
        signalText: `Matches user's verified color preference (${topColor.value})`,
        source: topColor.source || 'StyleDNA Engine',
        confidence: topColor.confidence || 0.85
      });
    }

    // 2. Silhouette Signal from Style DNA
    if (styleDNA && styleDNA.silhouetteProfile && styleDNA.silhouetteProfile.length > 0) {
      const topSil = styleDNA.silhouetteProfile[0];
      signals.push({
        id: `sig_sil_${Date.now()}_2`,
        category: 'style_dna',
        signalText: `Aligns with signature silhouette preference (${topSil.value})`,
        source: topSil.source || 'StyleDNA Engine',
        confidence: topSil.confidence || 0.88
      });
    }

    // 3. Wardrobe Synergy Signal
    const ownedPercent = Math.round(ownedRatio * 100);
    signals.push({
      id: `sig_wrd_${Date.now()}_3`,
      category: 'wardrobe_synergy',
      signalText: `High wardrobe compatibility: ${ownedPercent}% of outfit selected from owned closet`,
      source: 'UnifiedFashionOS Wardrobe Memory',
      confidence: 0.92
    });

    // 4. Memory Signals
    const explicitMemories = memories.filter(m => m.source === 'user_explicit' || m.source === 'correction');
    if (explicitMemories.length > 0) {
      const topMem = explicitMemories[0];
      const memVal = Array.isArray(topMem.value) ? topMem.value.join(', ') : topMem.value;
      signals.push({
        id: `sig_mem_${Date.now()}_4`,
        category: 'memory',
        signalText: `Informed by verified user memory preference ("${memVal}")`,
        source: topMem.source,
        confidence: topMem.confidence || 0.90
      });
    }

    // 5. Context Signal
    signals.push({
      id: `sig_ctx_${Date.now()}_5`,
      category: 'user_context',
      signalText: `Optimized for ${contextProfile.occasion} (${contextProfile.eventType.toUpperCase()} formality requirement: ${Math.round(contextProfile.formalityRequirement * 100)}%)`,
      source: 'Context Understanding Engine',
      confidence: contextProfile.confidenceScore
    });

    return signals;
  }

  /**
   * Constructs ARIA Reasoning Layer structured output (Task 3)
   */
  public static buildStructuredReasoning(
    title: string,
    summaryText: string,
    outfitComposition: OutfitComposition,
    ownedItemRatio: number,
    rationaleSignals: DecisionReasonSignal[],
    stylingAdvice: string,
    contextProfile: ContextProfile
  ): StructuredDecisionReasoning {
    const keyAdjustments: string[] = [];

    if (contextProfile.weatherCondition.temperatureC !== undefined && contextProfile.weatherCondition.temperatureC < 15) {
      keyAdjustments.push('Layered for cooler temperature protection');
    }
    if (contextProfile.formalityRequirement >= 0.75) {
      keyAdjustments.push('Elevated tailoring and crisp finish for formal setting');
    }
    if (ownedItemRatio >= 0.75) {
      keyAdjustments.push('Prioritizes existing owned wardrobe pieces');
    } else {
      keyAdjustments.push('Includes curated additions to bridge closet gap');
    }

    const contextMatchExplanation = `This recommendation achieves a ${Math.round(contextProfile.confidenceScore * 100)}% context alignment for ${contextProfile.occasion}, harmonizing weather suitability (${contextProfile.weatherCondition.condition || 'mild'}) and event formality requirements (${Math.round(contextProfile.formalityRequirement * 100)}%).`;

    return {
      recommendationTitle: title,
      summaryText,
      outfitComposition,
      ownedItemRatio: Number(ownedItemRatio.toFixed(2)),
      rationaleSignals,
      stylingAdvice,
      keyAdjustments,
      contextMatchExplanation
    };
  }
}
