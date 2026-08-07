/**
 * ARIA v2.5 Style Evolution Tracker
 * Captures historical timeline snapshots of user style evolution over time without overwriting history.
 * Product: LOOK VISION v2.4
 */

import {
  StyleEvolutionSnapshot,
  StyleEvolutionTimeline,
  EvolutionTriggerEvent
} from './StyleEvolutionTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';
import { styleEvolutionStorage } from './StyleEvolutionStorage';
import { StyleDNAScorer } from '../styleDNA/StyleDNAScorer';

export class StyleEvolutionTracker {
  private static instance: StyleEvolutionTracker;

  private constructor() {}

  public static getInstance(): StyleEvolutionTracker {
    if (!StyleEvolutionTracker.instance) {
      StyleEvolutionTracker.instance = new StyleEvolutionTracker();
    }
    return StyleEvolutionTracker.instance;
  }

  /**
   * Generates a new historical evolution snapshot from a Style DNA profile
   */
  public async captureEvolutionSnapshot(
    userId: string,
    profile: StyleDNAProfile,
    triggerEvent: EvolutionTriggerEvent,
    extraMetrics?: {
      formalityLevel?: number;
      experimentalIndex?: number;
      seasonalPreference?: 'spring' | 'summer' | 'fall' | 'winter' | 'transition';
      feedbackEventsCount?: number;
    }
  ): Promise<StyleEvolutionSnapshot> {
    const timestamp = new Date().toISOString();
    const snapshotId = `evo_snap_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const preferredColors = (profile.colorProfile || []).map(c => ({
      value: c.value,
      confidence: c.confidence,
      evidenceCount: c.evidenceCount
    }));

    const preferredGarments = (profile.silhouetteProfile || []).map(g => ({
      value: g.value,
      confidence: g.confidence,
      evidenceCount: g.evidenceCount
    }));

    const preferredBrands = (profile.brandAffinity || []).map(b => ({
      value: b.value,
      confidence: b.confidence,
      evidenceCount: b.evidenceCount
    }));

    const preferredMaterials = (profile.materialProfile || []).map(m => ({
      value: m.value,
      confidence: m.confidence,
      evidenceCount: m.evidenceCount
    }));

    const fashionCategories = (profile.occasionPreferences || []).map(o => ({
      value: o.value,
      weight: o.confidence
    }));

    const maturity = StyleDNAScorer.getMaturityLabel(
      profile.overallConfidence || 0.7,
      profile.totalEvidenceCount || 1
    );

    const snapshot: StyleEvolutionSnapshot = {
      snapshotId,
      userId,
      version: profile.version || 1,
      capturedAt: timestamp,
      triggerEvent,
      preferredColors,
      preferredGarments,
      preferredBrands,
      preferredMaterials,
      fashionCategories,
      formalityLevel: extraMetrics?.formalityLevel ?? 0.65,
      experimentalIndex: extraMetrics?.experimentalIndex ?? 0.5,
      seasonalPreference: extraMetrics?.seasonalPreference ?? 'transition',
      overallConfidence: profile.overallConfidence || 0.7,
      evidenceCount: profile.totalEvidenceCount || 1,
      maturityLabel: maturity
    };

    // Persist snapshot to Firestore and Local Storage via adapter
    await styleEvolutionStorage.saveEvolutionSnapshot(userId, snapshot);

    return snapshot;
  }

  /**
   * Fetches user's complete historical timeline
   */
  public async getEvolutionTimeline(userId: string): Promise<StyleEvolutionTimeline> {
    const records = await styleEvolutionStorage.fetchEvolutionHistory(userId);
    const lastEvolvedAt = records[0]?.capturedAt || new Date().toISOString();

    return {
      userId,
      records,
      lastEvolvedAt,
      totalEvolutions: records.length
    };
  }
}

export const styleEvolutionTracker = StyleEvolutionTracker.getInstance();
