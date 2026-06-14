import { ConfidencePayload } from './confidenceCalculator';

export class ConfidenceExplainer {
  /**
   * Compiles natural, non-technical explanations reflecting the trust index.
   */
  static compileExplanation(payload: ConfidencePayload): string {
    const { predictionConfidence, uncertainty, trustScore, fallbackIndicators } = payload;
    const reasons: string[] = [];

    if (fallbackIndicators.hasEmptyCloset) {
      return "Critical Warning: No clothing item metadata found. Add garments to launch prediction cycles.";
    }

    // Evaluate Trust level
    if (trustScore >= 0.85) {
      reasons.push("Perfect Affinity: Heavily prioritized using your favorite colors and style vibe preferences.");
    } else if (trustScore >= 0.65) {
      reasons.push("Balanced Selection: Standard coordinate alignment matching neutral color ranges.");
    } else {
      reasons.push("Exploratory Advice: Stepping slightly outside usual patterns to refresh style choices.");
    }

    // Evaluate Uncertainty concerns
    if (uncertainty > 0.45) {
      reasons.push("Elevated Situational Uncertainty: Extreme weather conditions require careful layered insulation.");
    }

    // Handle Fallbacks
    if (fallbackIndicators.isOffline) {
      reasons.push("Deterministic Mode on: Running local matching rules as API server is currently offline.");
    }

    const confidencePercentage = Math.round(predictionConfidence * 100);
    return `Model Confidence is ${confidencePercentage}% with transparent details: ${reasons.join(' | ')}`;
  }
}
