export interface AuditResult {
  meanScore: number;
  medianScore: number;
  variance: number;
  standardDeviation: number;
  confidenceLowerBound: number;
  confidenceUpperBound: number;
  outliersDetectedCount: number;
  auditStatus: 'optimal' | 'recalibrate' | 'critical-variance';
}

export class ConfidenceAudit {
  /**
   * Evaluates historical scores to measure the mathematical consistency of design recommends
   */
  static runAudit(scores: number[]): AuditResult {
    if (scores.length === 0) {
      return {
        meanScore: 0, medianScore: 0, variance: 0, standardDeviation: 0,
        confidenceLowerBound: 0, confidenceUpperBound: 0, outliersDetectedCount: 0,
        auditStatus: 'optimal'
      };
    }

    // Sort to determine Median
    const sorted = [...scores].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const medianScore = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Mean
    const meanScore = scores.reduce((sum, val) => sum + val, 0) / scores.length;

    // Variance & StdDev
    const squareDiffs = scores.map(v => Math.pow(v - meanScore, 2));
    const variance = squareDiffs.reduce((sum, val) => sum + val, 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);

    // 95% Confidence Interval
    // standard margin of error = Z * (stdDev / sqrt(N)) where Z = 1.96
    const marginOfError = scores.length > 1 ? 1.96 * (standardDeviation / Math.sqrt(scores.length)) : 0;
    const confidenceLowerBound = Math.max(0, meanScore - marginOfError);
    const confidenceUpperBound = Math.min(1.0, meanScore + marginOfError);

    // Outliers checking (values situated further than 2 standard deviations away)
    const outliers = scores.filter(v => Math.abs(v - meanScore) > 2 * standardDeviation);

    // Determine Status
    let auditStatus: 'optimal' | 'recalibrate' | 'critical-variance' = 'optimal';
    if (standardDeviation > 0.18) {
      auditStatus = 'critical-variance';
    } else if (standardDeviation > 0.10) {
      auditStatus = 'recalibrate';
    }

    return {
      meanScore: parseFloat(meanScore.toFixed(3)),
      medianScore: parseFloat(medianScore.toFixed(3)),
      variance: parseFloat(variance.toFixed(4)),
      standardDeviation: parseFloat(standardDeviation.toFixed(3)),
      confidenceLowerBound: parseFloat(confidenceLowerBound.toFixed(3)),
      confidenceUpperBound: parseFloat(confidenceUpperBound.toFixed(3)),
      outliersDetectedCount: outliers.length,
      auditStatus
    };
  }
}
