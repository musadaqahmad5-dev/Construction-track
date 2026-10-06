/**
 * AIStyleHub v1.7 Product Architecture Engine
 * Core architecture managing Product Memories, Universal Publishing Gateway,
 * Anonymous Draft Ecosystem, and AI Learning Signal Engine for Zero Search Experience.
 */

export type ProductModule = 
  | 'HOME_HUB'
  | 'COMMUNITY'
  | 'AI_CREATIONS'
  | 'OUTFITS'
  | 'MARKETPLACE'
  | 'STYLE_DNA'
  | 'VIRTUAL_TRY_ON';

export type UserSignalAction = 
  | 'LIKE'
  | 'DISLIKE'
  | 'NOT_RELATED'
  | 'SAVE'
  | 'DOWNLOAD'
  | 'PUBLISH'
  | 'DISCARD';

export interface SignalWeightMap {
  LIKE: number;       // +5
  DISLIKE: number;    // -5
  NOT_RELATED: number;// -3
  SAVE: number;       // +8
  DOWNLOAD: number;   // +6
  PUBLISH: number;    // +10
  DISCARD: number;    // -2
}

export const SIGNAL_WEIGHTS: SignalWeightMap = {
  LIKE: 5,
  DISLIKE: -5,
  NOT_RELATED: -3,
  SAVE: 8,
  DOWNLOAD: 6,
  PUBLISH: 10,
  DISCARD: -2
};

export interface UniversalPublishableAsset {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  originModule: ProductModule;
  createdAt: string;
  isPrivate: boolean; // Private by default in v1.7
  publishedToHomeHub: boolean;
  publishedToPublicFeed: boolean;
  creatorId?: string;
  creatorName?: string;
  tags: string[];
  category?: string;
  styleVibe?: string;
  qualityScore?: number;
  metadata?: Record<string, any>;
}

export interface AnonymousDraftAsset {
  id: string;
  anonymousHash: string;
  imageUrl: string;
  titleSuggestion: string;
  originModule: ProductModule;
  category: string;
  styleVibe: string;
  qualityScore: number;
  anonymizedAt: string;
  tags: string[];
}

export interface ProductMemoryRecord {
  module: ProductModule;
  totalInteractions: number;
  savedItemsCount: number;
  lastActiveTimestamp: string;
  topCategories: string[];
  favoriteStyles: string[];
  recentActivity: Array<{
    action: string;
    targetTitle: string;
    timestamp: string;
  }>;
}

export interface UnifiedHomeHubMemory {
  totalAssetsCount: number;
  totalLikesReceived: number;
  totalSavedAssets: number;
  publishedAssetsCount: number;
  anonymousDraftsCount: number;
  zeroSearchPrecisionScore: number; // 0 - 100%
  learnedStylePreferences: Record<string, number>; // style -> affinity score
  productMemories: Record<ProductModule, ProductMemoryRecord>;
  lastUnifiedSyncTimestamp: string;
}

export interface HomeHubLikedItem {
  id: string;
  title: string;
  imageUrl: string;
  originModule: ProductModule;
  likedAt: string;
  styleVibe: string;
}

export interface HomeHubDownloadedItem {
  id: string;
  title: string;
  imageUrl: string;
  originModule: ProductModule;
  downloadedAt: string;
  fileFormat: string;
  resolution: string;
}

export interface HomeHubCollection {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  itemCount: number;
  createdAt: string;
  tags: string[];
}

export interface HomeHubStory {
  id: string;
  authorName: string;
  authorAvatar?: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  caption?: string;
  createdAt: string;
  isViewed?: boolean;
}

export interface HomeHubPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  title: string;
  caption: string;
  tags: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isImportedFromPublicMemory?: boolean;
  importedSourceModule?: string;
}

export interface HomeHubSocialEntity {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  category: 'USERS' | 'PAGES' | 'GROUPS';
  subTag?: string;
  membersOrFollowers?: string;
  friendRequestStatus?: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED';
  isJoinedOrFollowing?: boolean;
}

export interface AICreationFolder {
  id: string;
  name: string;
  description?: string;
  categoryTag?: string;
  itemIds: string[];
  createdAt: string;
  isSystemDefault?: boolean;
}

export interface AICreationActiveSession {
  prompt: string;
  category: string;
  selectedStyle: string;
  selectedView?: string;
  isGenerating?: boolean;
  generationStep?: string;
  pendingResult?: any;
  lastUpdatedTimestamp: string;
}

export interface OutfitActiveSession {
  vibePreset?: string;
  occasion?: string;
  selectedGarmentIds?: string[];
  selectedColors?: string[];
  customPrompt?: string;
  isGenerating?: boolean;
  generationStep?: string;
  pendingOutfitAssets?: any[];
  lastUpdatedTimestamp: string;
}

export type StabilityLevel = 'experimental' | 'developing' | 'established' | 'core_identity';
export type TrendDirection = 'rising' | 'stable' | 'declining';

export interface StyleDNAPreferenceItem {
  id: string;
  value: string;
  category: 'style' | 'color' | 'garment' | 'outfit_structure' | 'fabric' | 'silhouette' | 'accessory' | 'visual_mood' | 'prompt_pattern' | 'fashion_category';
  confidenceScore: number; // 0 to 100
  learningCount: number;   // Count of observations / reinforcements
  lastUpdated: string;
  trendDirection: TrendDirection;
  stabilityLevel: StabilityLevel;
}

export interface PersonalFashionIdentity {
  styleArchetype: string;        // E.g., "Minimalist Haute Couture"
  colorPersonality: string;      // E.g., "Monochrome Charcoal & Emerald Accents"
  fashionMood: string;           // E.g., "Architectural Modern Elegance"
  creativityLevel: number;       // 0 to 100
  luxuryPreference: number;      // 0 to 100
  minimalismScore: number;       // 0 to 100
  experimentalScore: number;     // 0 to 100
  formalityPreference: number;   // 0 to 100
  seasonalPreference: string;    // E.g., "Autumn Tailoring & Transseasonal Draping"
  overallConfidenceScore: number;// 0 to 100
  totalSignalsLearned: number;   // Count of all signals processed
  lastEvolvedTimestamp: string;
}

export interface StyleDNAIntelligenceModel {
  identity: PersonalFashionIdentity;
  preferences: {
    preferredFashionStyles: StyleDNAPreferenceItem[];
    preferredColors: StyleDNAPreferenceItem[];
    favoriteGarments: StyleDNAPreferenceItem[];
    favoriteOutfitStructures: StyleDNAPreferenceItem[];
    favoriteFabrics: StyleDNAPreferenceItem[];
    favoriteSilhouettes: StyleDNAPreferenceItem[];
    favoriteAccessories: StyleDNAPreferenceItem[];
    favoriteVisualMoods: StyleDNAPreferenceItem[];
    favoritePromptPatterns: StyleDNAPreferenceItem[];
    favoriteFashionCategories: StyleDNAPreferenceItem[];
  };
  evolutionTimeline: Array<{
    id: string;
    timestamp: string;
    sourceModule: ProductModule;
    signalAction: UserSignalAction;
    summary: string;
    impactScore: number;
  }>;
}

const MEMORY_STORAGE_KEY = 'aistylehub_v17_unified_memory';
const DRAFTS_STORAGE_KEY = 'aistylehub_v17_anonymous_drafts';
const PUBLISHING_GATEWAY_KEY = 'aistylehub_v17_publishing_queue';
const SIGNALS_STORAGE_KEY = 'aistylehub_v17_learning_signals';
const LIKES_STORAGE_KEY = 'aistylehub_v17_recent_likes';
const DOWNLOADS_STORAGE_KEY = 'aistylehub_v17_recent_downloads';
const COLLECTIONS_STORAGE_KEY = 'aistylehub_v17_collections';
const HOMEHUB_STORIES_KEY = 'aistylehub_v17_homehub_stories';
const HOMEHUB_POSTS_KEY = 'aistylehub_v17_homehub_posts';
const LAST_HOURLY_SYNC_KEY = 'aistylehub_v17_last_hourly_sync';
const AI_CREATION_SESSION_KEY = 'aistylehub_v17_aicreation_active_session';
const OUTFIT_SESSION_KEY = 'aistylehub_v17_outfit_active_session';
const STYLE_DNA_MODEL_KEY = 'aistylehub_v17_style_dna_model';
const AICREATION_FOLDERS_KEY = 'aistylehub_v17_aicreation_folders';
const SOCIAL_ENTITIES_KEY = 'aistylehub_v17_social_entities';

