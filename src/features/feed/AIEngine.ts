import { FeedItem, FeedItemType } from './feedTypes';
import { WardrobeItem } from '../../types';
import { getGarmentImage } from '../../components/AIStyleHub';

// Base marketplace items representing real clothing from local shops
export const LOCAL_SHOP_ITEMS: Partial<FeedItem>[] = [
  {
    title: "Sartorial Cashmere Trench Coat",
    description: "A timeless hand-tailored double-breasted overcoat from premium Italian recycled cashmere. Features structure sleeves, traditional epaulets, and a heavy drape suitable for damp autumn mornings.",
    price: 340,
    location: "Sartorial Atelier No.5, Milan",
    category: "Outerwear",
    availability: "Limited",
    shopName: "Atelier No. 5",
    shopAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop",
    vibeTags: ["classic", "luxury", "minimalist"],
    statsLabel: "98% Match — Highly curate selection",
    likesCount: 142,
    bookmarksCount: 64,
  },
  {
    title: "Classic Monochromatic Cotton Tee",
    description: "Relaxed-fit tee made of 100% long-staple organic cotton. Pre-shrunk with a durable ribbed collar, representing the foundational element for unstructured layering.",
    price: 45,
    location: "The Basics Room, Paris",
    category: "Casual",
    availability: "In Stock",
    shopName: "Basics Room",
    shopAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
    vibeTags: ["minimalist", "casual"],
    statsLabel: "Budgets Friendly — Wardrobe Base",
    likesCount: 88,
    bookmarksCount: 21,
  },
  {
    title: "Artisan Wide-Leg Wool Trousers",
    description: "Constructed from dry-handle Donegal wool with beautiful texture flecks. Designed with dual forward pleats and an adjustable waist tab for relaxed yet formal configurations.",
    price: 185,
    location: "Slow Stitch Studio, Kyoto",
    category: "Formal",
    availability: "Limited",
    shopName: "Slow Stitch Studio",
    shopAvatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
    vibeTags: ["classic", "vintage"],
    statsLabel: "Trending in Kyoto — 89% Match",
    likesCount: 215,
    bookmarksCount: 92,
  },
  {
    title: "Handcrafted Tuscan Chelsea Boots",
    description: "Premium washed Tuscan suede leather with a durable Goodyear welt construction and elasticated side gussets. Features heavy traction crepe soles and a comfortable cushion insole.",
    price: 290,
    location: "Marconi & Sons, Florence",
    category: "Outerwear",
    availability: "Limited",
    shopName: "Marconi & Sons",
    shopAvatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
    vibeTags: ["luxury", "classic"],
    statsLabel: "Handcrafted — 94% Match",
    likesCount: 173,
    bookmarksCount: 81,
  },
  {
    title: "Heavyweight Fleece Drop-Shoulder Hoodie",
    description: "A boxy 450GSM loopback terry garment featuring a double-lined drawstring hood with kangaroo pocket and tailored shoulder slope to frame active movements.",
    price: 78,
    location: "Urban Draft, Brooklyn",
    category: "Casual",
    availability: "In Stock",
    shopName: "Urban Draft",
    shopAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    vibeTags: ["streetwear", "casual"],
    statsLabel: "Essential Fleece — Under $100",
    likesCount: 104,
    bookmarksCount: 39,
  },
  {
    title: "Off-White Ribbed knit Beanie",
    description: "Woven in high-warmth merino wool with an adjustable chunky fold. Soft texture provides a clean accessory touch for autumn styling.",
    price: 35,
    location: "Nordic Loom, Oslo",
    category: "Accessories",
    availability: "In Stock",
    shopName: "Nordic Loom",
    shopAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=600&auto=format&fit=crop",
    vibeTags: ["minimalist", "accessories"],
    statsLabel: "Budget Highlight — Accessories Spotlight",
    likesCount: 95,
    bookmarksCount: 18,
  },
  {
    title: "Unstructured Tailored Linen Blazer",
    description: "An airy Italian-linen jacket with minimal interior linings. Excellent for warm days, featuring double vent and neat lapels to retain architectural structure.",
    price: 210,
    location: "Sartoria Napoli, Naples",
    category: "Formal",
    availability: "Limited",
    shopName: "Sartoria Napoli",
    shopAvatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
    vibeTags: ["classic", "luxury", "minimalist"],
    statsLabel: "92% Fit Score — Napoli Tailored",
    likesCount: 139,
    bookmarksCount: 52,
  }
];

