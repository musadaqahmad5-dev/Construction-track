import { DecisionTracker } from '../decision-loop/decisionTracker';

export interface VariantMetric {
  variantId: string;
  totalImpressions: number;
  totalAccepts: number;
  totalSaves: number;
  totalWorns: number;
  conversionRate: number; // Conversion = (Accepts + Saves + Worns) / Impressions
}

export interface ExperimentSummary {
  experimentId: string;
  metrics: VariantMetric[];
  winnerVariantId?: string;
}

export class MetricsCollector {
  /**
   * Evaluates the conversion rates for active experiments.
   */
  static async computeExperimentMetrics(userId: string, experimentId: string): Promise<ExperimentSummary> {
    const outcomes = await DecisionTracker.getOutcomes(userId, 100);

    // Filter relevant outcomes matching experimentId
    const relevantOutcomes = outcomes.filter(o => o.variantId && o.variantId.includes(experimentId));

    const metricsMap: Record<string, { impressions: number; accepts: number; saves: number; worns: number }> = {
      'control_A': { impressions: 0, accepts: 0, saves: 0, worns: 0 },
      'treatment_B': { impressions: 0, accepts: 0, saves: 0, worns: 0 }
    };

    // Process logs to group under experiment bounds
    relevantOutcomes.forEach(o => {
      const variant = o.variantId?.split(':')[1] || 'control_A';
      if (metricsMap[variant]) {
        metricsMap[variant].impressions++;
        if (o.action === 'accepted') metricsMap[variant].accepts++;
        if (o.action === 'saved') metricsMap[variant].saves++;
        if (o.action === 'worn') metricsMap[variant].worns++;
      }
    });

    const metrics: VariantMetric[] = Object.entries(metricsMap).map(([variantId, raw]) => {
      const conversions = raw.accepts + raw.saves + raw.worns;
      const conversionRate = raw.impressions > 0 ? Math.round((conversions / raw.impressions) * 100) : 0;
      return {
        variantId,
        totalImpressions: raw.impressions,
        totalAccepts: raw.accepts,
        totalSaves: raw.saves,
        totalWorns: raw.worns,
        conversionRate
      };
    });

    const control = metrics.find(m => m.variantId === 'control_A');
    const treatment = metrics.find(m => m.variantId === 'treatment_B');
    let winner: string | undefined;

    if (control && treatment && (control.totalImpressions > 0 || treatment.totalImpressions > 0)) {
      if (treatment.conversionRate > control.conversionRate) {
        winner = 'treatment_B';
      } else if (control.conversionRate > treatment.conversionRate) {
        winner = 'control_A';
      }
    }

    return {
      experimentId,
      metrics,
      winnerVariantId: winner
    };
  }
}
