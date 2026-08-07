/**
 * ARIA v2.9 Agent Performance Analyzer
 * Product: LOOK VISION v2.4
 * 
 * Analyzes historical agent execution metrics, collaboration outcomes, confidence accuracy,
 * and user feedback correlation to update agent performance profiles.
 */

import { AgentPerformanceProfile, AgentLearningSignal } from './AdaptiveTypes';
import { AgentRole } from '../AgentTypes';
import { agentReliabilityEngine } from './AgentReliabilityEngine';
import { agentAdaptiveStorage } from './AgentAdaptiveStorage';

export class AgentPerformanceAnalyzer {
  private static instance: AgentPerformanceAnalyzer;

  private constructor() {}

  public static getInstance(): AgentPerformanceAnalyzer {
    if (!AgentPerformanceAnalyzer.instance) {
      AgentPerformanceAnalyzer.instance = new AgentPerformanceAnalyzer();
    }
    return AgentPerformanceAnalyzer.instance;
  }

  /**
   * Evaluates an agent's historical performance profile and applies learning signals
   */
  public async analyzePerformance(
    userId: string,
    agentRole: AgentRole,
    signals?: AgentLearningSignal[]
  ): Promise<AgentPerformanceProfile> {
    const currentProfile = await agentAdaptiveStorage.getPerformanceProfile(userId, agentRole);

    let updated = { ...currentProfile };

    if (signals && signals.length > 0) {
      signals.forEach((sig) => {
        if (sig.agentRole !== agentRole) return;

        switch (sig.signalType) {
          case 'ACCEPTED':
            updated.totalExecutions += 1;
            updated.successfulExecutions += 1;
            updated.userAcceptanceRate = Math.min(1.0, updated.userAcceptanceRate + 0.01);
            updated.confidenceAccuracy = Math.min(1.0, updated.confidenceAccuracy + 0.008);
            break;

          case 'REJECTED':
            updated.totalExecutions += 1;
            updated.userAcceptanceRate = Math.max(0.0, updated.userAcceptanceRate - 0.02);
            updated.confidenceAccuracy = Math.max(0.0, updated.confidenceAccuracy - 0.015);
            break;

          case 'MODIFIED':
            updated.totalExecutions += 1;
            updated.successfulExecutions += 1;
            updated.userAcceptanceRate = Math.min(1.0, updated.userAcceptanceRate + 0.002);
            break;

          case 'LATENCY_PENALTY':
            if (sig.value > 0) {
              updated.averageLatencyMs = Math.round((updated.averageLatencyMs * 0.8) + (sig.value * 0.2));
            }
            break;

          case 'CONFIDENCE_ACCURACY':
            updated.confidenceAccuracy = Math.min(1.0, Math.max(0.0, (updated.confidenceAccuracy * 0.85) + (sig.value * 0.15)));
            break;

          case 'COLLABORATION_HIGH_IMPACT':
            updated.collaborationValueScore = Math.min(1.0, updated.collaborationValueScore + 0.015);
            break;
        }
      });
    }

    // Recompute reliability score using formula
    updated.reliabilityScore = agentReliabilityEngine.calculateReliabilityScore(updated);
    updated.lastEvaluated = new Date().toISOString();

    // Persist updated profile
    await agentAdaptiveStorage.savePerformanceProfile(userId, updated);

    return updated;
  }
}

export const agentPerformanceAnalyzer = AgentPerformanceAnalyzer.getInstance();
