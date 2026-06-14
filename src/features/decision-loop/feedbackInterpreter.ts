import { OutcomeAction } from './decisionTracker';

export class FeedbackInterpreter {
  /**
   * Translates client gestures and interaction feedback actions into direct numerical values.
   * Helps normalize user intent parameters for unified learning weights.
   */
  static interpretActionWeight(action: OutcomeAction): number {
    switch (action) {
      case 'worn':
        return 1.0; // Ultimate success: garment was physically selected and worn.
      case 'shared':
        return 0.9; // Sharing is a high-validation social signal.
      case 'saved':
        return 0.85; // Saving lookbooks signifies aesthetic appreciation.
      case 'accepted':
        return 0.8; // Simple virtual accept check.
      case 'viewed':
        return 0.2; // Minor engagement, user did not swipe away immediately.
      case 'abandoned':
        return 0.0; // Neutral decay.
      case 'rejected':
        return -1.0; // Negative reinforcement score signal.
      default:
        return 0.0;
    }
  }

  /**
   * Assesses dynamic uncertainty levels based on interaction parameters like deliberation times.
   */
  static measureDeliberationUncertainty(timeToDecisionMs?: number): number {
    if (!timeToDecisionMs) return 0.5; // Average uncertainty default
    // If user takes more than 15 seconds to select an outfit, they display high selection hesitation
    if (timeToDecisionMs > 15000) {
      return Math.min(0.8, 0.4 + (timeToDecisionMs - 15000) / 100000);
    }
    // Instant interaction (<3 seconds) denotes strong conviction
    if (timeToDecisionMs < 3000) {
      return 0.1;
    }
    return 0.3;
  }
}
