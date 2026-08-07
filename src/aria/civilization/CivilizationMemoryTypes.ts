/**
 * ARIA v2.5 Civilization Memory Types
 * Product: LOOK VISION v2.4
 */

export type MemoryDomainType =
  | 'personal'
  | 'fashion'
  | 'creative'
  | 'decision'
  | 'simulation'
  | 'visual'
  | 'digital_twin'
  | 'community_metadata';

export interface MemoryNodeRef {
  nodeId: string;
  domain: MemoryDomainType;
  sourceId: string;
  title: string;
  summary: string;
  tags: string[];
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

export type RelationshipType =
  | 'ENHANCES'
  | 'DERIVED_FROM'
  | 'INFLUENCES'
  | 'CONTRADICTS'
  | 'TEMPORALLY_FOLLOWS'
  | 'VALIDATES';

export interface KnowledgeEdge {
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationship: RelationshipType;
  weight: number;
  evidence: string;
  createdAt: string;
}

export interface KnowledgeGraphData {
  nodes: MemoryNodeRef[];
  edges: KnowledgeEdge[];
  lastUpdated: string;
}

export interface TemporalSnapshot {
  snapshotId: string;
  timestamp: string;
  activeNodesCount: number;
  activeEdgesCount: number;
  dominantTheme: string;
  evolutionSummary: string;
}

export interface SearchQueryOptions {
  query: string;
  domain?: MemoryDomainType;
  minConfidence?: number;
  limit?: number;
}

export interface SearchResultItem {
  node: MemoryNodeRef;
  relevanceScore: number;
  connectedEdges: KnowledgeEdge[];
}

export interface CivilizationMemoryEngineStatus {
  isInitialized: boolean;
  isIndexing: boolean;
  totalIndexedNodes: number;
  totalGraphEdges: number;
  lastIndexedAt?: string;
  lastError?: string;
}

// ============================================================================
// TASK 1 — ARIA CIVILIZATION KNOWLEDGE GRAPH CORE TYPES
// ============================================================================

export type KnowledgeNodeType =
  | 'Style Archetype'
  | 'Fashion Era'
  | 'Designer'
  | 'Brand'
  | 'Material'
  | 'Color Theory'
  | 'Silhouette'
  | 'Cultural Pattern'
  | 'Trend'
  | 'Occasion';

export type KnowledgeRelationshipType =
  | 'CONNECTED_TO'
  | 'INFLUENCED_BY'
  | 'SUITABLE_FOR'
  | 'COMPATIBLE_WITH'
  | 'DERIVED_FROM'
  | 'ENHANCES'
  | 'VALIDATES'
  | 'CONTRADICTS';

export interface KnowledgeRelationship {
  relationshipId: string;
  relationshipType: KnowledgeRelationshipType;
  sourceNodeId: string;
  targetNodeId: string;
  strengthScore: number; // 0.0 to 1.0
  confidenceScore: number; // 0.0 to 1.0
  evidence?: string;
  createdAt?: string;
}

export interface KnowledgeNode {
  id: string;
  type: KnowledgeNodeType;
  name: string;
  description: string;
  metadata: Record<string, unknown>;
  relationships: KnowledgeRelationship[];
  confidence: number; // 0.0 to 1.0
  vectorEmbedding?: number[]; // Future vector indexing compatibility
  createdAt: string;
  updatedAt: string;
}

export interface PersonalKnowledgeConnection {
  connectionId: string;
  userId: string;
  nodeId: string;
  nodeType: KnowledgeNodeType;
  nodeName: string;
  affinityScore: number; // 0.0 to 1.0
  source: string; // e.g. 'Style DNA', 'Personal Memory', 'Wardrobe Synergy'
  lastConnectedAt: string;
}

export interface KnowledgeRetrievalQuery {
  queryText: string;
  userId?: string;
  targetNodeTypes?: KnowledgeNodeType[];
  minConfidence?: number;
  minStrength?: number;
  limit?: number;
}

export interface KnowledgeQueryResult {
  queryText: string;
  matchedNodes: KnowledgeNode[];
  personalConnections: PersonalKnowledgeConnection[];
  relevantRelationships: KnowledgeRelationship[];
  confidenceScore: number; // 0.0 to 1.0
  reasoningSignals: Array<{
    signalId: string;
    nodeName: string;
    nodeType: KnowledgeNodeType;
    explanation: string;
    confidence: number;
  }>;
  retrievedAt: string;
  latencyMs: number;
}

