/**
 * ARIA v3.2 Vision Decision Bridge
 * Product: LOOK VISION v2.4
 * 
 * Bridges visual fashion perception with DecisionEngine, RecommendationEngine,
 * and GenerativeFashionEngine to produce multimodal visual-context recommendations.
 */

import { VisualFashionAnalysis } from './VisionTypes';
import { DecisionEngine } from '../decision/DecisionEngine';
import { FashionRecommendation, DecisionQueryRequest } from '../decision/DecisionTypes';
import { generativeFashionEngine } from '../generation/GenerativeFashionEngine';
import { FashionConcept } from '../generation/GenerativeTypes';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class VisionDecisionBridge {
  private static instance: VisionDecisionBridge;

  private constructor() {}

  public static getInstance(): VisionDecisionBridge {
    if (!VisionDecisionBridge.instance) {
      VisionDecisionBridge.instance = new VisionDecisionBridge();
    }
    return VisionDecisionBridge.instance;
  }

  /**
   * Evaluates a Visual Fashion Analysis inside the Decision Engine to produce a multimodal recommendation
   */
  public async evaluateVisualInDecisionEngine(
    visualAnalysis: VisualFashionAnalysis,
    queryRequest?: Partial<DecisionQueryRequest>
  ): Promise<FashionRecommendation> {
    const startTime = performance.now();
    const userId = visualAnalysis.userId || 'guest_user';

    const promptContext = `Visual Analysis of "${visualAnalysis.imageName}": Detected ${visualAnalysis.garments.length} garments (${visualAnalysis.garments.map((g) => g.name).join(', ')}). Dominant Palette: ${visualAnalysis.outfitProfile.colorHarmony.dominantColors.map((c) => c.colorName).join(', ')}. Aesthetics: ${visualAnalysis.visualEmbedding.aestheticTag}.`;

    const request: DecisionQueryRequest = {
      userId,
      userPrompt: `${queryRequest?.userPrompt || 'Evaluate visual outfit harmony'} [${promptContext}]`,
      occasion: queryRequest?.occasion || 'Visual Style Validation',
      weatherContext: queryRequest?.weatherContext || 'Mild',
      temperatureC: queryRequest?.temperatureC || 20
    };

    const recommendation = await DecisionEngine.getInstance().generateRecommendation(request);

    // Inject visual reasoning signal into recommendation
    if (recommendation.reasonSignals) {
      recommendation.reasonSignals.push({
        id: `sig_vis_${Date.now()}`,
        category: 'style_dna',
        signalText: `Visual Outfit Harmony Score: ${Math.round(visualAnalysis.outfitProfile.overallHarmonyScore * 100)}% (${visualAnalysis.outfitProfile.proportion})`,
        source: 'ARIA Visual Fashion Intelligence Engine',
        confidence: visualAnalysis.confidence.finalVisualConfidence / 100
      });
    }

    const latencyMs = Math.round(performance.now() - startTime);

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'VisionDecisionBridge',
        eventName: 'VISUAL_DECISION_EVALUATION_COMPLETED',
        category: 'Decision',
        payload: `Evaluated visual analysis "${visualAnalysis.analysisId}" in Decision Engine with confidence ${visualAnalysis.confidence.finalVisualConfidence}%`,
        latencyMs,
        status: 'Success'
      });
    } catch (_) {}

    return recommendation;
  }

  /**
   * Generates a generative fashion concept based on a visual fashion analysis
   */
  public async generateConceptFromVisual(
    visualAnalysis: VisualFashionAnalysis
  ): Promise<FashionConcept> {
    const userId = visualAnalysis.userId || 'guest_user';

    const concept = await generativeFashionEngine.generateConcept({
      userId,
      userPrompt: `Bespoke concept derived from visual analysis "${visualAnalysis.imageName}" featuring ${visualAnalysis.outfitProfile.composition}`,
      occasion: 'Visual Concept Synthesis',
      season: 'Autumn/Winter'
    });

    return concept;
  }
}

export const visionDecisionBridge = VisionDecisionBridge.getInstance();
