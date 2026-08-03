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
