/**
 * ARIA v2.5 Digital Twin Engine (Singleton Orchestrator)
 * Product: LOOK VISION v2.4
 */

import { DigitalTwinModel, DigitalTwinEngineStatus } from './DigitalTwinTypes';
import { IdentityModelBuilder } from './IdentityModelBuilder';
import { StyleEvolutionTracker } from './StyleEvolutionTracker';
import { WardrobeBehaviourAnalyzer } from './WardrobeBehaviourAnalyzer';
import { FashionForecastEngine } from './FashionForecastEngine';
import { DigitalTwinStorage } from './DigitalTwinStorage';
import { DigitalTwinHistory } from './DigitalTwinHistory';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { memoryEngine } from '../memory/MemoryEngine';
import { decisionEngine } from '../decision/DecisionEngine';
import { creativeEngine } from '../creative/CreativeEngine';
import { visualIntelligenceEngine } from '../vision/VisualIntelligenceEngine';

export class DigitalTwinEngine {
  private static instance: DigitalTwinEngine;
  private currentTwin: DigitalTwinModel | null = null;
  private status: DigitalTwinEngineStatus = {
    isInitialized: false,
    isAnalyzing: false,
    storageMode: 'offline_local'
  };

  private constructor() {}

  public static getInstance(): DigitalTwinEngine {
    if (!DigitalTwinEngine.instance) {
      DigitalTwinEngine.instance = new DigitalTwinEngine();
    }
    return DigitalTwinEngine.instance;
  }

  public async initialize(userId: string = 'guest_user'): Promise<DigitalTwinModel> {
    this.status.isAnalyzing = true;
    try {
      const existing = DigitalTwinStorage.loadProfile(userId);
      if (existing) {
        this.currentTwin = existing;
      } else {
        this.currentTwin = await this.synthesizeTwin(userId);
      }

      this.status.isInitialized = true;
      this.status.isAnalyzing = false;
      this.status.lastAnalyzedAt = new Date().toISOString();
      return this.currentTwin;
    } catch (err: any) {
      this.status.isAnalyzing = false;
      this.status.lastError = err.message || 'Initialization failed';
      throw err;
    }
  }

  public async synthesizeTwin(userId: string = 'guest_user'): Promise<DigitalTwinModel> {
    this.status.isAnalyzing = true;

    try {
      // Reuse existing intelligence engines without duplicating
      const dnaProfile = styleDNAEngine.getProfile();
      const memories = memoryEngine.getMemories();
      const decisions = await decisionEngine.getHistory();
      const creativeConcepts = await creativeEngine.getHistory();
      const visionHistory = await visualIntelligenceEngine.getHistory();

      const identitySummary = IdentityModelBuilder.buildIdentitySummary(userId);
      const evolutionTimeline = await StyleEvolutionTracker.trackEvolution(userId);
      const wardrobeBehaviour = await WardrobeBehaviourAnalyzer.analyzeBehaviour(userId);
      const futureForecasts = FashionForecastEngine.generateForecasts(userId);

      const supportingEvidence: string[] = [
        `Integrated Style DNA Profile (${dnaProfile?.identityName || 'Default'})`,
        `Ingested ${memories.length} Personal Fashion Memory records`,
        `Cross-referenced ${decisions.length} Decision Engine historical recommendations`,
        `Mapped ${creativeConcepts.length} Creative Engine concept directions`,
        `Synthesized ${visionHistory.length} Visual Intelligence analysis snapshots`
      ];

      const model: DigitalTwinModel = {
        twinId: `twin_${userId}_${Date.now()}`,
        userId,
        identitySummary,
        currentStyleState: {
          dominantVibe: dnaProfile?.identityName || 'Contemporary Minimalist',
          activePalette: dnaProfile?.colorProfile?.map(c => c.value) || ['#000000', '#1F2937', '#D1D5DB'],
          recentFormalityBias: 'Smart Casual / Elevated Tailoring',
          confidence: dnaProfile?.overallConfidence || 0.92
        },
        preferencePatterns: [
          {
            category: 'Silhouette',
            preferredValue: dnaProfile?.silhouetteProfile?.[0]?.value || 'Tailored Structured',
            weight: 0.95,
            confidence: 0.94,
            source: 'Style DNA Engine'
          },
          {
            category: 'Palette',
            preferredValue: 'Monochromatic Neutral',
            weight: 0.91,
            confidence: 0.92,
            source: 'Memory Engine'
          },
          {
            category: 'Footwear',
            preferredValue: 'Sleek Leather Loafers & Boots',
            weight: 0.88,
            confidence: 0.89,
            source: 'Decision Engine'
          }
        ],
        wardrobeBehaviour,
        creativeDirections: creativeConcepts.map(c => ({
          activeTheme: c.title,
          colorStory: c.colorStory || [],
          moodKeyword: c.category
        })),
        evolutionTimeline,
        futureForecasts,
        supportingEvidence,
        lastUpdated: new Date().toISOString()
      };

      this.currentTwin = model;
      DigitalTwinStorage.saveProfile(model);
      DigitalTwinHistory.addSnapshot(model);

      this.status.isInitialized = true;
      this.status.isAnalyzing = false;
      this.status.lastAnalyzedAt = model.lastUpdated;

      return model;
    } catch (err: any) {
      this.status.isAnalyzing = false;
      this.status.lastError = err.message || 'Synthesis failed';
      throw err;
    }
  }

  public getProfile(): DigitalTwinModel | null {
    return this.currentTwin;
  }

  public getStatus(): DigitalTwinEngineStatus {
    return { ...this.status };
  }

  public getHistory(userId: string): DigitalTwinModel[] {
    return DigitalTwinHistory.getHistory(userId);
  }
}

export const digitalTwinEngine = DigitalTwinEngine.getInstance();
