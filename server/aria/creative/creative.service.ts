/**
 * ARIA v2.5 Creative Intelligence Express Service
 * Product: LOOK VISION v2.4
 */

export interface ServerCapsuleItem {
  id: string;
  name: string;
  category: string;
  color: string;
  material: string;
  versatilityScore: number;
  pairings: string[];
}

export interface ServerMoodboardElement {
  id: string;
  title: string;
  type: string;
  value: string;
  accentColor?: string;
}

export interface ServerCreativeConcept {
  creativeId: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  originalityScore: number;
  styleDNAAlignment: number;
  decisionAlignment: number;
  memoryAlignment: number;
  supportingSignals: Array<{
    id: string;
    sourceType: string;
    signalText: string;
    confidence: number;
  }>;
  evidenceCount: number;
  createdAt: string;
  colorStory?: string[];
  stylingDirections?: string[];
  capsuleItems?: ServerCapsuleItem[];
  moodboardElements?: ServerMoodboardElement[];
  editorialHeadline?: string;
  metadata?: Record<string, any>;
}

export class CreativeService {
  private static instance: CreativeService;
  private serverCreativeHistory: Map<string, ServerCreativeConcept[]> = new Map();

  private constructor() {}

  public static getInstance(): CreativeService {
    if (!CreativeService.instance) {
      CreativeService.instance = new CreativeService();
    }
    return CreativeService.instance;
  }

  public async generateConcept(
    userId: string,
    params: {
      category?: string;
      themePrompt?: string;
      targetSeason?: string;
      desiredPieceCount?: number;
    }
  ): Promise<ServerCreativeConcept> {
    const now = new Date().toISOString();
    const creativeId = `crt_srv_${userId}_${Date.now()}`;
    const category = params.category || 'CAPSULE_WARDROBE';
    const themePrompt = params.themePrompt || 'Architectural Precision';

    const concept: ServerCreativeConcept = {
      creativeId,
      userId,
      title: `${themePrompt} ${params.targetSeason ? `• ${params.targetSeason}` : ''}`,
      description: `Synthesized sartorial concept generated server-side for user ${userId}. Harmonizes Style DNA vectors with Decision Intelligence.`,
      category,
      confidence: 0.93,
      originalityScore: 0.89,
      styleDNAAlignment: 0.92,
      decisionAlignment: 0.90,
      memoryAlignment: 0.88,
      supportingSignals: [
        {
          id: `sig_s1_${Date.now()}`,
          sourceType: 'style_dna',
          signalText: 'Aligned with Minimalist Tailored Blazer profile',
          confidence: 0.92
        },
        {
          id: `sig_s2_${Date.now()}`,
          sourceType: 'decision',
          signalText: 'Informed by active 91% confidence decision recommendation',
          confidence: 0.91
        }
      ],
      evidenceCount: 14,
      createdAt: now,
      colorStory: ['Deep Charcoal', 'Warm Cream', 'Midnight Indigo', 'Optic White'],
      stylingDirections: [
        'Monochromatic layering anchoring deep charcoal outer structure with oat knitwear.',
        'Proportional contrast between wide trousers and sculptured shoulder tailoring.'
      ],
      capsuleItems: [
        {
          id: `cap_s1_${Date.now()}`,
          name: 'Structured Single-Breasted Virgin Wool Blazer',
          category: 'Outerwear',
          color: 'Deep Charcoal',
          material: 'Virgin Wool Blend',
          versatilityScore: 0.95,
          pairings: ['Pleated Trousers', 'Silk Cashmere Knit']
        },
        {
          id: `cap_s2_${Date.now()}`,
          name: 'Pleated Wide-Leg Trousers',
          category: 'Bottoms',
          color: 'Deep Charcoal',
          material: 'Virgin Wool Blend',
          versatilityScore: 0.92,
          pairings: ['Blazer', 'Crewneck Knit']
        }
      ],
      editorialHeadline: 'Sartorial Innovation Engineered for Timeless Synergy',
      metadata: {
        themePrompt,
        targetSeason: params.targetSeason || 'Trans-Seasonal'
      }
    };

    const history = this.serverCreativeHistory.get(userId) || [];
    history.unshift(concept);
    this.serverCreativeHistory.set(userId, history);

    return concept;
  }

  public async getHistory(userId: string): Promise<ServerCreativeConcept[]> {
    const history = this.serverCreativeHistory.get(userId) || [];
    if (history.length === 0) {
      const initial = await this.generateConcept(userId, { themePrompt: 'Autumn Capsule Edit' });
      return [initial];
    }
    return history;
  }

  public async deleteHistoryItem(userId: string, creativeId: string): Promise<boolean> {
    const history = this.serverCreativeHistory.get(userId) || [];
    const updated = history.filter(c => c.creativeId !== creativeId);
    this.serverCreativeHistory.set(userId, updated);
    return true;
  }
}

export const creativeService = CreativeService.getInstance();
