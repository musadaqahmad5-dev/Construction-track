/**
 * ARIA v2.6 Retrieval Decision Bridge
 * Product: LOOK VISION v2.4
 * 
 * Bridges Civilization Knowledge Retrieval & Reasoning Engine outputs with ARIA Contextual Decision Engine.
 * Provides supplementary intelligence inputs without modifying core Decision Engine scoring logic.
 */

import {
  KnowledgeQueryParser
} from './KnowledgeQueryParser';
import {
  GraphTraversalEngine
} from './GraphTraversalEngine';
import {
  KnowledgeRankingEngine
} from './KnowledgeRankingEngine';
import {
  SemanticFashionReasoningEngine
} from './SemanticFashionReasoningEngine';
import {
  RetrievalStorage
} from './RetrievalStorage';
import {
  RetrievalCacheEntry,
  ParsedUserIntent,
  MultiHopReasoningChain,
  RankedKnowledgeResult
} from './RetrievalTypes';
import { KnowledgeQueryResult, KnowledgeNodeType } from '../CivilizationMemoryTypes';
import { civilizationKnowledgeStorage } from '../CivilizationKnowledgeStorage';
import { styleDNAEngine } from '../../styleDNA/StyleDNAEngine';
import { memoryEngine } from '../../memory/MemoryEngine';
import { EnterpriseObservabilityEngine } from '../../../engine/observabilityEngine';

export interface DecisionIntelligenceInputs {
  userId: string;
  parsedIntent: ParsedUserIntent;
  queryResult: KnowledgeQueryResult;
  rankedKnowledgeNodes: RankedKnowledgeResult[];
  multiHopReasoningChains: MultiHopReasoningChain[];
  semanticReasoningSignals: Array<{
    signalId: string;
    nodeName: string;
    nodeType: KnowledgeNodeType;
    explanation: string;
    confidence: number;
  }>;
  overallReasoningConfidence: number;
  synthesisSummary: string;
  retrievedAt: string;
  latencyMs: number;
}

export class RetrievalDecisionBridge {
  private static instance: RetrievalDecisionBridge;

  private constructor() {}

  public static getInstance(): RetrievalDecisionBridge {
    if (!RetrievalDecisionBridge.instance) {
      RetrievalDecisionBridge.instance = new RetrievalDecisionBridge();
    }
    return RetrievalDecisionBridge.instance;
  }

  /**
   * Generates comprehensive Civilization Decision Intelligence Inputs for ARIA Decision Engine
   */
  public async getDecisionContextInputs(
    rawRequest?: {
      userPrompt?: string;
      occasion?: string;
      season?: string;
      styleGoals?: string[];
      personality?: string;
      wardrobeContext?: string;
      formalityRequirement?: number;
      preferredPalette?: string[];
    },
    userId: string = 'guest_user'
  ): Promise<DecisionIntelligenceInputs> {
    const startTime = performance.now();

    // 1. Parse user intent & build query
    const parsedIntent = KnowledgeQueryParser.parseUserIntent(rawRequest || {}, userId);
    const query = KnowledgeQueryParser.buildQuery(parsedIntent, userId);

    // 2. Fetch Knowledge Graph & Personal Connections
    const nodes = await civilizationKnowledgeStorage.fetchAllKnowledgeNodes();
    const rels = await civilizationKnowledgeStorage.fetchAllKnowledgeRelationships();
    const pconns = await civilizationKnowledgeStorage.fetchPersonalConnections(userId);

    // 3. Graph Traversal for multi-hop relationships
    const seedNodes = nodes.filter((n) =>
      parsedIntent.targetNodeTypes.includes(n.type) ||
      n.name.toLowerCase().includes(parsedIntent.rawPrompt.toLowerCase())
    );
    const traversal = GraphTraversalEngine.getInstance().traverseGraph(
      seedNodes.length > 0 ? seedNodes : nodes.slice(0, 5),
      nodes,
      rels,
      2,
      0.5,
      0.5
    );

    // 4. Rank Nodes against Style DNA & Context
    const styleDNA = styleDNAEngine.getProfile();
    const memories = memoryEngine.getMemories();
    const rankedNodes = KnowledgeRankingEngine.getInstance().rankNodes(
      traversal.traversedNodes.length > 0 ? traversal.traversedNodes : nodes,
      parsedIntent,
      styleDNA,
      pconns,
      memories
    );

    // 5. Generate Semantic Reasoning & Multi-Hop Chains
    const semanticOutput = SemanticFashionReasoningEngine.getInstance().generateSemanticReasoning(
      parsedIntent,
      rankedNodes,
      traversal.reasoningChains,
      styleDNA
    );

    const latencyMs = Math.round(performance.now() - startTime);

    // Construct KnowledgeQueryResult
    const queryResult: KnowledgeQueryResult = {
      queryText: parsedIntent.rawPrompt,
      matchedNodes: rankedNodes.map((r) => r.node).slice(0, 15),
      personalConnections: pconns,
      relevantRelationships: rels,
      confidenceScore: semanticOutput.overallReasoningConfidence,
      reasoningSignals: semanticOutput.reasoningSignals,
      retrievedAt: new Date().toISOString(),
      latencyMs
    };

    const cacheEntry: RetrievalCacheEntry = {
      cacheId: `ret_cache_${userId}_${Date.now()}`,
      queryHash: `hash_${parsedIntent.rawPrompt.replace(/\s+/g, '_')}`,
      userId,
      parsedIntent,
      queryResult,
      reasoningChains: semanticOutput.primaryReasoningChains,
      rankedResults: rankedNodes.slice(0, 10),
      createdAt: new Date().toISOString(),
      latencyMs
    };

    // Save retrieval cache entry
    RetrievalStorage.getInstance().saveRetrievalEntry(cacheEntry).catch(() => {});

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'RetrievalDecisionBridge',
        eventName: 'DECISION_INTELLIGENCE_INPUTS_BRIDGED',
        category: 'Reasoning',
        payload: `Bridged ${rankedNodes.length} ranked nodes and ${semanticOutput.primaryReasoningChains.length} multi-hop reasoning chains for user ${userId}`,
        latencyMs,
        status: 'Success'
      });
    } catch (_) {}

    return {
      userId,
      parsedIntent,
      queryResult,
      rankedKnowledgeNodes: rankedNodes,
      multiHopReasoningChains: semanticOutput.primaryReasoningChains,
      semanticReasoningSignals: semanticOutput.reasoningSignals,
      overallReasoningConfidence: semanticOutput.overallReasoningConfidence,
      synthesisSummary: semanticOutput.synthesisSummary,
      retrievedAt: new Date().toISOString(),
      latencyMs
    };
  }
}

export const retrievalDecisionBridge = RetrievalDecisionBridge.getInstance();
