/**
 * ARIA v2.6 Semantic Fashion Reasoning Engine
 * Product: LOOK VISION v2.4
 * 
 * Converts Knowledge Graph traversal paths, ranked nodes, and user context into
 * structured semantic reasoning signals and multi-hop reasoning chains.
 */

import { KnowledgeNodeType } from '../CivilizationMemoryTypes';
import {
  ParsedUserIntent,
  RankedKnowledgeResult,
  MultiHopReasoningChain
} from './RetrievalTypes';
import { StyleDNAProfile } from '../../styleDNA/StyleDNATypes';
import { EnterpriseObservabilityEngine } from '../../../engine/observabilityEngine';

export class SemanticFashionReasoningEngine {
  private static instance: SemanticFashionReasoningEngine;

  private constructor() {}

  public static getInstance(): SemanticFashionReasoningEngine {
    if (!SemanticFashionReasoningEngine.instance) {
      SemanticFashionReasoningEngine.instance = new SemanticFashionReasoningEngine();
    }
    return SemanticFashionReasoningEngine.instance;
  }

  /**
   * Synthesizes ranked knowledge nodes and multi-hop chains into structured reasoning signals
   */
  public generateSemanticReasoning(
    intent: ParsedUserIntent,
    rankedResults: RankedKnowledgeResult[],
    rawChains: MultiHopReasoningChain[],
    styleDNA: StyleDNAProfile | null
  ): {
    primaryReasoningChains: MultiHopReasoningChain[];
    reasoningSignals: Array<{
      signalId: string;
      nodeName: string;
      nodeType: KnowledgeNodeType;
      explanation: string;
      confidence: number;
    }>;
    overallReasoningConfidence: number;
    synthesisSummary: string;
  } {
    const topRanked = rankedResults.slice(0, 6);

    // 1. Build reasoning signals from top ranked nodes
    const reasoningSignals = topRanked.map((item, idx) => {
      const node = item.node;
      const dnaName = styleDNA?.identityName || 'Personal Style DNA';
      const scorePct = Math.round(item.totalScore * 100);

      let explanation = `${node.name} (${node.type}): Provides ${scorePct}% synergy for ${intent.occasion || 'contextual look'}.`;
      if (node.type === 'Material') {
        explanation = `${node.name}: Selected for optimal breathability and luxury tactile drape during ${intent.season || 'the season'}.`;
      } else if (node.type === 'Style Archetype') {
        explanation = `${node.name}: Aligns directly with ${dnaName} core aesthetic principles (${scorePct}% match).`;
      } else if (node.type === 'Color Theory') {
        explanation = `${node.name}: Establishes clean visual harmony matching user's preferred palette (${intent.preferredPalette.slice(0, 2).join(', ')}).`;
      } else if (node.type === 'Silhouette') {
        explanation = `${node.name}: Delivers structured proportion and drape appropriate for formality level ${Math.round(intent.formalityRequirement * 100)}%.`;
      }

      return {
        signalId: `sem_sig_${node.id}_${idx}`,
        nodeName: node.name,
        nodeType: node.type,
        explanation,
        confidence: item.totalScore
      };
    });

    // 2. Refine multi-hop reasoning chains
    const primaryReasoningChains: MultiHopReasoningChain[] = rawChains.slice(0, 4).map((chain, idx) => {
      const nodes = chain.nodes;
      const nodeNames = nodes.map((n) => n.name).join(' → ');
      return {
        ...chain,
        chainId: `mhop_${idx}_${Date.now()}`,
        userGoal: intent.rawPrompt,
        reasoningExplanation: `Multi-hop synergy: ${nodeNames}. Connects ${nodes[0]?.name} to ${nodes[nodes.length - 1]?.name} for ${intent.occasion || 'targeted event'}.`,
        supportingNodeNames: nodes.map((n) => n.name)
      };
    });

    // Fallback chain if no traversal chains exist
    if (primaryReasoningChains.length === 0 && topRanked.length >= 2) {
      const n1 = topRanked[0].node;
      const n2 = topRanked[1].node;
      primaryReasoningChains.push({
        chainId: `mhop_fallback_${Date.now()}`,
        userGoal: intent.rawPrompt,
        path: [],
        nodes: [n1, n2],
        totalConfidence: 0.88,
        reasoningExplanation: `Direct synergy chain: ${n1.name} (${n1.type}) pairs seamlessly with ${n2.name} (${n2.type}) for ${intent.occasion}.`,
        supportingNodeNames: [n1.name, n2.name],
        depth: 1
      });
    }

    // 3. Compute overall reasoning confidence
    const overallReasoningConfidence = topRanked.length > 0
      ? Number((topRanked.reduce((acc, r) => acc + r.totalScore, 0) / topRanked.length).toFixed(2))
      : 0.85;

    // 4. Natural language synthesis summary
    const topConceptNames = topRanked.slice(0, 3).map((r) => r.node.name).join(', ');
    const synthesisSummary = `Civilization Knowledge Reasoning synthesizes ${topConceptNames} for "${intent.rawPrompt}". Contextual formality requirement: ${Math.round(intent.formalityRequirement * 100)}%, season: ${intent.season}.`;

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'SemanticFashionReasoningEngine',
        eventName: 'SEMANTIC_REASONING_GENERATED',
        category: 'Reasoning',
        payload: synthesisSummary,
        latencyMs: 1,
        status: 'Success'
      });
    } catch (_) {}

    return {
      primaryReasoningChains,
      reasoningSignals,
      overallReasoningConfidence,
      synthesisSummary
    };
  }
}

export const semanticFashionReasoningEngine = SemanticFashionReasoningEngine.getInstance();
