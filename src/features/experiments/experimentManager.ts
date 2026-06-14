import { VariantSelector, ExperimentVariant } from './variantSelector';

export interface ActiveExperiment {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'ended';
  variants: string[];
}

export class ExperimentManager {
  private static readonly RUNNING_EXPERIMENTS: ActiveExperiment[] = [
    {
      id: 'scoring_engine_tuning',
      name: 'Dynamic Scorer v2 VS Classic Weights',
      description: 'Tests whether prioritizing user favored colors yields elevated acceptance results.',
      status: 'active',
      variants: ['control_A', 'treatment_B']
    },
    {
      id: 'prompt_vibe_test',
      name: 'Sartorial Language Model Vibe Tuning',
      description: 'Evaluates if high-fashion elegant editorial tone increases lookbook saves.',
      status: 'active',
      variants: ['control_A', 'treatment_B']
    }
  ];

  /**
   * Retrieves active experiments registered.
   */
  static getExperiments(): ActiveExperiment[] {
    return this.RUNNING_EXPERIMENTS;
  }

  /**
   * Evaluates and assigns the current user to a specific running campaign.
   */
  static getAssignment(userId: string, experimentId: string): ExperimentVariant {
    const experiment = this.RUNNING_EXPERIMENTS.find(e => e.id === experimentId);
    if (!experiment || experiment.status !== 'active') {
      return {
        experimentId,
        variantId: 'control_A',
        strategyName: 'ClassicWeights'
      };
    }
    return VariantSelector.selectVariant(userId, experimentId);
  }
}
