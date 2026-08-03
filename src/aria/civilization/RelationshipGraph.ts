/**
 * ARIA v2.5 Relationship Graph Engine
 * Product: LOOK VISION v2.4
 */

import { KnowledgeEdge, KnowledgeGraphData, MemoryNodeRef } from './CivilizationMemoryTypes';

export class RelationshipGraph {
  public static findConnectedEdges(nodeId: string, graph: KnowledgeGraphData): KnowledgeEdge[] {
    return graph.edges.filter(
      (e) => e.sourceNodeId === nodeId || e.targetNodeId === nodeId
    );
  }

  public static findRelatedNodes(nodeId: string, graph: KnowledgeGraphData): MemoryNodeRef[] {
    const edges = this.findConnectedEdges(nodeId, graph);
    const relatedIds = new Set<string>();

    edges.forEach((e) => {
      if (e.sourceNodeId !== nodeId) relatedIds.add(e.sourceNodeId);
      if (e.targetNodeId !== nodeId) relatedIds.add(e.targetNodeId);
    });

    return graph.nodes.filter((n) => relatedIds.has(n.nodeId));
  }
}
