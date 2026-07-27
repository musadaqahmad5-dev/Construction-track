import { PersonalFashionMemoryEngine } from './personalMemory';
import { WardrobeItem } from '../types';

export type NodeType = 
  | 'USER' 
  | 'STYLE_PREFERENCE' 
  | 'PRODUCT' 
  | 'BRAND' 
  | 'CREATOR' 
  | 'TREND' 
  | 'OCCASION' 
  | 'CONVERSATION' 
  | 'PROJECT_ARCHITECTURE';

export type RelationshipType = 
  | 'PREFERS' 
  | 'DISLIKES' 
  | 'RECOMMENDS' 
  | 'OWNED_BY' 
  | 'CREATED_BY' 
  | 'PART_OF' 
  | 'SUITABLE_FOR' 
  | 'CONVERSES_ABOUT' 
  | 'DEPENDS_ON';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: Record<string, any>;
  updatedAt: string;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationship: RelationshipType;
  weight: number; // 0 to 100
  metadata?: Record<string, any>;
}

export interface GraphQueryResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  summary: string;
}

/**
 * Enterprise Knowledge Graph Engine (E02 Memory Graph & Knowledge Intelligence Layer)
 */
export class KnowledgeGraphEngine {
  private static nodes: Map<string, GraphNode> = new Map();
  private static edges: Map<string, GraphEdge> = new Map();
  private static initialized = false;

  /**
   * Bootstraps core Knowledge Graph Taxonomy and Project Architecture Memory Nodes
   */
  public static init(): void {
    if (this.initialized) return;

    // 1. Seed Project Architecture Memory Nodes (AI-SEOS Knowledge Base)
    const projectStages = [
      { id: 'proj:P01', label: 'Foundation & Repository Audit', status: 'VERIFIED', score: 98 },
      { id: 'proj:P02', label: 'Community Ecosystem Upgrade', status: 'VERIFIED', score: 96 },
      { id: 'proj:P03', label: 'Marketplace & Creator Commerce Upgrade', status: 'VERIFIED', score: 97 },
      { id: 'proj:P04', label: 'Virtual Try-On Photorealistic Engine', status: 'VERIFIED', score: 99 },
      { id: 'proj:P05', label: 'AI Style Intelligence Engine', status: 'VERIFIED', score: 98 },
      { id: 'proj:P06', label: 'Enterprise UX & Design System Upgrade', status: 'VERIFIED', score: 96 },
      { id: 'proj:P07', label: 'Production Security & Optimization', status: 'VERIFIED', score: 99 },
      { id: 'proj:P08', label: 'Final Release Validation & QA', status: 'VERIFIED', score: 100 },
      { id: 'proj:E01', label: 'Multi-Agent Communication Hub', status: 'ACTIVE', score: 98 },
      { id: 'proj:E02', label: 'Memory Graph & Knowledge Layer', status: 'ACTIVE', score: 100 }
    ];

    projectStages.forEach(stg => {
      this.addNode({
        id: stg.id,
        type: 'PROJECT_ARCHITECTURE',
        label: stg.label,
        properties: { status: stg.status, qualityScore: stg.score },
        updatedAt: new Date().toISOString()
      });
    });

    // Connect sequential dependencies in Project Architecture
    for (let i = 0; i < projectStages.length - 1; i++) {
      this.addEdge({
        id: `edge:${projectStages[i + 1].id}->${projectStages[i].id}`,
        sourceId: projectStages[i + 1].id,
        targetId: projectStages[i].id,
        relationship: 'DEPENDS_ON',
        weight: 100
      });
    }

    // 2. Seed Fashion Brands & Style Nodes
    const brands = [
      { id: 'brand:Prada', label: 'Prada', tier: 'Luxury' },
      { id: 'brand:AcneStudios', label: 'Acne Studios', tier: 'Avant-Garde' },
      { id: 'brand:Lemaire', label: 'Lemaire', tier: 'Quiet Luxury' },
      { id: 'brand:Hermes', label: 'Hermès', tier: 'High Luxury' },
      { id: 'brand:SuitSupply', label: 'SuitSupply', tier: 'Tailored Premium' }
    ];

    brands.forEach(b => {
      this.addNode({
        id: b.id,
        type: 'BRAND',
        label: b.label,
        properties: { tier: b.tier },
        updatedAt: new Date().toISOString()
      });
    });

    // 3. Sync initial default user
    this.syncUserMemoryGraph('user-1');

    this.initialized = true;
    console.log(`[KnowledgeGraphEngine] Initialized memory graph with ${this.nodes.size} nodes and ${this.edges.size} edges.`);
  }

