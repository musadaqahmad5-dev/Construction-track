/**
 * ARIA v2.5 Style DNA Service (Express / Backend Engine)
 * Product: LOOK VISION v2.4
 */

export interface ServerStyleDNAAttribute {
  id: string;
  key: string;
  value: string;
  source: string;
  confidence: number;
  evidenceCount: number;
  lastConfirmedAt: string;
  category?: string;
}

export interface ServerStyleDNAProfile {
  id: string;
  userId: string;
  version: number;
  identityName: string;
  colorProfile: ServerStyleDNAAttribute[];
  silhouetteProfile: ServerStyleDNAAttribute[];
  materialProfile: ServerStyleDNAAttribute[];
  brandAffinity: ServerStyleDNAAttribute[];
  lifestyleAlignment: ServerStyleDNAAttribute[];
  occasionPreferences: ServerStyleDNAAttribute[];
  overallConfidence: number;
  totalEvidenceCount: number;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface ServerStyleDNASnapshot {
  snapshotId: string;
  profileId: string;
  userId: string;
  version: number;
  profile: ServerStyleDNAProfile;
  capturedAt: string;
  trigger: string;
}

export class StyleDNAService {
  private static instance: StyleDNAService;
  private serverProfileStore: Map<string, ServerStyleDNAProfile> = new Map();
  private serverSnapshotStore: Map<string, ServerStyleDNASnapshot[]> = new Map();

  private constructor() {}

  public static getInstance(): StyleDNAService {
    if (!StyleDNAService.instance) {
      StyleDNAService.instance = new StyleDNAService();
    }
    return StyleDNAService.instance;
  }

  /**
   * Get active Style DNA profile for user
   */
  public async getProfile(userId: string): Promise<ServerStyleDNAProfile> {
    const existing = this.serverProfileStore.get(userId);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const defaultProfile: ServerStyleDNAProfile = {
      id: `sdna_srv_${userId}_${Date.now()}`,
      userId,
      version: 1,
      identityName: 'Curated Minimalist DNA',
      colorProfile: [
        { id: 'c1', key: 'black', value: 'Deep Onyx', source: 'user_explicit', confidence: 0.95, evidenceCount: 3, lastConfirmedAt: now },
        { id: 'c2', key: 'cream', value: 'Warm Cream', source: 'stored_memory', confidence: 0.85, evidenceCount: 2, lastConfirmedAt: now }
      ],
      silhouetteProfile: [
        { id: 's1', key: 'blazer', value: 'Structured Tailored Blazers', source: 'user_explicit', confidence: 0.92, evidenceCount: 3, lastConfirmedAt: now }
      ],
      materialProfile: [
        { id: 'm1', key: 'wool', value: 'Virgin Wool & Cashmere', source: 'user_explicit', confidence: 0.90, evidenceCount: 2, lastConfirmedAt: now }
      ],
      brandAffinity: [
        { id: 'b1', key: 'acne', value: 'Acne Studios', source: 'user_explicit', confidence: 0.88, evidenceCount: 2, lastConfirmedAt: now }
      ],
      lifestyleAlignment: [
        { id: 'l1', key: 'urban', value: 'Architectural City Wear', source: 'confirmed_interaction', confidence: 0.80, evidenceCount: 1, lastConfirmedAt: now }
      ],
      occasionPreferences: [
        { id: 'o1', key: 'evening', value: 'Contemporary Gallery Openings', source: 'stored_memory', confidence: 0.78, evidenceCount: 1, lastConfirmedAt: now }
      ],
      overallConfidence: 0.88,
      totalEvidenceCount: 14,
      createdAt: now,
      updatedAt: now,
      metadata: { maturityLabel: 'Verified Signature DNA' }
    };

    this.serverProfileStore.set(userId, defaultProfile);
    return defaultProfile;
  }

  /**
   * Update or refine Style DNA profile
   */
  public async updateProfile(
    userId: string,
    updates: {
      identityName?: string;
      colorProfile?: ServerStyleDNAAttribute[];
      silhouetteProfile?: ServerStyleDNAAttribute[];
      materialProfile?: ServerStyleDNAAttribute[];
      brandAffinity?: ServerStyleDNAAttribute[];
      lifestyleAlignment?: ServerStyleDNAAttribute[];
      occasionPreferences?: ServerStyleDNAAttribute[];
      metadata?: Record<string, any>;
    }
  ): Promise<{ profile: ServerStyleDNAProfile; snapshot: ServerStyleDNASnapshot }> {
    const current = await this.getProfile(userId);
    const now = new Date().toISOString();
    const newVersion = current.version + 1;

    const updatedProfile: ServerStyleDNAProfile = {
      ...current,
      version: newVersion,
      identityName: updates.identityName || current.identityName,
      colorProfile: updates.colorProfile || current.colorProfile,
      silhouetteProfile: updates.silhouetteProfile || current.silhouetteProfile,
      materialProfile: updates.materialProfile || current.materialProfile,
      brandAffinity: updates.brandAffinity || current.brandAffinity,
      lifestyleAlignment: updates.lifestyleAlignment || current.lifestyleAlignment,
      occasionPreferences: updates.occasionPreferences || current.occasionPreferences,
      updatedAt: now,
      metadata: {
        ...current.metadata,
        ...updates.metadata
      }
    };

    this.serverProfileStore.set(userId, updatedProfile);

    const snapshot: ServerStyleDNASnapshot = {
      snapshotId: `snap_srv_v${newVersion}_${Date.now()}`,
      profileId: updatedProfile.id,
      userId,
      version: newVersion,
      profile: updatedProfile,
      capturedAt: now,
      trigger: 'explicit_update'
    };

    const snapshots = this.serverSnapshotStore.get(userId) || [];
    snapshots.unshift(snapshot);
    this.serverSnapshotStore.set(userId, snapshots);

    return { profile: updatedProfile, snapshot };
  }

  /**
   * Get profile history / snapshots
   */
  public async getHistory(userId: string): Promise<ServerStyleDNASnapshot[]> {
    const snapshots = this.serverSnapshotStore.get(userId) || [];
    if (snapshots.length === 0) {
      const current = await this.getProfile(userId);
      const initialSnap: ServerStyleDNASnapshot = {
        snapshotId: `snap_srv_v1_init`,
        profileId: current.id,
        userId,
        version: current.version,
        profile: current,
        capturedAt: current.createdAt,
        trigger: 'initial_creation'
      };
      this.serverSnapshotStore.set(userId, [initialSnap]);
      return [initialSnap];
    }
    return snapshots;
  }
}

export const styleDNAService = StyleDNAService.getInstance();
