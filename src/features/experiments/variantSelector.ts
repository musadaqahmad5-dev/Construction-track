export interface ExperimentVariant {
  experimentId: string;
  variantId: 'control_A' | 'treatment_B';
  strategyName: 'ClassicWeights' | 'DynamicScoringV2' | 'ExperimentalPromptSartorial';
}

export class VariantSelector {
  /**
   * Selection bucket algorithm.
   * Maps user ID values to Control A or Treatment B experiments consistently.
   */
  static selectVariant(userId: string, experimentId: string): ExperimentVariant {
    // Basic deterministic hash from input string
    let hashSum = 0;
    const key = `${userId}_${experimentId}`;
    for (let i = 0; i < key.length; i++) {
      hashSum += key.charCodeAt(i);
    }

    const isTreatment = hashSum % 2 === 1;
    const variantId = isTreatment ? 'treatment_B' : 'control_A';

    let strategyName: 'ClassicWeights' | 'DynamicScoringV2' | 'ExperimentalPromptSartorial';
    if (experimentId === 'prompt_vibe_test') {
      strategyName = isTreatment ? 'ExperimentalPromptSartorial' : 'ClassicWeights';
    } else {
      strategyName = isTreatment ? 'DynamicScoringV2' : 'ClassicWeights';
    }

    return {
      experimentId,
      variantId,
      strategyName
    };
  }
}
