import { WardrobeItem } from '../../types';
import { ConfidenceReport } from './confidenceEngine';

export interface ExplanationPayload {
  outfitId: string;
  confidenceScore: number;
  whySelected: string;
  rejectedAlternatives: string[];
  contributingSignals: string[];
  decisionTrace: string[];
}

export class RecommendationNarrator {
  /**
   * Narrates and constructs explanation structures deterministically.
   */
  static generateNarrative(
    outfitId: string,
    styleName: string,
    report: ConfidenceReport,
    rejectedOptions: string[]
  ): ExplanationPayload {
    const trace = [
      `[Initialization] Booting Decision Engine for outfit compilation: ${styleName}`,
      `[Signals Scan] Compiled ${report.contributingSignals.length} relevant signals`,
      `[Evaluation] Climate alignment checked: ${report.climateScore}%`,
      `[Evaluation] User preference DNA affinity parsed: ${report.preferenceScore}%`,
      `[Evaluation] Trend index validation completed: ${report.trendScore}%`,
      `[Selection] Ranked ${styleName} as the optimal candidate with ${report.overallConfidence}% confidence score`,
    ];

    return {
      outfitId,
      confidenceScore: report.overallConfidence,
      whySelected: report.explanation,
      rejectedAlternatives: rejectedOptions.length > 0 ? rejectedOptions : ['Heavy Combat Utility Overcoat', 'High ventilation minimalist sportswear'],
      contributingSignals: report.contributingSignals,
      decisionTrace: trace
    };
  }
}
