/**
 * ARIA v2.9 Agent Learning Bridge
 * Product: LOOK VISION v2.4
 * 
 * Bridges user feedback events, collaboration evaluation metrics, and agent reliability updates.
 * Ingests learning signals into performance profiles without modifying underlying decision algorithms.
 */

import { AgentLearningSignal, SignalType } from './AdaptiveTypes';
import { AgentRole } from '../AgentTypes';
import { agentPerformanceAnalyzer } from './AgentPerformanceAnalyzer';
import { agentAdaptiveStorage } from './AgentAdaptiveStorage';
import { EnterpriseObservabilityEngine } from '../../../engine/observabilityEngine';

export class AgentLearningBridge {
  private static instance: AgentLearningBridge;

  private constructor() {}

  public static getInstance(): AgentLearningBridge {
    if (!AgentLearningBridge.instance) {
      AgentLearningBridge.instance = new AgentLearningBridge();
    }
    return AgentLearningBridge.instance;
  }

  /**
   * Ingests a user feedback event or collaboration outcome and converts it into agent learning signals
   */
  public async ingestFeedbackSignal(
    userId: string,
    eventData: {
      eventType: 'outfit_like' | 'outfit_dislike' | 'creation_saved' | 'rec_rejected' | 'collaboration_completed';
      participatingAgents?: AgentRole[];
      collaborationScore?: number;
      latencyMs?: number;
      itemId?: string;
    }
  ): Promise<AgentLearningSignal[]> {
    const timestamp = new Date().toISOString();
    const agents = eventData.participatingAgents && eventData.participatingAgents.length > 0
      ? eventData.participatingAgents
      : (['PERSONAL_STYLIST', 'WARDROBE_OPTIMIZER', 'FASHION_HISTORIAN'] as AgentRole[]);

    const signals: AgentLearningSignal[] = [];

    let signalType: SignalType = 'ACCEPTED';
    let signalValue = 0.05;

    if (eventData.eventType === 'outfit_like' || eventData.eventType === 'creation_saved') {
      signalType = 'ACCEPTED';
      signalValue = 0.08;
    } else if (eventData.eventType === 'outfit_dislike' || eventData.eventType === 'rec_rejected') {
      signalType = 'REJECTED';
      signalValue = -0.10;
    } else if (eventData.eventType === 'collaboration_completed') {
      if ((eventData.collaborationScore || 0) >= 85) {
        signalType = 'COLLABORATION_HIGH_IMPACT';
        signalValue = 0.05;
      }
    }

    for (const role of agents) {
      const signalId = `sig_${Date.now()}_${role}_${Math.random().toString(36).substring(2, 6)}`;
      const signal: AgentLearningSignal = {
        signalId,
        agentRole: role,
        source: eventData.eventType === 'collaboration_completed' ? 'COLLABORATION_RESULT' : 'USER_FEEDBACK',
        signalType,
        value: signalValue,
        timestamp,
        userId,
        context: {
          eventType: eventData.eventType,
          collaborationScore: eventData.collaborationScore,
          latencyMs: eventData.latencyMs,
          itemId: eventData.itemId
        }
      };

      signals.push(signal);

      // Persist signal
      await agentAdaptiveStorage.saveLearningSignal(userId, signal);

      // Trigger performance analyzer pass
      await agentPerformanceAnalyzer.analyzePerformance(userId, role, [signal]);
    }

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'AgentLearningBridge',
        eventName: 'AGENT_LEARNING_SIGNAL_INGESTED',
        category: 'Learning',
        payload: `Ingested ${signals.length} learning signals (${signalType}) for user ${userId}`,
        latencyMs: 15,
        status: 'Success'
      });
    } catch (_) {}

    return signals;
  }
}

export const agentLearningBridge = AgentLearningBridge.getInstance();
