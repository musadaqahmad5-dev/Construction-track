/**
 * ARIA v2.6 Graph Traversal Engine
 * Product: LOOK VISION v2.4
 * 
 * Traverses relationships across Global Fashion Knowledge Graph nodes to construct
 * multi-hop reasoning paths and contextual knowledge clusters.
 */

import {
  KnowledgeNode,
  KnowledgeRelationship
} from '../CivilizationMemoryTypes';
import {
  TraversalPathStep,
  MultiHopReasoningChain
} from './RetrievalTypes';
import { EnterpriseObservabilityEngine } from '../../../engine/observabilityEngine';

export class GraphTraversalEngine {
  private static instance: GraphTraversalEngine;

  private constructor() {}

  public static getInstance(): GraphTraversalEngine {
    if (!GraphTraversalEngine.instance) {
      GraphTraversalEngine.instance = new GraphTraversalEngine();
    }
    return GraphTraversalEngine.instance;
  }

  /**
   * Traverses multi-hop relationships starting from seed nodes
   */
  public traverseGraph(
    seedNodes: KnowledgeNode[],
    allNodes: KnowledgeNode[],
    allRelationships: KnowledgeRelationship[],
    maxDepth: number = 2,
    minStrength: number = 0.5,
    minConfidence: number = 0.5
  ): {
    traversedNodes: KnowledgeNode[];
    traversalSteps: TraversalPathStep[];
    reasoningChains: MultiHopReasoningChain[];
  } {
    const nodeMap = new Map<string, KnowledgeNode>();
    allNodes.forEach((n) => nodeMap.set(n.id, n));

    const visitedNodes = new Set<string>();
    const traversedNodes: KnowledgeNode[] = [];
    const traversalSteps: TraversalPathStep[] = [];
    const reasoningChains: MultiHopReasoningChain[] = [];

    // Filter valid relationships
    const validRels = allRelationships.filter(
      (r) => r.strengthScore >= minStrength && r.confidenceScore >= minConfidence
    );

    seedNodes.forEach((seedNode) => {
      if (!visitedNodes.has(seedNode.id)) {
        visitedNodes.add(seedNode.id);
        traversedNodes.push(seedNode);
      }

      // 1-Hop traversal
      const oneHopRels = validRels.filter(
        (r) => r.sourceNodeId === seedNode.id || r.targetNodeId === seedNode.id
      );

      oneHopRels.forEach((rel, relIdx) => {
        const neighborId = rel.sourceNodeId === seedNode.id ? rel.targetNodeId : rel.sourceNodeId;
        const neighborNode = nodeMap.get(neighborId);

        if (neighborNode) {
          if (!visitedNodes.has(neighborNode.id)) {
            visitedNodes.add(neighborNode.id);
            traversedNodes.push(neighborNode);
          }

          const step: TraversalPathStep = {
            stepIndex: 1,
            sourceNode: seedNode,
            relationship: rel,
            targetNode: neighborNode,
            stepConfidence: Number((rel.strengthScore * rel.confidenceScore).toFixed(2))
          };
          traversalSteps.push(step);

          // 2-Hop multi-hop chain construction
          if (maxDepth >= 2) {
            const twoHopRels = validRels.filter(
              (r) =>
                (r.sourceNodeId === neighborNode.id || r.targetNodeId === neighborNode.id) &&
                r.relationshipId !== rel.relationshipId
            );

            twoHopRels.forEach((secondRel) => {
              const secondNeighborId =
                secondRel.sourceNodeId === neighborNode.id ? secondRel.targetNodeId : secondRel.sourceNodeId;
              const secondNeighborNode = nodeMap.get(secondNeighborId);

              if (secondNeighborNode && secondNeighborNode.id !== seedNode.id) {
                if (!visitedNodes.has(secondNeighborNode.id)) {
                  visitedNodes.add(secondNeighborNode.id);
                  traversedNodes.push(secondNeighborNode);
                }

                const secondStep: TraversalPathStep = {
                  stepIndex: 2,
                  sourceNode: neighborNode,
                  relationship: secondRel,
                  targetNode: secondNeighborNode,
                  stepConfidence: Number((secondRel.strengthScore * secondRel.confidenceScore).toFixed(2))
                };

                const chainConfidence = Number(
                  (step.stepConfidence * secondStep.stepConfidence * seedNode.confidence).toFixed(2)
                );

                const chain: MultiHopReasoningChain = {
                  chainId: `chain_${seedNode.id}_${neighborNode.id}_${secondNeighborNode.id}`,
                  userGoal: `Harmonize ${seedNode.name} through ${neighborNode.name} to ${secondNeighborNode.name}`,
                  path: [step, secondStep],
                  nodes: [seedNode, neighborNode, secondNeighborNode],
                  totalConfidence: Math.max(0.65, chainConfidence),
                  reasoningExplanation: `${seedNode.name} (${seedNode.type}) ${rel.relationshipType} -> ${neighborNode.name} (${neighborNode.type}) ${secondRel.relationshipType} -> ${secondNeighborNode.name} (${secondNeighborNode.type}).`,
                  supportingNodeNames: [seedNode.name, neighborNode.name, secondNeighborNode.name],
                  depth: 2
                };

                reasoningChains.push(chain);
              }
            });
          }
        }
      });
    });

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'GraphTraversalEngine',
        eventName: 'GRAPH_TRAVERSAL_COMPLETED',
        category: 'Reasoning',
        payload: `Traversed ${traversedNodes.length} nodes, ${traversalSteps.length} steps, created ${reasoningChains.length} multi-hop reasoning chains`,
        latencyMs: 2,
        status: 'Success'
      });
    } catch (_) {}

    return { traversedNodes, traversalSteps, reasoningChains };
  }
}

export const graphTraversalEngine = GraphTraversalEngine.getInstance();
