/**
 * ARIA v2.9 Adaptive Agent Selector
 * Product: LOOK VISION v2.4
 * 
 * Dynamically selects optimal fashion agents prior to collaboration based on
 * request objective relevance, agent reliability scores, and historical performance.
 */

import { AgentRole } from '../AgentTypes';
import { AdaptiveSelectionResult } from './AdaptiveTypes';
import { agentAdaptiveStorage } from './AgentAdaptiveStorage';

export class AdaptiveAgentSelector {
  private static instance: AdaptiveAgentSelector;

  private constructor() {}

  public static getInstance(): AdaptiveAgentSelector {
    if (!AdaptiveAgentSelector.instance) {
      AdaptiveAgentSelector.instance = new AdaptiveAgentSelector();
    }
    return AdaptiveAgentSelector.instance;
  }

  /**
   * Computes task relevance score for a given agent role and objective prompt
   */
  public calculateRelevanceScore(agentRole: AgentRole, objective: string): number {
    const objLower = objective.toLowerCase();
    let score = 0.70; // baseline relevance

    switch (agentRole) {
      case 'FASHION_ANALYST':
        if (objLower.includes('analysis') || objLower.includes('metric') || objLower.includes('score') || objLower.includes('dna')) {
          score = 0.95;
        } else {
          score = 0.80;
        }
        break;

      case 'PERSONAL_STYLIST':
        if (objLower.includes('outfit') || objLower.includes('style') || objLower.includes('wear') || objLower.includes('look') || objLower.includes('travel') || objLower.includes('business')) {
          score = 0.98;
        } else {
          score = 0.90;
        }
        break;

      case 'WARDROBE_OPTIMIZER':
        if (objLower.includes('wardrobe') || objLower.includes('closet') || objLower.includes('capsule') || objLower.includes('owned') || objLower.includes('travel') || objLower.includes('packing')) {
          score = 0.96;
        } else if (objLower.includes('outfit') || objLower.includes('suit') || objLower.includes('wear')) {
          score = 0.88;
        } else {
          score = 0.75;
        }
        break;

      case 'FASHION_HISTORIAN':
        if (objLower.includes('luxury') || objLower.includes('heritage') || objLower.includes('era') || objLower.includes('tailoring') || objLower.includes('classic') || objLower.includes('vintage') || objLower.includes('designer')) {
          score = 0.94;
        } else if (objLower.includes('executive') || objLower.includes('business') || objLower.includes('formal')) {
          score = 0.85;
        } else {
          score = 0.65;
        }
        break;

      case 'TREND_INTELLIGENCE':
        if (objLower.includes('trend') || objLower.includes('modern') || objLower.includes('runway') || objLower.includes('season') || objLower.includes('contemporary')) {
          score = 0.95;
        } else if (objLower.includes('casual') || objLower.includes('streetwear')) {
          score = 0.85;
        } else if (objLower.includes('luxury business travel') || objLower.includes('classic executive')) {
          score = 0.65; // lower priority for purely classic executive queries
        } else {
          score = 0.70;
        }
        break;

      case 'CREATIVE_DIRECTOR':
        if (objLower.includes('editorial') || objLower.includes('concept') || objLower.includes('mood') || objLower.includes('aesthetic') || objLower.includes('gala')) {
          score = 0.95;
        } else {
          score = 0.60;
        }
        break;

      case 'VISUAL_ANALYSIS':
        if (objLower.includes('image') || objLower.includes('photo') || objLower.includes('color') || objLower.includes('silhouette') || objLower.includes('garment')) {
          score = 0.95;
        } else {
          score = 0.60;
        }
        break;
    }

    return Number(score.toFixed(2));
  }

  /**
   * Adaptively selects participating primary and secondary agents for a collaboration request
   */
  public async selectAgentsAdaptively(
    objective: string,
    userId: string,
    requestedAgents?: AgentRole[]
  ): Promise<AdaptiveSelectionResult> {
    const allRoles: AgentRole[] = [
      'FASHION_ANALYST',
      'PERSONAL_STYLIST',
      'WARDROBE_OPTIMIZER',
      'FASHION_HISTORIAN',
      'TREND_INTELLIGENCE',
      'CREATIVE_DIRECTOR',
      'VISUAL_ANALYSIS'
    ];

    if (requestedAgents && requestedAgents.length > 0) {
      const explicitRoles = Array.from(new Set(requestedAgents));
      return {
        selectedAgents: explicitRoles,
        agentRelevanceScores: {},
        agentReliabilityScores: {},
        primaryAgents: explicitRoles,
        secondaryAgents: [],
        reasoning: [`Explicit user request specified ${explicitRoles.length} agents: ${explicitRoles.join(', ')}`],
        explanation: `Explicitly selected ${explicitRoles.join(', ')}.`
      };
    }

    const profiles = await agentAdaptiveStorage.getAllPerformanceProfiles(userId);

    const relevanceScores: Partial<Record<AgentRole, number>> = {};
    const reliabilityScores: Partial<Record<AgentRole, number>> = {};
    const combinedScores: { role: AgentRole; combinedScore: number; relevance: number; reliability: number }[] = [];

    allRoles.forEach((role) => {
      const rel = this.calculateRelevanceScore(role, objective);
      const prof = profiles[role];
      const relScore = prof ? prof.reliabilityScore : 85;

      relevanceScores[role] = rel;
      reliabilityScores[role] = relScore;

      // Combined formula: Relevance (60%) + Reliability Normalized (40%)
      const combined = (rel * 0.60) + ((relScore / 100) * 0.40);

      combinedScores.push({
        role,
        combinedScore: combined,
        relevance: rel,
        reliability: relScore
      });
    });

    // Sort by combined score descending
    combinedScores.sort((a, b) => b.combinedScore - a.combinedScore);

    // Primary agents: top 3 scoring agents (or all with combinedScore >= 0.72)
    const primaryAgents = combinedScores.slice(0, 3).map((c) => c.role);
    const secondaryCandidates = combinedScores.slice(3).filter((c) => c.combinedScore >= 0.65);
    const secondaryAgents = secondaryCandidates.map((c) => c.role);

    const selectedAgents = Array.from(new Set([...primaryAgents, ...secondaryAgents]));

    const reasoning: string[] = [
      `Evaluated objective "${objective}" across 6 specialized fashion agents.`,
      `Primary Selection (${primaryAgents.join(', ')}): High task relevance & reliability score (avg ${(combinedScores.slice(0, 3).reduce((acc, c) => acc + c.reliability, 0) / 3).toFixed(0)}%).`
    ];

    if (secondaryAgents.length > 0) {
      reasoning.push(`Secondary Selection (${secondaryAgents.join(', ')}): Secondary context contribution.`);
    }

    const explanation = `Adaptively selected ${primaryAgents.join(', ')} as primary reasoning agents based on objective relevance and high reliability scores.`;

    return {
      selectedAgents,
      agentRelevanceScores: relevanceScores,
      agentReliabilityScores: reliabilityScores,
      primaryAgents,
      secondaryAgents,
      reasoning,
      explanation
    };
  }
}

export const adaptiveAgentSelector = AdaptiveAgentSelector.getInstance();
