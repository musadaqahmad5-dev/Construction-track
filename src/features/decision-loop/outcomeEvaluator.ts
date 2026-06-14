import { DecisionTracker, DecisionOutcomeRecord } from './decisionTracker';
import { FeedbackInterpreter } from './feedbackInterpreter';

export interface EvaluationReport {
  userId: string;
  recommendationOutcomeScore: number; // 0 to 100 overall score
  score?: number;                     // fallback alias matching TodaySuggestionCard TS usages
  totalDecisionsMeasured: number;
  acceptanceRate: number;            // percentage of positive outcomes
  rejectionRate: number;             // percentage of negative outcomes
  frequencyOfWornOutfits: number;    // times user set outfits as "worn"
  averageTimeToDecisionMs: number;   // average decision latency in ms
  retrospectiveConfidenceAvg: number;// derived average confidence of resolved choices
}

export class OutcomeEvaluator {
  /**
   * Computes the robust 'recommendationOutcomeScore' for a given user.
   * Weighs acceptance patterns, wear repeats, deliberation delays, and blacklist triggers.
   */
  static async evaluateUserPerformance(userId: string): Promise<EvaluationReport> {
    const defaultReport: EvaluationReport = {
      userId,
      recommendationOutcomeScore: 70, // Trusting default score
      score: 70,
      totalDecisionsMeasured: 0,
      acceptanceRate: 0,
      rejectionRate: 0,
      frequencyOfWornOutfits: 0,
      averageTimeToDecisionMs: 0,
      retrospectiveConfidenceAvg: 75
    };

    const outcomes = await DecisionTracker.getOutcomes(userId, 50);
    if (!outcomes || outcomes.length === 0) {
      return defaultReport;
    }

    let acceptCounts = 0;
    let rejectCounts = 0;
    let wornCounts = 0;
    let totalTime = 0;
    let timedDecisions = 0;
    let successSum = 0;

    outcomes.forEach(record => {
      const weight = FeedbackInterpreter.interpretActionWeight(record.action);
      
      // Accumulate successes (any weight >= 0.8 is positive)
      if (weight >= 0.8) {
        acceptCounts++;
        if (record.action === 'worn') {
          wornCounts++;
        }
      } else if (weight < 0) {
        rejectCounts++;
      }

      if (record.timeToDecisionMs) {
        totalTime += record.timeToDecisionMs;
        timedDecisions++;
      }

      // Convert weight [-1, 1] to positive system index [0, 100]
      const positiveOffset = ((weight + 1) / 2) * 100;
      successSum += positiveOffset;
    });

    const totalCount = outcomes.length;
    const acceptanceRate = Math.round((acceptCounts / totalCount) * 100);
    const rejectionRate = Math.round((rejectCounts / totalCount) * 100);
    const averageTime = timedDecisions > 0 ? Math.round(totalTime / timedDecisions) : 4500;

    // Time-to-selection penalty factor (more hesitation lowers performance slightly)
    const speedPenalty = averageTime > 12000 ? Math.min(15, (averageTime - 12000) / 1000) : 0;

    // Calculate composite Outcome Score [0, 100]
    const baseOutcomeVal = successSum / totalCount;
    // Add bonus rewards for repeat user wears and saves
    const wearBonus = Math.min(10, wornCounts * 1.5);
    const finalOutcomeScore = Math.round(Math.max(0, Math.min(100, baseOutcomeVal + wearBonus - speedPenalty)));

    return {
      userId,
      recommendationOutcomeScore: finalOutcomeScore,
      score: finalOutcomeScore,
      totalDecisionsMeasured: totalCount,
      acceptanceRate,
      rejectionRate,
      frequencyOfWornOutfits: wornCounts,
      averageTimeToDecisionMs: averageTime,
      retrospectiveConfidenceAvg: Math.round(baseOutcomeVal)
    };
  }
}
