/**
 * ARIA v2.5 Knowledge Consolidator
 * Product: LOOK VISION v2.4
 */

import { KnowledgeGraphData } from './CivilizationMemoryTypes';

export class KnowledgeConsolidator {
  public static consolidate(graph: KnowledgeGraphData): KnowledgeGraphData {
    // Ensure all node IDs are unique
    const nodeMap = new Map<string, typeof graph.nodes[0]>();
    graph.nodes.forEach((n) => {
      nodeMap.set(n.nodeId, n);
    });

    const uniqueNodes = Array.from(nodeMap.values());

    // Filter valid edges
    const validEdges = graph.edges.filter(
      (e) => nodeMap.has(e.sourceNodeId) && nodeMap.has(e.targetNodeId)
    );

    return {
      nodes: uniqueNodes,
      edges: validEdges,
      lastUpdated: new Date().toISOString()
    };
  }
}
