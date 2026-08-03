/**
 * ARIA v2.5 Personal Fashion Memory Types
 * Product: LOOK VISION v2.4
 */

export type FashionMemoryCategory = 
  | 'color_preference'
  | 'style_preference'
  | 'silhouette_preference'
  | 'material_preference'
  | 'brand_preference'
  | 'wardrobe_behavior'
  | 'user_correction'
  | 'feedback'
  | 'explicit_preference';

export type MemorySource = 
  | 'user_explicit'
  | 'system_inferred'
  | 'feedback_loop'
  | 'correction';

export type MemoryLevel = 
  | 'short_term'
  | 'session'
  | 'preference'
  | 'long_term';

export interface FashionMemoryItem {
  id: string;
  userId?: string;
  category: FashionMemoryCategory;
  subcategory?: string;
  value: string | string[] | Record<string, unknown>;
  confidence: number; // 0.0 to 1.0
  source: MemorySource;
  level: MemoryLevel;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    workspaceId?: string;
    sessionId?: string;
    notes?: string;
    interactionCount?: number;
    decayFactor?: number;
    tags?: string[];
  };
}

export interface MemoryQueryFilter {
  category?: FashionMemoryCategory;
  level?: MemoryLevel;
  source?: MemorySource;
  minConfidence?: number;
  searchQuery?: string;
  limit?: number;
}

export interface MemoryContextSummary {
  userId?: string;
  totalMemories: number;
  preferencesCount: number;
  topColors: string[];
  topStyles: string[];
  preferredBrands: string[];
  preferredSilhouettes: string[];
  preferredMaterials: string[];
  recentCorrections: FashionMemoryItem[];
  confidenceOverview: {
    highCount: number;
    mediumCount: number;
    lowCount: number;
    averageConfidence: number;
  };
  lastSyncedAt: string;
}

export interface MemoryUpdatePayload {
  category: FashionMemoryCategory;
  subcategory?: string;
  value: string | string[] | Record<string, unknown>;
  source?: MemorySource;
  level?: MemoryLevel;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface MemoryStatus {
  isInitialized: boolean;
  isSyncing: boolean;
  itemCount: number;
  storageMode: 'firestore' | 'offline_local';
  lastError?: string;
  lastSyncedAt?: string;
}
