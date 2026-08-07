/**
 * ARIA v2.5 Style DNA Core Engine Orchestrator
 * Product: LOOK VISION v2.4
 */

import { 
  StyleDNAProfile, 
  StyleDNASnapshot, 
  StyleDNAStatus, 
  StyleDNAUpdatePayload 
} from './StyleDNATypes';
import { styleDNAStorage } from './StyleDNAStorage';
import { StyleDNAProfileBuilder } from './StyleDNAProfileBuilder';
import { memoryEngine } from '../memory/MemoryEngine';
import { styleEvolutionEngine } from '../evolution/StyleEvolutionEngine';
import { styleEvolutionTracker } from '../evolution/StyleEvolutionTracker';

export class StyleDNAEngine {
  private static instance: StyleDNAEngine;

  private userId?: string;
  private currentProfile: StyleDNAProfile | null = null;
  private snapshots: StyleDNASnapshot[] = [];
  private status: StyleDNAStatus = {
    isInitialized: false,
    isAnalyzing: false,
    currentVersion: 0,
    storageMode: 'offline_local',
    lastUpdated: new Date().toISOString()
  };

  private constructor() {}

  public static getInstance(): StyleDNAEngine {
    if (!StyleDNAEngine.instance) {
      StyleDNAEngine.instance = new StyleDNAEngine();
    }
    return StyleDNAEngine.instance;
  }

  /**
   * Initialize Style DNA engine for active user
   */
  public async initialize(userId?: string): Promise<StyleDNAStatus> {
    this.userId = userId || 'guest_user';
    this.status.isAnalyzing = true;

    try {
      // 1. Ensure MemoryEngine is initialized
      await memoryEngine.initialize(this.userId);
      const memories = memoryEngine.getMemories();

      // 2. Load stored profile or build initial profile from memories
      const existingProfile = await styleDNAStorage.fetchProfile(this.userId);
      const { profile, snapshot } = StyleDNAProfileBuilder.buildProfile(
        this.userId,
        memories,
        existingProfile
      );

      this.currentProfile = profile;
      await styleDNAStorage.saveProfile(this.userId, profile);

      if (snapshot) {
        await styleDNAStorage.saveSnapshot(this.userId, snapshot);
      }

      this.snapshots = await styleDNAStorage.fetchSnapshots(this.userId);

      // 3. Initialize Style Evolution Engine
      try {
        await styleEvolutionEngine.initialize(this.userId);
      } catch (evoErr) {
        console.warn('[StyleDNAEngine] Evolution engine init notice:', evoErr);
      }

      this.status = {
        isInitialized: true,
        isAnalyzing: false,
        currentVersion: profile.version,
        storageMode: userId ? 'firestore' : 'offline_local',
        lastUpdated: profile.updatedAt
      };
    } catch (err: any) {
      console.warn('[StyleDNAEngine] Initialization error, using local fallback:', err);
      this.status = {
        isInitialized: true,
        isAnalyzing: false,
        currentVersion: this.currentProfile?.version || 1,
        storageMode: 'offline_local',
        lastError: err.message || 'Initialization fallback active',
        lastUpdated: new Date().toISOString()
      };
    }

    return this.status;
  }

  /**
   * Reanalyzes memories and updates Style DNA profile
   */
  public async reanalyzeProfile(manualUpdates?: StyleDNAUpdatePayload): Promise<StyleDNAProfile> {
    const activeUserId = this.userId || 'guest_user';
    this.status.isAnalyzing = true;

    const memories = memoryEngine.getMemories();
    const { profile, snapshot } = StyleDNAProfileBuilder.buildProfile(
      activeUserId,
      memories,
      this.currentProfile,
      manualUpdates
    );

    this.currentProfile = profile;
    await styleDNAStorage.saveProfile(activeUserId, profile);

    if (snapshot) {
      await styleDNAStorage.saveSnapshot(activeUserId, snapshot);
      this.snapshots.unshift(snapshot);
    }

    // Capture evolution trajectory snapshot
    try {
      await styleEvolutionTracker.captureEvolutionSnapshot(activeUserId, profile, 'manual_update');
    } catch (evoSnapErr) {
      console.warn('[StyleDNAEngine] Evolution snapshot capture notice:', evoSnapErr);
    }

    this.status = {
      isInitialized: true,
      isAnalyzing: false,
      currentVersion: profile.version,
      storageMode: this.userId ? 'firestore' : 'offline_local',
      lastUpdated: profile.updatedAt
    };

    return profile;
  }

  /**
   * Get active profile
   */
  public getProfile(): StyleDNAProfile | null {
    return this.currentProfile;
  }

  /**
   * Get profile snapshots history
   */
  public async getSnapshots(): Promise<StyleDNASnapshot[]> {
    if (this.snapshots.length === 0 && this.userId) {
      this.snapshots = await styleDNAStorage.fetchSnapshots(this.userId);
    }
    return this.snapshots;
  }

  /**
   * Get status
   */
  public getStatus(): StyleDNAStatus {
    return { ...this.status };
  }

  /**
   * Returns a formatted text snippet suitable for Gemini LLM context prompts
   */
  public getPromptFormattedStyleDNA(): string {
    if (!this.currentProfile) {
      return "STYLE DNA PROFILE: No Style DNA constructed yet.";
    }

    const p = this.currentProfile;
    const lines: string[] = [
      `STYLE DNA PROFILE (Identity: "${p.identityName}", Version: v${p.version}, Confidence: ${Math.round(p.overallConfidence * 100)}%):`,
    ];

    if (p.colorProfile.length > 0) {
      lines.push(`• Color Vectors: ${p.colorProfile.map(c => `${c.value} (${Math.round(c.confidence*100)}%)`).join(', ')}`);
    }
    if (p.silhouetteProfile.length > 0) {
      lines.push(`• Silhouette Vectors: ${p.silhouetteProfile.map(s => `${s.value} (${Math.round(s.confidence*100)}%)`).join(', ')}`);
    }
    if (p.materialProfile.length > 0) {
      lines.push(`• Material Vectors: ${p.materialProfile.map(m => `${m.value} (${Math.round(m.confidence*100)}%)`).join(', ')}`);
    }
    if (p.brandAffinity.length > 0) {
      lines.push(`• Brand Affinities: ${p.brandAffinity.map(b => `${b.value} (${Math.round(b.confidence*100)}%)`).join(', ')}`);
    }

    return lines.join('\n');
  }
}

export const styleDNAEngine = StyleDNAEngine.getInstance();
