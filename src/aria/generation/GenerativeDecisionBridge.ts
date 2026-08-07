/**
 * ARIA v3.1 Generative Decision Bridge
 * Product: LOOK VISION v2.4
 * 
 * Connects generated creative concepts and capsule directions into Decision Engine context
 * without modifying existing Decision Engine scoring mathematics.
 */

import { FashionConcept } from './GenerativeTypes';
import { DecisionEngine } from '../decision/DecisionEngine';
import { FashionRecommendation, DecisionQueryRequest } from '../decision/DecisionTypes';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class GenerativeDecisionBridge {
  private static instance: GenerativeDecisionBridge;

  private constructor() {}

  public static getInstance(): GenerativeDecisionBridge {
    if (!GenerativeDecisionBridge.instance) {
      GenerativeDecisionBridge.instance = new GenerativeDecisionBridge();
    }
    return GenerativeDecisionBridge.instance;
  }

  /**
   * Generates a Decision Engine recommendation contextualized by an ARIA Generative Concept
   */
  public async evaluateConceptInDecisionEngine(
    concept: FashionConcept,
    queryRequest?: Partial<DecisionQueryRequest>
  ): Promise<FashionRecommendation> {
    const startTime = performance.now();
    const userId = concept.userId || 'guest_user';

    const augmentedPrompt = `${queryRequest?.userPrompt || concept.title} [Concept Theme: "${concept.aestheticTheme}", Items: ${concept.outfitItems.map((i) => i.description).join('; ')}]`;

    const fullRequest: DecisionQueryRequest = {
      userId,
      userPrompt: augmentedPrompt,
      occasion: queryRequest?.occasion || 'Concept Validation',
      weatherContext: queryRequest?.weatherContext || 'Mild',
      temperatureC: queryRequest?.temperatureC || 20
    };

    const recommendation = await DecisionEngine.getInstance().generateRecommendation(fullRequest);

    // Inject generative concept reasoning signal
    if (recommendation.reasonSignals) {
      recommendation.reasonSignals.push({
        id: `sig_gen_${Date.now()}`,
        category: 'style_dna',
        signalText: `Generative Creative Concept Alignment: ${concept.title} (Confidence: ${concept.confidence.finalCreativeConfidence}%)`,
        source: 'ARIA Generative Fashion Engine',
        confidence: concept.confidence.finalCreativeConfidence / 100
      });
    }

    const latencyMs = Math.round(performance.now() - startTime);

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'GenerativeDecisionBridge',
        eventName: 'GENERATIVE_CONCEPT_EVALUATED',
        category: 'Decision',
        payload: `Evaluated creative concept "${concept.title}" in Decision Engine with confidence ${concept.confidence.finalCreativeConfidence}%`,
        latencyMs,
        status: 'Success'
      });
    } catch (_) {}

    return recommendation;
  }
}

export const generativeDecisionBridge = GenerativeDecisionBridge.getInstance();
