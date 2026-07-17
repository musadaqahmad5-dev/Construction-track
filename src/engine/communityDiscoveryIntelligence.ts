import { FashionDNAEngine } from './fashionIntelligenceEngine';

// ============================================================================
// 1. DATA STRUCTURES & INTERFACES
// ============================================================================

export interface Creator {
  name: string;
  handle: string;
  avatar: string;
  uid: string;
}

export interface Blueprint {
  gender: string;
  age: string;
  faceShape: string;
  hairStyle: string;
  hairColor: string;
  skinTone: string;
  bodyProportions: string;
  height: string;
  pose: string;
  expression: string;
}

export interface GarmentBlueprint {
  silhouette: string;
  collar: string;
  sleeves: string;
  stitching: string;
  fabric: string;
  material: string;
  folds: string;
  texture: string;
  accessories: string;
  shoes: string;
  jewelry: string;
}

export interface SceneBlueprint {
  location: string;
  lighting: string;
  camera: string;
}

export interface CommunityPost {
  id: string;
  lookId?: string;
  userId?: string;
  author: Creator;
  caption: string;
  imageUrl: string;
  likes: number;
  commentsCount?: number;
  shares: number;
  saves: number;
  views: number;
  trendingScore: number;
  vibeTags: string[];
  taggedGarment?: { title: string; price: number; category: any };
  comments: { author: string; handle: string; avatar: string; text: string; createdAt: string }[];
  aiScore: number;
  aiBreakdown: { color: string; texture: string; seasonal: string };
  avatarBlueprint?: Blueprint;
  garmentBlueprint?: GarmentBlueprint;
  sceneBlueprint?: SceneBlueprint;
  isEditorPick?: boolean;
  isWeeklyHighlight?: boolean;
  collectionName?: string;
  createdAt: string;
}

export type IntelligentCollectionType =
  | 'Luxury'
  | 'Streetwear'
  | 'Editorial'
  | 'Minimal'
  | 'Avant Garde'
  | 'Wedding'
  | 'Formal'
  | 'Winter'
  | 'Summer'
  | 'Autumn'
  | 'Spring'
  | 'Business'
  | 'Sportswear'
  | 'Traditional'
  | 'Cultural'
  | 'Runway'
  | 'Photography'
  | 'Portrait'
  | 'Fashion Campaign'
  | 'Magazine Cover'
  | 'Fashion Week'
  | 'Designer Concepts'
  | 'Experimental';

export type RankingEngineType =
  | 'Trending Today'
  | 'Trending This Week'
  | 'Trending This Month'
  | 'Most Loved'
  | 'Most Viewed'
  | 'Most Saved'
  | 'Most Shared'
  | 'Fastest Growing'
  | 'Hidden Gems'
  | 'Fresh Discoveries'
  | 'Editor\'s Choice';

export interface UserInteractions {
  likedPostIds: string[];
  savedPostIds: string[];
  viewedPostIds: string[];
  preferredTags: Record<string, number>;
  preferredColors: Record<string, number>;
  preferredCollections: Record<string, number>;
}

export interface SimilarityBreakdown {
  fashionSimilarity: number;
  poseSimilarity: number;
  fabricSimilarity: number;
  colorSimilarity: number;
  styleSimilarity: number;
  lightingSimilarity: number;
  compositionSimilarity: number;
  overallScore: number;
}

export interface FashionTrendReport {
  emergingStyles: { tag: string; score: number; trend: 'up' | 'stable' }[];
  popularColors: { color: string; count: number; percentage: number }[];
  popularGarments: { item: string; count: number }[];
  popularPoses: { pose: string; count: number }[];
  popularFabrics: { fabric: string; count: number }[];
  popularLighting: { lighting: string; count: number }[];
  popularBackgrounds: { location: string; count: number }[];
  lastUpdated: string;
}

// ============================================================================
// 2. INTELLIGENT COLLECTIONS ENGINE
// ============================================================================

