/**
 * ARIA v2.5 Memory Search Engine
 * Product: LOOK VISION v2.4
 */

import {
  KnowledgeGraphData,
  SearchQueryOptions,
  SearchResultItem
} from './CivilizationMemoryTypes';
import { RelationshipGraph } from './RelationshipGraph';

export class MemorySearchEngine {
  public static search(
    queryOptions: SearchQueryOptions,
    graph: KnowledgeGraphData
  ): SearchResultItem[] {
    const q = queryOptions.query.toLowerCase().trim();
    const limit = queryOptions.limit || 10;
    const minConf = queryOptions.minConfidence || 0.0;

    const results: SearchResultItem[] = [];

    graph.nodes.forEach((node) => {
      if (queryOptions.domain && node.domain !== queryOptions.domain) {
        return;
      }
      if (node.confidence < minConf) {
        return;
      }

      let relevanceScore = 0;
      if (node.title.toLowerCase().includes(q)) relevanceScore += 0.5;
      if (node.summary.toLowerCase().includes(q)) relevanceScore += 0.3;
      if (node.tags.some((t) => t.toLowerCase().includes(q))) relevanceScore += 0.4;

      // Match all items if query is empty or "*", or if relevanceScore > 0
      if (q === '' || q === '*' || relevanceScore > 0) {
        if (q === '' || q === '*') relevanceScore = node.confidence;

        const connectedEdges = RelationshipGraph.findConnectedEdges(node.nodeId, graph);
        results.push({
          node,
          relevanceScore: Math.min(1.0, relevanceScore),
          connectedEdges
        });
      }
    });

    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return results.slice(0, limit);
  }
}
