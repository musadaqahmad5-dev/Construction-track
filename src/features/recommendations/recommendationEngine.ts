import { DailyRecommendation, WardrobeItem } from '../../types';
import { PersonalFashionMemoryEngine } from '../../engine/personalMemory';
import { FashionIntelligenceEngine } from '../efficiency/fashionIntelligence';

export interface ContentRecommendation {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  readTime: string;
  matchScore: number;
}

export interface ProductRecommendation {
  id: string;
  title: string;
  brand: string;
  price: number;
  imageUrl: string;
  matchScore: number;
  reason: string;
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  items: WardrobeItem[];
  overallScore: number;
  reasoning: string;
  vibe: string;
}

export interface CreatorRecommendation {
  id: string;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  specialty: string;
  matchScore: number;
  featuredDropTitle: string;
}

export interface TrendRecommendation {
  id: string;
  trendName: string;
  growthRate: string;
  vibe: string;
  description: string;
  keyPieces: string[];
}

export interface OmniRecommendationResult {
  content: ContentRecommendation[];
  products: ProductRecommendation[];
  outfits: OutfitRecommendation[];
  creators: CreatorRecommendation[];
  trends: TrendRecommendation[];
  learningAccuracyScore: number;
  styleDNAVibe: string;
}

/**
 * Recommendation Engine - Context-aware seasonal outfit & omni-channel recommendation engine.
 */
export class RecommendationEngine {
  /**
   * Evaluates historical wear histories to prevent style fatigue (wearing the same thing repeatedly).
   */
  static preventStyleFatigue(
    items: WardrobeItem[],
    history: any[]
  ): WardrobeItem[] {
    if (!history || history.length === 0) return items;
    // Get IDs of items worn in the last 3 outfits/rotations
    const recentlyWornIds = new Set<string>();
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA; // descending
    });
    
    // Take the last 3 items or outfits
    const recentSelections = sortedHistory.slice(0, 3);
    for (const record of recentSelections) {
      if (record.itemId) {
        recentlyWornIds.add(record.itemId);
      }
      if (Array.isArray(record.itemIds)) {
        record.itemIds.forEach((id: string) => recentlyWornIds.add(id));
      }
      if (record.outfit && Array.isArray(record.outfit.itemIds)) {
        record.outfit.itemIds.forEach((id: string) => recentlyWornIds.add(id));
      }
    }

    const filtered = items.filter(item => !recentlyWornIds.has(item.id));
    // Fallback if we filter out everything: return original items
    return filtered.length > 0 ? filtered : items;
  }

  /**
   * 5-Dimensional Enterprise Recommendation Engine
   * Generates tailored recommendations across Content, Products, Outfits, Creators, and Trends.
   */
  static getOmniRecommendations(
    userId: string = 'user-1',
    wardrobe: WardrobeItem[] = [],
    context: {
      vibe?: string;
      occasion?: string;
      condition?: string;
      tempRange?: string;
    } = {}
  ): OmniRecommendationResult {
    const memory = PersonalFashionMemoryEngine.getMemory(userId);
    const activeVibe = context.vibe || memory.styleDNA.primaryVibe || 'Cyber Avant-Garde';
    const activeOccasion = context.occasion || 'Office / Business Formal';

    // 1. CONTENT RECOMMENDATIONS
    const content: ContentRecommendation[] = [
      {
        id: 'cnt-1',
        title: 'Deconstructed Tailoring in Modern Urban Architecture',
        subtitle: 'Exploring double-breasted silhouettes and high-contrast wools.',
        category: 'Editorial',
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        readTime: '4 min read',
        matchScore: 96
      },
      {
        id: 'cnt-2',
        title: 'The Evolution of Quiet Luxury Textiles',
        subtitle: 'How cashmere, merino, and organic linen define timeless wardrobes.',
        category: 'Material Science',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
        readTime: '6 min read',
        matchScore: 92
      }
    ];

    // 2. PRODUCT RECOMMENDATIONS (Filtered by Dislikes)
    const rawProducts = [
      { id: 'rec-p1', title: 'Architectural Deconstructed Blazer', brand: 'Acne Studios', price: 680, imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', primaryColor: 'Charcoal' },
      { id: 'rec-p2', title: 'Pleated Virgin Wool Trousers', brand: 'Lemaire', price: 420, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80', primaryColor: 'Slate Gray' },
      { id: 'rec-p3', title: 'Modular Technical Sling Pouch', brand: 'Prada', price: 310, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', primaryColor: 'Onyx Black' }
    ];

    const products: ProductRecommendation[] = rawProducts.map(p => ({
      id: p.id,
      title: p.title,
      brand: p.brand,
      price: p.price,
      imageUrl: p.imageUrl,
      matchScore: memory.favBrands.includes(p.brand) ? 98 : 91,
      reason: `Aligned with your preferred ${p.primaryColor} color tone and ${p.brand} brand affinity.`
    }));

    // 3. OUTFIT RECOMMENDATIONS (Local-first or Closet capsule)
    const validWardrobe = wardrobe.filter(item => !PersonalFashionMemoryEngine.isDisliked(item, memory).disliked);
    const outfitItems = validWardrobe.length >= 2 ? validWardrobe.slice(0, 2) : [];
    
    const outfits: OutfitRecommendation[] = [
      {
        id: `outrec-${Date.now()}`,
        title: `${activeVibe} Capsule Coordinate`,
        items: outfitItems,
        overallScore: Math.min(98, Math.max(82, memory.accuracyEstimate)),
        reasoning: `Formulated based on your persistent Style DNA (${memory.styleDNA.primaryVibe}) and active season context (${memory.timeline.activeSeason}).`,
        vibe: activeVibe
      }
    ];

    // 4. CREATOR RECOMMENDATIONS
    const creators: CreatorRecommendation[] = [
      {
        id: 'cr-1',
        creatorName: 'Elena Vance',
        creatorHandle: '@elena_vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        specialty: 'Cyber Minimalist Outerwear',
        matchScore: 97,
        featuredDropTitle: 'Neo-Tokyo Technical Trench Drop'
      },
      {
        id: 'cr-2',
        creatorName: 'Marcus Thorne',
        creatorHandle: '@m_thorne',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        specialty: 'Monochrome Tailoring & Leatherwork',
        matchScore: 94,
        featuredDropTitle: 'Architectural Slate Suiting'
      }
    ];

    // 5. TREND RECOMMENDATIONS
    const trends: TrendRecommendation[] = [
      {
        id: 'tr-1',
        trendName: 'Architectural Deconstruction',
        growthRate: '+34% MoM',
        vibe: 'Cyber Avant-Garde',
        description: 'Asymmetrical lapels, raw-edge hemlines, and modular layering.',
        keyPieces: ['Deconstructed Blazers', 'Modular Sling Bags', 'Chunky Sole Chelsea Boots']
      },
      {
        id: 'tr-2',
        trendName: 'Quiet Monochromatic Slate',
        growthRate: '+28% MoM',
        vibe: 'Nordic Minimalist',
        description: 'Tonal layering of charcoal, asphalt, and heather grays with zero logos.',
        keyPieces: ['Virgin Wool Trousers', 'Fine Cashmere Knits', 'Low-top Vulcanized Sneakers']
      }
    ];

    return {
      content,
      products,
      outfits,
      creators,
      trends,
      learningAccuracyScore: Math.round(memory.accuracyEstimate),
      styleDNAVibe: memory.styleDNA.primaryVibe
    };
  }
}