export class IntelligentCollectionsEngine {
  private static collectionRules: Record<IntelligentCollectionType, string[]> = {
    Luxury: ['luxury', 'luxe', 'couture', 'gold', 'expensive', 'silk', 'velvet', 'premium', 'high-end', 'designer', 'milan', 'paris', 'haute'],
    Streetwear: ['streetwear', 'street', 'sneakers', 'hoodie', 'oversized', 'cargo', 'urban', 'tokyo', 'cyberpunk', 'utility', 'skate'],
    Editorial: ['editorial', 'vogue', 'gq', 'magazine', 'campaign', 'concept', 'sleek', 'sculptural', 'artistic', 'lighting', 'rim'],
    Minimal: ['minimal', 'minimalist', 'clean', 'simple', 'monochrome', 'sleek', 'uncluttered', 'plain', 'neutral', 'slate', 'gray'],
    'Avant Garde': ['avant-garde', 'avant', 'experimental', 'sculptural', 'deconstructed', 'asymmetrical', 'cocoon', 'unconventional'],
    Wedding: ['wedding', 'bridal', 'groom', 'gown', 'marriage', 'veil', 'tuxedo', 'white lace', 'organza', 'chiffon', 'ivory'],
    Formal: ['formal', 'suit', 'tuxedo', 'tie', 'gala', 'evening gown', 'blazer', 'tailored', 'black-tie', 'dressy'],
    Winter: ['winter', 'cold', 'snow', 'wool', 'alpaca', 'coat', 'parka', 'shearling', 'heavy-weight', 'knit', 'cozy', 'thermal'],
    Summer: ['summer', 'hot', 'beach', 'sun', 'shorts', 'swim', 'linen', 'lawn', 'breezy', 'lightweight', 'sand'],
    Autumn: ['autumn', 'fall', 'leaves', 'trench', 'cardigan', 'earthy', 'brown', 'ochre', 'cozy', 'knitted', 'october', 'milan'],
    Spring: ['spring', 'blossom', 'floral', 'pastel', 'light coat', 'silk gazar', 'fresh', 'green', 'breeze'],
    Business: ['business', 'office', 'corporate', 'suit', 'blazer', 'pencil skirt', 'trouser', 'meeting', 'interview', 'oxford'],
    Sportswear: ['sportswear', 'sport', 'athletic', 'gym', 'activewear', 'joggers', 'sweatpant', 'jersey', 'dri-fit', 'running', 'stretch'],
    Traditional: ['traditional', 'cultural', 'ethnic', 'sari', 'sherwani', 'kurta', 'shalwar', 'embroidery', 'heritage', 'weave', 'kimono'],
    Cultural: ['cultural', 'heritage', 'ethnic', 'traditional', 'ancestry', 'folklore', 'textile', 'artisanal', 'customary'],
    Runway: ['runway', 'catwalk', 'fashion week', 'couture', 'show', 'collection', 'model walk', 'paris couture', 'debut'],
    Photography: ['photography', 'camera', 'hasselblad', 'leica', 'canon', 'lens', 'cinematic', 'studio', 'portrait', 'aperture', 'f/'],
    Portrait: ['portrait', 'face', 'expression', 'glance', 'expression', 'headshot', 'close-up', 'features', 'stoic', 'calm'],
    'Fashion Campaign': ['campaign', 'brand', 'lookbook', 'advertisement', 'promo', 'editorial campaign', 'collection launch'],
    'Magazine Cover': ['magazine', 'cover', 'vogue', 'elle', 'bazaar', 'gq', 'editorial board', 'headline', 'issue'],
    'Fashion Week': ['fashion week', 'milan', 'paris', 'tokyo', 'new york', 'london', 'schedule', 'collection launch', 'designer concept'],
    'Designer Concepts': ['concept', 'draft', 'sketch', 'ideation', 'prototype', 'unreleased', 'original design', 'visionary'],
    Experimental: ['experimental', 'glitch', 'abstract', 'unconventional', 'testing', 'prototype', 'generative', 'algorithmic', 'boundary']
  };