  public static addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
  }

  public static addEdge(edge: GraphEdge): void {
    this.edges.set(edge.id, edge);
  }

  public static getNode(id: string): GraphNode | undefined {
    this.init();
    return this.nodes.get(id);
  }

  public static getEdgesFrom(sourceId: string): GraphEdge[] {
    this.init();
    return Array.from(this.edges.values()).filter(e => e.sourceId === sourceId);
  }

  public static getEdgesTo(targetId: string): GraphEdge[] {
    this.init();
    return Array.from(this.edges.values()).filter(e => e.targetId === targetId);
  }

  public static getNeighbors(nodeId: string): { node: GraphNode; edge: GraphEdge }[] {
    this.init();
    const result: { node: GraphNode; edge: GraphEdge }[] = [];
    const outgoing = this.getEdgesFrom(nodeId);
    
    outgoing.forEach(edge => {
      const targetNode = this.nodes.get(edge.targetId);
      if (targetNode) {
        result.push({ node: targetNode, edge });
      }
    });

    return result;
  }

  /**
   * Synchronizes a user's Personal Fashion Memory into the Knowledge Graph
   */
  public static syncUserMemoryGraph(userId: string = 'user-1'): void {
    const memory = PersonalFashionMemoryEngine.getMemory(userId);
    const userNodeId = `usr:${userId}`;

    // 1. User Node
    this.addNode({
      id: userNodeId,
      type: 'USER',
      label: `User (${userId})`,
      properties: {
        accuracyEstimate: memory.accuracyEstimate,
        learningEvents: memory.learningEventsLogged,
        activeSeason: memory.timeline.activeSeason
      },
      updatedAt: new Date().toISOString()
    });

    // 2. Primary Style Preference Node
    const primaryVibe = memory.styleDNA.primaryVibe || 'Cyber Avant-Garde';
    const vibeNodeId = `pref:${primaryVibe.toLowerCase().replace(/\s+/g, '-')}`;

    this.addNode({
      id: vibeNodeId,
      type: 'STYLE_PREFERENCE',
      label: primaryVibe,
      properties: {
        formality: memory.styleDNA.formalityPreference,
        experimentalIndex: memory.styleDNA.experimentalIndex
      },
      updatedAt: new Date().toISOString()
    });

    this.addEdge({
      id: `edge:${userNodeId}->${vibeNodeId}`,
      sourceId: userNodeId,
      targetId: vibeNodeId,
      relationship: 'PREFERS',
      weight: Math.round(memory.accuracyEstimate)
    });

    // 3. Favorite Brands Edges
    memory.favBrands.forEach(brandName => {
      const brandNodeId = `brand:${brandName.replace(/\s+/g, '')}`;
      if (!this.nodes.has(brandNodeId)) {
        this.addNode({
          id: brandNodeId,
          type: 'BRAND',
          label: brandName,
          properties: { source: 'User Favorite' },
          updatedAt: new Date().toISOString()
        });
      }
      this.addEdge({
        id: `edge:${userNodeId}->${brandNodeId}`,
        sourceId: userNodeId,
        targetId: brandNodeId,
        relationship: 'PREFERS',
        weight: 90
      });
    });

    // 4. Negative Dislikes Edges
    memory.dislikes.colors.forEach(color => {
      const colorNodeId = `color:${color.toLowerCase()}`;
      this.addNode({
        id: colorNodeId,
        type: 'STYLE_PREFERENCE',
        label: `Color: ${color}`,
        properties: { isDislike: true },
        updatedAt: new Date().toISOString()
      });
      this.addEdge({
        id: `edge:${userNodeId}->${colorNodeId}`,
        sourceId: userNodeId,
        targetId: colorNodeId,
        relationship: 'DISLIKES',
        weight: 100
      });
    });

    memory.dislikes.garments.forEach(garment => {
      const garmentNodeId = `garment:${garment.toLowerCase()}`;
      this.addNode({
        id: garmentNodeId,
        type: 'STYLE_PREFERENCE',
        label: `Garment: ${garment}`,
        properties: { isDislike: true },
        updatedAt: new Date().toISOString()
      });
      this.addEdge({
        id: `edge:${userNodeId}->${garmentNodeId}`,
        sourceId: userNodeId,
        targetId: garmentNodeId,
        relationship: 'DISLIKES',
        weight: 100
      });
    });
  }

  /**
   * Logs a user conversation exchange into the Knowledge Graph for contextual recall
   */
  public static logConversationNode(
    userId: string,
    userQuery: string,
    assistantResponse: string,
    intent: string
  ): GraphNode {
    this.init();
    const convId = `conv:${Date.now()}`;
    const userNodeId = `usr:${userId}`;

    const convNode: GraphNode = {
      id: convId,
      type: 'CONVERSATION',
      label: `Chat (${intent}) - "${userQuery.slice(0, 30)}..."`,
      properties: {
        userId,
        userQuery,
        assistantResponse,
        intent,
        timestamp: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };

    this.addNode(convNode);

    // Link user to conversation
    this.addEdge({
      id: `edge:${userNodeId}->${convId}`,
      sourceId: userNodeId,
      targetId: convId,
      relationship: 'CONVERSES_ABOUT',
      weight: 100
    });

    // Also update Personal Memory log event
    PersonalFashionMemoryEngine.logEvent(userId, 'RECOMMENDATION_VIEWED', {
      convId,
      query: userQuery,
      intent
    });

    return convNode;
  }

  /**
   * Searches knowledge graph for relevant nodes given a query string
   */
  public static queryGraph(
    queryText: string,
    userId: string = 'user-1'
  ): GraphQueryResult {
    this.init();
    this.syncUserMemoryGraph(userId);

    const lowerQuery = queryText.toLowerCase();
    const matchedNodes: GraphNode[] = [];
    const matchedEdges: GraphEdge[] = [];

    // Search nodes by label or properties
    this.nodes.forEach(node => {
      const matchLabel = node.label.toLowerCase().includes(lowerQuery);
      const matchProps = JSON.stringify(node.properties).toLowerCase().includes(lowerQuery);
      if (matchLabel || matchProps) {
        matchedNodes.push(node);
      }
    });

    // If query mentions "last time", "previous", "history", or "memory" -> include recent conversation nodes
    if (
      lowerQuery.includes('last time') || 
      lowerQuery.includes('previous') || 
      lowerQuery.includes('history') || 
      lowerQuery.includes('remember') ||
      lowerQuery.includes('memory')
    ) {
      this.nodes.forEach(node => {
        if (node.type === 'CONVERSATION' && node.properties.userId === userId) {
          if (!matchedNodes.some(n => n.id === node.id)) {
            matchedNodes.push(node);
          }
        }
      });
    }

    // Collect edges belonging to matched nodes
    const nodeIds = new Set(matchedNodes.map(n => n.id));
    this.edges.forEach(edge => {
      if (nodeIds.has(edge.sourceId) || nodeIds.has(edge.targetId)) {
        matchedEdges.push(edge);
      }
    });

    const summary = `Memory Graph Search returned ${matchedNodes.length} nodes and ${matchedEdges.length} connected edges matching query "${queryText}".`;

    return {
      nodes: matchedNodes,
      edges: matchedEdges,
      summary
    };
  }

  /**
   * Privacy & Data Management: Returns graph export or resets graph memory for a user
   */
  public static clearUserGraph(userId: string): void {
    this.init();
    const userPrefix = `usr:${userId}`;
    
    // Remove user edges and conversation nodes
    Array.from(this.edges.keys()).forEach(key => {
      if (key.includes(userPrefix)) {
        this.edges.delete(key);
      }
    });

    Array.from(this.nodes.keys()).forEach(key => {
      if (key.startsWith(userPrefix) || (this.nodes.get(key)?.properties.userId === userId)) {
        this.nodes.delete(key);
      }
    });

    // Reset Personal Memory
    PersonalFashionMemoryEngine.resetMemory(userId);
    console.log(`[KnowledgeGraphEngine] Purged user memory graph for user: ${userId}`);
  }

  public static exportUserGraphJSON(userId: string): string {
    this.init();
    this.syncUserMemoryGraph(userId);

    const userNodes: GraphNode[] = [];
    const userEdges: GraphEdge[] = [];

    this.nodes.forEach(node => {
      if (node.id.includes(userId) || node.properties.userId === userId) {
        userNodes.push(node);
      }
    });

    const nodeIds = new Set(userNodes.map(n => n.id));
    this.edges.forEach(edge => {
      if (nodeIds.has(edge.sourceId) || nodeIds.has(edge.targetId)) {
        userEdges.push(edge);
      }
    });

    return JSON.stringify({
      userId,
      exportedAt: new Date().toISOString(),
      nodes: userNodes,
      edges: userEdges,
      stats: this.getGraphStats()
    }, null, 2);
  }

  public static getGraphStats() {
    this.init();
    let userNodesCount = 0;
    let conversationNodesCount = 0;
    let projectNodesCount = 0;

    this.nodes.forEach(node => {
      if (node.type === 'USER') userNodesCount++;
      if (node.type === 'CONVERSATION') conversationNodesCount++;
      if (node.type === 'PROJECT_ARCHITECTURE') projectNodesCount++;
    });

    return {
      totalNodes: this.nodes.size,
      totalEdges: this.edges.size,
      userNodesCount,
      conversationNodesCount,
      projectNodesCount
    };
  }
}
