/**
 * ARIA v2.6 Knowledge Ranking Engine
 * Product: LOOK VISION v2.4
 * 
 * Ranks retrieved Knowledge Graph nodes against Style DNA, personal affinity,
 * context relevance, relationship confidence, and historical acceptance.
 */

import {
  KnowledgeNode,
  PersonalKnowledgeConnection
} from '../CivilizationMemoryTypes';
import {
  ParsedUserIntent,
  RankedKnowledgeResult
} from './RetrievalTypes';
import { StyleDNAProfile } from '../../styleDNA/StyleDNATypes';
import { FashionMemoryItem } from '../../memory/MemoryTypes';
import { relationshipEngine } from '../RelationshipEngine';

export class KnowledgeRankingEngine {
  private static instance: KnowledgeRankingEngine;

  private constructor() {}

  public static getInstance(): KnowledgeRankingEngine {
    if (!KnowledgeRankingEngine.instance) {
      KnowledgeRankingEngine.instance = new KnowledgeRankingEngine();
    }
    return KnowledgeRankingEngine.instance;
  }

  /**
   * Ranks Knowledge Nodes with multi-factor scoring and attaches vector readiness metadata
   */
  public rankNodes(
    nodes: KnowledgeNode[],
    userIntent: ParsedUserIntent,
    styleDNA: StyleDNAProfile | null,
    personalConnections: PersonalKnowledgeConnection[],
    memories: FashionMemoryItem[] = []
  ): RankedKnowledgeResult[] {
    const connMap = new Map<string, PersonalKnowledgeConnection>();
    personalConnections.forEach((c) => connMap.set(c.nodeId, c));

    const ranked: RankedKnowledgeResult[] = nodes.map((node) => {
      // 1. Style DNA Compatibility (Weight 0.30)
      const dnaEval = relationshipEngine.evaluateDNACompatibility(node, styleDNA);
      const styleDnaMatch = dnaEval.affinityScore;

      // 2. Personal Affinity (Weight 0.25)
      const conn = connMap.get(node.id);
      const personalAffinity = conn ? conn.affinityScore : 0.6;

      // 3. Relationship Confidence (Weight 0.20)
      const relationshipConfidence = node.confidence;

      // 4. Context Relevance (Weight 0.15)
      let contextRelevance = 0.7;
      const nodeText = `${node.name} ${node.description} ${node.type}`.toLowerCase();
      if (userIntent.occasion && nodeText.includes(userIntent.occasion.toLowerCase())) {
        contextRelevance += 0.2;
      }
      if (userIntent.season && nodeText.includes(userIntent.season.toLowerCase())) {
        contextRelevance += 0.1;
      }
      userIntent.extractedKeywords.forEach((kw) => {
        if (nodeText.includes(kw)) contextRelevance += 0.05;
      });
      contextRelevance = Math.min(1.0, contextRelevance);

      // 5. Historical Acceptance (Weight 0.10)
      let historicalAcceptance = 0.85;
      const negativeMemories = memories.filter(
        (m) => m.category === 'user_correction' || (m.category === 'color_preference' && m.confidence < 0.3)
      );
      if (negativeMemories.some((m) => nodeText.includes(String(m.value).toLowerCase()))) {
        historicalAcceptance = 0.3;
      }

      // Total Weighted Score calculation
      const totalScore = Number(
        (
          styleDnaMatch * 0.3 +
          personalAffinity * 0.25 +
          relationshipConfidence * 0.2 +
          contextRelevance * 0.15 +
          historicalAcceptance * 0.1
        ).toFixed(2)
      );

      // Semantic Tags & Vector Similarity Preparation
      const semanticTags = [
        node.type.toLowerCase().replace(/\s+/g, '_'),
        node.name.toLowerCase().replace(/\s+/g, '_'),
        ...userIntent.extractedKeywords
      ];

      return {
        node,
        totalScore,
        breakdown: {
          styleDnaMatch,
          personalAffinity,
          relationshipConfidence,
          contextRelevance,
          historicalAcceptance
        },
        embeddingReady: true,
        vectorSimilarityScore: Number((totalScore * 0.95).toFixed(2)),
        semanticTags
      };
    });

    // Sort descending by totalScore
    ranked.sort((a, b) => b.totalScore - a.totalScore);
    return ranked;
  }
}

export const knowledgeRankingEngine = KnowledgeRankingEngine.getInstance();