  /**
   * Automatically organizes a post into matching intelligent collections based on keywords.
   */
  public static getCollectionsForPost(post: CommunityPost): IntelligentCollectionType[] {
    const textToAnalyze = `
      ${post.caption} 
      ${post.vibeTags.join(' ')} 
      ${post.collectionName || ''}
      ${post.taggedGarment?.title || ''}
      ${post.avatarBlueprint?.pose || ''}
      ${post.garmentBlueprint?.fabric || ''}
      ${post.garmentBlueprint?.material || ''}
      ${post.garmentBlueprint?.silhouette || ''}
      ${post.sceneBlueprint?.location || ''}
      ${post.sceneBlueprint?.lighting || ''}
    `.toLowerCase();

    const matchedCollections: IntelligentCollectionType[] = [];

    Object.entries(this.collectionRules).forEach(([collection, keywords]) => {
      let isMatch = false;
      for (const kw of keywords) {
        if (textToAnalyze.includes(kw)) {
          isMatch = true;
          break;
        }
      }
      if (isMatch) {
        matchedCollections.push(collection as IntelligentCollectionType);
      }
    });

    // Default Fallbacks so every post belongs to at least 1-2 intelligent collections
    if (matchedCollections.length === 0) {
      if (post.isEditorPick) {
        matchedCollections.push('Editorial', 'Designer Concepts');
      } else if (post.caption.toLowerCase().includes('minimal') || post.caption.toLowerCase().includes('clean')) {
        matchedCollections.push('Minimal');
      } else {
        matchedCollections.push('Designer Concepts', 'Experimental');
      }
    }

    return matchedCollections;
  }
}

// ============================================================================
// 3. FASHION SIMILARITY ENGINE & VISUAL RECOMMENDATION ENGINE
// ============================================================================

