import { WardrobeItem } from '../../types';

export type FeedItemType = 'outfit' | 'shop_product' | 'ai_style_tip' | 'budget_pick' | 'trending_fashion';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  description: string;
  imageUrl: string;
  category?: string;
  
  // Marketplace details (for shop_product and budget_pick)
  price?: number;
  location?: string;
  availability?: 'In Stock' | 'Limited' | 'Sold Out';
  shopName?: string;
  shopAvatarUrl?: string;
  
  // Expanded Hybrid Seller details
  storeType?: 'LOCAL_BOUTIQUE' | 'ONLINE_STORE' | 'HYBRID_BRAND';
  instagramUrl?: string;
  whatsAppNumber?: string;
  websiteLink?: string;
  shippingMode?: 'pickup' | 'nationwide' | 'international';
  verified?: boolean;
  deliveryEstimate?: string;
  
  // Custom Outfit details
  outfitItems?: WardrobeItem[];
  suitabilityScore?: number; // AI match score (0-100%)
  vibeTags?: string[];
  occasion?: string;
  
  // AI Style Info
  aiAdviceNote?: string;
  statsLabel?: string; // e.g., "Trending in Milan", "98% Match"
  
  // Engagement
  likesCount: number;
  bookmarksCount: number;
  hasLiked?: boolean;
  hasBookmarked?: boolean;
  createdAt: string;
}

export interface AIPromptCuration {
  query: string;
  explanation: string;
  curatedItemIds: string[];
}