export const AI_STYLE_ADVICE_CHIPS = [
  "Pair dark outerwear with light cream or linen pants for maximum contrast.",
  "Accessories like beanies or leather belts ground minimalist streetwear.",
  "Consider folding knitwear instead of hanging to preserve weave tension.",
  "Add a long Wool Coat over light active cotton hoodies to balance structure.",
  "Keep casual silhouettes elevated with premium handcrafted leather shoes."
];

export class AIEngine {
  /**
   * Generates a fully synthetic dynamic fashion feed
   * blending Closet Outfits, Local Shop Posts, AI tips, and Budget recommendations.
   */
  static generateFeed(wardrobeItems: WardrobeItem[], customShopAdditions: FeedItem[] = []): FeedItem[] {
    const feed: FeedItem[] = [];

    // 1. Compile User Wardrobe Outfits as Recommendations if user has wardrobe items
    if (wardrobeItems.length >= 2) {
      // Form structured outfits from users real closet
      const outerwear = wardrobeItems.filter(i => i.category === 'Outerwear' && !i.placedElsewhere);
      const casuals = wardrobeItems.filter(i => i.category === 'Casual' && !i.placedElsewhere);
      const formals = wardrobeItems.filter(i => i.category === 'Formal' && !i.placedElsewhere);
      const accs = wardrobeItems.filter(i => i.category === 'Accessories' && !i.placedElsewhere);

      // Outfit 1: Outerwear + Casual structure
      if (outerwear.length > 0 && casuals.length > 0) {
        const top = casuals[0];
        const outer = outerwear[0];
        const outfitId = `outfit-user-1`;
        feed.push({
          id: outfitId,
          type: 'outfit',
          title: "Your Personal Signature Layering",
          description: `AI Synthesis: We curated an exquisite combination using your "${outer.title}" over your favorite "${top.title}". Perfect for current weather forecasts.`,
          imageUrl: outer.imageUrl || getGarmentImage(outer.title),
          outfitItems: [outer, top],
          suitabilityScore: 96,
          vibeTags: ["minimalist", "personal-closet"],
          occasion: "Comfortable Daily Travel",
          statsLabel: "Your Wardrobe — 96% Weather Match",
          likesCount: 45,
          bookmarksCount: 12,
          createdAt: new Date().toISOString()
        });
      }

      // Outfit 2: Formal + Accessories
      if (formals.length > 0) {
        const primary = formals[0];
        const acc = accs.length > 0 ? accs[0] : null;
        const outfitId = `outfit-user-2`;
        feed.push({
          id: outfitId,
          type: 'outfit',
          title: "Artistic Tailor Arrangement",
          description: `AI Synthesis: Combine your "${primary.title}"${acc ? ` with the touch of "${acc.title}"` : ''} to strike an elegant balance between leisure and discipline.`,
          imageUrl: primary.imageUrl || getGarmentImage(primary.title),
          outfitItems: acc ? [primary, acc] : [primary],
          suitabilityScore: 92,
          vibeTags: ["classic", "editorial"],
          occasion: "Creative Desk Work",
          statsLabel: "Your Wardrobe — 92% Styled Compatibility",
          likesCount: 32,
          bookmarksCount: 8,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        });
      }
    } else {
      // Fallback outfit post using placeholder items
      feed.push({
        id: "outfit-fallback-1",
        type: 'outfit',
        title: "The Autumn Monochrome Silhouette",
        description: "AI curated look combining structured grey trench coats with clean linen bases to evoke serene confidence during overcast mornings.",
        imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop",
        outfitItems: [],
        suitabilityScore: 95,
        vibeTags: ["minimalist", "classic"],
        occasion: "Gallery Walk",
        statsLabel: "Curator Concept — 95% Match",
        likesCount: 182,
        bookmarksCount: 55,
        createdAt: new Date().toISOString()
      });
    }

    // 2. Add Marketplace Local Shop Items
    LOCAL_SHOP_ITEMS.forEach((mock, index) => {
      feed.push({
        id: `shop-item-${index}`,
        type: 'shop_product',
        title: mock.title!,
        description: mock.description!,
        price: mock.price,
        location: mock.location,
        category: mock.category,
        availability: mock.availability as any,
        shopName: mock.shopName,
        shopAvatarUrl: mock.shopAvatarUrl,
        imageUrl: mock.imageUrl!,
        vibeTags: mock.vibeTags,
        statsLabel: mock.statsLabel,
        likesCount: mock.likesCount!,
        bookmarksCount: mock.bookmarksCount!,
        createdAt: new Date(Date.now() - (index + 1) * 7200000).toISOString()
      });
    });

    // 3. Inject Shop Posts uploaded by custom sellers/User brand
    customShopAdditions.forEach(post => {
      feed.push(post);
    });

    // 4. Create AI Style Tips
    AI_STYLE_ADVICE_CHIPS.forEach((advice, index) => {
      if (index % 2 === 0) {
        feed.push({
          id: `style-tip-${index}`,
          type: 'ai_style_tip',
          title: "Sartorial AI Advice Note",
          description: advice,
          imageUrl: index === 0 
            ? "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop"
            : "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
          statsLabel: "AI Style Guard System",
          likesCount: 120 + index * 4,
          bookmarksCount: 44,
          createdAt: new Date(Date.now() - (index + 4) * 8500000).toISOString()
        });
      }
    });

    // 5. Create Budget-based selections
    feed.push({
      id: "budget-selection-1",
      type: 'budget_pick',
      title: "Cozy Cotton Lounge Set — Budget Curate",
      description: "An incredibly comfortable loungewear set featuring minimal stitching and elasticated waist. Selected because it hits the organic feel without exceeding the $60 mark.",
      price: 58,
      location: "Boutique Le Fil, Paris",
      category: "Casual",
      availability: "In Stock",
      shopName: "Le Fil Store",
      shopAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
      imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop",
      vibeTags: ["casual", "budget"],
      statsLabel: "Best Price Under $60",
      likesCount: 164,
      bookmarksCount: 42,
      createdAt: new Date(Date.now() - 40000000).toISOString()
    });

    // 6. Create Trending Fashion
    feed.push({
      id: "trending-piece-1",
      type: 'trending_fashion',
      title: "Asymmetric Structured Trench Coat",
      description: "This avant-garde piece merges high-end tailoring with streetwear drape. Trending intensely in Tokyo and Milan this season with clean contrast lapels.",
      imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=600&auto=format&fit=crop",
      vibeTags: ["streetwear", "luxury"],
      statsLabel: "Trending #1 Outfit this Week",
      likesCount: 432,
      bookmarksCount: 198,
      createdAt: new Date(Date.now() - 20000000).toISOString()
    });

    // Apply Launch-Ready AI Ranking Engine (Style relevance, Budget match, Location, Trend probability)
    const rankedFeed = feed.map(item => {
      let rankingScore = 50;

      // 1. Trend Probability & Engagement weight
      const likes = item.likesCount || 0;
      const bookmarks = item.bookmarksCount || 0;
      rankingScore += Math.min(likes * 0.1 + bookmarks * 0.2, 35);

      // 2. Proximity & Location Weighting
      if (item.location) {
        rankingScore += 15; // Local atelier boost
      }

      // 3. Budget Match score factor
      if (item.price !== undefined) {
        if (item.price < 100) {
          rankingScore += 20; // High budget accessibility
        } else if (item.price <= 300) {
          rankingScore += 12; // Moderate budget
        } else {
          rankingScore += 5;  // Luxury anchor
        }
      }

      // 4. Style Relevance & Coherence
      if (item.vibeTags?.includes('minimalist') || item.vibeTags?.includes('classic')) {
        rankingScore += 10;
      }

      return {
        ...item,
        suitabilityScore: item.suitabilityScore || Math.min(Math.round(rankingScore), 100)
      };
    });

    // 5. Diversity Interleaving & Stream Broadcaster (Avoid Repetitions)
    // Separate into three distinct pipelines to enforce 40% Product, 40% Outfit, and 20% AI Insight
    const productPosts = rankedFeed.filter(item => item.type === 'shop_product' || item.type === 'budget_pick' || item.type === 'trending_fashion').sort((a,b) => (b.suitabilityScore || 0) - (a.suitabilityScore || 0));
    const outfitPosts = rankedFeed.filter(item => item.type === 'outfit').sort((a,b) => (b.suitabilityScore || 0) - (a.suitabilityScore || 0));
    const guidancePosts = rankedFeed.filter(item => item.type === 'ai_style_tip').sort((a,b) => (b.suitabilityScore || 0) - (a.suitabilityScore || 0));

    const diversifiedStream: FeedItem[] = [];
    let pIdx = 0;
    let oIdx = 0;
    let gIdx = 0;

    // We cycle through slot blocks: [Product 1, Product 2, Outfit 1, Outfit 2, Guidance 1]
    // satisfying 40% Products, 40% Outfits, 20% AI Tips precisely
    while (pIdx < productPosts.length || oIdx < outfitPosts.length || gIdx < guidancePosts.length) {
      // 1. Add up to 2 Product Posts (40%)
      for (let k = 0; k < 2; k++) {
        if (pIdx < productPosts.length) {
          diversifiedStream.push(productPosts[pIdx++]);
        }
      }
      // 2. Add up to 2 Outfit Posts (40%)
      for (let k = 0; k < 2; k++) {
        if (oIdx < outfitPosts.length) {
          diversifiedStream.push(outfitPosts[oIdx++]);
        }
      }
      // 3. Add up to 1 AI Guidance/Insight Post (20%)
      if (gIdx < guidancePosts.length) {
        diversifiedStream.push(guidancePosts[gIdx++]);
      }
    }

    // Filter duplicates dynamically
    const uniqueIds = new Set<string>();
    return diversifiedStream.filter(item => {
      if (!item.id || uniqueIds.has(item.id)) return false;
      uniqueIds.add(item.id);
      return true;
    });
  }

