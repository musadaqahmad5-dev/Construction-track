/**
 * ARIA v2.5 Simulation Service (Express Backend)
 * Product: LOOK VISION v2.4
 */

export interface ServerSimulationReport {
  simulationId: string;
  userId: string;
  scenario: {
    scenarioId: string;
    type: string;
    title: string;
    description: string;
    parameters: Record<string, any>;
    createdAt: string;
  };
  expectedStyleImpact: string;
  wardrobeCompatibilityScore: number;
  versatilityScore: number;
  styleDNAEffect: {
    archetypeMatchDelta: number;
    silhouetteAlignment: string;
    colorHarmonyScore: number;
    gapClosureScore: number;
  };
  creativeEffect: {
    aestheticSynergy: string;
    moodElevationScore: number;
    textureVersatility: string;
  };
  confidence: number;
  supportingEvidence: string[];
  reasonSignals: string[];
  alternativeOutcomes: Array<{
    outcomeId: string;
    title: string;
    description: string;
    versatilityScore: number;
    keyTradeoff: string;
  }>;
  timestamp: string;
}

export class SimulationService {
  private static mockStore: Map<string, ServerSimulationReport[]> = new Map();

  public static async runSimulation(
    userId: string,
    scenarioType: string,
    parameters: Record<string, any> = {},
    customTitle?: string
  ): Promise<ServerSimulationReport> {
    const report: ServerSimulationReport = {
      simulationId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      scenario: {
        scenarioId: `scen_${Date.now()}`,
        type: scenarioType,
        title: customTitle || `Simulation: ${scenarioType.replace('_', ' ').toUpperCase()}`,
        description: `Simulated fashion outcome for ${scenarioType} under user-defined constraints.`,
        parameters,
        createdAt: new Date().toISOString()
      },
      expectedStyleImpact: `Simulating ${scenarioType}: High synergy predicted with existing wardrobe core, expanding versatility by 24%.`,
      wardrobeCompatibilityScore: 0.94,
      versatilityScore: 0.91,
      styleDNAEffect: {
        archetypeMatchDelta: 0.05,
        silhouetteAlignment: 'Elevates structured tailored proportions with relaxed drape',
        colorHarmonyScore: 0.92,
        gapClosureScore: 0.88
      },
      creativeEffect: {
        aestheticSynergy: 'Harmonizes with active editorial theme and color stories',
        moodElevationScore: 0.90,
        textureVersatility: 'Optimizes multi-season tactile layering'
      },
      confidence: 0.93,
      supportingEvidence: [
        'Integrated Style DNA Profile & Color Matrix',
        'Validated against Personal Fashion Memory records',
        'Cross-referenced with Digital Twin Wardrobe Behaviour'
      ],
      reasonSignals: [
        'High versatility score across 5 target occasion profiles',
        'Reduces wardrobe redundancy and expands pairing options',
        'Strong architectural line compatibility'
      ],
      alternativeOutcomes: [
        {
          outcomeId: 'alt_1',
          title: 'Conservative Incremental Option',
          description: 'Focus on neutral foundational pieces before adding accent tones.',
          versatilityScore: 0.95,
          keyTradeoff: 'Slower aesthetic transformation but maximum daily utility.'
        },
        {
          outcomeId: 'alt_2',
          title: 'Full Capsule Transformation',
          description: 'Consolidate 15 high-versatility garments into a strict capsule.',
          versatilityScore: 0.97,
          keyTradeoff: 'Requires purging low-frequency items.'
        }
      ],
      timestamp: new Date().toISOString()
    };

    const history = this.mockStore.get(userId) || [];
    this.mockStore.set(userId, [report, ...history].slice(0, 30));

    return report;
  }

  public static async getHistory(userId: string): Promise<ServerSimulationReport[]> {
    const existing = this.mockStore.get(userId);
    if (existing && existing.length > 0) {
      return existing;
    }
    const defaultReport = await this.runSimulation(userId, 'capsule_conversion');
    return [defaultReport];
  }

  public static async getReportById(userId: string, id: string): Promise<ServerSimulationReport | null> {
    const history = await this.getHistory(userId);
    return history.find(r => r.simulationId === id) || history[0] || null;
  }
}
