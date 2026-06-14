import { StyleExplanation } from './decisionNarrator';

export class AgentSummary {
  /**
   * Summarizes current style narrative statuses.
   */
  static getAgentSummary(explanations: StyleExplanation[]) {
    if (explanations.length === 0) {
      return {
        dominantVibe: 'Classic Minimalist',
        averageConfidence: 95,
        narration: 'Your smart styling agent is idling. Add wardrobe items to begin automated curation.'
      };
    }

    const totalConfidence = explanations.reduce((acc, e) => acc + e.confidence, 0);
    const averageConfidence = Math.round(totalConfidence / explanations.length);

    return {
      dominantVibe: 'Scandi Technical Modernism',
      averageConfidence,
      narration: `The companion has successfully mapped style narratives across ${explanations.length} clothing item divisions with an average precision rating of ${averageConfidence}%.`
    };
  }
}
