/**
 * ARIA v2.7 Agent Orchestrator
 * Product: LOOK VISION v2.4
 * 
 * Orchestrates multi-agent execution pipeline:
 * User Request -> ARIA Orchestrator -> Select Required Agents -> Execute Reasoning Tasks -> Combine Outputs -> Return Intelligence Result
 */

import { 
  AgentRole, 
  AgentExecutionRequest, 
  AgentExecutionRecord, 
  AgentOrchestratorStatus,
  AgentProfile 
} from './AgentTypes';
import { agentRegistry } from './AgentRegistry';
import { AgentExecutor } from './AgentExecutor';
import { agentPerformanceTracker } from './AgentPerformanceTracker';
import { agentCommunicationBus } from './AgentCommunicationBus';
import { agentMemoryBridge } from './AgentMemoryBridge';

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private userId?: string;
  private history: AgentExecutionRecord[] = [];
  private status: AgentOrchestratorStatus = {
    isInitialized: false,
    isExecuting: false,
    activeAgentsCount: 0,
    totalExecutionsRecorded: 0,
    storageMode: 'offline_local'
  };

  private constructor() {}

  public static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  public async initialize(userId?: string): Promise<AgentOrchestratorStatus> {
    this.userId = userId || 'guest_user';
    this.status.isExecuting = true;

    try {
      this.history = await agentPerformanceTracker.fetchExecutionHistory(this.userId);
      const agents = agentRegistry.getAllAgents();

      this.status = {
        isInitialized: true,
        isExecuting: false,
        activeAgentsCount: agents.length,
        totalExecutionsRecorded: this.history.length,
        storageMode: userId ? 'firestore' : 'offline_local',
        lastExecutedAt: this.history[0]?.executedAt
      };
    } catch (err: any) {
      console.warn('[AgentOrchestrator] Initialization fallback active:', err);
      this.status = {
        isInitialized: true,
        isExecuting: false,
        activeAgentsCount: 7,
        totalExecutionsRecorded: this.history.length,
        storageMode: 'offline_local',
        lastError: err.message || 'Fallback active'
      };
    }

    return this.status;
  }

  /**
   * Determine target agent role based on query intent
   */
  public inferTargetRole(prompt: string): AgentRole {
    const p = prompt.toLowerCase();
    if (p.includes('history') || p.includes('era') || p.includes('historian') || p.includes('designer') || p.includes('archive') || p.includes('vintage') || p.includes('heritage') || p.includes('cultural')) {
      return 'FASHION_HISTORIAN';
    }
    if (p.includes('wardrobe') || p.includes('closet') || p.includes('capsule') || p.includes('optimize') || p.includes('synergy') || p.includes('utilization')) {
      return 'WARDROBE_OPTIMIZER';
    }
    if (p.includes('image') || p.includes('photo') || p.includes('look') || p.includes('garment') || p.includes('try-on') || p.includes('vision')) {
      return 'VISUAL_ANALYSIS';
    }
    if (p.includes('concept') || p.includes('creative') || p.includes('editorial') || p.includes('mood') || p.includes('vibe')) {
      return 'CREATIVE_DIRECTOR';
    }
    if (p.includes('trend') || p.includes('season') || p.includes('runway') || p.includes('fashion week')) {
      return 'TREND_INTELLIGENCE';
    }
    if (p.includes('outfit') || p.includes('wear') || p.includes('recommend') || p.includes('decision') || p.includes('style me')) {
      return 'PERSONAL_STYLIST';
    }
    return 'FASHION_ANALYST';
  }

  /**
   * Orchestrate and execute agent pipeline
   */
  public async executeAgent(request: AgentExecutionRequest): Promise<AgentExecutionRecord> {
    const activeUserId = request.userId || this.userId || 'guest_user';
    this.status.isExecuting = true;

    const role = request.agentRole || this.inferTargetRole(request.prompt);
    let agentProfile = agentRegistry.getAgentByRole(role);

    if (agentProfile) {
      agentProfile.status = 'EXECUTING';
      agentRegistry.updateAgent(agentProfile);
    }

    // Execute via Executor
    const record = await AgentExecutor.execute(role, request);

    // Update agent metrics and status
    if (agentProfile) {
      agentProfile = agentPerformanceTracker.updateAgentMetrics(
        agentProfile,
        record.status === 'SUCCESS',
        record.latencyMs,
        record.confidence
      );
      agentRegistry.updateAgent(agentProfile);
    }

    // Save execution record
    await agentPerformanceTracker.saveExecutionRecord(activeUserId, record);
    this.history.unshift(record);

    // Publish to event bus
    agentCommunicationBus.publish(record);

    // Record insight in shared MemoryEngine via Memory Bridge if confidence > 0.9
    if (record.status === 'SUCCESS' && record.confidence >= 0.9) {
      await agentMemoryBridge.recordAgentInsight(
        activeUserId,
        'style_preference',
        `Agent [${role}] insight: ${record.outputSummary}`,
        record.confidence
      );
    }

    this.status = {
      isInitialized: true,
      isExecuting: false,
      activeAgentsCount: agentRegistry.getAllAgents().length,
      totalExecutionsRecorded: this.history.length,
      storageMode: this.userId ? 'firestore' : 'offline_local',
      lastExecutedAt: record.executedAt
    };

    return record;
  }

  public getAgents(): AgentProfile[] {
    return agentRegistry.getAllAgents();
  }

  public async getHistory(): Promise<AgentExecutionRecord[]> {
    const activeUserId = this.userId || 'guest_user';
    this.history = await agentPerformanceTracker.fetchExecutionHistory(activeUserId);
    return this.history;
  }

  public getStatus(): AgentOrchestratorStatus {
    return { ...this.status };
  }
}

export const agentOrchestrator = AgentOrchestrator.getInstance();
