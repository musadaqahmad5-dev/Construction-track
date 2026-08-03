/**
 * ARIA v2.5 Style DNA Types
 * Product: LOOK VISION v2.4
 */

export type StyleDNASource = 
  | 'user_explicit'
  | 'stored_memory'
  | 'user_correction'
  | 'confirmed_interaction';

export interface StyleDNAAttribute<T = string> {
  id: string;
  key: string;
  value: T;
  source: StyleDNASource;
  confidence: number; // 0.0 to 1.0
  evidenceCount: number;
  lastConfirmedAt: string;
  category?: string;
  notes?: string;
}

export interface StyleDNAProfile {
  id: string;
  userId: string;
  version: number;
  identityName: string;
  colorProfile: StyleDNAAttribute<string>[];
  silhouetteProfile: StyleDNAAttribute<string>[];
  materialProfile: StyleDNAAttribute<string>[];
  brandAffinity: StyleDNAAttribute<string>[];
  lifestyleAlignment: StyleDNAAttribute<string>[];
  occasionPreferences: StyleDNAAttribute<string>[];
  overallConfidence: number;
  totalEvidenceCount: number;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface StyleDNASnapshot {
  snapshotId: string;
  profileId: string;
  userId: string;
  version: number;
  profile: StyleDNAProfile;
  capturedAt: string;
  trigger: 'explicit_update' | 'memory_sync' | 'manual_snapshot';
}

export interface StyleDNAStatus {
  isInitialized: boolean;
  isAnalyzing: boolean;
  currentVersion: number;
  storageMode: 'firestore' | 'offline_local';
  lastUpdated: string;
  lastError?: string;
}

export interface StyleDNAUpdatePayload {
  identityName?: string;
  colorProfile?: StyleDNAAttribute<string>[];
  silhouetteProfile?: StyleDNAAttribute<string>[];
  materialProfile?: StyleDNAAttribute<string>[];
  brandAffinity?: StyleDNAAttribute<string>[];
  lifestyleAlignment?: StyleDNAAttribute<string>[];
  occasionPreferences?: StyleDNAAttribute<string>[];
  metadata?: Record<string, unknown>;
}
