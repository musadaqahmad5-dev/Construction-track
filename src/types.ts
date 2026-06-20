export type ClothingCategory = 'Casual' | 'Formal' | 'Sportswear' | 'Outerwear' | 'Accessories';

export interface WardrobeItem {
  id: string;
  title: string;                                 // Name of the garment (e.g. "Wool Blazer")
  category: ClothingCategory;                     // Closet classification
  description: string;                           // Detailed description, fabric, fit, etc.
  status: 'In Closet' | 'Planned' | 'Worn/Wash';  // Item's lifecycle state (available, ready, or needs laundry)
  strategy?: string;                             // AI styling suggestions / outfit advice
  userId: string;
  createdAt: any;                                // Firestore Timestamp Reference
  imageUrl?: string;                             // Photograph representation
  season?: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All-Season';
  primaryColor?: string;                         // Hex color or name
  secondaryColor?: string;                       // Coordinating shade
  wearCount?: number;                            // Frequency counter
  lastUsed?: string;                             // Date string representation YYYY-MM-DD
  formality?: 'Formal' | 'Semi-formal' | 'Casual' | 'Sportswear'; // Matching TS usage in orchestrator
  size?: string;                                 // Matching TS usage in fit estimator
  name?: string;                                 // Matching TS usage in tryon and overlays
  careNote?: string;                             // Human closet care notes (e.g. "Needs ironing")
  location?: string;                             // Where it belongs (e.g. "Top shelf")
  privateNote?: string;                          // One optional private line
  placedElsewhere?: boolean;                      // Placed elsewhere (put away flag)
  lastWornMoment?: string;                       // Moment of day last worn
  worksWith?: string;                            // Optional coordinate text (e.g. "white shoes")
}

export interface OutfitSuggestion {
  id: string;
  itemId: string;
  styleAdvice: string;
  coordinates: string[];                         // Coordinating clothing suggestions
  occasion: string;                              // Event suitability (e.g. "Workplace Dinner")
  confidenceScore: number;
  generatedAt: Date;
}

export interface StyleProfile {
  userId: string;
  preferredCategories: ClothingCategory[];
  favoriteColors: string[];
  styleVibe: 'minimalist' | 'classic' | 'streetwear' | 'vintage' | 'bold';
  updatedAt: Date;
}

export interface DailyRecommendation {
  id: string;
  userId: string;
  date: string;                                  // YYYY-MM-DD
  temperatureRange: string;
  weatherCondition: string;
  suggestedItems: string[];                       // IDs of WardrobeItems proposed
  styleNotes: string;
}

export interface Seller {
  id: string; // Seller/Shop identifier (typically matching userId of creator)
  name: string;
  location: string;
  category: string; // specialty e.g. "Minimalist Tweed", "Streetwear", "Accessories"
  ownerId: string;
  createdAt: any;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  shopId: string; // ownerId / sellerId
  shopName: string;
  title: string;
  description: string;
  price: number;
  category: 'Casual' | 'Formal' | 'Sportswear' | 'Outerwear' | 'Accessories';
  availability: 'In Stock' | 'Limited' | 'Out of Stock';
  imageUrl: string;
  vibeTags?: string[];
  createdAt: any;
  ownerId: string;
}