export class FashionSimilarityEngine {
  /**
   * Calculates similarities between current post and comparison post.
   * Returns a complete breakdowns along with weighted overall score.
   */
  public static calculateSimilarity(postA: CommunityPost, postB: CommunityPost): SimilarityBreakdown {
    if (postA.id === postB.id) {
      return {
        fashionSimilarity: 100,
        poseSimilarity: 100,
        fabricSimilarity: 100,
        colorSimilarity: 100,
        styleSimilarity: 100,
        lightingSimilarity: 100,
        compositionSimilarity: 100,
        overallScore: 100
      };
    }

    // 1. Fashion Similarity (vibeTags intersection & collection overlap)
    const tagsA = new Set(postA.vibeTags.map(t => t.toLowerCase()));
    const tagsB = new Set(postB.vibeTags.map(t => t.toLowerCase()));
    const tagIntersection = [...tagsA].filter(t => tagsB.has(t));
    const tagUnion = new Set([...tagsA, ...tagsB]);
    let tagScore = tagUnion.size > 0 ? (tagIntersection.length / tagUnion.size) * 100 : 0;
    
    // Boost if in the same user-specified collection
    if (postA.collectionName && postB.collectionName && postA.collectionName.toLowerCase() === postB.collectionName.toLowerCase()) {
      tagScore = Math.min(100, tagScore + 30);
    }
    const fashionSimilarity = Math.round(Math.max(5, tagScore));

    // 2. Pose Similarity (avatar blueprint pose matching)
    const poseA = (postA.avatarBlueprint?.pose || '').toLowerCase();
    const poseB = (postB.avatarBlueprint?.pose || '').toLowerCase();
    let poseScore = 15;
    if (poseA === poseB && poseA.length > 0) {
      poseScore = 100;
    } else if (poseA.length > 0 && poseB.length > 0) {
      // Fuzzy match key terms
      const keyTerms = ['stride', 'dynamic', 'front', 'resting', 'slouch', 'contrapposto', 'stance', 'shift'];
      let termMatches = 0;
      keyTerms.forEach(term => {
        if (poseA.includes(term) && poseB.includes(term)) termMatches++;
      });
      poseScore = termMatches > 0 ? 50 + termMatches * 15 : 25;
    }
    const poseSimilarity = Math.round(poseScore);

    // 3. Fabric Similarity (garment blueprints fabric and materials overlap)
    const fabricA = (postA.garmentBlueprint?.fabric || '').toLowerCase();
    const fabricB = (postB.garmentBlueprint?.fabric || '').toLowerCase();
    const matA = (postA.garmentBlueprint?.material || '').toLowerCase();
    const matB = (postB.garmentBlueprint?.material || '').toLowerCase();
    let fabricScore = 10;
    if (fabricA === fabricB && fabricA.length > 0) fabricScore += 60;
    if (matA === matB && matA.length > 0) fabricScore += 30;
    if (fabricScore === 10) {
      // Fuzzy keywords
      const materials = ['linen', 'wool', 'silk', 'cotton', 'leather', 'denim', 'alpaca', 'hemp', 'twill', 'gazar'];
      materials.forEach(m => {
        if ((fabricA.includes(m) || matA.includes(m)) && (fabricB.includes(m) || matB.includes(m))) {
          fabricScore += 40;
        }
      });
    }
    const fabricSimilarity = Math.round(Math.min(100, fabricScore));

    // 4. Color Similarity (AI breakdown colors, caption colors harmony)
    const colA = (postA.aiBreakdown?.color || '').toLowerCase();
    const colB = (postB.aiBreakdown?.color || '').toLowerCase();
    const captionA = postA.caption.toLowerCase();
    const captionB = postB.caption.toLowerCase();
    let colorScore = 20;
    if (colA === colB && colA.length > 0) {
      colorScore = 95;
    } else {
      const colorKeywords = ['black', 'white', 'slate', 'sandstone', 'beige', 'ochre', 'gold', 'neon', 'blue', 'brown', 'cream', 'charcoal', 'grey'];
      let colorMatches = 0;
      colorKeywords.forEach(color => {
        const inA = colA.includes(color) || captionA.includes(color);
        const inB = colB.includes(color) || captionB.includes(color);
        if (inA && inB) colorMatches++;
      });
      colorScore = colorMatches > 0 ? 40 + colorMatches * 20 : 25;
    }
    const colorSimilarity = Math.round(Math.min(100, colorScore));

    // 5. Style Similarity (silhouette and body proportions)
    const silA = (postA.garmentBlueprint?.silhouette || '').toLowerCase();
    const silB = (postB.garmentBlueprint?.silhouette || '').toLowerCase();
    const propA = (postA.avatarBlueprint?.bodyProportions || '').toLowerCase();
    const propB = (postB.avatarBlueprint?.bodyProportions || '').toLowerCase();
    let styleScore = 15;
    if (silA === silB && silA.length > 0) styleScore += 50;
    if (propA === propB && propA.length > 0) styleScore += 35;
    // Check key silhouette descriptions
    const silKeywords = ['cocoon', 'tailored', 'oversized', 'column', 'asymmetrical', 'jacket', 'trousers', 'draped'];
    silKeywords.forEach(k => {
      if (silA.includes(k) && silB.includes(k)) styleScore += 15;
    });
    const styleSimilarity = Math.round(Math.min(100, styleScore));

    // 6. Lighting Similarity (scene lighting matches)
    const lightA = (postA.sceneBlueprint?.lighting || '').toLowerCase();
    const lightB = (postB.sceneBlueprint?.lighting || '').toLowerCase();
    let lightScore = 15;
    if (lightA === lightB && lightA.length > 0) {
      lightScore = 100;
    } else {
      const lights = ['overcast', 'diffuse', 'afternoon', 'sunset', 'twilight', 'golden', 'backlighting', 'rim', 'high-contrast'];
      let lightMatches = 0;
      lights.forEach(l => {
        if (lightA.includes(l) && lightB.includes(l)) lightMatches++;
      });
      lightScore = lightMatches > 0 ? 40 + lightMatches * 20 : 20;
    }
    const lightingSimilarity = Math.round(Math.min(100, lightScore));

    // 7. Composition Similarity (scene camera and setting location matches)
    const camA = (postA.sceneBlueprint?.camera || '').toLowerCase();
    const camB = (postB.sceneBlueprint?.camera || '').toLowerCase();
    const locA = (postA.sceneBlueprint?.location || '').toLowerCase();
    const locB = (postB.sceneBlueprint?.location || '').toLowerCase();
    let compScore = 15;
    if (camA === camB && camA.length > 0) compScore += 45;
    if (locA === locB && locA.length > 0) compScore += 40;
    // Fuzzy locations
    const locations = ['milan', 'berlin', 'tokyo', 'iceland', 'kyoto', 'quarry', 'atrium', 'cliffs', 'courtyard'];
    locations.forEach(l => {
      if (locA.includes(l) && locB.includes(l)) compScore += 25;
    });
    const compositionSimilarity = Math.round(Math.min(100, compScore));

    // Compute Overall Weighted Score
    // We weigh Fashion tags, Fabrics, and Colors more heavily for aesthetic discovery
    const overallScore = Math.round(
      fashionSimilarity * 0.25 +
      fabricSimilarity * 0.20 +
      colorSimilarity * 0.15 +
      styleSimilarity * 0.15 +
      lightingSimilarity * 0.10 +
      poseSimilarity * 0.08 +
      compositionSimilarity * 0.07
    );

    return {
      fashionSimilarity,
      poseSimilarity,
      fabricSimilarity,
      colorSimilarity,
      styleSimilarity,
      lightingSimilarity,
      compositionSimilarity,
      overallScore
    };
  }
}

