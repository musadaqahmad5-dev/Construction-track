import { ClothingCategory } from '../types';

// Home Generation Requests
export interface HomeGenerateRequest {
  userId: string;
  userPhotoUrl?: string; // Mode A if provided, otherwise Mode B
  gender: 'male' | 'female' | 'unisex';
  vibe: string;
  season: string;
  customDetails?: string;
}

export interface HomeGenerateResult {
  imageUrl: string;
  mode: 'PERSONAL_FASHION_TRYON' | 'AI_MODEL_INSPIRATION';
  isPrivate: boolean;
  modelFaceUsed: string;
  avatarShape: string;
  promptFingerprint: string;
}

// AI Creations / Creative Studio Requests
export interface AICreationRequest {
  creatorId: string;
  meshPreset: string;
  vibePreset: string;
  renderEngine: string;
  drapePhysics: string;
  customDetails?: string;
}

export interface AICreationResult {
  creationId: string;
  imageUrl: string;
  title: string;
  prompt: string;
  provider: string;
  isPrivateOnly: boolean; // Never published automatically
  approvalRequiredToExport: boolean;
}

// Marketplace / Commerce Requests
export interface MarketplaceProductItem {
  id: string;
  title: string;
  category: string;
  price: number;
  seller: string;
  brand: string;
  imageUrl: string;
}

export interface MarketplacePurchaseRequest {
  productId: string;
  buyerId: string;
  quantity: number;
  paymentMethod: string;
}

// Community / Social Feed Requests
export interface CommunityPost {
  postId: string;
  userId: string;
  imageUrl: string;
  description: string;
  sharedAt: string;
  approved: boolean;
}

// Profile / Personal Identity Requests
export interface ProfileRequest {
  userId: string;
  preferredCategories?: ClothingCategory[];
  favoriteColors?: string[];
  styleVibe?: 'minimalist' | 'classic' | 'streetwear' | 'vintage' | 'bold';
}
