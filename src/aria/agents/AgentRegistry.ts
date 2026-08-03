/**
 * ARIA v2.5 Agent Registry
 * Product: LOOK VISION v2.4
 */

import { AgentProfile, AgentRole } from './AgentTypes';

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<AgentRole, AgentProfile> = new Map();

  private constructor() {
    this.registerDefaultAgents();
  }

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  private registerDefaultAgents(): void {
    const defaultAgents: AgentProfile[] = [
      {
        agentId: 'ag_fashion_analyst_01',
        agentName: 'Fashion Analyst Agent',
        role: 'FASHION_ANALYST',
        description: 'Analyzes fashion context, evaluates user preference signals, and queries Style DNA.',
        capabilities: {
          canAnalyzeDNA: true,
          canMakeDecisions: false,
          canSynthesizeCreative: false,
          canAnalyzeVision: false,
          canAnalyzeTrends: true
        },
        status: 'IDLE',
        confidence: 0.95,
        metrics: {
          totalExecutions: 12,
          successfulExecutions: 12,
          failedExecutions: 0,
          averageLatencyMs: 140,
          averageConfidence: 0.95,
          userSatisfactionScore: 0.98
        }
      },
      {
        agentId: 'ag_personal_stylist_02',
        agentName: 'Personal Stylist Agent',
        role: 'PERSONAL_STYLIST',
        description: 'Generates tailored outfit recommendations and decision scores using Decision Engine.',
        capabilities: {
          canAnalyzeDNA: true,
          canMakeDecisions: true,
          canSynthesizeCreative: false,
          canAnalyzeVision: true,
          canAnalyzeTrends: false
        },
        status: 'IDLE',
        confidence: 0.94,
        metrics: {
          totalExecutions: 18,
          successfulExecutions: 18,
          failedExecutions: 0,
          averageLatencyMs: 190,
          averageConfidence: 0.94,
          userSatisfactionScore: 0.96
        }
      },
      {
        agentId: 'ag_creative_director_03',
        agentName: 'Creative Director Agent',
        role: 'CREATIVE_DIRECTOR',
        description: 'Synthesizes high-concept editorial directions and moodboards via Creative Engine.',
        capabilities: {
          canAnalyzeDNA: true,
          canMakeDecisions: false,
          canSynthesizeCreative: true,
          canAnalyzeVision: false,
          canAnalyzeTrends: true
        },
        status: 'IDLE',
        confidence: 0.92,
        metrics: {
          totalExecutions: 9,
          successfulExecutions: 9,
          failedExecutions: 0,
          averageLatencyMs: 230,
          averageConfidence: 0.92,
          userSatisfactionScore: 0.95
        }
      },
      {
        agentId: 'ag_visual_analysis_04',
        agentName: 'Visual Analysis Agent',
        role: 'VISUAL_ANALYSIS',
        description: 'Extracts garments, color swatches, and structural layers using Visual Intelligence Engine.',
        capabilities: {
          canAnalyzeDNA: false,
          canMakeDecisions: false,
          canSynthesizeCreative: false,
          canAnalyzeVision: true,
          canAnalyzeTrends: false
        },
        status: 'IDLE',
        confidence: 0.93,
        metrics: {
          totalExecutions: 15,
          successfulExecutions: 15,
          failedExecutions: 0,
          averageLatencyMs: 210,
          averageConfidence: 0.93,
          userSatisfactionScore: 0.97
        }
      },
      {
        agentId: 'ag_trend_intelligence_05',
        agentName: 'Trend Intelligence Agent',
        role: 'TREND_INTELLIGENCE',
        description: 'Monitors contemporary fashion movements, seasonal palettes, and runway trends.',
        capabilities: {
          canAnalyzeDNA: true,
          canMakeDecisions: false,
          canSynthesizeCreative: true,
          canAnalyzeVision: false,
          canAnalyzeTrends: true
        },
        status: 'IDLE',
        confidence: 0.91,
        metrics: {
          totalExecutions: 8,
          successfulExecutions: 8,
          failedExecutions: 0,
          averageLatencyMs: 160,
          averageConfidence: 0.91,
          userSatisfactionScore: 0.94
        }
      }
    ];

    defaultAgents.forEach(a => this.agents.set(a.role, a));
  }

  public getAllAgents(): AgentProfile[] {
    return Array.from(this.agents.values());
  }

  public getAgentByRole(role: AgentRole): AgentProfile | undefined {
    return this.agents.get(role);
  }

  public updateAgent(profile: AgentProfile): void {
    this.agents.set(profile.role, profile);
  }
}

export const agentRegistry = AgentRegistry.getInstance();
