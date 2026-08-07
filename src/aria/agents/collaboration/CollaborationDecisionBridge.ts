/**
 * ARIA v2.8 Collaboration Decision Bridge
 * Product: LOOK VISION v2.4
 * 
 * Bridges the Agent Collaboration Layer with the Decision Engine.
 * Enhances Decision Query contexts with multi-agent collective intelligence signals
 * without modifying existing decision scoring algorithms.
 */

import { agentCollaborationManager } from './AgentCollaborationManager';
import { CollectiveDecision, AgentCollaborationRequest } from './CollaborationTypes';
import { DecisionEngine } from '../../decision/DecisionEngine';
import { FashionRecommendation, DecisionQueryRequest } from '../../decision/DecisionTypes';
import { EnterpriseObservabilityEngine } from '../../../engine/observabilityEngine';

export class CollaborationDecisionBridge {
  private static instance: CollaborationDecisionBridge;

  private constructor() {}

  public static getInstance(): CollaborationDecisionBridge {
    if (!CollaborationDecisionBridge.instance) {
      CollaborationDecisionBridge.instance = new CollaborationDecisionBridge();
    }
    return CollaborationDecisionBridge.instance;
  }

  /**
   * Executes multi-agent collaboration and bridges collective intelligence into Decision Engine query
   */
  public async generateCollaborativeRecommendation(
    queryRequest: DecisionQueryRequest
  ): Promise<{ recommendation: FashionRecommendation; collectiveDecision: CollectiveDecision }> {
    const startTime = performance.now();
    const userId = queryRequest.userId || 'guest_user';
    const objective = queryRequest.userPrompt || `Generate optimal collaborative outfit for ${queryRequest.occasion || 'style query'}`;

    // 1. Prepare Agent Collaboration Request
    const collabRequest: AgentCollaborationRequest = {
      requestId: `bridge_${Date.now()}`,
      objective,
      context: {
        userPrompt: queryRequest.userPrompt,
        occasion: queryRequest.occasion,
        eventType: queryRequest.eventType,
        season: queryRequest.season,
        weatherContext: queryRequest.weatherContext,
        userGoals: queryRequest.userGoals,
        preferredPalette: queryRequest.preferredPalette
      },
      userId
    };

    // 2. Run Multi-Agent Collaboration
    const collectiveDecision = await agentCollaborationManager.initializeCollaboration(collabRequest);

    // 3. Construct Enhanced Decision Context
    const enhancedQueryRequest: DecisionQueryRequest = {
      ...queryRequest,
      userPrompt: `${objective} [Collective Intelligence: ${collectiveDecision.reasoningSummary}]`
    };

    // 4. Pass through Decision Engine (without altering scoring logic)
    const recommendation = await DecisionEngine.getInstance().generateRecommendation(enhancedQueryRequest);

    // 5. Inject Collective Decision Signals into recommendation reason signals
    if (recommendation.reasonSignals) {
      recommendation.reasonSignals.push({
        id: `sig_collab_${Date.now()}`,
        category: 'style_dna',
        signalText: `ARIA Multi-Agent Consensus: ${collectiveDecision.reasoningSummary}`,
        source: `AgentCollaborationManager (${collectiveDecision.contributingAgents.length} agents)`,
        confidence: collectiveDecision.confidenceScore / 100
      });
    }

    const latencyMs = Math.round(performance.now() - startTime);

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'CollaborationDecisionBridge',
        eventName: 'COLLABORATIVE_DECISION_BRIDGED',
        category: 'Decision',
        payload: `Bridged collective decision (${collectiveDecision.confidenceScore}% confidence) into Decision Engine for user ${userId}`,
        latencyMs,
        status: 'Success'
      });
    } catch (_) {}

    return {
      recommendation,
      collectiveDecision
    };
  }
}

export const collaborationDecisionBridge = CollaborationDecisionBridge.getInstance();