export class VisualRecommendationEngine {
  /**
   * Finds the most visually relevant recommendations for the current open post.
   */
  public static getRecommendations(
    currentPost: CommunityPost,
    allPosts: CommunityPost[],
    limit: number = 4
  ): { post: CommunityPost; similarity: SimilarityBreakdown }[] {
    return allPosts
      .filter(p => p.id !== currentPost.id)
      .map(p => {
        const similarity = FashionSimilarityEngine.calculateSimilarity(currentPost, p);
        return { post: p, similarity };
      })
      .sort((a, b) => b.similarity.overallScore - a.similarity.overallScore)
      .slice(0, limit);
  }
}

// ============================================================================
// 4. CREATOR DIVERSITY & FEED ROTATION ENGINES
// ============================================================================

export class CreatorDiversityEngine {
  /**
   * Restructures a feed so that consecutive posts are not from the same creator.
   * Promotes creator discovery by interleaving diverse designer concepts.
   */
  public static enforceCreatorDiversity(posts: CommunityPost[]): CommunityPost[] {
    if (posts.length <= 2) return posts;

    const result: CommunityPost[] = [];
    const creatorBuckets: Record<string, CommunityPost[]> = {};

    // Group posts by creator
    posts.forEach(post => {
      const uid = post.author.uid || post.author.handle;
      if (!creatorBuckets[uid]) {
        creatorBuckets[uid] = [];
      }
      creatorBuckets[uid].push(post);
    });

    // Extract sorted list of creators by post count (highest first to interleave them first)
    const creators = Object.keys(creatorBuckets).sort(
      (a, b) => creatorBuckets[b].length - creatorBuckets[a].length
    );

    let itemsRemaining = true;
    while (itemsRemaining) {
      itemsRemaining = false;
      creators.forEach(uid => {
        const bucket = creatorBuckets[uid];
        if (bucket.length > 0) {
          const item = bucket.shift()!;
          result.push(item);
          itemsRemaining = true;
        }
      });
    }

    // Secondary safety pass: check if any two consecutive posts have identical authors and swap with a neighbor if possible
    for (let i = 1; i < result.length - 1; i++) {
      if (result[i].author.uid === result[i - 1].author.uid) {
        // Find a post further down with a different author and swap
        for (let j = i + 1; j < result.length; j++) {
          if (result[j].author.uid !== result[i].author.uid && result[j].author.uid !== result[i - 1].author.uid) {
            // Swap
            const temp = result[i];
            result[i] = result[j];
            result[j] = temp;
            break;
          }
        }
      }
    }

    return result;
  }
}

export class FeedRotationEngine {
  /**
   * Intelligently rotates/shuffles the feed using a pseudo-random seed
   * to ensure fresh views on refresh without dropping high-performing elements.
   */
  public static rotateFeed(posts: CommunityPost[], sessionSeed: string): CommunityPost[] {
    if (posts.length <= 1) return posts;

    // Convert seed string to a numerical hash
    let hash = 0;
    for (let i = 0; i < sessionSeed.length; i++) {
      hash = sessionSeed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seedNum = Math.abs(hash);

    // Simple seeded LCG (Linear Congruential Generator) for deterministic shuffle
    const seededRandom = (seed: number) => {
      let current = seed;
      return () => {
        current = (current * 9301 + 49297) % 233280;
        return current / 233280;
      };
    };

    const rand = seededRandom(seedNum);
    const shuffled = [...posts];

    // Knuth-Fisher-Yates Shuffle with our seeded random function
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }

    return shuffled;
  }
}

// ============================================================================
// 5. FRESHNESS ENGINE & INSPIRATION ENGINE
// ============================================================================

