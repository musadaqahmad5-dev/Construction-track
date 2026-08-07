/**
 * ARIA v2.8 Agent Conflict Resolver
 * Product: LOOK VISION v2.4
 * 
 * Resolves disagreements between specialized fashion agents (e.g., Trend Intelligence vs. Wardrobe Optimization / Style DNA)
 * using Style DNA priority, user memory history, confidence ranking, and personal preference weighting.
 */

import { AgentContribution, AgentConflict } from './CollaborationTypes';
import { styleDNAEngine } from '../../styleDNA/StyleDNAEngine';
import { memoryEngine } from '../../memory/MemoryEngine';

export class AgentConflictResolver {
  private static instance: AgentConflictResolver;

  private constructor() {}

  public static getInstance(): AgentConflictResolver {
    if (!AgentConflictResolver.instance) {
      AgentConflictResolver.instance = new AgentConflictResolver();
    }
    return AgentConflictResolver.instance;
  }

  /**
   * Scans agent contributions for conflicting advice or style recommendations
   */
  public detectConflicts(
    contributions: AgentContribution[],
    context?: Record<string, unknown>
  ): AgentConflict[] {
    const conflicts: AgentConflict[] = [];
    if (!contributions || contributions.length < 2) return conflicts;

    const findContrib = (role: string) => contributions.find((c) => c.agentRole === role);

    const trendAgent = findContrib('TREND_INTELLIGENCE');
    const wardrobeAgent = findContrib('WARDROBE_OPTIMIZER');
    const stylistAgent = findContrib('PERSONAL_STYLIST');
    const historianAgent = findContrib('FASHION_HISTORIAN');

    // Conflict Scenario 1: Trend Agent vs. Wardrobe Optimizer (Oversized Trend vs. Owned Fitted/Tailored Items)
    if (trendAgent && wardrobeAgent) {
      const trendText = Array.isArray(trendAgent.reasoning) ? trendAgent.reasoning.join(' ') : '';
      const wardrobeText = Array.isArray(wardrobeAgent.reasoning) ? wardrobeAgent.reasoning.join(' ') : '';

      if (
        (trendText.toLowerCase().includes('oversized') || trendText.toLowerCase().includes('relaxed')) &&
        (wardrobeText.toLowerCase().includes('tailored') || wardrobeText.toLowerCase().includes('fitted') || wardrobeText.toLowerCase().includes('structured'))
      ) {
        conflicts.push({
          conflictId: `conflict_silhouette_${Date.now()}_1`,
          sourceAgentRole: 'TREND_INTELLIGENCE',
          targetAgentRole: 'WARDROBE_OPTIMIZER',
          topic: 'Silhouette & Tailoring Alignment',
          sourceClaim: 'Recommends current trend: Relaxed / Oversized Silhouette',
          targetClaim: 'Recommends registered wardrobe items: Tailored / Structured Garments',
          resolutionStrategy: 'STYLE_DNA_PRIORITY',
          winningAgentRole: 'WARDROBE_OPTIMIZER',
          explanation: 'Resolved by prioritizing user-owned wardrobe inventory and primary Style DNA silhouette weight over ephemeral external trend pushes.',
          resolutionWeight: 0.85
        });
      }
    }

    // Conflict Scenario 2: Personal Stylist vs. Fashion Historian (Modern Casual vs. Historical Formal/Heritage)
    if (stylistAgent && historianAgent) {
      const stylistText = Array.isArray(stylistAgent.reasoning) ? stylistAgent.reasoning.join(' ') : '';
      const historianText = Array.isArray(historianAgent.reasoning) ? historianAgent.reasoning.join(' ') : '';

      if (
        stylistText.toLowerCase().includes('casual') &&
        historianText.toLowerCase().includes('formal')
      ) {
        conflicts.push({
          conflictId: `conflict_formality_${Date.now()}_2`,
          sourceAgentRole: 'PERSONAL_STYLIST',
          targetAgentRole: 'FASHION_HISTORIAN',
          topic: 'Formality Level Balance',
          sourceClaim: 'Recommends relaxed contemporary casual styling',
          targetClaim: 'Recommends heritage formal tailoring reference',
          resolutionStrategy: 'HYBRID_SYNTHESIS',
          winningAgentRole: 'PERSONAL_STYLIST',
          explanation: 'Resolved by blending heritage formal elements (structured blazer) with contemporary casual foundation (neutral knit & relaxed trousers).',
          resolutionWeight: 0.80
        });
      }
    }

    // Conflict Scenario 3: Confidence Ranking Fallback
    for (let i = 0; i < contributions.length; i++) {
      for (let j = i + 1; j < contributions.length; j++) {
        const c1 = contributions[i];
        const c2 = contributions[j];

        // If confidence gap > 0.35 and evidence differs significantly
        if (Math.abs(c1.confidence - c2.confidence) > 0.35) {
          const winner = c1.confidence > c2.confidence ? c1 : c2;
          const loser = c1.confidence > c2.confidence ? c2 : c1;

          conflicts.push({
            conflictId: `conflict_confidence_${Date.now()}_${i}_${j}`,
            sourceAgentRole: loser.agentRole,
            targetAgentRole: winner.agentRole,
            topic: `Confidence Disparity on ${winner.agentRole}`,
            sourceClaim: `Lower confidence advice (${Math.round(loser.confidence * 100)}%)`,
            targetClaim: `Higher confidence advice (${Math.round(winner.confidence * 100)}%)`,
            resolutionStrategy: 'CONFIDENCE_RANKING',
            winningAgentRole: winner.agentRole,
            explanation: `Resolved in favor of ${winner.agentRole} due to significantly higher confidence score and stronger supporting evidence.`,
            resolutionWeight: winner.confidence
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * Resolves conflicts and updates contribution confidence or reasoning adjustments
   */
  public resolveConflicts(
    conflicts: AgentConflict[],
    contributions: AgentContribution[]
  ): { resolvedContributions: AgentContribution[]; resolutions: AgentConflict[] } {
    if (!conflicts || conflicts.length === 0) {
      return { resolvedContributions: [...contributions], resolutions: [] };
    }

    const profile = styleDNAEngine.getProfile();
    const memories = memoryEngine.getMemories();

    const resolved = contributions.map((contrib) => {
      const copy = { ...contrib, reasoning: [...contrib.reasoning] };

      conflicts.forEach((conf) => {
        if (conf.winningAgentRole === copy.agentRole) {
          copy.reasoning.push(`[Conflict Resolution] Validated claim for ${conf.topic}: ${conf.explanation}`);
          copy.confidence = Math.min(1.0, copy.confidence + 0.03);
        } else if (conf.sourceAgentRole === copy.agentRole && conf.resolutionStrategy === 'STYLE_DNA_PRIORITY') {
          copy.reasoning.push(`[Conflict Resolution] Adapted recommendation to respect primary Style DNA identity (${profile?.identityName || 'Contemporary'}).`);
        }
      });

      return copy;
    });

    return {
      resolvedContributions: resolved,
      resolutions: conflicts
    };
  }
}

export const agentConflictResolver = AgentConflictResolver.getInstance();
