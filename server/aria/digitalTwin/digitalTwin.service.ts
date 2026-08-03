/**
 * ARIA v2.5 Digital Twin Service (Express Backend)
 * Product: LOOK VISION v2.4
 */

export interface ServerDigitalTwinProfile {
  twinId: string;
  userId: string;
  identitySummary: {
    archetypeTitle: string;
    description: string;
    signatureColors: string[];
    primarySilhouette: string;
    styleMaturityLevel: string;
    styleMaturityScore: number;
  };
  currentStyleState: {
    dominantVibe: string;
    activePalette: string[];
    recentFormalityBias: string;
    confidence: number;
  };
  preferencePatterns: Array<{
    category: string;
    preferredValue: string;
    weight: number;
    confidence: number;
    source: string;
  }>;
  wardrobeBehaviour: Array<{
    insightId: string;
    category: string;
    title: string;
    description: string;
    confidence: number;
    evidenceCount: number;
    source: string;
  }>;
  creativeDirections: Array<{
    activeTheme: string;
    colorStory: string[];
    moodKeyword: string;
  }>;
  evolutionTimeline: Array<{
    milestoneId: string;
    timestamp: string;
    phaseName: string;
    description: string;
    triggerEvent: string;
    keyShift: string;
    confidence: number;
  }>;
  futureForecasts: Array<{
    forecastId: string;
    dimension: string;
    title: string;
    forecastText: string;
    confidence: number;
    reasoningSignals: string[];
    supportingHistory: string[];
    horizonMonths: number;
  }>;
  supportingEvidence: string[];
  lastUpdated: string;
}

export class DigitalTwinService {
  private static mockStore: Map<string, ServerDigitalTwinProfile> = new Map();
  private static historyStore: Map<string, ServerDigitalTwinProfile[]> = new Map();

  public static async getProfile(userId: string): Promise<ServerDigitalTwinProfile> {
    const existing = this.mockStore.get(userId);
    if (existing) {
      return existing;
    }
    return this.synthesizeTwin(userId);
  }

  public static async synthesizeTwin(userId: string): Promise<ServerDigitalTwinProfile> {
    const profile: ServerDigitalTwinProfile = {
      twinId: `twin_${userId}_${Date.now()}`,
      userId,
      identitySummary: {
        archetypeTitle: 'Contemporary Minimalist Twin',
        description: 'Digitized fashion avatar representing structured tailored silhouettes, high-contrast neutral palettes, and curated outerwear layering.',
        signatureColors: ['#000000', '#1F2937', '#D1D5DB'],
        primarySilhouette: 'Tailored Structured',
        styleMaturityLevel: 'Refined',
        styleMaturityScore: 0.88
      },
      currentStyleState: {
        dominantVibe: 'Contemporary Architectural Minimalist',
        activePalette: ['#000000', '#1F2937', '#D1D5DB', '#F3F4F6'],
        recentFormalityBias: 'Smart Casual / Elevated Tailoring',
        confidence: 0.94
      },
      preferencePatterns: [
        {
          category: 'Silhouette',
          preferredValue: 'Tailored Structured Oversized Blazers',
          weight: 0.95,
          confidence: 0.94,
          source: 'Style DNA Engine'
        },
        {
          category: 'Palette',
          preferredValue: 'Monochromatic Slate & Cream',
          weight: 0.92,
          confidence: 0.93,
          source: 'Memory Engine'
        },
        {
          category: 'Footwear',
          preferredValue: 'Sleek Leather Loafers & Ankle Boots',
          weight: 0.89,
          confidence: 0.90,
          source: 'Decision Engine'
        }
      ],
      wardrobeBehaviour: [
        {
          insightId: `wb_freq_${userId}`,
          category: 'frequent_styles',
          title: 'Monochromatic Tailoring Bias',
          description: 'High selection frequency for structured silhouettes paired with neutral charcoal and cream tones.',
          confidence: 0.95,
          evidenceCount: 12,
          source: 'MemoryEngine & StyleDNA Engine'
        },
        {
          insightId: `wb_combo_${userId}`,
          category: 'preferred_combos',
          title: 'Layered Outerwear & Minimalist Footwear',
          description: 'Combines relaxed wool overcoats with sleek leather footwear for elevated smart-casual occasions.',
          confidence: 0.92,
          evidenceCount: 8,
          source: 'DecisionEngine History'
        },
        {
          insightId: `wb_gap_${userId}`,
          category: 'wardrobe_gaps',
          title: 'Technical Outerwear Deficit',
          description: 'Deficit in water-resistant technical outerwear matching tailored dress codes.',
          confidence: 0.88,
          evidenceCount: 3,
          source: 'Style DNA Gap Matrix'
        }
      ],
      creativeDirections: [
        {
          activeTheme: 'Editorial Slate Architecture',
          colorStory: ['#0F172A', '#334155', '#94A3B8'],
          moodKeyword: 'Architectural'
        }
      ],
      evolutionTimeline: [
        {
          milestoneId: `evo_1_${userId}`,
          timestamp: new Date().toISOString(),
          phaseName: 'Identity Calibration',
          description: 'Established baseline Style DNA archetype Contemporary Minimalist.',
          triggerEvent: 'Initial Archetype Profiling',
          keyShift: 'Shift toward structured silhouettes and neutral palettes',
          confidence: 0.91
        },
        {
          milestoneId: `evo_2_${userId}`,
          timestamp: new Date().toISOString(),
          phaseName: 'Memory Integration',
          description: 'Integrated historical preference items into persistent memory core.',
          triggerEvent: 'Personal Fashion Memory Sync',
          keyShift: 'Deepened brand and silhouette affinity mapping',
          confidence: 0.94
        }
      ],
      futureForecasts: [
        {
          forecastId: `forecast_1_${userId}`,
          dimension: 'future_direction',
          title: 'Architectural Soft-Tailoring Transition',
          forecastText: '35% evolution toward fluid architectural tailoring over next 6 months.',
          confidence: 0.91,
          reasoningSignals: ['Increased preference for relaxed shoulders', 'Aesthetic drift in Style DNA'],
          supportingHistory: ['Memory items: Tailored outerwear'],
          horizonMonths: 6
        },
        {
          forecastId: `forecast_2_${userId}`,
          dimension: 'seasonal_evolution',
          title: 'Earth-Tone Monochromatic Layering',
          forecastText: 'Upcoming seasonal forecast highlights warm espresso and oat camel as primary shade additions.',
          confidence: 0.89,
          reasoningSignals: ['High seasonal affinity with neutral base'],
          supportingHistory: ['Color profile alignment score: 0.90'],
          horizonMonths: 3
        }
      ],
      supportingEvidence: [
        'Integrated Style DNA Profile',
        'Ingested Personal Fashion Memory records',
        'Cross-referenced Decision Engine historical recommendations',
        'Mapped Creative Engine concept directions',
        'Synthesized Visual Intelligence analysis snapshots'
      ],
      lastUpdated: new Date().toISOString()
    };

    this.mockStore.set(userId, profile);
    const history = this.historyStore.get(userId) || [];
    this.historyStore.set(userId, [profile, ...history].slice(0, 20));

    return profile;
  }

  public static async getHistory(userId: string): Promise<ServerDigitalTwinProfile[]> {
    const existing = this.historyStore.get(userId);
    if (existing && existing.length > 0) {
      return existing;
    }
    const fresh = await this.synthesizeTwin(userId);
    return [fresh];
  }
}