export class FreshnessEngine {
  /**
   * Calculates freshness weight (0.0 - 1.0) based on creation timestamp.
   * Content decays with half-life of roughly 3 days.
   */
  public static calculateFreshness(createdAt: string): number {
    const postTime = new Date(createdAt).getTime();
    const now = Date.now();
    const ageHours = Math.max(0, (now - postTime) / (1000 * 60 * 60));

    // Exponential decay: e^(-lambda * hours)
    // Roughly 0.95 at 12h, 0.90 at 24h, 0.50 at 72h (3 days)
    const decayFactor = 0.0096; 
    return Math.exp(-decayFactor * ageHours);
  }
}

export class InspirationEngine {
  /**
   * Personalizes the feed list by ranking posts based on user's liked and saved design features.
   */
  public static personalizeFeed(
    posts: CommunityPost[],
    userInteractions: UserInteractions
  ): CommunityPost[] {
    const { preferredTags, preferredColors, preferredCollections } = userInteractions;

    const hasInteractions = 
      Object.keys(preferredTags).length > 0 || 
      Object.keys(preferredColors).length > 0 || 
      Object.keys(preferredCollections).length > 0;

    if (!hasInteractions) {
      return posts;
    }

    return posts.map(post => {
      let personalizationBoost = 0;

      // 1. Boost matching tags
      post.vibeTags.forEach(tag => {
        const normalized = tag.toLowerCase().trim();
        if (preferredTags[normalized]) {
          personalizationBoost += preferredTags[normalized] * 12; // 12 points per matching tag interaction weight
        }
      });

      // 2. Boost matching colors
      const colorDesc = (post.aiBreakdown?.color || '').toLowerCase();
      Object.entries(preferredColors).forEach(([color, weight]) => {
        if (colorDesc.includes(color) || post.caption.toLowerCase().includes(color)) {
          personalizationBoost += weight * 8; // 8 points for favorite color presence
        }
      });

      // 3. Boost matching collections
      const postCollections = IntelligentCollectionsEngine.getCollectionsForPost(post);
      postCollections.forEach(col => {
        if (preferredCollections[col]) {
          personalizationBoost += preferredCollections[col] * 15; // 15 points for matched collection preference
        }
      });

      // Clamp personal boost to a maximum score of 100
      const personalizedScore = Math.min(100, personalizationBoost);

      return {
        ...post,
        // Integrate the personalization boost into the post's dynamic trending score
        trendingScore: parseFloat((post.trendingScore + personalizedScore * 0.15).toFixed(1))
      };
    });
  }

  /**
   * Dynamically compiles user preference maps by analyzing local interactions.
   */
  public static compileUserInteractions(
    allPosts: CommunityPost[],
    likedIds: string[],
    savedIds: string[]
  ): UserInteractions {
    const preferredTags: Record<string, number> = {};
    const preferredColors: Record<string, number> = {};
    const preferredCollections: Record<string, number> = {};

    const interactedIds = Array.from(new Set([...likedIds, ...savedIds]));
    const interactedPosts = allPosts.filter(p => interactedIds.includes(p.id));

    interactedPosts.forEach(post => {
      // Tags frequency weights
      post.vibeTags.forEach(t => {
        const tag = t.toLowerCase().trim();
        preferredTags[tag] = (preferredTags[tag] || 0) + 1;
      });

      // Colors frequency weights
      const colorKeywords = ['black', 'white', 'slate', 'sandstone', 'beige', 'ochre', 'gold', 'neon', 'blue', 'brown', 'cream', 'charcoal', 'grey'];
      const colorDesc = (post.aiBreakdown?.color || '').toLowerCase() + ' ' + post.caption.toLowerCase();
      colorKeywords.forEach(color => {
        if (colorDesc.includes(color)) {
          preferredColors[color] = (preferredColors[color] || 0) + 1;
        }
      });

      // Intelligent collections frequency weights
      const cols = IntelligentCollectionsEngine.getCollectionsForPost(post);
      cols.forEach(col => {
        preferredCollections[col] = (preferredCollections[col] || 0) + 1;
      });
    });

    return {
      likedPostIds: likedIds,
      savedPostIds: savedIds,
      viewedPostIds: [],
      preferredTags,
      preferredColors,
      preferredCollections
    };
  }
}

// ============================================================================
// 6. AUTOMATIC RANKING ENGINES
// ============================================================================