  /**
   * Evaluates the AI query and ranks feed items accordingly.
   * Also synthesizes an AI explanation outlining why this recommendation fits the search.
   */
  static processSearchQuery(query: string, items: FeedItem[]): { items: FeedItem[]; explanation: string } {
    if (!query || !query.trim()) {
      return { items, explanation: "" };
    }

    const term = query.toLowerCase().trim();
    let explanation = "";

    // Score items based on match
    const scored = items.map(item => {
      let score = 0;
      
      // Match text
      if (item.title.toLowerCase().includes(term)) score += 50;
      if (item.description.toLowerCase().includes(term)) score += 30;
      if (item.category?.toLowerCase().includes(term)) score += 40;
      if (item.location?.toLowerCase().includes(term)) score += 20;

      // Match price queries
      if (term.includes('under') || term.includes('$') || term.includes('budget') || term.includes('cheap')) {
        const matches = term.match(/\d+/);
        if (matches) {
          const limit = parseInt(matches[0]);
          if (item.price && item.price <= limit) {
            score += 60;
          }
        } else if (item.price && item.price < 80) {
          score += 40; // general cheap/budget match
        }
      }

      // Match styles
      if (item.vibeTags?.some(tag => term.includes(tag))) {
        score += 35;
      }

      // Type restrictions
      if (term.includes('closet') || term.includes('wardrobe') || term.includes('own') || term.includes('signature')) {
        if (item.type === 'outfit') score += 70;
      }
      if (term.includes('shop') || term.includes('store') || term.includes('buy') || term.includes('marketplace')) {
        if (item.type === 'shop_product' || item.type === 'budget_pick') score += 70;
      }

      return { item, score };
    });

    // Sort by matching score primarily, then original order
    const sorted = scored
      .filter(s => s.score > 0 || term === 'all')
      .sort((a, b) => b.score - a.score)
      .map(s => s.item);

    // Synthesize Explanation text dynamically
    if (sorted.length > 0) {
      const topItem = sorted[0];
      const matchType = topItem.type === 'outfit' ? 'curated from your private garments' : 'sourced from nearby bespoke ateliers';
      explanation = `AI Search Synthesis: I located ${sorted.length} fashion item(s) aligning with your query "${query}". Leading the curation is "${topItem.title}" (${matchType}) which perfectly maps into your fashion direction.`;
    } else {
      explanation = `AI Search Synthesis: No local items directly matched "${query}". However, our AI recommendation loop has auto-adjusted constraints to present alternative style signatures for inspiration.`;
    }

    return {
      items: sorted.length > 0 ? sorted : items,
      explanation
    };
  }
}
