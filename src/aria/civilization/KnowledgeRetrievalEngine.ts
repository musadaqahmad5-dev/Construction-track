/**
 * ARIA v2.5 Civilization Knowledge Retrieval Engine
 * Product: LOOK VISION v2.4
 * 
 * Bridges Global Fashion Knowledge Graph with ARIA Personal Intelligence (Style DNA, Personal Memory, Decision Engine).
 * Evaluates contextual queries, retrieves compatible knowledge nodes, maps personal connections, and outputs reasoning signals.
 */

import {
  KnowledgeNode,
  KnowledgeRelationship,
  PersonalKnowledgeConnection,
  KnowledgeRetrievalQuery,
  KnowledgeQueryResult,
  KnowledgeNodeType
} from './CivilizationMemoryTypes';
import { civilizationKnowledgeStorage } from './CivilizationKnowledgeStorage';
import { relationshipEngine } from './RelationshipEngine';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';
import {
  KnowledgeQueryParser,
  GraphTraversalEngine,
  KnowledgeRankingEngine,
  SemanticFashionReasoningEngine
} from './retrieval';

export class KnowledgeRetrievalEngine {
  private static instance: KnowledgeRetrievalEngine;

  private seedNodes: KnowledgeNode[] = [
    {
      id: 'kn_archetype_minimalism',
      type: 'Style Archetype',
      name: 'Minimalism',
      description: 'Focuses on clean silhouettes, restrained color palettes, high-grade fabrics, and functional elegance.',
      metadata: { formality: 'versatile', popularity: 0.94, origin: 'Global' },
      relationships: [],
      confidence: 0.96,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_archetype_quiet_luxury',
      type: 'Style Archetype',
      name: 'Quiet Luxury',
      description: 'Understated, unbranded elegance utilizing ultra-premium textiles, precise tailoring, and neutral tones.',
      metadata: { formality: 'high', popularity: 0.91, origin: 'European Tailoring' },
      relationships: [],
      confidence: 0.95,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_era_90s_minimalism',
      type: 'Fashion Era',
      name: '1990s Minimalist Era',
      description: 'Defined by sleek monochrome lines, slip dresses, neutral tailoring, and anti-ostentatious design.',
      metadata: { keyDesigners: ['Helmut Lang', 'Jil Sander', 'Calvin Klein'] },
      relationships: [],
      confidence: 0.92,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_designer_phoebe_philo',
      type: 'Designer',
      name: 'Phoebe Philo',
      description: 'Renowned for defining modern women\'s wardrobe design through intelligent proportions, tactile fabrics, and empowering cuts.',
      metadata: { influenceIndex: 0.98, primaryHouses: ['Celine', 'Phoebe Philo'] },
      relationships: [],
      confidence: 0.94,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_brand_the_row',
      type: 'Brand',
      name: 'The Row',
      description: 'Pinnacle luxury fashion house specializing in immaculate tailoring, rare wools/cashmere, and timeless forms.',
      metadata: { marketSegment: 'Ultra Luxury', tier: 'Top' },
      relationships: [],
      confidence: 0.95,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_material_cashmere',
      type: 'Material',
      name: 'Loro Piana Cashmere',
      description: 'Ultra-soft, thermally adaptive natural fiber offering luxury drape and supreme tactile sensation.',
      metadata: { season: 'Autumn/Winter', breathability: 'High', warmth: 'High' },
      relationships: [],
      confidence: 0.98,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_color_monochrome_neutrals',
      type: 'Color Theory',
      name: 'Monochromatic Neutral Palette',
      description: 'Combines black, ivory, slate gray, and camel tone layers to maximize garment cross-compatibility.',
      metadata: { versatilityIndex: 0.99, mood: 'Sophisticated' },
      relationships: [],
      confidence: 0.97,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_silhouette_architectural_tailored',
      type: 'Silhouette',
      name: 'Tailored Architectural Silhouette',
      description: 'Structured shoulders, clean waist drapes, and elongated trouser lines providing commanding visual presence.',
      metadata: { bodyStructure: 'Structured', drapeType: 'Firm' },
      relationships: [],
      confidence: 0.93,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_pattern_parisian_chic',
      type: 'Cultural Pattern',
      name: 'Parisian Modern Chic',
      description: 'Effortless pairing of classic tailoring with casual accents, characterized by restraint and confidence.',
      metadata: { regionalAnchor: 'Paris, France', styleDensity: 'High' },
      relationships: [],
      confidence: 0.91,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_trend_sustainable_craftsmanship',
      type: 'Trend',
      name: 'Sustainable Artisanal Craftsmanship',
      description: 'Focus on enduring garment construction, traceable sourcing, and long-horizon wardrobe investment.',
      metadata: { longevity: 'Permanent', environmentalRating: 'High' },
      relationships: [],
      confidence: 0.94,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_occasion_executive_boardroom',
      type: 'Occasion',
      name: 'Executive Boardroom & Leadership',
      description: 'High-stakes formal environments requiring authoritative, polished, and refined aesthetic presentation.',
      metadata: { formalityRequirement: 0.95 },
      relationships: [],
      confidence: 0.96,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  private seedRelationships: KnowledgeRelationship[] = [
    {
      relationshipId: 'rel_seed_1',
      relationshipType: 'CONNECTED_TO',
      sourceNodeId: 'kn_archetype_minimalism',
      targetNodeId: 'kn_archetype_quiet_luxury',
      strengthScore: 0.92,
      confidenceScore: 0.95,
      evidence: 'Minimalism shares core foundational aesthetic principles with Quiet Luxury',
      createdAt: new Date().toISOString()
    },
    {
      relationshipId: 'rel_seed_2',
      relationshipType: 'INFLUENCED_BY',
      sourceNodeId: 'kn_archetype_quiet_luxury',
      targetNodeId: 'kn_era_90s_minimalism',
      strengthScore: 0.88,
      confidenceScore: 0.92,
      evidence: 'Quiet Luxury silhouettes draw direct inspiration from 1990s minimal tailoring',
      createdAt: new Date().toISOString()
    },
    {
      relationshipId: 'rel_seed_3',
      relationshipType: 'SUITABLE_FOR',
      sourceNodeId: 'kn_material_cashmere',
      targetNodeId: 'kn_occasion_executive_boardroom',
      strengthScore: 0.95,
      confidenceScore: 0.97,
      evidence: 'High-grade cashmere knitwear delivers supreme warmth and boardroom refinement',
      createdAt: new Date().toISOString()
    },
    {
      relationshipId: 'rel_seed_4',
      relationshipType: 'ENHANCES',
      sourceNodeId: 'kn_color_monochrome_neutrals',
      targetNodeId: 'kn_archetype_minimalism',
      strengthScore: 0.96,
      confidenceScore: 0.98,
      evidence: 'Monochromatic neutral palettes maximize minimalist wardrobe versatility',
      createdAt: new Date().toISOString()
    },
    {
      relationshipId: 'rel_seed_5',
      relationshipType: 'COMPATIBLE_WITH',
      sourceNodeId: 'kn_silhouette_architectural_tailored',
      targetNodeId: 'kn_occasion_executive_boardroom',
      strengthScore: 0.94,
      confidenceScore: 0.96,
      evidence: 'Architectural shoulders establish structure for corporate leadership meetings',
      createdAt: new Date().toISOString()
    }
  ];

  private constructor() {}

  public static getInstance(): KnowledgeRetrievalEngine {
    if (!KnowledgeRetrievalEngine.instance) {
      KnowledgeRetrievalEngine.instance = new KnowledgeRetrievalEngine();
    }
    return KnowledgeRetrievalEngine.instance;
  }

  /**
   * Initializes seed knowledge nodes and relationships if storage is empty
   */
  public async ensureInitialized(): Promise<{ nodes: KnowledgeNode[]; relationships: KnowledgeRelationship[] }> {
    let nodes = await civilizationKnowledgeStorage.fetchAllKnowledgeNodes();
    let rels = await civilizationKnowledgeStorage.fetchAllKnowledgeRelationships();

    if (nodes.length === 0) {
      for (const node of this.seedNodes) {
        await civilizationKnowledgeStorage.saveKnowledgeNode(node);
      }
      nodes = await civilizationKnowledgeStorage.fetchAllKnowledgeNodes();
    }

    if (rels.length === 0) {
      for (const rel of this.seedRelationships) {
        await civilizationKnowledgeStorage.saveKnowledgeRelationship(rel);
      }
      rels = await civilizationKnowledgeStorage.fetchAllKnowledgeRelationships();
    }

    return { nodes, relationships: rels };
  }

  /**
   * Query Civilization Knowledge Graph and bridge to User Intelligence (Task 4)
   */
  public async retrieveKnowledge(query: KnowledgeRetrievalQuery): Promise<KnowledgeQueryResult> {
    const startTime = performance.now();
    const userId = query.userId || 'guest_user';
    const minConfidence = query.minConfidence ?? 0.5;

    // 1. Ensure Knowledge Graph is loaded
    const { nodes, relationships } = await this.ensureInitialized();

    // 2. Fetch User Personal Style DNA & Personal Connections
    const styleDNA = styleDNAEngine.getProfile();
    const existingConnections = await civilizationKnowledgeStorage.fetchPersonalConnections(userId);

    // 3. Delegate to RetrievalDecisionBridge & Graph Traversal Engine for multi-hop semantic reasoning
    const parsedIntent = KnowledgeQueryParser.parseUserIntent({ userPrompt: query.queryText }, userId);
    const traversal = GraphTraversalEngine.getInstance().traverseGraph(
      nodes.filter(n => query.targetNodeTypes?.includes(n.type) || n.name.toLowerCase().includes(query.queryText.toLowerCase())),
      nodes,
      relationships,
      2,
      query.minStrength || 0.5,
      query.minConfidence || 0.5
    );

    const rankedNodes = KnowledgeRankingEngine.getInstance().rankNodes(
      traversal.traversedNodes.length > 0 ? traversal.traversedNodes : nodes,
      parsedIntent,
      styleDNA,
      existingConnections
    );

    const semanticOutput = SemanticFashionReasoningEngine.getInstance().generateSemanticReasoning(
      parsedIntent,
      rankedNodes,
      traversal.reasoningChains,
      styleDNA
    );

    const matchedNodes = rankedNodes.map(r => r.node);
    const matchedNodeIds = new Set(matchedNodes.map((n) => n.id));
    const relevantRelationships = relationships.filter(
      (r) => matchedNodeIds.has(r.sourceNodeId) || matchedNodeIds.has(r.targetNodeId)
    );

    const latencyMs = Math.round(performance.now() - startTime);

    const result: KnowledgeQueryResult = {
      queryText: query.queryText,
      matchedNodes: matchedNodes.slice(0, query.limit || 20),
      personalConnections: existingConnections.slice(0, 20),
      relevantRelationships,
      confidenceScore: semanticOutput.overallReasoningConfidence,
      reasoningSignals: semanticOutput.reasoningSignals,
      retrievedAt: new Date().toISOString(),
      latencyMs
    };

    // Telemetry Integration (Task 5)
    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'KnowledgeRetrievalEngine',
        eventName: 'KNOWLEDGE_RETRIEVAL_COMPLETED',
        category: 'Reasoning',
        payload: `Retrieved ${result.matchedNodes.length} knowledge nodes, ${result.relevantRelationships.length} relationships for query: "${query.queryText}". Latency: ${latencyMs}ms`,
        latencyMs,
        status: 'Success'
      });
    } catch (_) {}

    return result;
  }
}

export const knowledgeRetrievalEngine = KnowledgeRetrievalEngine.getInstance();
