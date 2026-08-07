/**
 * ARIA v3.0 Future Decision Bridge
 * Product: LOOK VISION v2.4
 * 
 * Bridges Predictive Intelligence & Future Simulations into the Decision Engine
 * without modifying existing scoring algorithms.
 */

import { SimulationScenario } from './PredictiveTypes';
import { DecisionEngine } from '../decision/DecisionEngine';
import { FashionRecommendation, DecisionQueryRequest } from '../decision/DecisionTypes';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class FutureDecisionBridge {
  private static instance: FutureDecisionBridge;

  private constructor() {}

  public static getInstance(): FutureDecisionBridge {
    if (!FutureDecisionBridge.instance) {
      FutureDecisionBridge.instance = new FutureDecisionBridge();
    }
    return FutureDecisionBridge.instance;
  }

  /**
   * Generates future-contextualized recommendations by augmenting decision queries with prediction signals
   */
  public async generatePredictiveRecommendation(
    queryRequest: DecisionQueryRequest,
    scenario: SimulationScenario
  ): Promise<FashionRecommendation> {
    const startTime = performance.now();
    const userId = queryRequest.userId || scenario.userId || 'guest_user';

    // Augment prompt with predictive context signals
    const predictivePrompt = `${queryRequest.userPrompt || 'Future-proof outfit recommendation'} [Future Forecast (${scenario.timeHorizonMonths}m): Archetype "${scenario.stylePrediction.predictedArchetype}", Top Trend "${scenario.trendForecasts[0]?.trendName || 'Quiet Luxury'}"]`;

    const augmentedQuery: DecisionQueryRequest = {
      ...queryRequest,
      userPrompt: predictivePrompt,
      userId
    };

    // Execute Decision Engine without changing underlying scoring math
    const recommendation = await DecisionEngine.getInstance().generateRecommendation(augmentedQuery);

    // Inject predictive reasoning signal into reasonSignals
    if (recommendation.reasonSignals) {
      recommendation.reasonSignals.push({
        id: `sig_future_${Date.now()}`,
        category: 'style_dna',
        signalText: `Predictive Alignment (${scenario.timeHorizonMonths} Months): Designed for transition toward ${scenario.stylePrediction.predictedArchetype}`,
        source: 'ARIA Future Simulation Engine',
        confidence: scenario.confidence.finalPredictionConfidence / 100
      });
    }

    const latencyMs = Math.round(performance.now() - startTime);

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'FutureDecisionBridge',
        eventName: 'PREDICTIVE_RECOMMENDATION_GENERATED',
        category: 'Decision',
        payload: `Generated future-contextualized decision for ${scenario.timeHorizonMonths}-month horizon (Confidence: ${scenario.confidence.finalPredictionConfidence}%)`,
        latencyMs,
        status: 'Success'
      });
    } catch (_) {}

    return recommendation;
  }
}

export const futureDecisionBridge = FutureDecisionBridge.getInstance();
