/**
 * ARIA v2.5 Creative Intelligence Types
 * Product: LOOK VISION v2.4
 */

export type CreativeCategory =
  | 'OUTFIT_CONCEPT'
  | 'CAPSULE_WARDROBE'
  | 'SEASONAL_COLLECTION'
  | 'COLOR_STORY'
  | 'MOOD_BOARD'
  | 'STYLING_DIRECTION'
  | 'WARDROBE_REFRESH'
  | 'FASHION_THEME';

export interface CreativeSignal {
  id: string;
  sourceType: 'memory' | 'style_dna' | 'decision' | 'creative_synthesis';
  signalText: string;
  confidence: number;
}

export interface CapsuleItem {
  id: string;
  name: string;
  category: string;
  color: string;
  material: string;
  versatilityScore: number; // 0.0 to 1.0
  pairings: string[];
}

export interface MoodboardElement {
  id: string;
  title: string;
  type: 'color_swatch' | 'texture' | 'silhouette' | 'editorial_note';
  value: string;
  accentColor?: string;
}

export interface CreativeConcept {
  creativeId: string;
  userId?: string;
  title: string;
  description: string;
  category: CreativeCategory;
  confidence: number;            // 0.0 to 1.0
  originalityScore: number;      // 0.0 to 1.0
  styleDNAAlignment: number;     // 0.0 to 1.0
  decisionAlignment: number;     // 0.0 to 1.0
  memoryAlignment: number;       // 0.0 to 1.0
  supportingSignals: CreativeSignal[];
  evidenceCount: number;
  createdAt: string;

  // Creative payloads
  colorStory?: string[];
  stylingDirections?: string[];
  capsuleItems?: CapsuleItem[];
  moodboardElements?: MoodboardElement[];
  editorialHeadline?: string;

  metadata?: Record<string, unknown>;
}

export interface CreativeQueryRequest {
  userId?: string;
  category?: CreativeCategory;
  themePrompt?: string;
  targetSeason?: string;
  desiredPieceCount?: number;
}

export interface CreativeEngineStatus {
  isInitialized: boolean;
  isGenerating: boolean;
  historyCount: number;
  storageMode: 'firestore' | 'offline_local';
  lastGeneratedAt?: string;
  lastError?: string;
}
