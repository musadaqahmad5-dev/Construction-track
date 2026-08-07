/**
 * ARIA v2.5 Civilization Relationship Engine
 * Product: LOOK VISION v2.4
 * 
 * Manages relationships between Global Fashion Knowledge Nodes and Personal Style DNA/Memories.
 * Computes relationship strength scores (0.0 - 1.0) and confidence metrics.
 */

import {
  KnowledgeNode,
  KnowledgeRelationship,
  KnowledgeRelationshipType,
  KnowledgeNodeType,
  PersonalKnowledgeConnection
} from './CivilizationMemoryTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class RelationshipEngine {
  private static instance: RelationshipEngine;

  private constructor() {}

  public static getInstance(): RelationshipEngine {
    if (!RelationshipEngine.instance) {
      RelationshipEngine.instance = new RelationshipEngine();
    }
    return RelationshipEngine.instance;
  }

  /**
   * Creates a structured Knowledge Relationship between two nodes
   */
  public createRelationship(
    sourceNodeId: string,
    targetNodeId: string,
    relationshipType: KnowledgeRelationshipType,
    strengthScore: number = 0.8,
    confidenceScore: number = 0.85,
    evidence?: string
  ): KnowledgeRelationship {
    const clampedStrength = Math.min(1.0, Math.max(0.0, strengthScore));
    const clampedConfidence = Math.min(1.0, Math.max(0.0, confidenceScore));

    const rel: KnowledgeRelationship = {
      relationshipId: `rel_${sourceNodeId}_${targetNodeId}_${Date.now()}`,
      relationshipType,
      sourceNodeId,
      targetNodeId,
      strengthScore: Number(clampedStrength.toFixed(2)),
      confidenceScore: Number(clampedConfidence.toFixed(2)),
      evidence: evidence || `${sourceNodeId} ${relationshipType} ${targetNodeId}`,
      createdAt: new Date().toISOString()
    };

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'RelationshipEngine',
        eventName: 'RELATIONSHIP_CREATED',
        category: 'Reasoning',
        payload: `Mapped ${rel.sourceNodeId} [${rel.relationshipType}] -> ${rel.targetNodeId} (Strength: ${rel.strengthScore}, Confidence: ${rel.confidenceScore})`,
        latencyMs: 1,
        status: 'Success'
      });
    } catch (_) {}

    return rel;
  }

  /**
   * Finds all relationships connected to a specific node
   */
  public findConnectedRelationships(
    nodeId: string,
    allRelationships: KnowledgeRelationship[],
    minStrength: number = 0.0,
    minConfidence: number = 0.0
  ): KnowledgeRelationship[] {
    return allRelationships.filter((rel) => {
      const isConnected = rel.sourceNodeId === nodeId || rel.targetNodeId === nodeId;
      const meetsStrength = rel.strengthScore >= minStrength;
      const meetsConfidence = rel.confidenceScore >= minConfidence;
      return isConnected && meetsStrength && meetsConfidence;
    });
  }

  /**
   * Evaluates compatibility between a Knowledge Node and user's Style DNA Profile
   */
  public evaluateDNACompatibility(
    node: KnowledgeNode,
    styleDNA: StyleDNAProfile | null
  ): { isCompatible: boolean; affinityScore: number; reason: string } {
    if (!styleDNA) {
      return {
        isCompatible: true,
        affinityScore: 0.5,
        reason: 'Default neutral compatibility in absence of Style DNA profile'
      };
    }

    const nodeNameLower = node.name.toLowerCase();
    const dnaArchetypeLower = styleDNA.identityName.toLowerCase();
    const silhouetteValues = (styleDNA.silhouetteProfile || []).map((s) => String(s.value).toLowerCase());
    const materialValues = (styleDNA.materialProfile || []).map((m) => String(m.value).toLowerCase());
    const brandValues = (styleDNA.brandAffinity || []).map((b) => String(b.value).toLowerCase());

    // Direct archetype match
    if (nodeNameLower.includes(dnaArchetypeLower) || dnaArchetypeLower.includes(nodeNameLower)) {
      return {
        isCompatible: true,
        affinityScore: 0.98,
        reason: `Direct synergy with user's core archetype: ${styleDNA.identityName}`
      };
    }

    // Silhouette or material or brand match
    const profileMatch = [...silhouetteValues, ...materialValues, ...brandValues].some((val) => 
      nodeNameLower.includes(val) || node.description.toLowerCase().includes(val)
    );
    if (profileMatch) {
      return {
        isCompatible: true,
        affinityScore: 0.88,
        reason: `Matches user's active Style DNA traits (${[...silhouetteValues, ...materialValues].slice(0, 3).join(', ')})`
      };
    }

    // Color check against DNA color profile
    const colorMatch = (styleDNA.colorProfile || []).some((c) => nodeNameLower.includes(String(c.value).toLowerCase()));
    if (colorMatch) {
      return {
        isCompatible: true,
        affinityScore: 0.82,
        reason: `Harmonizes with user's Style DNA color palette`
      };
    }


    return {
      isCompatible: true,
      affinityScore: 0.65,
      reason: `General compatibility with user fashion domain`
    };
  }

  /**
   * Generates Personal Knowledge Connections bridging Global Nodes to user context
   */
  public buildPersonalConnection(
    userId: string,
    node: KnowledgeNode,
    affinityScore: number,
    source: string = 'Style DNA'
  ): PersonalKnowledgeConnection {
    return {
      connectionId: `pconn_${userId}_${node.id}`,
      userId,
      nodeId: node.id,
      nodeType: node.type,
      nodeName: node.name,
      affinityScore: Number(affinityScore.toFixed(2)),
      source,
      lastConnectedAt: new Date().toISOString()
    };
  }
}

export const relationshipEngine = RelationshipEngine.getInstance();
