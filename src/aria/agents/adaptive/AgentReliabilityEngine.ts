/**
 * ARIA v2.9 Agent Reliability Scoring Engine
 * Product: LOOK VISION v2.4
 * 
 * Computes deterministic reliability scores (0-100) for specialized ARIA agents
 * based on Execution Success (30%), Confidence Accuracy (25%), User Acceptance (25%),
 * Performance Speed (10%), and Collaboration Value (10%).
 */

import { AgentPerformanceProfile } from './AdaptiveTypes';

export class AgentReliabilityEngine {
  private static instance: AgentReliabilityEngine;

  private constructor() {}

  public static getInstance(): AgentReliabilityEngine {
    if (!AgentReliabilityEngine.instance) {
      AgentReliabilityEngine.instance = new AgentReliabilityEngine();
    }
    return AgentReliabilityEngine.instance;
  }

  /**
   * Calculates controlled 0-100 reliability score
   */
  public calculateReliabilityScore(profile: AgentPerformanceProfile): number {
    if (!profile || profile.totalExecutions === 0) {
      return 85; // baseline initialization score
    }

    // 1. Execution Success Rate (30%)
    const successRatio = Math.min(1.0, Math.max(0.0, profile.successfulExecutions / profile.totalExecutions));
    const successFactor = successRatio * 0.30;

    // 2. Confidence Accuracy (25%)
    const confAccRatio = Math.min(1.0, Math.max(0.0, profile.confidenceAccuracy));
    const confAccFactor = confAccRatio * 0.25;

    // 3. User Acceptance Rate (25%)
    const userAccRatio = Math.min(1.0, Math.max(0.0, profile.userAcceptanceRate));
    const userAccFactor = userAccRatio * 0.25;

    // 4. Performance Speed / Latency Factor (10%)
    // Benchmark: <= 150ms is 1.0, >= 650ms is 0.0
    const rawLatency = profile.averageLatencyMs || 200;
    const speedRatio = Math.min(1.0, Math.max(0.0, 1.0 - (rawLatency - 150) / 500));
    const speedFactor = speedRatio * 0.10;

    // 5. Collaboration Value Score (10%)
    const collabRatio = Math.min(1.0, Math.max(0.0, profile.collaborationValueScore));
    const collabFactor = collabRatio * 0.10;

    // Combined Score [0 - 1.0] -> [0 - 100]
    const combined = (successFactor + confAccFactor + userAccFactor + speedFactor + collabFactor) * 100;

    return Math.min(100, Math.max(1, Math.round(combined)));
  }
}

export const agentReliabilityEngine = AgentReliabilityEngine.getInstance();
