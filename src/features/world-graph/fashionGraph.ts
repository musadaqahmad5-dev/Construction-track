export interface GraphNode {
  id: string;
  type: 'user' | 'look' | 'material' | 'style' | 'region' | 'occasion' | 'creator' | 'trend';
  label: string;
  properties: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: 'likes' | 'remixes' | 'similarity' | 'influence' | 'co-occurrence' | 'originates' | 'utilizes';
  weight: number; // 0.0 - 1.0 indicating strength
}

export class FashionGraph {
  private static nodes: GraphNode[] = [
    { id: 'n-user-1', type: 'user', label: 'Sven Lindqvist', properties: { activeStyle: 'Minimalist' } },
    { id: 'n-look-1', type: 'look', label: 'Copenhagen Linen Set', properties: { price: 240 } },
    { id: 'n-mat-1', type: 'material', label: 'Supima Cotton', properties: { sustainabilityScore: 92 } },
    { id: 'n-style-1', type: 'style', label: 'Stockholm Minimal', properties: { globalRank: 4 } },
    { id: 'n-reg-1', type: 'region', label: 'Nordics (SE/DK)', properties: { climate: 'Cold/Temperate' } },
    { id: 'n-trend-1', type: 'trend', label: 'Undyed Earth Tones', properties: { growthPercent: 42 } }
  ];

  private static edges: GraphEdge[] = [
    { id: 'e-1', sourceId: 'n-user-1', targetId: 'n-look-1', relation: 'likes', weight: 0.95 },
    { id: 'e-2', sourceId: 'n-look-1', targetId: 'n-style-1', relation: 'similarity', weight: 0.88 },
    { id: 'e-3', sourceId: 'n-look-1', targetId: 'n-mat-1', relation: 'utilizes', weight: 1.00 },
    { id: 'e-4', sourceId: 'n-style-1', targetId: 'n-reg-1', relation: 'originates', weight: 0.90 },
    { id: 'e-5', sourceId: 'n-style-1', targetId: 'n-trend-1', relation: 'co-occurrence', weight: 0.75 }
  ];

  static getGraphState() {
    return {
      graphHealth: {
        nodeCount: this.nodes.length,
        edgeCount: this.edges.length,
        densityScore: parseFloat((this.edges.length / (this.nodes.length * (this.nodes.length - 1) || 1)).toFixed(4)),
        clusteringCoefficient: 0.74,
        avgPathLength: 2.1
      },
      activeClusters: [
        { clusterId: 'cl-nordic', coreStyle: 'Stockholm Minimal', membersCount: 1420, cohesionRate: 0.89 },
        { clusterId: 'cl-gorp', coreStyle: 'Stealth Techwear', membersCount: 2150, cohesionRate: 0.94 }
      ],
      trendMovement: {
        rising: ['Undyed Earth Tones', 'Tactical Asymmetry'],
        saturating: ['Neon Cyberpunk'],
        waning: ['Fast Poly-blends']
      },
      styleDistance: {
        'Stockholm Minimal to Stealth Techwear': 0.68,
        'Stockholm Minimal to Savile Classic': 0.34,
        'Stealth Techwear to Savile Classic': 0.85
      }
    };
  }

  static getNodes(): GraphNode[] {
    return this.nodes;
  }

  static getEdges(): GraphEdge[] {
    return this.edges;
  }

  static addNode(node: GraphNode): void {
    if (!this.nodes.find(n => n.id === node.id)) {
      this.nodes.push(node);
    }
  }

  static addEdge(edge: GraphEdge): void {
    this.edges.push(edge);
  }
}
