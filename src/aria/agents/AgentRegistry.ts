/**
 * ARIA v2.7 Agent Registry
 * Product: LOOK VISION v2.4
 * 
 * Registers, manages, and tracks ARIA autonomous fashion agents.
 */

import {
  FashionAgent,
  AgentProfile,
  AgentRole
} from './AgentTypes';
import { personalStylistAgent } from './specialized/PersonalStylistAgent';
import { fashionHistorianAgent } from './specialized/FashionHistorianAgent';
import { trendIntelligenceAgent } from './specialized/TrendIntelligenceAgent';
import { wardrobeOptimizationAgent } from './specialized/WardrobeOptimizationAgent';
import { creativeDirectorAgent } from './specialized/CreativeDirectorAgent';
import { visualAnalysisAgent } from './specialized/VisualAnalysisAgent';

export class AgentRegistry {
  private static instance: AgentRegistry;
  private fashionAgents: Map<string, FashionAgent> = new Map();
  private agentProfiles: Map<AgentRole, AgentProfile> = new Map();

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
    // Specialized Agents
    const initialSpecialized: FashionAgent[] = [
      personalStylistAgent.definition,
      fashionHistorianAgent.definition,
      trendIntelligenceAgent.definition,
      wardrobeOptimizationAgent.definition,
      creativeDirectorAgent.definition,
      visualAnalysisAgent.definition,
      {
        id: 'ag_fashion_analyst_01',
        name: 'Fashion Analyst Agent',
        role: 'FASHION_ANALYST',
        capabilities: ['analyze', 'retrieve', 'explain'],
        confidence: 0.95,
        status: 'IDLE',
        telemetryId: 'tel_fashion_analyst',
        description: 'Analyzes fashion context, evaluates user preference signals, and queries Style DNA.'
      }
    ];

    initialSpecialized.forEach((ag) => {
      this.registerAgent(ag);
    });

    // Default Profile Wrappers for backward compatibility
    const defaultProfiles: AgentProfile[] = [
      {
        agentId: 'ag_fashion_analyst_01',
        agentName: 'Fashion Analyst Agent',
        role: 'FASHION_ANALYST',
        description: 'Analyzes fashion context and evaluates user preference signals.',
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
        confidence: 0.95,
        metrics: {
          totalExecutions: 18,
          successfulExecutions: 18,
          failedExecutions: 0,
          averageLatencyMs: 190,
          averageConfidence: 0.95,
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
        confidence: 0.93,
        metrics: {
          totalExecutions: 8,
          successfulExecutions: 8,
          failedExecutions: 0,
          averageLatencyMs: 160,
          averageConfidence: 0.93,
          userSatisfactionScore: 0.94
        }
      },
      {
        agentId: 'ag_fashion_historian_06',
        agentName: 'Fashion Historian Agent',
        role: 'FASHION_HISTORIAN',
        description: 'Queries Civilization Memory Graph for era references and designer influence.',
        capabilities: {
          canAnalyzeDNA: true,
          canMakeDecisions: false,
          canSynthesizeCreative: false,
          canAnalyzeVision: false,
          canAnalyzeTrends: true,
          canRetrieveKnowledge: true
        },
        status: 'IDLE',
        confidence: 0.94,
        metrics: {
          totalExecutions: 5,
          successfulExecutions: 5,
          failedExecutions: 0,
          averageLatencyMs: 120,
          averageConfidence: 0.94,
          userSatisfactionScore: 0.96
        }
      },
      {
        agentId: 'ag_wardrobe_optimizer_07',
        agentName: 'Wardrobe Optimization Agent',
        role: 'WARDROBE_OPTIMIZER',
        description: 'Optimizes owned wardrobe items and capsule rotation efficiency.',
        capabilities: {
          canAnalyzeDNA: true,
          canMakeDecisions: true,
          canSynthesizeCreative: false,
          canAnalyzeVision: false,
          canAnalyzeTrends: false,
          canOptimizeWardrobe: true
        },
        status: 'IDLE',
        confidence: 0.95,
        metrics: {
          totalExecutions: 10,
          successfulExecutions: 10,
          failedExecutions: 0,
          averageLatencyMs: 110,
          averageConfidence: 0.95,
          userSatisfactionScore: 0.97
        }
      }
    ];

    defaultProfiles.forEach((p) => this.agentProfiles.set(p.role, p));
  }

  public registerAgent(agent: FashionAgent): void {
    this.fashionAgents.set(agent.id, agent);
  }

  public removeAgent(agentId: string): boolean {
    return this.fashionAgents.delete(agentId);
  }

  public getAgent(agentIdOrRole: string): FashionAgent | undefined {
    // Check by ID
    if (this.fashionAgents.has(agentIdOrRole)) {
      return this.fashionAgents.get(agentIdOrRole);
    }
    // Check by Role
    for (const ag of this.fashionAgents.values()) {
      if (ag.role === agentIdOrRole) return ag;
    }
    return undefined;
  }

  public listAgents(): FashionAgent[] {
    return Array.from(this.fashionAgents.values());
  }

  public activateAgent(agentId: string): boolean {
    const agent = this.getAgent(agentId);
    if (agent) {
      agent.status = 'EXECUTING';
      this.fashionAgents.set(agent.id, agent);
      return true;
    }
    return false;
  }

  public getAllAgents(): AgentProfile[] {
    return Array.from(this.agentProfiles.values());
  }

  public getAgentByRole(role: AgentRole): AgentProfile | undefined {
    return this.agentProfiles.get(role);
  }

  public updateAgent(profile: AgentProfile): void {
    this.agentProfiles.set(profile.role, profile);
    const fAgent = this.getAgent(profile.role);
    if (fAgent) {
      fAgent.status = profile.status;
      fAgent.confidence = profile.confidence;
      this.fashionAgents.set(fAgent.id, fAgent);
    }
  }
}

export const agentRegistry = AgentRegistry.getInstance();