export class AutomaticRankingEngine {
  /**
   * Sorts the posts dynamically based on the selected smart ranking metric,
   * factoring in engagement values, freshness decay, and editor curations.
   */
  public static rank(
    posts: CommunityPost[],
    rankingType: RankingEngineType,
    userInteractions?: UserInteractions
  ): CommunityPost[] {
    const postsWithDecay = posts.map(post => {
      const freshness = FreshnessEngine.calculateFreshness(post.createdAt);
      
      // Calculate dynamic traction value based on actual action metrics
      // Views: 1pt, Likes: 5pts, Saves: 10pts, Shares: 15pts
      const engagement = 
        (post.views * 0.05) + 
        ((post.likes || 0) * 5) + 
        ((post.saves || 0) * 10) + 
        ((post.shares || 0) * 15);

      // Freshness multiplier: gives newly posted designs an initial exponential boost,
      // but lets established viral content retain position via engagement points.
      const rawFreshRank = engagement * freshness;

      return {
        post,
        freshness,
        engagement,
        rawFreshRank
      };
    });

    switch (rankingType) {
      case 'Trending Today':
        // High decay rate, priorities heavy recent action (freshness > 0.8)
        return postsWithDecay
          .sort((a, b) => {
            const scoreA = a.engagement * (a.freshness > 0.8 ? 1.5 : a.freshness);
            const scoreB = b.engagement * (b.freshness > 0.8 ? 1.5 : b.freshness);
            return scoreB - scoreA;
          })
          .map(x => x.post);

      case 'Trending This Week':
        // Medium decay rate, priority is total weekly volume
        return postsWithDecay
          .sort((a, b) => {
            const scoreA = a.engagement * Math.sqrt(a.freshness);
            const scoreB = b.engagement * Math.sqrt(b.freshness);
            return scoreB - scoreA;
          })
          .map(x => x.post);

      case 'Trending This Month':
        // Low decay rate, pure engagement points count
        return postsWithDecay
          .sort((a, b) => b.engagement - a.engagement)
          .map(x => x.post);

      case 'Most Loved':
        return [...posts].sort((a, b) => b.likes - a.likes);

      case 'Most Viewed':
        return [...posts].sort((a, b) => b.views - a.views);

      case 'Most Saved':
        return [...posts].sort((a, b) => b.saves - a.saves);

      case 'Most Shared':
        return [...posts].sort((a, b) => b.shares - a.shares);

      case 'Fastest Growing':
        // Velocity: engagement points divided by physical age (hours) plus baseline buffer
        return postsWithDecay
          .sort((a, b) => {
            const ageHoursA = Math.max(1, (Date.now() - new Date(a.post.createdAt).getTime()) / (1000 * 60 * 60));
            const ageHoursB = Math.max(1, (Date.now() - new Date(b.post.createdAt).getTime()) / (1000 * 60 * 60));
            const velocityA = a.engagement / ageHoursA;
            const velocityB = b.engagement / ageHoursB;
            return velocityB - velocityA;
          })
          .map(x => x.post);

      case 'Hidden Gems':
        // High engagement ratios (likes / views) but overall view count is low (under 10,000 views)
        return postsWithDecay
          .filter(x => x.post.views < 1500000 && x.post.views > 10)
          .sort((a, b) => {
            const ratioA = (a.post.likes + a.post.saves) / a.post.views;
            const ratioB = (b.post.likes + b.post.saves) / b.post.views;
            return ratioB - ratioA;
          })
          .map(x => x.post);

      case 'Fresh Discoveries':
        // High freshness factor (created within last 48h) sorted by engagement velocity
        return postsWithDecay
          .filter(x => x.freshness > 0.6)
          .sort((a, b) => b.engagement - a.engagement)
          .map(x => x.post);

      case 'Editor\'s Choice':
        return [...posts]
          .sort((a, b) => {
            if (a.isEditorPick && !b.isEditorPick) return -1;
            if (!a.isEditorPick && b.isEditorPick) return 1;
            return b.trendingScore - a.trendingScore;
          });

      default:
        return posts;
    }
  }
}

// ============================================================================
// 7. FASHION TREND DETECTION ENGINE
// ============================================================================

