/**
 * ARIA v2.8 Agent Collaboration Manager
 * Product: LOOK VISION v2.4
 * 
 * Coordinates multi-agent collaboration, evaluates contributions, resolves conflicts,
 * computes collective confidence, and records telemetry & persistence.
 */

import {
  AgentCollaborationRequest,
  AgentContribution,
  CollectiveDecision,
  CollaborationStatus
} from './CollaborationTypes';
import { AgentRole } from '../AgentTypes';
import { AgentExecutor } from '../AgentExecutor';
import { confidenceAggregationEngine } from './ConfidenceAggregationEngine';
import { agentConflictResolver } from './AgentConflictResolver';
import { collectiveReasoningEngine } from './CollectiveReasoningEngine';
import { collaborationStorage } from './CollaborationStorage';
import { adaptiveAgentSelector } from '../adaptive/AdaptiveAgentSelector';
import { agentLearningBridge } from '../adaptive/AgentLearningBridge';
import { EnterpriseObservabilityEngine } from '../../../engine/observabilityEngine';

export class AgentCollaborationManager {
  private static instance: AgentCollaborationManager;

  private status: CollaborationStatus = {
    isExecuting: false,
    activeCollaborationsCount: 0,
    totalCollaborationsRecorded: 0
  };

  private constructor() {}

  public static getInstance(): AgentCollaborationManager {
    if (!AgentCollaborationManager.instance) {
      AgentCollaborationManager.instance = new AgentCollaborationManager();
    }
    return AgentCollaborationManager.instance;
  }

  /**
   * Select relevant participating agents based on objective intent if not explicitly provided
   */
  public selectAgents(objective: string, requestedAgents?: AgentRole[]): AgentRole[] {
    if (requestedAgents && requestedAgents.length > 0) {
      return Array.from(new Set(requestedAgents));
    }

    const objLower = objective.toLowerCase();
    const agents: Set<AgentRole> = new Set(['PERSONAL_STYLIST']);

    if (objLower.includes('history') || objLower.includes('era') || objLower.includes('heritage') || objLower.includes('vintage') || objLower.includes('designer') || objLower.includes('classic')) {
      agents.add('FASHION_HISTORIAN');
    }
    if (objLower.includes('trend') || objLower.includes('season') || objLower.includes('runway') || objLower.includes('modern') || objLower.includes('contemporary')) {
      agents.add('TREND_INTELLIGENCE');
    }
    if (objLower.includes('wardrobe') || objLower.includes('closet') || objLower.includes('capsule') || objLower.includes('owned') || objLower.includes('synergy')) {
      agents.add('WARDROBE_OPTIMIZER');
    }
    if (objLower.includes('concept') || objLower.includes('creative') || objLower.includes('mood') || objLower.includes('editorial')) {
      agents.add('CREATIVE_DIRECTOR');
    }
    if (objLower.includes('image') || objLower.includes('photo') || objLower.includes('visual') || objLower.includes('garment')) {
      agents.add('VISUAL_ANALYSIS');
    }

    // Always include at least 3 complementary core agents for rich collaboration
    if (agents.size < 3) {
      agents.add('TREND_INTELLIGENCE');
      agents.add('WARDROBE_OPTIMIZER');
      agents.add('FASHION_HISTORIAN');
    }

    return Array.from(agents);
  }

  /**
   * Execute participating agents and collect contributions
   */
  public async collectAgentResponses(
    agents: AgentRole[],
    request: AgentCollaborationRequest
  ): Promise<AgentContribution[]> {
    const userId = request.userId || 'guest_user';

    const execPromises = agents.map(async (role) => {
      const startTime = performance.now();
      const record = await AgentExecutor.execute(role, {
        agentRole: role,
        prompt: request.objective,
        userId,
        contextParams: request.context
      });
      const executionTimeMs = Math.round(performance.now() - startTime);

      const contribution: AgentContribution = {
        agentId: record.agentId,
        agentName: `${role} Agent`,
        agentRole: role,
        recommendation: record.dataPayload || record.outputSummary,
        confidence: record.confidence,
        reasoning: record.supportingEvidence && record.supportingEvidence.length > 0
          ? record.supportingEvidence
          : [record.outputSummary],
        supportingEvidence: record.supportingEvidence || [],
        executionTimeMs,
        timestamp: new Date().toISOString()
      };

      return contribution;
    });

    const results = await Promise.all(execPromises);
    return results;
  }

