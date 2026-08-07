/**
 * ARIA Production User Experience Layer Types
 * Product: LOOK VISION v2.4.0-telemetry
 * Architecture: ARIA Production UX Engine v3.2
 */

export interface ColorProfile {
  primaryColor: string;
  secondaryColors: string[];
  colorHarmonyFamily: string;
  warmthScore: number; // 0 - 100
}

export interface MaterialProfile {
  fabricType: string;
  drapeWeight: 'Light' | 'Medium' | 'Heavy' | 'Structured';
  seasonality: string[];
  textureNotes?: string;
}

export interface UsageHistory {
  timesWorn: number;
  lastWornDate?: string;
  versatilityRating: number; // 0 - 100
  userRating: number; // 1 - 5
}

export interface OutfitRelationship {
  id: string;
  title: string;
  itemIds: string[];
  occasion: string;
  season: string;
  harmonyScore: number; // 0 - 100
  notes?: string;
}

export interface WardrobeItemMetadata {
  id: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Accessories' | 'Full Body';
  subCategory?: string;
  imageUrl?: string;
  colorProfile: ColorProfile;
  materialProfile: MaterialProfile;
  usageHistory: UsageHistory;
  synergyScore: number; // 0 - 100
  tags: string[];
  addedAt: string;
}

export interface UserWardrobeProfile {
  totalItems: number;
  items: WardrobeItemMetadata[];
  colorDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  favoriteOutfits: OutfitRelationship[];
  synergyScoreAvg: number;
}

export interface UserStyleIdentity {
  styleDNAVector: number[];
  primaryArchetype: string;
  secondaryArchetypes: string[];
  aestheticTraits: { name: string; score: number }[];
  formalityIndex: number; // 0 - 100
  vibePolarity: string;
}

export interface UserPreferenceModel {
  preferredSilhouettes: string[];
  avoidedSilhouettes: string[];
  favoriteColors: string[];
  dislikedColors: string[];
  fashionGoals: string[];
  lifestyleContext: string;
  budgetTier: string;
}

export interface SubscriptionState {
  plan: 'FREE_PREVIEW' | 'PRO_STYLIST' | 'ENTERPRISE_STUDIO';
  status: 'ACTIVE' | 'TRIAL' | 'EXPIRED';
  renewsAt?: string;
  features: string[];
}

export interface StyleEvolutionMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  archetypeShift?: string;
  confidenceScore: number;
}

export interface UserFashionProfile {
  userId: string;
  displayName: string;
  email?: string;
  subscription: SubscriptionState;
  identity: UserStyleIdentity;
  preferences: UserPreferenceModel;
  wardrobe: UserWardrobeProfile;
  evolutionMilestones: StyleEvolutionMilestone[];
  evolutionStage: string;
  lastActive: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingPreferences {
  displayName: string;
  primaryArchetype: string;
  preferredSilhouettes: string[];
  favoriteColors: string[];
  dislikedColors: string[];
  fashionGoals: string[];
  lifestyleContext: string;
  budgetTier: string;
}

export interface ImageUploadAnalysisResult {
  previewUrl: string;
  detectedGarment: Partial<WardrobeItemMetadata>;
  confidence: number;
  colorProfile: ColorProfile;
  materialProfile: MaterialProfile;
  reasoningNotes: string[];
  suggestedTags: string[];
}
