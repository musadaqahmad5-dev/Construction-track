import { getExperimentsState } from './experimentEngine';

export interface VariantAnalysisResult {
  variantId: string;
  label: string;
  conversions: number;
  impressions: number;
  conversionRate: number;
  conversionLift: number; // vs control
  zScore: number;
  isSignificant: boolean;
}

export interface ExperimentAnalysisReport {
  experimentId: string;
  name: string;
  controlRate: number;
  bestVariantId: string;
  reportNotes: string;
  results: VariantAnalysisResult[];
}

export class ResultAnalyzer {
  /**
   * Evaluates conversion metrics across experimental variants to identify statistically superior candidates
   */
  static analyzeExperiment(experimentId: string): ExperimentAnalysisReport | null {
    const experiments = getExperimentsState();
    const experiment = experiments.find(exp => exp.id === experimentId);

    if (!experiment) return null;

    const controlVariant = experiment.variants.find(v => v.id === 'control');
    const controlRate = controlVariant && controlVariant.impressions > 0
      ? controlVariant.conversions / controlVariant.impressions
      : 0;

    let bestVariantId = 'control';
    let highestRate = controlRate;

    const results: VariantAnalysisResult[] = experiment.variants.map(variant => {
      const conversionRate = variant.impressions > 0 ? variant.conversions / variant.impressions : 0;
      
      // Calculate conversion lift (%) vs control
      const conversionLift = controlRate > 0 ? (conversionRate - controlRate) / controlRate : 0;

      // Calculate simplified Z-score for two proportions
      // z = (p1 - p2) / sqrt( p * (1-p) * (1/n1 + 1/n2) )
      let zScore = 0;
      if (variant.id !== 'control' && controlVariant && controlVariant.impressions > 0 && variant.impressions > 0) {
        const p1 = controlRate;
        const p2 = conversionRate;
        const totalConversions = controlVariant.conversions + variant.conversions;
        const totalImpressions = controlVariant.impressions + variant.impressions;
        const poolP = totalConversions / totalImpressions;

        if (poolP > 0 && poolP < 1) {
          const standardError = Math.sqrt(poolP * (1 - poolP) * (1 / controlVariant.impressions + 1 / variant.impressions));
          zScore = (p2 - p1) / standardError;
        }
      }

      // 95% Confidence threshold corresponds to Z-Score absolute magnitude > 1.96
      const isSignificant = Math.abs(zScore) >= 1.96;

      if (conversionRate > highestRate) {
        highestRate = conversionRate;
        bestVariantId = variant.id;
      }

      return {
        variantId: variant.id,
        label: variant.label,
        conversions: variant.conversions,
        impressions: variant.impressions,
        conversionRate: parseFloat(conversionRate.toFixed(3)),
        conversionLift: parseFloat((conversionLift * 100).toFixed(2)),
        zScore: parseFloat(zScore.toFixed(3)),
        isSignificant
      };
    });

    let reportNotes = 'No statistically significant differences detected yet. Recommend continuing data collection.';
    if (results.some(r => r.isSignificant && r.conversionLift > 0)) {
      const sigV = results.find(r => r.isSignificant && r.conversionLift > 0);
      reportNotes = `Variant "${sigV?.label}" shows a statistically significant lift of +${sigV?.conversionLift}% with 95% confidence. Recommendation: Promote to 100% rollout.`;
    }

    return {
      experimentId,
      name: experiment.name,
      controlRate: parseFloat(controlRate.toFixed(3)),
      bestVariantId,
      reportNotes,
      results
    };
  }
}