export class FashionTrendDetectionEngine {
  /**
   * Scans all published community posts to dynamically extract trending keywords,
   * popular fabrics, colors, lighting types, and silhouette coordinates.
   */
  public static detectActiveTrends(posts: CommunityPost[]): FashionTrendReport {
    if (posts.length === 0) {
      return {
        emergingStyles: [],
        popularColors: [],
        popularGarments: [],
        popularPoses: [],
        popularFabrics: [],
        popularLighting: [],
        popularBackgrounds: [],
        lastUpdated: new Date().toISOString()
      };
    }

    const tagsFreq: Record<string, number> = {};
    const colorsFreq: Record<string, number> = {};
    const garmentsFreq: Record<string, number> = {};
    const posesFreq: Record<string, number> = {};
    const fabricsFreq: Record<string, number> = {};
    const lightFreq: Record<string, number> = {};
    const locFreq: Record<string, number> = {};

    posts.forEach(post => {
      // 1. Tags
      post.vibeTags.forEach(t => {
        const clean = t.toLowerCase().trim();
        tagsFreq[clean] = (tagsFreq[clean] || 0) + 1;
      });

      // 2. Colors fuzzy detection
      const colorKeywords = ['black', 'white', 'slate', 'sandstone', 'beige', 'ochre', 'gold', 'neon', 'blue', 'brown', 'cream', 'charcoal', 'grey'];
      const colorDesc = (post.aiBreakdown?.color || '').toLowerCase() + ' ' + post.caption.toLowerCase();
      colorKeywords.forEach(color => {
        if (colorDesc.includes(color)) {
          colorsFreq[color] = (colorsFreq[color] || 0) + 1;
        }
      });

      // 3. Garments / Silhouettes
      const silhouette = post.garmentBlueprint?.silhouette || '';
      if (silhouette) {
        const cleanSil = silhouette.split(' ')[0] || silhouette;
        garmentsFreq[cleanSil] = (garmentsFreq[cleanSil] || 0) + 1;
      }
      if (post.taggedGarment?.title) {
        garmentsFreq[post.taggedGarment.title] = (garmentsFreq[post.taggedGarment.title] || 0) + 1;
      }

      // 4. Poses
      const pose = post.avatarBlueprint?.pose || '';
      if (pose) {
        const cleanPose = pose.split(' ')[0] || pose;
        posesFreq[cleanPose] = (posesFreq[cleanPose] || 0) + 1;
      }

      // 5. Fabrics
      const fabric = post.garmentBlueprint?.fabric || '';
      if (fabric) {
        fabricsFreq[fabric] = (fabricsFreq[fabric] || 0) + 1;
      }

      // 6. Lighting
      const light = post.sceneBlueprint?.lighting || '';
      if (light) {
        const cleanLight = light.split(' ')[0] || light;
        lightFreq[cleanLight] = (lightFreq[cleanLight] || 0) + 1;
      }

      // 7. Backgrounds
      const loc = post.sceneBlueprint?.location || '';
      if (loc) {
        const cleanLoc = loc.split(',')[0] || loc;
        locFreq[cleanLoc] = (locFreq[cleanLoc] || 0) + 1;
      }
    });

    // Format emerging styles (top 4 with score & trajectory)
    const emergingStyles = Object.entries(tagsFreq)
      .map(([tag, count]) => ({
        tag,
        score: Math.round((count / posts.length) * 100),
        trend: count > 1 ? 'up' as const : 'stable' as const
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Format colors
    const totalColorMatches = Object.values(colorsFreq).reduce((a, b) => a + b, 0) || 1;
    const popularColors = Object.entries(colorsFreq)
      .map(([color, count]) => ({
        color: color.charAt(0).toUpperCase() + color.slice(1),
        count,
        percentage: Math.round((count / totalColorMatches) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const mapToCountList = (freq: Record<string, number>, limit: number = 4) => {
      return Object.entries(freq)
        .map(([key, count]) => ({ item: key, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    };

    return {
      emergingStyles,
      popularColors,
      popularGarments: mapToCountList(garmentsFreq).map(x => ({ item: x.item, count: x.count })),
      popularPoses: mapToCountList(posesFreq).map(x => ({ pose: x.item, count: x.count })),
      popularFabrics: mapToCountList(fabricsFreq).map(x => ({ fabric: x.item, count: x.count })),
      popularLighting: mapToCountList(lightFreq).map(x => ({ lighting: x.item, count: x.count })),
      popularBackgrounds: mapToCountList(locFreq).map(x => ({ location: x.item, count: x.count })),
      lastUpdated: new Date().toISOString()
    };
  }
}
