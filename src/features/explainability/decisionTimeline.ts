import { ExplanationPayload } from './recommendationNarrator';

export class DecisionTimeline {
  private static decisionHistory: ExplanationPayload[] = [];

  static recordDecision(payload: ExplanationPayload) {
    // Keep last 15 decisions in running history trace
    this.decisionHistory.unshift(payload);
    if (this.decisionHistory.length > 15) {
      this.decisionHistory.pop();
    }
  }

  static getTimeline(): ExplanationPayload[] {
    return this.decisionHistory;
  }

  static clearTimeline() {
    this.decisionHistory = [];
  }
}