  /**
   * Filter or normalize contributions
   */
  public evaluateContributions(contributions: AgentContribution[]): AgentContribution[] {
    return contributions.filter((c) => c && c.confidence >= 0.20);
  }

  /**
   * Main entry point to initialize multi-agent collaboration
   */
  public async initializeCollaboration(request: AgentCollaborationRequest): Promise<CollectiveDecision> {
    const startTime = Date.now();
    this.status.isExecuting = true;
    const userId = request.userId || 'guest_user';

    try {
      // 1. Select participating agents adaptively based on relevance and reliability
      const selectionResult = await adaptiveAgentSelector.selectAgentsAdaptively(
        request.objective,
        userId,
        request.participatingAgents
      );
      const selectedAgents = selectionResult.selectedAgents;

      // 2. Collect responses in parallel
      const rawContributions = await this.collectAgentResponses(selectedAgents, request);

      // 3. Evaluate and filter contributions
      const evaluatedContributions = this.evaluateContributions(rawContributions);

      // 4. Detect & resolve conflicts
      const rawConflicts = agentConflictResolver.detectConflicts(evaluatedContributions, request.context);
      const { resolvedContributions, resolutions } = agentConflictResolver.resolveConflicts(
        rawConflicts,
        evaluatedContributions
      );

      // 5. Aggregate collective confidence
      const confidenceBreakdown = confidenceAggregationEngine.calculateCollectiveConfidence(
        resolvedContributions,
        resolutions,
        request.objective
      );

      // 6. Synthesize final collective decision
      const latencyMs = Date.now() - startTime;
      const decision = collectiveReasoningEngine.synthesizeDecision(
        request,
        resolvedContributions,
        resolutions,
        confidenceBreakdown,
        latencyMs
      );

      // 7. Telemetry logging via EnterpriseObservabilityEngine
      try {
        EnterpriseObservabilityEngine.logTrace({
          engine: 'AgentCollaborationManager',
          eventName: 'AGENT_COLLABORATION_COMPLETED',
          category: 'Reasoning',
          payload: `Collaborated adaptively with ${selectedAgents.length} agents (${selectedAgents.join(', ')}). Collective Score: ${decision.confidenceScore}%, Conflicts: ${resolutions.length}`,
          latencyMs,
          status: 'Success'
        });
      } catch (_) {}

      // 8. Store in Firestore / Offline Cache
      await collaborationStorage.saveCollaboration(userId, decision);

      // 9. Ingest learning feedback signal into Adaptive Intelligence Framework
      await agentLearningBridge.ingestFeedbackSignal(userId, {
        eventType: 'collaboration_completed',
        participatingAgents: selectedAgents,
        collaborationScore: decision.confidenceScore,
        latencyMs
      }).catch(() => {});

      this.status = {
        isExecuting: false,
        activeCollaborationsCount: selectedAgents.length,
        totalCollaborationsRecorded: this.status.totalCollaborationsRecorded + 1,
        lastExecutedAt: new Date().toISOString()
      };

      return decision;
    } catch (err: any) {
      this.status.isExecuting = false;
      this.status.lastError = err.message || 'Collaboration error';

      try {
        EnterpriseObservabilityEngine.logTrace({
          engine: 'AgentCollaborationManager',
          eventName: 'AGENT_COLLABORATION_FAILED',
          category: 'Reasoning',
          payload: `Collaboration failed for objective "${request.objective}": ${err.message}`,
          latencyMs: Date.now() - startTime,
          status: 'Failure'
        });
      } catch (_) {}

      throw err;
    }
  }

  public getStatus(): CollaborationStatus {
    return { ...this.status };
  }
}

export const agentCollaborationManager = AgentCollaborationManager.getInstance();
