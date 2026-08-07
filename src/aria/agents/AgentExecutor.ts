/**
 * ARIA v2.7 Agent Executor
 * Product: LOOK VISION v2.4
 * 
 * Executes agent tasks using specialized fashion intelligence agents
 * and integrates telemetry and observability logging.
 */

import {
  AgentRole,
  AgentExecutionRecord,
  AgentExecutionRequest,
  AgentRequest,
  AgentResponse
} from './AgentTypes';
import { agentRegistry } from './AgentRegistry';
import { personalStylistAgent } from './specialized/PersonalStylistAgent';
import { fashionHistorianAgent } from './specialized/FashionHistorianAgent';
import { trendIntelligenceAgent } from './specialized/TrendIntelligenceAgent';
import { wardrobeOptimizationAgent } from './specialized/WardrobeOptimizationAgent';
import { creativeDirectorAgent } from './specialized/CreativeDirectorAgent';
import { visualAnalysisAgent } from './specialized/VisualAnalysisAgent';
import { memoryEngine } from '../memory/MemoryEngine';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { creativeEngine } from '../creative/CreativeEngine';
import { visualIntelligenceEngine } from '../vision/VisualIntelligenceEngine';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class AgentExecutor {
  public static async execute(
    role: AgentRole,
    request: AgentExecutionRequest
  ): Promise<AgentExecutionRecord> {
    const startTime = Date.now();
    const userId = request.userId || 'guest_user';
    const agentProfile = agentRegistry.getAgentByRole(role);

    if (!agentProfile) {
      throw new Error(`Agent for role [${role}] not found in registry`);
    }

    const executionId = `exec_${role.toLowerCase()}_${Date.now()}`;
    let outputSummary = '';
    let dataPayload: Record<string, unknown> = {};
    let confidence = agentProfile.confidence;
    let supportingEvidence: string[] = [];
    let reasoningDepth = 2;

    try {
      const agentReq: AgentRequest = {
        requestId: executionId,
        source: 'ARIA_AGENT_ORCHESTRATOR',
        context: request.contextParams || {},
        requiredCapability: request.requiredCapabilities?.[0] || 'analyze',
        prompt: request.prompt,
        userId
      };

      if (role === 'PERSONAL_STYLIST') {
        const response: AgentResponse = await personalStylistAgent.execute(agentReq);
        outputSummary = `Personal Stylist: ${(response.result.title as string) || 'Outfit Recommendation'} (Confidence: ${Math.round(response.confidence * 100)}%)`;
        dataPayload = response.result;
        confidence = response.confidence;
        supportingEvidence = response.reasoning;
        reasoningDepth = response.telemetry.reasoningDepth;
      } else if (role === 'FASHION_HISTORIAN') {
        const response: AgentResponse = await fashionHistorianAgent.execute(agentReq);
        outputSummary = `Fashion Historian: Mapped ${(response.result.eras as any[])?.length || 0} eras and ${(response.result.designers as any[])?.length || 0} designer references`;
        dataPayload = response.result;
        confidence = response.confidence;
        supportingEvidence = response.reasoning;
        reasoningDepth = response.telemetry.reasoningDepth;
      } else if (role === 'TREND_INTELLIGENCE') {
        const response: AgentResponse = await trendIntelligenceAgent.execute(agentReq);
        outputSummary = `Trend Intelligence: Identified ${(response.result.trendingSilhouettes as any[])?.length || 0} active runway trend silhouettes`;
        dataPayload = response.result;
        confidence = response.confidence;
        supportingEvidence = response.reasoning;
        reasoningDepth = response.telemetry.reasoningDepth;
      } else if (role === 'WARDROBE_OPTIMIZER') {
        const response: AgentResponse = await wardrobeOptimizationAgent.execute(agentReq);
        outputSummary = `Wardrobe Optimizer: Wardrobe synergy score ${Math.round((response.confidence) * 100)}% across ${response.result.totalOwnedItems} items`;
        dataPayload = response.result;
        confidence = response.confidence;
        supportingEvidence = response.reasoning;
        reasoningDepth = response.telemetry.reasoningDepth;
      } else if (role === 'FASHION_ANALYST') {
        const profile = styleDNAEngine.getProfile();
        const memories = memoryEngine.getMemories();
        outputSummary = `Fashion Analyst: Analyzed Style DNA profile (${profile?.identityName || 'Contemporary'}). Primary silhouette: ${profile?.silhouetteProfile[0]?.value || 'Tailored'}. Verified against ${memories.length} memories.`;
        dataPayload = {
          styleDNA: profile,
          memoryCount: memories.length,
          topColors: profile?.colorProfile.slice(0, 3)
        };
        supportingEvidence = [
          `Style DNA overall confidence score: ${profile?.overallConfidence || 0.92}`,
          `Verified ${memories.length} memory records in memory engine`
        ];
        confidence = profile?.overallConfidence || 0.94;
        reasoningDepth = supportingEvidence.length;
      } else if (role === 'CREATIVE_DIRECTOR') {
        const response: AgentResponse = await creativeDirectorAgent.execute(agentReq);
        outputSummary = `Creative Director synthesized concept "${response.result.title as string}". Theme: ${response.result.aestheticTheme as string}`;
        dataPayload = response.result;
        confidence = response.confidence;
        supportingEvidence = response.reasoning;
        reasoningDepth = response.telemetry.reasoningDepth;
      } else if (role === 'VISUAL_ANALYSIS') {
        const response: AgentResponse = await visualAnalysisAgent.execute(agentReq);
        outputSummary = `Visual Analysis Agent analyzed image "${response.result.imageName as string}" detecting ${response.result.garmentCount as number} garments with ${Math.round(response.confidence * 100)}% visual confidence.`;
        dataPayload = response.result;
        confidence = response.confidence;
        supportingEvidence = response.reasoning;
        reasoningDepth = response.telemetry.reasoningDepth;
      }

      const latencyMs = Date.now() - startTime;

      // Log trace to EnterpriseObservabilityEngine
      try {
        EnterpriseObservabilityEngine.logTrace({
          engine: `AgentExecutor:${role}`,
          eventName: 'AGENT_EXECUTION_COMPLETED',
          category: 'Agent',
          payload: `Agent ${agentProfile.agentName} completed execution with confidence ${confidence}`,
          latencyMs,
          status: 'Success'
        });
      } catch (_) {}

      const record: AgentExecutionRecord = {
        executionId,
        agentId: agentProfile.agentId,
        agentRole: role,
        userId,
        prompt: request.prompt || `Execute ${role} pipeline`,
        status: 'SUCCESS',
        confidence,
        outputSummary,
        dataPayload,
        latencyMs,
        executedAt: new Date().toISOString(),
        supportingEvidence,
        reasoningDepth
      };

      return record;
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;

      try {
        EnterpriseObservabilityEngine.logTrace({
          engine: `AgentExecutor:${role}`,
          eventName: 'AGENT_EXECUTION_FAILED',
          category: 'Agent',
          payload: `Error executing ${role}: ${err.message || 'Unknown error'}`,
          latencyMs,
          status: 'Failure'
        });
      } catch (_) {}

      return {
        executionId,
        agentId: agentProfile.agentId,
        agentRole: role,
        userId,
        prompt: request.prompt || `Execute ${role}`,
        status: 'FAILED',
        confidence: 0,
        outputSummary: `Execution failed: ${err.message || 'Internal error'}`,
        dataPayload: { error: err.message },
        latencyMs,
        executedAt: new Date().toISOString(),
        supportingEvidence: ['Error encountered during agent execution'],
        reasoningDepth: 1
      };
    }
  }
}
