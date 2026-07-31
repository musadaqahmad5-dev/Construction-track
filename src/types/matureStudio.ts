export type MatureFashionMode = 'editorial_couture' | 'avant_garde' | 'body_art_textile' | 'fantasy_conceptual';
export type MediaType = 'image' | 'video';
export type MemoryViewType = 'personal' | 'community';

export interface MatureStudioParameters {
  drapeTension: number;
  lightingAtmosphere: string;
  textureComplexity: string;
  silhouetteStructure: string;
}

export interface MatureGeneratedAsset {
  id: string;
  userId: string;
  creatorName?: string;
  creatorAvatar?: string;
  creatorLevel?: string;
  type: MediaType;
  title: string;
  category: string;
  stylePreset: MatureFashionMode;
  outfitType?: string;
  material?: string;
  colorPalette?: string[];
  artisticTheme?: string;
  prompt: string;
  generatedAsset: string;
  memoryType: MemoryViewType;
  visibility: 'private' | 'public';
  savedToWardrobe: boolean;
  sharedToCommunity: boolean;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  parameters?: MatureStudioParameters;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
}

export interface MatureStudioPromptPayload {
  mode: MatureFashionMode;
  mediaType: MediaType;
  category: string;
  conceptPrompt: string;
  material: string;
  colorPalette: string[];
  artisticTheme: string;
  drapeTension: number;
  lightingAtmosphere: string;
  textureComplexity: string;
  silhouetteStructure: string;
  visibility: 'private' | 'public';
  ageVerified: boolean;
}

export interface AIHelperSuggestion {
  title: string;
  prompt: string;
  material: string;
  category: string;
  artisticTheme: string;
  colorPalette: string[];
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  creatorLevel: 'Master Atelier' | 'Couture Visionary' | 'Haute Stylist' | 'Emerging Designer';
  styleCategory: string;
  expertise: string[];
  reputationScore: number;
  publishedWorks: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  verified: boolean;
  badge: string;
  location?: string;
  joinedDate: string;
  coverBanner?: string;
}

export interface FashionCollection {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorLevel?: string;
  title: string;
  tagline: string;
  description: string;
  type: 'collection' | 'seasonal_drop' | 'fashion_story' | 'editorial_campaign';
  season?: string;
  coverImage: string;
  creationIds: string[];
  creations?: MatureGeneratedAsset[];
  likeCount: number;
  savedCount: number;
  isLiked?: boolean;
  createdAt: string;
  isMarketplaceReady: boolean;
  estimatedValuation?: string;
}

export interface MarketplaceListing {
  id: string;
  collectionId?: string;
  creationId?: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  itemType: 'digital_concept' | 'couture_nft' | 'bespoke_custom_order' | 'physical_runway_piece';
  previewImage: string;
  price: number;
  currency: 'USD' | 'ETH' | 'CREDITS';
  royaltyPercent: number;
  status: 'available' | 'reserved' | 'sold';
  tier: 'Exclusif 1/1' | 'Limited Edition 1/10' | 'Signature Drop';
  customizationOptions: string[];
  createdAt: string;
}

export interface CreatorComment {
  id: string;
  targetId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface BespokeCustomRequestPayload {
  creatorId: string;
  clientName: string;
  clientEmail: string;
  conceptNotes: string;
  budgetRange: string;
  preferredMaterials: string;
  targetDeliveryDate: string;
}
