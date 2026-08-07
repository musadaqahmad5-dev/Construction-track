/**
 * ARIA v2.6 Civilization Intelligence Retrieval & Reasoning Types
 * Product: LOOK VISION v2.4
 */

import {
  KnowledgeNode,
  KnowledgeRelationship,
  KnowledgeNodeType,
  PersonalKnowledgeConnection,
  KnowledgeQueryResult
} from '../CivilizationMemoryTypes';

export interface ParsedUserIntent {
  rawPrompt: string;
  occasion?: string;
  season?: string;
  styleGoals: string[];
  personalityTraits: string[];
  wardrobeContext?: string;
  targetNodeTypes: KnowledgeNodeType[];
  preferredPalette: string[];
  formalityRequirement: number; // 0.0 to 1.0
  extractedKeywords: string[];
}

export interface TraversalPathStep {
  stepIndex: number;
  sourceNode: KnowledgeNode;
  relationship: KnowledgeRelationship;
  targetNode: KnowledgeNode;
  stepConfidence: number;
}

export interface MultiHopReasoningChain {
  chainId: string;
  userGoal: string;
  path: TraversalPathStep[];
  nodes: KnowledgeNode[];
  totalConfidence: number; // 0.0 to 1.0
  reasoningExplanation: string;
  supportingNodeNames: string[];
  depth: number;
}

export interface RankedKnowledgeResult {
  node: KnowledgeNode;
  totalScore: number; // 0.0 to 1.0
  breakdown: {
    styleDnaMatch: number;
    personalAffinity: number;
    relationshipConfidence: number;
    contextRelevance: number;
    historicalAcceptance: number;
  };
  embeddingReady: boolean;
  vectorSimilarityScore?: number;
  semanticTags?: string[];
}

export interface VectorSearchMeta {
  embeddingReady: boolean;
  vectorSimilarityScore?: number;
  semanticTags?: string[];
}

export interface RetrievalCacheEntry {
  cacheId: string;
  queryHash: string;
  userId: string;
  parsedIntent: ParsedUserIntent;
  queryResult: KnowledgeQueryResult;
  reasoningChains: MultiHopReasoningChain[];
  rankedResults: RankedKnowledgeResult[];
  createdAt: string;
  latencyMs: number;
}