/**
 * Safe local storage setter to guard against DOMException QuotaExceededError
 */
const safeLocalStorageSetItem = (key: string, value: string): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (err: any) {
    if (err?.name === 'QuotaExceededError' || err?.code === 22 || err?.code === 1014) {
      try {
        // Clear transient keys first to free up space
        localStorage.removeItem(AI_CREATION_SESSION_KEY);
        localStorage.removeItem(OUTFIT_SESSION_KEY);
        localStorage.removeItem(DRAFTS_STORAGE_KEY);
        localStorage.setItem(key, value);
      } catch {
        // Fallback: silently ignore if browser storage is strictly capped
        console.warn(`[AIStyleHubStorage] Storage quota exceeded when writing to '${key}'. Value cached in memory.`);
      }
    }
  }
};

const safeLocalStorageRemoveItem = (key: string): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore removal errors
  }
};

export class AIStyleHubV17Architecture {

  // ==========================================
  // 1. PRODUCT MEMORY & UNIFIED MEMORY CENTER
  // ==========================================

  public static getUnifiedMemory(): UnifiedHomeHubMemory {
    if (typeof localStorage === 'undefined') return this.getDefaultUnifiedMemory();
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (!raw) return this.getDefaultUnifiedMemory();
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultUnifiedMemory();
    }
  }

  public static saveUnifiedMemory(memory: UnifiedHomeHubMemory): void {
    safeLocalStorageSetItem(MEMORY_STORAGE_KEY, JSON.stringify(memory));
  }

  private static getDefaultUnifiedMemory(): UnifiedHomeHubMemory {
    const defaultRecord = (mod: ProductModule): ProductMemoryRecord => ({
      module: mod,
      totalInteractions: 12,
      savedItemsCount: 3,
      lastActiveTimestamp: new Date().toISOString(),
      topCategories: ['Avant-Garde', 'Tailored Silk', 'Cyberpunk'],
      favoriteStyles: ['Minimalist Noir', 'Haute Couture'],
      recentActivity: [
        { action: 'EXPLORED', targetTitle: `${mod} Initialization`, timestamp: new Date().toISOString() }
      ]
    });

    return {
      totalAssetsCount: 24,
      totalLikesReceived: 142,
      totalSavedAssets: 18,
      publishedAssetsCount: 6,
      anonymousDraftsCount: 9,
      zeroSearchPrecisionScore: 94,
      learnedStylePreferences: {
        'Avant-Garde': 45,
        'Quiet Luxury': 38,
        'Cyberpunk': 30,
        'Tailored Silk': 25,
        'Streetwear': 18
      },
      productMemories: {
        HOME_HUB: defaultRecord('HOME_HUB'),
        COMMUNITY: defaultRecord('COMMUNITY'),
        AI_CREATIONS: defaultRecord('AI_CREATIONS'),
        OUTFITS: defaultRecord('OUTFITS'),
        MARKETPLACE: defaultRecord('MARKETPLACE'),
        STYLE_DNA: defaultRecord('STYLE_DNA'),
        VIRTUAL_TRY_ON: defaultRecord('VIRTUAL_TRY_ON'),
      },
      lastUnifiedSyncTimestamp: new Date().toISOString()
    };
  }

  // ==========================================
  // 2. UNIVERSAL PUBLISHING GATEWAY
  // ==========================================

  /**
   * Universal Rule: Every asset is PRIVATE BY DEFAULT.
   * Items are queued into HomeHub's publishing gateway. Only HomeHub can publish publicly.
   */
  public static queueAssetForPublishing(asset: Omit<UniversalPublishableAsset, 'isPrivate' | 'publishedToHomeHub' | 'publishedToPublicFeed'>): UniversalPublishableAsset {
    const queue = this.getPublishingQueue();
    const newAsset: UniversalPublishableAsset = {
      ...asset,
      isPrivate: true, // Private by default in v1.7
      publishedToHomeHub: true, // Saved in user's HomeHub Personal World
      publishedToPublicFeed: false // Requires HomeHub Universal Publishing Gateway confirmation
    };

    queue.unshift(newAsset);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PUBLISHING_GATEWAY_KEY, JSON.stringify(queue));
    }

    // Record signal
    this.recordLearningSignal(asset.originModule, 'SAVE', asset.styleVibe || 'General');

    return newAsset;
  }

  public static getPublishingQueue(): UniversalPublishableAsset[] {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(PUBLISHING_GATEWAY_KEY);
    if (!raw) return this.getDefaultPublishingAssets();
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultPublishingAssets();
    }
  }

  /**
   * HomeHub ONLY Public Gateway Approval
   */
  public static publishAssetToPublicCommunityFeed(assetId: string, publicMetadata?: { caption?: string; tags?: string[] }): UniversalPublishableAsset | null {
    const queue = this.getPublishingQueue();
    const idx = queue.findIndex(a => a.id === assetId);
    if (idx === -1) return null;

    queue[idx].publishedToPublicFeed = true;
    queue[idx].isPrivate = false;
    if (publicMetadata?.caption) queue[idx].description = publicMetadata.caption;
    if (publicMetadata?.tags) queue[idx].tags = Array.from(new Set([...queue[idx].tags, ...publicMetadata.tags]));

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PUBLISHING_GATEWAY_KEY, JSON.stringify(queue));
    }

    // Update memory
    const mem = this.getUnifiedMemory();
    mem.publishedAssetsCount += 1;
    this.saveUnifiedMemory(mem);

    // Record PUBLISH signal
    this.recordLearningSignal(queue[idx].originModule, 'PUBLISH', queue[idx].styleVibe || 'General');

    return queue[idx];
  }

  private static getDefaultPublishingAssets(): UniversalPublishableAsset[] {
    return [
      {
        id: 'asset-v17-1',
        title: 'Architectural Liquid Gold Trench',
        description: 'Avant-Garde structural concept created in AI Creations Universe Studio.',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
        originModule: 'AI_CREATIONS',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        isPrivate: true,
        publishedToHomeHub: true,
        publishedToPublicFeed: true,
        tags: ['avant-garde', 'liquid-gold', 'runway'],
        category: 'AI Fashion',
        styleVibe: 'Avant-Garde',
        qualityScore: 98
      },
      {
        id: 'asset-v17-2',
        title: 'Nordic Minimalist Silk Ensemble',
        description: 'Curated outfit lookbook from Wardrobe & Outfit Planner.',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800',
        originModule: 'OUTFITS',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        isPrivate: true,
        publishedToHomeHub: true,
        publishedToPublicFeed: false,
        tags: ['nordic', 'silk', 'minimalist'],
        category: 'Outfits',
        styleVibe: 'Quiet Luxury',
        qualityScore: 92
      }
    ];
  }

  // ==========================================
  // 3. ANONYMOUS DRAFT ECOSYSTEM
  // ==========================================

  /**
   * When an asset is discarded or downloaded, if it has high visual quality score,
   * it enters the Anonymous Draft Ecosystem after stripping all identity information.
   */
  public static convertToAnonymousDraft(asset: {
    imageUrl: string;
    title: string;
    originModule: ProductModule;
    category?: string;
    styleVibe?: string;
    tags?: string[];
  }): AnonymousDraftAsset {
    const drafts = this.getAnonymousDrafts();
    const hash = `anon_v17_${Math.random().toString(36).substring(2, 10)}`;

    const newDraft: AnonymousDraftAsset = {
      id: `draft-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      anonymousHash: hash,
      imageUrl: asset.imageUrl,
      titleSuggestion: asset.title.replace(/(my|i|user|me)\s+/gi, '').trim() || 'Visual Inspiration Draft',
      originModule: asset.originModule,
      category: asset.category || 'General Concept',
      styleVibe: asset.styleVibe || 'Creative Concept',
      qualityScore: Math.floor(88 + Math.random() * 10),
      anonymizedAt: new Date().toISOString(),
      tags: asset.tags || ['inspiration', 'anonymous-draft']
    };

    drafts.unshift(newDraft);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    }

    const mem = this.getUnifiedMemory();
    mem.anonymousDraftsCount = drafts.length;
    this.saveUnifiedMemory(mem);

    return newDraft;
  }

  public static getAnonymousDrafts(filterModule?: ProductModule): AnonymousDraftAsset[] {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    let list: AnonymousDraftAsset[] = [];
    if (!raw) {
      list = this.getDefaultAnonymousDrafts();
    } else {
      try {
        list = JSON.parse(raw);
      } catch {
        list = this.getDefaultAnonymousDrafts();
      }
    }

    if (filterModule) {
      return list.filter(d => d.originModule === filterModule);
    }
    return list;
  }

  private static getDefaultAnonymousDrafts(): AnonymousDraftAsset[] {
    return [
      {
        id: 'anon-1',
        anonymousHash: 'anon_v17_a9f82d',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',
        titleSuggestion: 'Deconstructed Emerald Tailored Suit',
        originModule: 'AI_CREATIONS',
        category: 'Fashion Concept',
        styleVibe: 'Avant-Garde',
        qualityScore: 95,
        anonymizedAt: new Date(Date.now() - 86400000).toISOString(),
        tags: ['emerald', 'tailored', 'draped']
      },
      {
        id: 'anon-2',
        anonymousHash: 'anon_v17_c7b11e',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800',
        titleSuggestion: 'Neon Volumetric Metropolis Architecture',
        originModule: 'COMMUNITY',
        category: 'Fantasy World',
        styleVibe: 'Cyberpunk',
        qualityScore: 91,
        anonymizedAt: new Date(Date.now() - 172800000).toISOString(),
        tags: ['neon', 'sci-fi', 'landscape']
      }
    ];
  }

  // ==========================================
  // 4. AI LEARNING ENGINE, STYLE DNA & ZERO SEARCH
  // ==========================================

  public static getStyleDNAModel(): StyleDNAIntelligenceModel {
    if (typeof localStorage === 'undefined') return this.getDefaultStyleDNAModel();
    const raw = localStorage.getItem(STYLE_DNA_MODEL_KEY);
    if (!raw) return this.getDefaultStyleDNAModel();
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultStyleDNAModel();
    }
  }

  public static saveStyleDNAModel(model: StyleDNAIntelligenceModel): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STYLE_DNA_MODEL_KEY, JSON.stringify(model));
  }

  public static getDefaultStyleDNAModel(): StyleDNAIntelligenceModel {
    const now = new Date().toISOString();
    return {
      identity: {
        styleArchetype: 'Luxury Minimalist Avant-Garde',
        colorPersonality: 'Monochrome Charcoal with Emerald Accents',
        fashionMood: 'Architectural Structural Elegance',
        creativityLevel: 88,
        luxuryPreference: 94,
        minimalismScore: 82,
        experimentalScore: 85,
        formalityPreference: 70,
        seasonalPreference: 'Autumn Tailoring & Transseasonal Draping',
        overallConfidenceScore: 92,
        totalSignalsLearned: 38,
        lastEvolvedTimestamp: now
      },
      preferences: {
        preferredFashionStyles: [
          { id: 'p-style-1', value: 'Avant-Garde', category: 'style', confidenceScore: 94, learningCount: 16, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'core_identity' },
          { id: 'p-style-2', value: 'Quiet Luxury', category: 'style', confidenceScore: 90, learningCount: 12, lastUpdated: now, trendDirection: 'stable', stabilityLevel: 'core_identity' },
          { id: 'p-style-3', value: 'Cyberpunk', category: 'style', confidenceScore: 78, learningCount: 7, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'established' },
          { id: 'p-style-4', value: 'Minimalist', category: 'style', confidenceScore: 84, learningCount: 10, lastUpdated: now, trendDirection: 'stable', stabilityLevel: 'established' },
          { id: 'p-style-5', value: 'Tailored Silk', category: 'style', confidenceScore: 76, learningCount: 5, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'developing' }
        ],
        preferredColors: [
          { id: 'p-col-1', value: 'Charcoal & Obsidian', category: 'color', confidenceScore: 92, learningCount: 14, lastUpdated: now, trendDirection: 'stable', stabilityLevel: 'core_identity' },
          { id: 'p-col-2', value: 'Liquid Emerald', category: 'color', confidenceScore: 86, learningCount: 9, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'established' },
          { id: 'p-col-3', value: 'Champagne Gold', category: 'color', confidenceScore: 78, learningCount: 6, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'developing' }
        ],
        favoriteGarments: [
          { id: 'p-garm-1', value: 'Deconstructed Trench Coat', category: 'garment', confidenceScore: 95, learningCount: 15, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'core_identity' },
          { id: 'p-garm-2', value: 'Pleated Silk Trousers', category: 'garment', confidenceScore: 88, learningCount: 11, lastUpdated: now, trendDirection: 'stable', stabilityLevel: 'established' },
          { id: 'p-garm-3', value: 'Volumetric Blazer', category: 'garment', confidenceScore: 82, learningCount: 8, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'established' }
        ],
        favoriteOutfitStructures: [
          { id: 'p-str-1', value: 'Asymmetric Tailored Layering', category: 'outfit_structure', confidenceScore: 91, learningCount: 13, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'core_identity' },
          { id: 'p-str-2', value: 'Monochrome Fluid Draping', category: 'outfit_structure', confidenceScore: 87, learningCount: 9, lastUpdated: now, trendDirection: 'stable', stabilityLevel: 'established' }
        ],
        favoriteFabrics: [
          { id: 'p-fab-1', value: 'Raw Heavy Silk', category: 'fabric', confidenceScore: 94, learningCount: 14, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'core_identity' },
          { id: 'p-fab-2', value: 'Italian Cashmere', category: 'fabric', confidenceScore: 89, learningCount: 10, lastUpdated: now, trendDirection: 'stable', stabilityLevel: 'established' },
          { id: 'p-fab-3', value: 'Technical Organza', category: 'fabric', confidenceScore: 81, learningCount: 6, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'developing' }
        ],
        favoriteSilhouettes: [
          { id: 'p-sil-1', value: 'Architectural Over-Sized', category: 'silhouette', confidenceScore: 93, learningCount: 13, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'core_identity' },
          { id: 'p-sil-2', value: 'Fluid Column Draping', category: 'silhouette', confidenceScore: 86, learningCount: 8, lastUpdated: now, trendDirection: 'stable', stabilityLevel: 'established' }
        ],
        favoriteAccessories: [
          { id: 'p-acc-1', value: 'Sculptural Obsidian Jewelry', category: 'accessory', confidenceScore: 88, learningCount: 9, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'established' },
          { id: 'p-acc-2', value: 'Monolithic Leather Tote', category: 'accessory', confidenceScore: 82, learningCount: 7, lastUpdated: now, trendDirection: 'stable', stabilityLevel: 'developing' }
        ],
        favoriteVisualMoods: [
          { id: 'p-vm-1', value: 'Refined High-Fashion', category: 'visual_mood', confidenceScore: 95, learningCount: 18, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'core_identity' },
          { id: 'p-vm-2', value: 'Futuristic Sartorial', category: 'visual_mood', confidenceScore: 87, learningCount: 11, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'established' }
        ],
        favoritePromptPatterns: [
          { id: 'p-pp-1', value: 'Volumetric lighting with liquid silk drapery', category: 'prompt_pattern', confidenceScore: 92, learningCount: 12, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'core_identity' },
          { id: 'p-pp-2', value: 'Tailored wool silhouette in dark slate monochrome', category: 'prompt_pattern', confidenceScore: 86, learningCount: 8, lastUpdated: now, trendDirection: 'stable', stabilityLevel: 'established' }
        ],
        favoriteFashionCategories: [
          { id: 'p-cat-1', value: 'Haute Couture', category: 'fashion_category', confidenceScore: 96, learningCount: 19, lastUpdated: now, trendDirection: 'rising', stabilityLevel: 'core_identity' },
          { id: 'p-cat-2', value: 'Runway Concepts', category: 'fashion_category', confidenceScore: 90, learningCount: 13, lastUpdated: now, trendDirection: 'stable', stabilityLevel: 'core_identity' },
          { id: 'p-cat-3', value: 'Smart Tailoring', category: 'fashion_category', confidenceScore: 84, learningCount: 9, lastUpdated: now, trendDirection: 'stable', stabilityLevel: 'established' }
        ]
      },
      evolutionTimeline: [
        {
          id: 'evo-1',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          sourceModule: 'AI_CREATIONS',
          signalAction: 'LIKE',
          summary: 'Reinforced Avant-Garde & Raw Heavy Silk preferences (+5 Confidence)',
          impactScore: 94
        },
        {
          id: 'evo-2',
          timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
          sourceModule: 'OUTFITS',
          signalAction: 'SAVE',
          summary: 'Saved Nordic Cashmere Lookbook (+8 Confidence to Quiet Luxury)',
          impactScore: 90
        },
        {
          id: 'evo-3',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          sourceModule: 'COMMUNITY',
          signalAction: 'PUBLISH',
          summary: 'Published Architectural Trench concept to Universal Gateway (+10 Confidence)',
          impactScore: 98
        }
      ]
    };
  }

  /**
   * Process learning signals to automatically evolve Style DNA confidence
   */
  public static processStyleDNASignal(
    sourceModule: ProductModule,
    action: UserSignalAction,
    styleVibe: string,
    metadata?: Record<string, any>
  ): void {
    const dna = this.getStyleDNAModel();
    const weight = SIGNAL_WEIGHTS[action] || 0;
    const now = new Date().toISOString();

    // Helper to update a preference item
    const updatePrefList = (
      list: StyleDNAPreferenceItem[],
      val: string,
      cat: StyleDNAPreferenceItem['category']
    ) => {
      let item = list.find(p => p.value.toLowerCase() === val.toLowerCase());
      if (!item) {
        item = {
          id: `pref-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          value: val,
          category: cat,
          confidenceScore: Math.min(100, Math.max(10, 50 + weight * 2)),
          learningCount: 1,
          lastUpdated: now,
          trendDirection: weight >= 0 ? 'rising' : 'declining',
          stabilityLevel: 'experimental'
        };
        list.unshift(item);
      } else {
        const prevScore = item.confidenceScore;
        item.confidenceScore = Math.min(100, Math.max(0, item.confidenceScore + weight));
        item.learningCount += 1;
        item.lastUpdated = now;
        if (item.confidenceScore > prevScore) item.trendDirection = 'rising';
        else if (item.confidenceScore < prevScore) item.trendDirection = 'declining';
        else item.trendDirection = 'stable';

        // Stability recalculation
        if (item.learningCount >= 12 && item.confidenceScore >= 80) item.stabilityLevel = 'core_identity';
        else if (item.learningCount >= 6 && item.confidenceScore >= 65) item.stabilityLevel = 'established';
        else if (item.learningCount >= 3 && item.confidenceScore >= 45) item.stabilityLevel = 'developing';
        else item.stabilityLevel = 'experimental';
      }
    };

    // 1. Primary Style Vibe
    if (styleVibe && styleVibe.trim().length > 0) {
      updatePrefList(dna.preferences.preferredFashionStyles, styleVibe.trim(), 'style');
    }

    // 2. Additional features from metadata or tags
    if (metadata) {
      if (metadata.color) updatePrefList(dna.preferences.preferredColors, metadata.color, 'color');
      if (metadata.garment) updatePrefList(dna.preferences.favoriteGarments, metadata.garment, 'garment');
      if (metadata.fabric) updatePrefList(dna.preferences.favoriteFabrics, metadata.fabric, 'fabric');
      if (metadata.silhouette) updatePrefList(dna.preferences.favoriteSilhouettes, metadata.silhouette, 'silhouette');
      if (metadata.category) updatePrefList(dna.preferences.favoriteFashionCategories, metadata.category, 'fashion_category');
      if (metadata.promptPattern) updatePrefList(dna.preferences.favoritePromptPatterns, metadata.promptPattern, 'prompt_pattern');
    }

    // 3. Evolve Identity metrics
    dna.identity.totalSignalsLearned += 1;
    dna.identity.lastEvolvedTimestamp = now;

    if (action === 'LIKE' || action === 'SAVE' || action === 'PUBLISH') {
      dna.identity.experimentalScore = Math.min(100, dna.identity.experimentalScore + 1);
      if (styleVibe.toLowerCase().includes('luxury') || styleVibe.toLowerCase().includes('haute')) {
        dna.identity.luxuryPreference = Math.min(100, dna.identity.luxuryPreference + 2);
      }
      if (styleVibe.toLowerCase().includes('minimal')) {
        dna.identity.minimalismScore = Math.min(100, dna.identity.minimalismScore + 2);
      }
    }

    // Recompute top archetype
    const topStyles = [...dna.preferences.preferredFashionStyles].sort((a, b) => b.confidenceScore - a.confidenceScore);
    if (topStyles.length >= 2) {
      dna.identity.styleArchetype = `${topStyles[0].value} ${topStyles[1].value}`;
    } else if (topStyles.length === 1) {
      dna.identity.styleArchetype = `${topStyles[0].value} Identity`;
    }

    const topColors = [...dna.preferences.preferredColors].sort((a, b) => b.confidenceScore - a.confidenceScore);
    if (topColors.length >= 2) {
      dna.identity.colorPersonality = `${topColors[0].value} & ${topColors[1].value}`;
    } else if (topColors.length === 1) {
      dna.identity.colorPersonality = `${topColors[0].value} Tones`;
    }

    // Overall confidence meter
    const coreItems = topStyles.slice(0, 5);
    const avgScore = coreItems.length > 0 ? Math.round(coreItems.reduce((acc, x) => acc + x.confidenceScore, 0) / coreItems.length) : 85;
    dna.identity.overallConfidenceScore = Math.min(99, Math.max(70, avgScore));

    // Append to evolution timeline
    dna.evolutionTimeline.unshift({
      id: `evo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now,
      sourceModule,
      signalAction: action,
      summary: `${action} signal from ${sourceModule} updated ${styleVibe} (${weight > 0 ? '+' : ''}${weight} Impact)`,
      impactScore: Math.min(99, 80 + Math.abs(weight) * 2)
    });
    dna.evolutionTimeline = dna.evolutionTimeline.slice(0, 15);

    this.saveStyleDNAModel(dna);
  }

  /**
   * Continuous signal processing for Like, Dislike, Save, Download, Publish, Discard, Not Related
   */
  public static recordLearningSignal(module: ProductModule, action: UserSignalAction, styleVibe: string, metadata?: Record<string, any>): void {
    const mem = this.getUnifiedMemory();
    const weight = SIGNAL_WEIGHTS[action] || 0;

    // Update style score
    const currentScore = mem.learnedStylePreferences[styleVibe] || 20;
    mem.learnedStylePreferences[styleVibe] = Math.max(0, currentScore + weight);

    // Record interaction in product memory
    const pMem = mem.productMemories[module] || {
      module,
      totalInteractions: 0,
      savedItemsCount: 0,
      lastActiveTimestamp: new Date().toISOString(),
      topCategories: [],
      favoriteStyles: [],
      recentActivity: []
    };

    pMem.totalInteractions += 1;
    if (action === 'SAVE' || action === 'PUBLISH') {
      pMem.savedItemsCount += 1;
    }
    pMem.lastActiveTimestamp = new Date().toISOString();
    pMem.recentActivity.unshift({
      action,
      targetTitle: `${styleVibe} (${action})`,
      timestamp: new Date().toISOString()
    });
    pMem.recentActivity = pMem.recentActivity.slice(0, 10);

    mem.productMemories[module] = pMem;
    mem.lastUnifiedSyncTimestamp = new Date().toISOString();

    // Recalculate Zero Search Precision Score
    const positiveCount = Object.values(mem.learnedStylePreferences).reduce((a, b) => a + b, 0);
    mem.zeroSearchPrecisionScore = Math.min(99, Math.round(85 + (positiveCount / 20)));

    this.saveUnifiedMemory(mem);

    // Process permanent Style DNA Intelligence update
    this.processStyleDNASignal(module, action, styleVibe, metadata);
  }

  /**
   * Helper method to expose Style DNA Summary to HomeHub
   */
  public static getStyleDNASummaryForHomeHub() {
    const dna = this.getStyleDNAModel();
    return {
      identity: dna.identity,
      topStyles: dna.preferences.preferredFashionStyles.slice(0, 6),
      topColors: dna.preferences.preferredColors.slice(0, 6),
      topFabrics: dna.preferences.favoriteFabrics.slice(0, 6),
      topSilhouettes: dna.preferences.favoriteSilhouettes.slice(0, 6),
      topPromptPatterns: dna.preferences.favoritePromptPatterns.slice(0, 4),
      recentEvolutions: dna.evolutionTimeline.slice(0, 5)
    };
  }

  /**
   * Update User's Style Identity & DNA Preferences collected from Style Identity & DNA Collector
   */
  public static updateUserStyleDNA(updatedIdentity: Partial<PersonalFashionIdentity>, newStyles?: string[], newColors?: string[], newSilhouettes?: string[]): StyleDNAIntelligenceModel {
    const dna = this.getStyleDNAModel();
    const now = new Date().toISOString();

    dna.identity = {
      ...dna.identity,
      ...updatedIdentity,
      lastEvolvedTimestamp: now
    };

    if (newStyles && newStyles.length > 0) {
      dna.preferences.preferredFashionStyles = newStyles.map((val, idx) => ({
        id: `p-style-user-${idx}`,
        value: val,
        category: 'style',
        confidenceScore: 95,
        learningCount: 20,
        lastUpdated: now,
        trendDirection: 'rising',
        stabilityLevel: 'core_identity'
      }));
    }

    if (newColors && newColors.length > 0) {
      dna.preferences.preferredColors = newColors.map((val, idx) => ({
        id: `p-col-user-${idx}`,
        value: val,
        category: 'color',
        confidenceScore: 92,
        learningCount: 18,
        lastUpdated: now,
        trendDirection: 'rising',
        stabilityLevel: 'core_identity'
      }));
    }

    if (newSilhouettes && newSilhouettes.length > 0) {
      dna.preferences.favoriteSilhouettes = newSilhouettes.map((val, idx) => ({
        id: `p-sil-user-${idx}`,
        value: val,
        category: 'silhouette',
        confidenceScore: 90,
        learningCount: 15,
        lastUpdated: now,
        trendDirection: 'rising',
        stabilityLevel: 'core_identity'
      }));
    }

    // Add evolution log
    dna.evolutionTimeline.unshift({
      id: `evo-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceModule: 'HOME_HUB',
      signalAction: 'SAVE',
      summary: `User updated Style Identity & DNA preferences: Archetype set to "${dna.identity.styleArchetype}".`,
      impactScore: 25
    });

    this.saveStyleDNAModel(dna);
    return dna;
  }

  // ==========================================
  // 5. RECENT LIKES, DOWNLOADS & COLLECTIONS
  // ==========================================

  public static getRecentLikes(): HomeHubLikedItem[] {
    if (typeof localStorage === 'undefined') return this.getDefaultLikes();
    const raw = localStorage.getItem(LIKES_STORAGE_KEY);
    if (!raw) return this.getDefaultLikes();
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultLikes();
    }
  }

  public static addLikeItem(item: Omit<HomeHubLikedItem, 'id' | 'likedAt'>): HomeHubLikedItem[] {
    const likes = this.getRecentLikes();
    const newLike: HomeHubLikedItem = {
      ...item,
      id: `like-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      likedAt: new Date().toISOString()
    };
    likes.unshift(newLike);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
    }
    this.recordLearningSignal(item.originModule, 'LIKE', item.styleVibe);
    return likes;
  }

  public static removeLikeItem(id: string): HomeHubLikedItem[] {
    const likes = this.getRecentLikes().filter(l => l.id !== id);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
    }
    return likes;
  }

  private static getDefaultLikes(): HomeHubLikedItem[] {
    return [
      {
        id: 'like-1',
        title: 'Architectural Liquid Gold Trench',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
        originModule: 'AI_CREATIONS',
        likedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        styleVibe: 'Avant-Garde'
      },
      {
        id: 'like-2',
        title: 'Nordic Cashmere Coat Lookbook',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800',
        originModule: 'OUTFITS',
        likedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        styleVibe: 'Quiet Luxury'
      }
    ];
  }

  public static getRecentDownloads(): HomeHubDownloadedItem[] {
    if (typeof localStorage === 'undefined') return this.getDefaultDownloads();
    const raw = localStorage.getItem(DOWNLOADS_STORAGE_KEY);
    if (!raw) return this.getDefaultDownloads();
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultDownloads();
    }
  }

  public static addDownloadItem(item: Omit<HomeHubDownloadedItem, 'id' | 'downloadedAt'>): HomeHubDownloadedItem[] {
    const downloads = this.getRecentDownloads();
    const newDownload: HomeHubDownloadedItem = {
      ...item,
      id: `download-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      downloadedAt: new Date().toISOString()
    };
    downloads.unshift(newDownload);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(downloads));
    }
    this.recordLearningSignal(item.originModule, 'DOWNLOAD', 'Download');
    return downloads;
  }

  private static getDefaultDownloads(): HomeHubDownloadedItem[] {
    return [
      {
        id: 'dl-1',
        title: 'Liquid Silk Runway Asset',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
        originModule: 'AI_CREATIONS',
        downloadedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        fileFormat: 'PNG (Ultra 4K)',
        resolution: '3840x2160'
      }
    ];
  }

  public static getPersonalCollections(): HomeHubCollection[] {
    if (typeof localStorage === 'undefined') return this.getDefaultCollections();
    const raw = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    if (!raw) return this.getDefaultCollections();
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultCollections();
    }
  }

  public static createPersonalCollection(name: string, description: string, tags: string[] = []): HomeHubCollection[] {
    const collections = this.getPersonalCollections();
    const newCol: HomeHubCollection = {
      id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      description,
      itemCount: 0,
      createdAt: new Date().toISOString(),
      tags,
      coverImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800'
    };
    collections.unshift(newCol);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
    }
    return collections;
  }

  private static getDefaultCollections(): HomeHubCollection[] {
    return [
      {
        id: 'col-1',
        name: 'Paris Fashion Week 2026',
        description: 'Avant-garde runway concepts and liquid silk drapery lookbooks.',
        coverImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
        itemCount: 8,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        tags: ['runway', 'paris', 'avant-garde']
      },
      {
        id: 'col-2',
        name: 'Nordic Minimalist Workwear',
        description: 'Quiet luxury tailored suits, cashmere knits, and neutral palettes.',
        coverImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800',
        itemCount: 5,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        tags: ['minimalist', 'tailored', 'cashmere']
      }
    ];
  }

  // ==========================================
  // 6. AI CREATION ACTIVE SESSION & LIFECYCLE
  // ==========================================

  public static getAICreationActiveSession(): AICreationActiveSession | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(AI_CREATION_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static saveAICreationActiveSession(session: Omit<AICreationActiveSession, 'lastUpdatedTimestamp'>): void {
    try {
      // Sanitize pendingResult if it contains large data URLs to avoid blowing local storage quota
      let sanitizedResult = session.pendingResult;
      if (sanitizedResult && typeof sanitizedResult === 'object') {
        sanitizedResult = {
          id: sanitizedResult.id,
          title: sanitizedResult.title,
          category: sanitizedResult.category,
          style: sanitizedResult.style,
          // Only keep image URL if it is not an enormous base64 data string
          imageUrl: (typeof sanitizedResult.imageUrl === 'string' && sanitizedResult.imageUrl.length > 5000)
            ? '' 
            : sanitizedResult.imageUrl
        };
      }

      const fullSession: AICreationActiveSession = {
        ...session,
        pendingResult: sanitizedResult,
        lastUpdatedTimestamp: new Date().toISOString()
      };
      safeLocalStorageSetItem(AI_CREATION_SESSION_KEY, JSON.stringify(fullSession));
    } catch (e) {
      console.warn('[AIStyleHubStorage] Failed to serialize AI creation session safely:', e);
    }
  }

  public static clearAICreationActiveSession(): void {
    safeLocalStorageRemoveItem(AI_CREATION_SESSION_KEY);
  }

  /**
   * Helper to record a newly generated asset from AI Creations into Unified HomeHub Memory & Private Assets
   */
  public static recordAICreationGenerated(creation: {
    id: string;
    title: string;
    imageUrl: string;
    prompt: string;
    style: string;
    category?: string;
    qualityScore?: number;
    tags?: string[];
  }): UniversalPublishableAsset {
    // 1. Record GENERATE signal
    this.recordLearningSignal('AI_CREATIONS', 'LIKE', creation.style || 'Avant-Garde');

    // 2. Queue into Publishing Gateway as PRIVATE BY DEFAULT
    const newAsset = this.queueAssetForPublishing({
      id: creation.id,
      title: creation.title,
      description: creation.prompt,
      imageUrl: creation.imageUrl,
      originModule: 'AI_CREATIONS',
      createdAt: new Date().toISOString(),
      tags: creation.tags || ['ai-creations', (creation.style || 'avant-garde').toLowerCase()],
      category: creation.category || 'AI Fashion',
      styleVibe: creation.style || 'Avant-Garde',
      qualityScore: creation.qualityScore || 95
    });

    // 3. Update unified memory total assets count
    const mem = this.getUnifiedMemory();
    mem.totalAssetsCount += 1;
    this.saveUnifiedMemory(mem);

    return newAsset;
  }

  // ==========================================
  // 7. OUTFIT ACTIVE SESSION & LIFECYCLE
  // ==========================================

  public static getOutfitActiveSession(): OutfitActiveSession | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(OUTFIT_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static saveOutfitActiveSession(session: Omit<OutfitActiveSession, 'lastUpdatedTimestamp'>): void {
    try {
      let sanitizedAssets = session.pendingOutfitAssets;
      if (Array.isArray(sanitizedAssets)) {
        sanitizedAssets = sanitizedAssets.slice(0, 4).map(a => ({
          id: a?.id,
          title: a?.title,
          imageUrl: (typeof a?.imageUrl === 'string' && a.imageUrl.length > 5000) ? '' : a?.imageUrl
        }));
      }

      const fullSession: OutfitActiveSession = {
        ...session,
        pendingOutfitAssets: sanitizedAssets,
        lastUpdatedTimestamp: new Date().toISOString()
      };
      safeLocalStorageSetItem(OUTFIT_SESSION_KEY, JSON.stringify(fullSession));
    } catch (e) {
      console.warn('[AIStyleHubStorage] Failed to serialize outfit session safely:', e);
    }
  }

  public static clearOutfitActiveSession(): void {
    safeLocalStorageRemoveItem(OUTFIT_SESSION_KEY);
  }

  /**
   * Helper to record a newly generated outfit from Outfits Module into Unified HomeHub Memory & Private Assets
   */
  public static recordOutfitGenerated(outfit: {
    id: string;
    title: string;
    imageUrl: string;
    prompt?: string;
    styleVibe?: string;
    category?: string;
    items?: any[];
    qualityScore?: number;
    tags?: string[];
  }): UniversalPublishableAsset {
    // 1. Record GENERATE signal
    this.recordLearningSignal('OUTFITS', 'LIKE', outfit.styleVibe || 'Curated Ensemble');

    // 2. Queue into Publishing Gateway as PRIVATE BY DEFAULT
    const newAsset = this.queueAssetForPublishing({
      id: outfit.id,
      title: outfit.title,
      description: outfit.prompt || 'Curated high-fashion outfit ensemble generated via Outfits engine.',
      imageUrl: outfit.imageUrl,
      originModule: 'OUTFITS',
      createdAt: new Date().toISOString(),
      tags: outfit.tags || ['outfit', (outfit.styleVibe || 'ensemble').toLowerCase()],
      category: outfit.category || 'Outfit Look',
      styleVibe: outfit.styleVibe || 'Curated Ensemble',
      qualityScore: outfit.qualityScore || 95
    });

    // 3. Update unified memory total assets count & outfit history
    const mem = this.getUnifiedMemory();
    mem.totalAssetsCount += 1;
    this.saveUnifiedMemory(mem);

    return newAsset;
  }

  // ==========================================
  // 8. HOMEHUB STORIES & POSTS ENGINE
  // ==========================================

  public static getHomeHubStories(): HomeHubStory[] {
    if (typeof localStorage === 'undefined') return this.getDefaultStories();
    const raw = localStorage.getItem(HOMEHUB_STORIES_KEY);
    if (!raw) return this.getDefaultStories();
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultStories();
    }
  }

  public static saveHomeHubStories(stories: HomeHubStory[]): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(HOMEHUB_STORIES_KEY, JSON.stringify(stories));
  }

  public static createHomeHubStory(story: { authorName: string; authorAvatar?: string; imageUrl: string; mediaType?: 'image' | 'video'; caption?: string }): HomeHubStory {
    const stories = this.getHomeHubStories();
    const newStory: HomeHubStory = {
      id: `story-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorName: story.authorName || 'Personal Stylist',
      authorAvatar: story.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      imageUrl: story.imageUrl,
      mediaType: story.mediaType || (story.imageUrl.endsWith('.mp4') || story.imageUrl.includes('video') ? 'video' : 'image'),
      caption: story.caption || '',
      createdAt: new Date().toISOString(),
      isViewed: false
    };
    stories.unshift(newStory);
    this.saveHomeHubStories(stories);
    return newStory;
  }

  private static getDefaultStories(): HomeHubStory[] {
    return [
      {
        id: 'story-demo-1',
        authorName: 'My Fashion World',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
        caption: 'Milan Runway Insights & Monochromatic Silhouettes ✦',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'story-demo-2',
        authorName: 'Haute Atelier',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800',
        caption: 'Architectural Silk Draping & Tailored Velvet',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ];
  }

  public static getHomeHubPosts(): HomeHubPost[] {
    if (typeof localStorage === 'undefined') return this.getDefaultPosts();
    const raw = localStorage.getItem(HOMEHUB_POSTS_KEY);
    if (!raw) return this.getDefaultPosts();
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultPosts();
    }
  }

  public static saveHomeHubPosts(posts: HomeHubPost[]): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(HOMEHUB_POSTS_KEY, JSON.stringify(posts));
  }

  public static createHomeHubPost(post: {
    authorName: string;
    authorAvatar?: string;
    imageUrl: string;
    mediaType?: 'image' | 'video';
    title: string;
    caption: string;
    tags?: string[];
    isImportedFromPublicMemory?: boolean;
    importedSourceModule?: string;
  }): HomeHubPost {
    const posts = this.getHomeHubPosts();
    const newPost: HomeHubPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorName: post.authorName || 'Personal Stylist',
      authorAvatar: post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      imageUrl: post.imageUrl,
      mediaType: post.mediaType || (post.imageUrl.endsWith('.mp4') || post.imageUrl.includes('video') ? 'video' : 'image'),
      title: post.title || 'Personal Fashion World Post',
      caption: post.caption || '',
      tags: post.tags || ['fashion', 'homehub', 'identity'],
      createdAt: new Date().toISOString(),
      likesCount: 1,
      commentsCount: 0,
      isLiked: true,
      isSaved: true,
      isImportedFromPublicMemory: post.isImportedFromPublicMemory || false,
      importedSourceModule: post.importedSourceModule || ''
    };
    posts.unshift(newPost);
    this.saveHomeHubPosts(posts);
    return newPost;
  }

  /**
   * "Upload For Give Your Name" Concept:
   * Pick an anonymous asset from Public Memory (Community/AI Creations/Outfit Planner),
   * give it user's title & caption, import it to HomeHub Post, and remove it from Public Memory.
   */
  public static importPublicMemoryAssetToHomeHub(
    draftId: string,
    givenTitle: string,
    givenCaption: string,
    userName: string
  ): HomeHubPost | null {
    const drafts = this.getAnonymousDrafts();
    const idx = drafts.findIndex(d => d.id === draftId);
    if (idx === -1) return null;

    const draft = drafts[idx];
    
    // Create new post in HomeHub owned by user
    const newPost = this.createHomeHubPost({
      authorName: userName || 'Personal Stylist',
      imageUrl: draft.imageUrl,
      title: givenTitle || draft.titleSuggestion || 'My Personalized Fashion Statement',
      caption: givenCaption || 'Imported into my HomeHub Personal World.',
      tags: draft.tags || ['imported', 'homehub'],
      isImportedFromPublicMemory: true,
      importedSourceModule: draft.originModule
    });

    // Remove from Public Memory (Drafts)
    drafts.splice(idx, 1);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    }

    // Update unified memory
    const mem = this.getUnifiedMemory();
    mem.anonymousDraftsCount = drafts.length;
    this.saveUnifiedMemory(mem);

    return newPost;
  }

  private static getDefaultPosts(): HomeHubPost[] {
    return [
      {
        id: 'post-demo-1',
        authorName: 'My Fashion World',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
        title: 'Minimalist Charcoal Tailored Ensemble',
        caption: 'Refining my personal aesthetic with structured shoulders, deep charcoal wools, and emerald accents.',
        tags: ['minimalist', 'charcoal', 'tailoring'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        likesCount: 24,
        commentsCount: 3,
        isLiked: true,
        isSaved: true
      },
      {
        id: 'post-demo-2',
        authorName: 'My Fashion World',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800',
        title: 'Streetwear Luxury Fusion',
        caption: 'Combining oversized silhouette layering with luxury leather boots for an effortless weekend vibe.',
        tags: ['streetwear', 'luxury', 'layering'],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        likesCount: 18,
        commentsCount: 2,
        isLiked: false,
        isSaved: true
      }
    ];
  }

  // ==========================================
  // 9. AUTOMATED HOURLY AI MEMORY SYNC ENGINE
  // ==========================================

  public static getLastHourlySyncTimestamp(): number {
    if (typeof localStorage === 'undefined') return 0;
    const raw = localStorage.getItem(LAST_HOURLY_SYNC_KEY);
    return raw ? parseInt(raw, 10) : 0;
  }

  public static setLastHourlySyncTimestamp(ts: number): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(LAST_HOURLY_SYNC_KEY, ts.toString());
  }

  /**
   * Checks if 1 hour (3,600,000 ms) has passed since last AI Memory sync.
   * If yes (or if forceSync is true), automatically generates & uploads fresh AI images
   * into Public Component Memory / AI Memory, notifying the system.
   */
  public static checkAndRunHourlyAIMemorySync(forceSync: boolean = false): boolean {
    const lastTs = this.getLastHourlySyncTimestamp();
    const now = Date.now();
    const ONE_HOUR_MS = 3600000;

    if (!forceSync && lastTs > 0 && (now - lastTs < ONE_HOUR_MS)) {
      return false; // Less than 1 hour elapsed
    }

    // Curated high-fidelity AI generated concepts to upload into AI Memory
    const hourlyPool = [
      {
        title: 'Cyberpunk Neon Sheen Velvet Blazer',
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800',
        originModule: 'AI_CREATIONS' as ProductModule,
        category: 'Cyberpunk Haute',
        styleVibe: 'Futuristic Sheen',
        tags: ['hourly-ai-sync', 'neon', 'cyberpunk', 'ai-memory']
      },
      {
        title: 'Emerald Silk Floor-Length Drape',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800',
        originModule: 'COMMUNITY' as ProductModule,
        category: 'Evening Couture',
        styleVibe: 'Monochromatic Emerald',
        tags: ['hourly-ai-sync', 'emerald', 'couture', 'ai-memory']
      },
      {
        title: 'Nordic Minimalist Oversized Trench',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
        originModule: 'OUTFITS' as ProductModule,
        category: 'Outerwear',
        styleVibe: 'Quiet Luxury',
        tags: ['hourly-ai-sync', 'minimalist', 'trench', 'ai-memory']
      },
      {
        title: 'Bespoke Obsidian Leather Moto Jacket',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800',
        originModule: 'AI_CREATIONS' as ProductModule,
        category: 'Streetwear',
        styleVibe: 'Urban Avant-Garde',
        tags: ['hourly-ai-sync', 'leather', 'obsidian', 'ai-memory']
      },
      {
        title: 'Midnight Velvet Pleated Evening Gown',
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800',
        originModule: 'COMMUNITY' as ProductModule,
        category: 'Haute Couture',
        styleVibe: 'Sartorial Elegance',
        tags: ['hourly-ai-sync', 'velvet', 'midnight', 'ai-memory']
      },
      {
        title: 'Iridescent Holographic Puffer Vest',
        imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800',
        originModule: 'OUTFITS' as ProductModule,
        category: 'Futuristic Techwear',
        styleVibe: 'Neon Glow',
        tags: ['hourly-ai-sync', 'holographic', 'techwear', 'ai-memory']
      }
    ];

    // Randomize order and pick 2 fresh items to upload every hour
    const shuffled = [...hourlyPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);
    selected.forEach(item => {
      this.convertToAnonymousDraft({
        imageUrl: item.imageUrl,
        title: item.title,
        originModule: item.originModule,
        category: item.category,
        styleVibe: item.styleVibe,
        tags: item.tags
      });
    });

    this.setLastHourlySyncTimestamp(now);

    // Notify UI
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lookvision_sync_v17_memory'));
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: '✦ Hourly AI Memory Sync: Fresh AI generated images uploaded to Public Component Memory!'
      }));
    }

    return true;
  }

  /**
   * Starts a background daemon that periodically checks every 60 seconds
   * if 1 hour has elapsed to auto-upload generated AI images to AI Memory.
   */
  public static startHourlySyncDaemon(): () => void {
    if (typeof window === 'undefined') return () => {};
    
    // Check immediately on load
    this.checkAndRunHourlyAIMemorySync(false);

    // Check every 60 seconds
    const interval = setInterval(() => {
      this.checkAndRunHourlyAIMemorySync(false);
    }, 60000);

    return () => clearInterval(interval);
  }

  // ==========================================
  // 10. AI CREATIONS PERSONAL FOLDERS PROTOCOL
  // ==========================================

  public static getAICreationFolders(): AICreationFolder[] {
    if (typeof localStorage === 'undefined') return this.getDefaultAICreationFolders();
    const raw = localStorage.getItem(AICREATION_FOLDERS_KEY);
    if (!raw) return this.getDefaultAICreationFolders();
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultAICreationFolders();
    }
  }

  public static saveAICreationFolders(folders: AICreationFolder[]): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(AICREATION_FOLDERS_KEY, JSON.stringify(folders));
  }

  public static getDefaultAICreationFolders(): AICreationFolder[] {
    return [
      {
        id: 'folder-fashion-apparel',
        name: 'Fashion & Haute Couture',
        description: 'Luxury garments, evening wear, and experimental runway looks',
        categoryTag: 'AI_FASHION_CREATIONS',
        itemIds: [],
        createdAt: new Date().toISOString(),
        isSystemDefault: true
      },
      {
        id: 'folder-character-personas',
        name: 'Characters & Dream Personas',
        description: 'Historical figures, futuristic personas, and digital avatars',
        categoryTag: 'CHARACTER_CREATION',
        itemIds: [],
        createdAt: new Date().toISOString(),
        isSystemDefault: true
      },
      {
        id: 'folder-fantasy-worlds',
        name: 'Fantasy Worlds & Sci-Fi Landscapes',
        description: 'Unreal environments, surreal architecture, and space aesthetics',
        categoryTag: 'FANTASY_WORLD_CREATION',
        itemIds: [],
        createdAt: new Date().toISOString(),
        isSystemDefault: true
      },
      {
        id: 'folder-virtual-assets',
        name: 'Virtual Assets & 3D Props',
        description: '3D assets, textures, and digital collectibles',
        categoryTag: 'VIRTUAL_ASSET_CREATION',
        itemIds: [],
        createdAt: new Date().toISOString(),
        isSystemDefault: true
      },
      {
        id: 'folder-favorites-vault',
        name: 'Personal Favorites & Curated',
        description: 'Your top curated AI creations marked as favorites',
        categoryTag: 'ALL',
        itemIds: [],
        createdAt: new Date().toISOString(),
        isSystemDefault: true
      }
    ];
  }

  public static createAICreationFolder(name: string, description: string = '', categoryTag: string = 'ALL'): AICreationFolder {
    const folders = this.getAICreationFolders();
    const newFolder: AICreationFolder = {
      id: `folder-custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      categoryTag,
      itemIds: [],
      createdAt: new Date().toISOString(),
      isSystemDefault: false
    };
    folders.push(newFolder);
    this.saveAICreationFolders(folders);
    return newFolder;
  }

  public static addItemToAICreationFolder(folderId: string, assetId: string): boolean {
    const folders = this.getAICreationFolders();
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return false;
    if (!folder.itemIds.includes(assetId)) {
      folder.itemIds.push(assetId);
      this.saveAICreationFolders(folders);
    }
    return true;
  }

  public static removeItemFromAICreationFolder(folderId: string, assetId: string): boolean {
    const folders = this.getAICreationFolders();
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return false;
    folder.itemIds = folder.itemIds.filter(id => id !== assetId);
    this.saveAICreationFolders(folders);
    return true;
  }

  // ==========================================
  // 10. HOMEHUB FRIENDS, PAGES & GROUPS SEARCH ENGINE
  // ==========================================

  public static getSocialEntities(): HomeHubSocialEntity[] {
    if (typeof localStorage === 'undefined') return this.getDefaultSocialEntities();
    const raw = localStorage.getItem(SOCIAL_ENTITIES_KEY);
    if (!raw) return this.getDefaultSocialEntities();
    try {
      return JSON.parse(raw);
    } catch {
      return this.getDefaultSocialEntities();
    }
  }

  public static saveSocialEntities(entities: HomeHubSocialEntity[]): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(SOCIAL_ENTITIES_KEY, JSON.stringify(entities));
  }

  public static sendFriendRequest(entityId: string): HomeHubSocialEntity[] {
    const entities = this.getSocialEntities();
    const updated = entities.map(e => {
      if (e.id === entityId) {
        return { ...e, friendRequestStatus: 'PENDING_SENT' as const };
      }
      return e;
    });
    this.saveSocialEntities(updated);
    return updated;
  }

  public static acceptFriendRequest(entityId: string): HomeHubSocialEntity[] {
    const entities = this.getSocialEntities();
    const updated = entities.map(e => {
      if (e.id === entityId) {
        return { ...e, friendRequestStatus: 'ACCEPTED' as const };
      }
      return e;
    });
    this.saveSocialEntities(updated);
    return updated;
  }

  public static declineFriendRequest(entityId: string): HomeHubSocialEntity[] {
    const entities = this.getSocialEntities();
    const updated = entities.map(e => {
      if (e.id === entityId) {
        return { ...e, friendRequestStatus: 'NONE' as const };
      }
      return e;
    });
    this.saveSocialEntities(updated);
    return updated;
  }

  public static toggleJoinOrFollow(entityId: string): HomeHubSocialEntity[] {
    const entities = this.getSocialEntities();
    const updated = entities.map(e => {
      if (e.id === entityId) {
        return { ...e, isJoinedOrFollowing: !e.isJoinedOrFollowing };
      }
      return e;
    });
    this.saveSocialEntities(updated);
    return updated;
  }

  public static getDefaultSocialEntities(): HomeHubSocialEntity[] {
    return [
      {
        id: 'usr-elena',
        name: 'Elena Vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
        bio: 'Haute Couture Stylist & Architectural Silhouettes Enthusiast',
        category: 'USERS',
        subTag: 'Fashion Designer',
        membersOrFollowers: '12.4k Followers',
        friendRequestStatus: 'PENDING_RECEIVED'
      },
      {
        id: 'usr-soren',
        name: 'Soren Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
        bio: 'Avant-Garde Tailoring & Digital Fashion Explorer',
        category: 'USERS',
        subTag: 'Creative Director',
        membersOrFollowers: '8.9k Followers',
        friendRequestStatus: 'NONE'
      },
      {
        id: 'usr-aria',
        name: 'Aria Sterling',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200',
        bio: 'Monochrome Minimalism & Sustainable Textile Innovation',
        category: 'USERS',
        subTag: 'Fashion Journalist',
        membersOrFollowers: '15.2k Followers',
        friendRequestStatus: 'ACCEPTED'
      },
      {
        id: 'page-[#milan-fashion-week]',
        name: 'Milan Fashion Week Official Page',
        avatar: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300',
        bio: 'Official runway live updates, street style snapshots, and designer interviews.',
        category: 'PAGES',
        subTag: 'Global Runway Hub',
        membersOrFollowers: '450k Followers',
        isJoinedOrFollowing: true
      },
      {
        id: 'page-[vogue-atelier]',
        name: 'Atelier Vogue Lookbook',
        avatar: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=300',
        bio: 'High-definition editorial photography and haute couture collection breakdowns.',
        category: 'PAGES',
        subTag: 'Editorial & Lookbook',
        membersOrFollowers: '280k Followers',
        isJoinedOrFollowing: false
      },
      {
        id: 'grp-[quiet-luxury-collective]',
        name: 'Quiet Luxury & Minimalist Tailoring Group',
        avatar: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=300',
        bio: 'A private group for minimalist fashion enthusiasts sharing capsule wardrobe ideas and fabric reviews.',
        category: 'GROUPS',
        subTag: 'Private Fashion Group',
        membersOrFollowers: '18.5k Members',
        isJoinedOrFollowing: true
      },
      {
        id: 'grp-[virtual-tryon-lab]',
        name: 'AI Virtual Try-On Creators Club',
        avatar: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=300',
        bio: 'Community of AI stylists sharing Virtual Try-On renders and prompt techniques.',
        category: 'GROUPS',
        subTag: 'AI Tech & Style Group',
        membersOrFollowers: '9.3k Members',
        isJoinedOrFollowing: false
      }
    ];
  }
}
