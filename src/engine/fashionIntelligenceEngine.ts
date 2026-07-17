import {
  type UnifiedOutfit,
  type SubscriptionTier
} from '../features/ai-core/UnifiedFashionOS';

// ============================================================================
// 1. DATA TYPES & CONTRACT INTERFACES
// ============================================================================

export type FashionVibe =
  | 'Minimalist'
  | 'Luxury'
  | 'Streetwear'
  | 'Casual'
  | 'Classic'
  | 'Formal'
  | 'Cyberpunk'
  | 'Traditional'
  | 'Smart Casual'
  | 'Business'
  | 'Elegant'
  | 'Sport';

export interface FashionDNAScore {
  category: FashionVibe;
  confidence: number; // 0.0 - 1.0
}

export interface GarmentNode {
  id: string;
  type: 'Shirt' | 'Jacket' | 'Pant' | 'Shoes' | 'Accessories' | 'Bag' | 'Watch' | 'Glasses' | 'Jewelry';
  name: string;
  brand?: string;
  vibe: FashionVibe;
  colors: string[];
  fabric?: string;
}

export interface OutfitComposition {
  id: string;
  name: string;
  structure: {
    shirt?: GarmentNode;
    jacket?: GarmentNode;
    pant?: GarmentNode;
    shoes?: GarmentNode;
    accessories?: GarmentNode[];
    bag?: GarmentNode;
    watch?: GarmentNode;
    glasses?: GarmentNode;
    jewelry?: GarmentNode[];
  };
  dominantVibe: FashionVibe;
}

export interface ColorHarmonyReport {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contrastRatio: 'High' | 'Medium' | 'Low';
  temperature: 'Warm' | 'Cool' | 'Neutral';
  harmonyScore: number; // 0 - 100
  paletteType: 'Complementary' | 'Analogous' | 'Monochrome' | 'Triadic';
  curatedTheme: 'Luxury' | 'Street' | 'Wedding' | 'Festival' | 'Default';
}

export type OccasionType =
  | 'Wedding'
  | 'Office'
  | 'Business Meeting'
  | 'Interview'
  | 'Party'
  | 'Travel'
  | 'Daily Wear'
  | 'Gym'
  | 'Date'
  | 'Formal Dinner'
  | 'Festival'
  | 'Religious Event'
  | 'Vacation';

export interface OccasionSuitability {
  occasion: OccasionType;
  score: number; // 0 - 100
  appropriatenessLevel: 'High' | 'Moderate' | 'Low';
}

export type BodyType = 'Ectomorph' | 'Mesomorph' | 'Endomorph' | 'Athletic' | 'Average';
export type BodyShape = 'Hourglass' | 'Rectangle' | 'Triangle' | 'Inverted Triangle' | 'Oval' | 'Plus Size' | 'Petite' | 'Tall';

export interface BodyMetricsInput {
  heightCm: number;
  bodyType: BodyType;
  bodyShape: BodyShape;
  skinTone: string;
  faceShape: string;
}

export interface BodyCompatibilityScore {
  compatibilityScore: number; // 0 - 100
  silhouetteRecommendation: string;
  necklineMatch: string;
  patternSuitability: string;
  tailoringFidelity: 'Perfect' | 'Aesthetic Adjustments Required' | 'Not Recommended';
}

export type FabricType =
  | 'Cotton'
  | 'Silk'
  | 'Linen'
  | 'Leather'
  | 'Denim'
  | 'Velvet'
  | 'Wool'
  | 'Polyester'
  | 'Satin'
  | 'Khaddar'
  | 'Lawn'
  | 'Organza'
  | 'Chiffon';

export interface FabricMetrics {
  type: FabricType;
  luxuryScore: number; // 0 - 100
  comfortScore: number; // 0 - 100
  breathability: number; // 0 - 100
  durability: number; // 0 - 100
  preferredSeason: 'Summer' | 'Winter' | 'Spring/Autumn' | 'All Season';
}

export interface TrendWeights {
  seasonTrendScore: number; // 0 - 100
  luxuryTrendScore: number; // 0 - 100
  streetTrendScore: number; // 0 - 100
  regionalTrendScore: number; // 0 - 100
  colorTrendScore: number; // 0 - 100
  celebrityInfluenceScore: number; // 0 - 100
  futureAdaptabilityScore: number; // 0 - 100
}

export interface FashionQualityReport {
  harmonyScore: number;
  luxuryScore: number;
  creativityScore: number;
  practicalScore: number;
  wearabilityScore: number;
  trendScore: number;
  overallFashionScore: number;
}

export interface FashionCriticReport {
  pros: string[];
  cons: string[];
  improvements: string[];
  luxurySuggestions: string[];
  budgetAlternatives: string[];
}

export interface UnifiedFashionDirectorOutput {
  composition: OutfitComposition;
  harmony: ColorHarmonyReport;
  quality: FashionQualityReport;
  critic: FashionCriticReport;
  dna: FashionDNAScore[];
  suitability: OccasionSuitability[];
  compatibility: BodyCompatibilityScore;
}

// ============================================================================
// 1. FASHION DNA ENGINE
// ============================================================================

export class FashionDNAEngine {
  public static analyzeDNA(tags: string[], description?: string): FashionDNAScore[] {
    const textToAnalyze = `${tags.join(' ')} ${description || ''}`.toLowerCase();
    
    const vibeWeights: Record<FashionVibe, string[]> = {
      Minimalist: ['clean', 'minimal', 'sleek', 'simple', 'monochrome', 'basic', 'uncluttered', 'plain'],
      Luxury: ['luxury', 'rich', 'expensive', 'silk', 'velvet', 'couture', 'high-end', 'premium', 'designer', 'gold', 'haute'],
      Streetwear: ['streetwear', 'street', 'sneakers', 'hoodie', 'oversized', 'urban', 'graffiti', 'baggy', 'cargo'],
      Casual: ['casual', 'relaxed', 'comfy', 'daily', 'denim', 't-shirt', 'everyday', 'chilled'],
      Classic: ['classic', 'timeless', 'heritage', 'vintage', 'vintage-cut', 'traditional-tailoring', 'stripe'],
      Formal: ['formal', 'suit', 'tuxedo', 'gown', 'tie', 'black-tie', 'blazer', 'dressy'],
      Cyberpunk: ['cyberpunk', 'techwear', 'neon', 'futuristic', 'holographic', 'matrix', 'tactical', 'darkwear'],
      Traditional: ['traditional', 'cultural', 'ethnic', 'sherwani', 'sari', 'kurta', 'shalwar', 'embroidery', 'heritage-weave'],
      'Smart Casual': ['smart', 'chino', 'loafers', 'button-down', 'polo', 'blazer-casual', 'refined-street'],
      Business: ['business', 'office', 'corporate', 'tailored', 'pencil-skirt', 'trouser', 'oxford'],
      Elegant: ['elegant', 'graceful', 'glamorous', 'satin', 'draped', 'evening', 'sophisticated', 'chic'],
      Sport: ['sport', 'activewear', 'athletic', 'gym', 'joggers', 'sweatpant', 'jersey', 'dri-fit', 'running']
    };

    const scores: FashionDNAScore[] = Object.entries(vibeWeights).map(([category, keywords]) => {
      let matches = 0;
      keywords.forEach(kw => {
        if (textToAnalyze.includes(kw)) matches++;
      });

      // Sigmoid/Bounded normalization based on keyword density
      const confidence = matches === 0 ? 0.05 : Math.min(1.0, 0.2 + matches * 0.25);
      return {
        category: category as FashionVibe,
        confidence: parseFloat(confidence.toFixed(2))
      };
    });

    return scores.sort((a, b) => b.confidence - a.confidence);
  }
}

// ============================================================================
// 2. OUTFIT COMPOSITION ENGINE
// ============================================================================

export class OutfitCompositionEngine {
  public static createComposition(
    vibe: FashionVibe,
    garments: GarmentNode[]
  ): OutfitComposition {
    const composition: OutfitComposition = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${vibe} Styled Assembly`,
      structure: {
        accessories: [],
        jewelry: []
      },
      dominantVibe: vibe
    };

    garments.forEach(g => {
      switch (g.type) {
        case 'Shirt':
          composition.structure.shirt = g;
          break;
        case 'Jacket':
          composition.structure.jacket = g;
          break;
        case 'Pant':
          composition.structure.pant = g;
          break;
        case 'Shoes':
          composition.structure.shoes = g;
          break;
        case 'Bag':
          composition.structure.bag = g;
          break;
        case 'Watch':
          composition.structure.watch = g;
          break;
        case 'Glasses':
          composition.structure.glasses = g;
          break;
        case 'Accessories':
          composition.structure.accessories?.push(g);
          break;
        case 'Jewelry':
          composition.structure.jewelry?.push(g);
          break;
      }
    });

    return composition;
  }
}

// ============================================================================
// 3. COLOR HARMONY ENGINE
// ============================================================================

export class ColorHarmonyEngine {
  public static evaluateHarmony(
    primary: string,
    secondary: string,
    accent: string
  ): ColorHarmonyReport {
    // Curate deterministic theme detection based on typical styling hex patterns or naming strings
    const colorsText = `${primary} ${secondary} ${accent}`.toLowerCase();
    
    let curatedTheme: 'Luxury' | 'Street' | 'Wedding' | 'Festival' | 'Default' = 'Default';
    let temperature: 'Warm' | 'Cool' | 'Neutral' = 'Neutral';
    let contrastRatio: 'High' | 'Medium' | 'Low' = 'Medium';
    let harmonyScore = 75;
    let paletteType: 'Complementary' | 'Analogous' | 'Monochrome' | 'Triadic' = 'Analogous';

    if (colorsText.includes('gold') || colorsText.includes('burgundy') || colorsText.includes('#ffd700')) {
      curatedTheme = 'Luxury';
      temperature = 'Warm';
      harmonyScore = 92;
      paletteType = 'Complementary';
    } else if (colorsText.includes('neon') || colorsText.includes('black') || colorsText.includes('#00ff00')) {
      curatedTheme = 'Street';
      contrastRatio = 'High';
      harmonyScore = 85;
      paletteType = 'Complementary';
    } else if (colorsText.includes('white') || colorsText.includes('ivory') || colorsText.includes('silver')) {
      curatedTheme = 'Wedding';
      temperature = 'Neutral';
      harmonyScore = 95;
      paletteType = 'Monochrome';
    } else if (colorsText.includes('multi') || colorsText.includes('yellow') || colorsText.includes('red')) {
      curatedTheme = 'Festival';
      temperature = 'Warm';
      contrastRatio = 'High';
      harmonyScore = 80;
      paletteType = 'Triadic';
    }

    // Default neutral styling properties
    if (colorsText.includes('blue') || colorsText.includes('navy')) {
      temperature = 'Cool';
    }

    return {
      primaryColor: primary,
      secondaryColor: secondary,
      accentColor: accent,
      contrastRatio,
      temperature,
      harmonyScore,
      paletteType,
      curatedTheme
    };
  }
}

// ============================================================================
// 4. OCCASION INTELLIGENCE ENGINE
// ============================================================================

export class OccasionIntelligenceEngine {
  private static occasionVibesMapping: Record<OccasionType, FashionVibe[]> = {
    Wedding: ['Elegant', 'Formal', 'Traditional', 'Luxury'],
    Office: ['Business', 'Smart Casual', 'Classic'],
    'Business Meeting': ['Business', 'Formal', 'Classic'],
    Interview: ['Business', 'Formal', 'Classic', 'Smart Casual'],
    Party: ['Streetwear', 'Elegant', 'Cyberpunk', 'Luxury'],
    Travel: ['Casual', 'Sport', 'Smart Casual'],
    'Daily Wear': ['Casual', 'Minimalist', 'Smart Casual'],
    Gym: ['Sport'],
    Date: ['Elegant', 'Minimalist', 'Smart Casual', 'Luxury'],
    'Formal Dinner': ['Elegant', 'Formal', 'Luxury', 'Classic'],
    Festival: ['Traditional', 'Cyberpunk', 'Streetwear'],
    'Religious Event': ['Traditional', 'Classic'],
    Vacation: ['Casual', 'Sport', 'Minimalist']
  };

  public static evaluateOccasionSuitability(
    dominantVibe: FashionVibe,
    complementaryVibes: FashionDNAScore[]
  ): OccasionSuitability[] {
    const activeVibeNames = [dominantVibe, ...complementaryVibes.slice(0, 3).map(d => d.category)];

    return Object.entries(this.occasionVibesMapping).map(([occ, allowedVibes]) => {
      let matches = 0;
      activeVibeNames.forEach(v => {
        if (allowedVibes.includes(v)) matches++;
      });

      const score = Math.max(10, Math.min(100, 30 + matches * 25));
      let appropriatenessLevel: 'High' | 'Moderate' | 'Low' = 'Low';

      if (score >= 80) appropriatenessLevel = 'High';
      else if (score >= 45) appropriatenessLevel = 'Moderate';

      return {
        occasion: occ as OccasionType,
        score,
        appropriatenessLevel
      };
    }).sort((a, b) => b.score - a.score);
  }
}

// ============================================================================
// 5. BODY COMPATIBILITY ENGINE
// ============================================================================

export class BodyCompatibilityEngine {
  public static evaluateCompatibility(
    metrics: BodyMetricsInput,
    dominantVibe: FashionVibe
  ): BodyCompatibilityScore {
    let compatibilityScore = 85;
    let silhouetteRecommendation = 'Regular-Fit Standard drape tailored profiles.';
    let necklineMatch = 'Crew neck or classic polo bounds.';
    let patternSuitability = 'Solid colors or minimal stripe grids.';
    let tailoringFidelity: 'Perfect' | 'Aesthetic Adjustments Required' | 'Not Recommended' = 'Perfect';

    // Height Adjustments
    if (metrics.heightCm > 185) {
      silhouetteRecommendation = 'Oversized structured drops, relaxed trousers, elongated hemlines.';
    } else if (metrics.heightCm < 165) {
      silhouetteRecommendation = 'Cropped box-cut tailoring to raise aesthetic waist line bounds.';
    }

    // Body Shape Rules
    if (metrics.bodyShape === 'Hourglass') {
      necklineMatch = 'V-Neck or scoop contouring structures.';
      patternSuitability = 'Fluid organic solid patterns.';
    } else if (metrics.bodyShape === 'Plus Size') {
      silhouetteRecommendation = 'Structured, high-density fabric outlines with vertical drapes.';
      tailoringFidelity = 'Aesthetic Adjustments Required';
      compatibilityScore = 88;
    } else if (metrics.bodyShape === 'Petite') {
      silhouetteRecommendation = 'Slim tailored structured profiles, avoiding drowning in extra fabric.';
      compatibilityScore = 90;
    }

    // Streetwear & Cyberpunk structural overrides
    if (dominantVibe === 'Streetwear' || dominantVibe === 'Cyberpunk') {
      silhouetteRecommendation = 'Drop shoulder oversized streetwear profiles.';
      necklineMatch = 'Mock neck or heavy rib collar configurations.';
      patternSuitability = 'High-contrast branding accents or digital typography prints.';
    }

    return {
      compatibilityScore,
      silhouetteRecommendation,
      necklineMatch,
      patternSuitability,
      tailoringFidelity
    };
  }
}

// ============================================================================
// 6. FABRIC INTELLIGENCE ENGINE
// ============================================================================

export class FabricIntelligenceEngine {
  private static fabrics: Record<FabricType, FabricMetrics> = {
    Cotton: { type: 'Cotton', luxuryScore: 60, comfortScore: 90, breathability: 95, durability: 80, preferredSeason: 'Summer' },
    Silk: { type: 'Silk', luxuryScore: 100, comfortScore: 85, breathability: 70, durability: 40, preferredSeason: 'Spring/Autumn' },
    Linen: { type: 'Linen', luxuryScore: 75, comfortScore: 95, breathability: 100, durability: 70, preferredSeason: 'Summer' },
    Leather: { type: 'Leather', luxuryScore: 90, comfortScore: 60, breathability: 10, durability: 100, preferredSeason: 'Winter' },
    Denim: { type: 'Denim', luxuryScore: 50, comfortScore: 75, breathability: 45, durability: 95, preferredSeason: 'All Season' },
    Velvet: { type: 'Velvet', luxuryScore: 95, comfortScore: 80, breathability: 30, durability: 65, preferredSeason: 'Winter' },
    Wool: { type: 'Wool', luxuryScore: 85, comfortScore: 85, breathability: 50, durability: 85, preferredSeason: 'Winter' },
    Polyester: { type: 'Polyester', luxuryScore: 30, comfortScore: 65, breathability: 40, durability: 90, preferredSeason: 'All Season' },
    Satin: { type: 'Satin', luxuryScore: 88, comfortScore: 80, breathability: 60, durability: 50, preferredSeason: 'Spring/Autumn' },
    Khaddar: { type: 'Khaddar', luxuryScore: 70, comfortScore: 80, breathability: 55, durability: 90, preferredSeason: 'Winter' },
    Lawn: { type: 'Lawn', luxuryScore: 65, comfortScore: 98, breathability: 100, durability: 60, preferredSeason: 'Summer' },
    Organza: { type: 'Organza', luxuryScore: 90, comfortScore: 40, breathability: 75, durability: 35, preferredSeason: 'Summer' },
    Chiffon: { type: 'Chiffon', luxuryScore: 80, comfortScore: 70, breathability: 85, durability: 45, preferredSeason: 'Summer' }
  };

  public static getFabricDetails(type: FabricType): FabricMetrics {
    return this.fabrics[type] || this.fabrics.Cotton;
  }
}

// ============================================================================
// 7. TREND INTELLIGENCE ENGINE
// ============================================================================

export class TrendIntelligenceEngine {
  public static evaluateTrendWeights(
    vibe: FashionVibe,
    colorTheme: string
  ): TrendWeights {
    let seasonTrendScore = 82;
    let luxuryTrendScore = 75;
    let streetTrendScore = 70;
    let regionalTrendScore = 80;
    let colorTrendScore = 78;
    let celebrityInfluenceScore = 84;
    let futureAdaptabilityScore = 80;

    // Direct weighting rule adjustments
    if (vibe === 'Streetwear') {
      streetTrendScore = 95;
      celebrityInfluenceScore = 92;
      futureAdaptabilityScore = 85;
    } else if (vibe === 'Luxury' || vibe === 'Elegant') {
      luxuryTrendScore = 98;
      colorTrendScore = 90;
    } else if (vibe === 'Cyberpunk') {
      futureAdaptabilityScore = 99;
      streetTrendScore = 85;
    }

    if (colorTheme.toLowerCase().includes('neon')) {
      colorTrendScore = 94;
    }

    return {
      seasonTrendScore,
      luxuryTrendScore,
      streetTrendScore,
      regionalTrendScore,
      colorTrendScore,
      celebrityInfluenceScore,
      futureAdaptabilityScore
    };
  }
}

// ============================================================================
// 8. FASHION VOCABULARY ENGINE
// ============================================================================

export class FashionVocabularyEngine {
  private static glossary = {
    luxuryTerms: ['Haute Couture', 'Atelier', 'Sartorialism', 'Draped Satin', 'Plissé', 'Bespoke Herringbone'],
    tailoring: ['Double-Breasted', 'Deconstructed Shoulder', 'Peak Lapels', 'Slim-Fit Chino', 'Boxy Cropped'],
    garments: ['Overcoat', 'Trench', 'Anorak', 'Structured Blazer', 'Drop Shoulder Tee', 'Cargo Joggers'],
    necklines: ['Mock Neck', 'Band Collar', 'Asymmetric Neck', 'Shawl Lapel', 'Deep V-Neck'],
    sleeves: ['Raglan Sleeves', 'Kimono Cut', 'Ribbed Cuffs', 'Bishop Sleeve', 'Dolman Sleeve'],
    patterns: ['Monochrome Solid', 'Pinstripe Grid', 'Baroque Brocade', 'Glitch Camo', 'Houndstooth Weaver'],
    textures: ['Heavyweight Loopback', 'Brushed Silk', 'Matte Waxed Leather', 'Semi-Sheer Organza'],
    silhouettes: ['A-Line Contour', 'Boxy Geometric', 'Elongated Fluidity', 'Fitted Structural'],
    adjectives: ['Avant-Garde', 'Impeccable', 'Sartorial', 'Glassmorphic', 'Cohesive', 'Ethereal'],
    prompts: [
      'Studio model portrait in hyper-realistic 8k, wearing customized premium @VIBE style silhouette, architectural lighting accents, cinematic editorial style.',
      'Sartorial runway photograph, spotlight glow, focused detailing of drapery fabric folds with complementary color balancing.'
    ]
  };

  public static getVocabularyGlossary() {
    return this.glossary;
  }
}

// ============================================================================
// 9. STYLING RECOMMENDATION ENGINE
// ============================================================================

export class StylingRecommendationEngine {
  public static recommendGarments(
    dna: FashionVibe,
    preferredColors: string[],
    budgetLimit: number
  ): GarmentNode[] {
    const catalog: GarmentNode[] = [
      { id: 'g_1', type: 'Shirt', name: 'Premium Tailored Oxford', brand: 'Sartorial Labs', vibe: 'Business', colors: ['White', 'Navy'], fabric: 'Cotton' },
      { id: 'g_2', type: 'Jacket', name: 'Deconstructed Soft Blazer', brand: 'Sartorial Labs', vibe: 'Smart Casual', colors: ['Charcoal', 'Brown'], fabric: 'Wool' },
      { id: 'g_3', type: 'Pant', name: 'Pleated Tapered Chinos', brand: 'Minimal Core', vibe: 'Minimalist', colors: ['Taupe', 'Black'], fabric: 'Cotton' },
      { id: 'g_4', type: 'Shoes', name: 'Calfskin Minimalist Loafers', brand: 'Luxe Craft', vibe: 'Elegant', colors: ['Brown', 'Black'], fabric: 'Leather' },
      { id: 'g_5', type: 'Jacket', name: 'Oversized Loopback Hoodie', brand: 'Vandal Street', vibe: 'Streetwear', colors: ['Grey', 'Black'], fabric: 'Cotton' },
      { id: 'g_6', type: 'Pant', name: 'Multi-pocket Cargo Pants', brand: 'Vandal Street', vibe: 'Streetwear', colors: ['Olive', 'Black'], fabric: 'Denim' },
      { id: 'g_7', type: 'Jacket', name: 'Cybernetic Matte Shell Jacket', brand: 'Neo Gear', vibe: 'Cyberpunk', colors: ['Black', 'Neon Green'], fabric: 'Polyester' },
      { id: 'g_8', type: 'Shoes', name: 'Vibram Techwear Boots', brand: 'Neo Gear', vibe: 'Cyberpunk', colors: ['Black'], fabric: 'Leather' },
      { id: 'g_9', type: 'Shirt', name: 'Draped Silk Evening Shirt', brand: 'Luxe Craft', vibe: 'Luxury', colors: ['Champagne', 'Burgundy'], fabric: 'Silk' }
    ];

    // Filter matching or nearby vibes
    return catalog.filter(g => {
      const matchVibe = g.vibe === dna || g.vibe === 'Minimalist' || g.vibe === 'Smart Casual';
      const matchColor = preferredColors.length === 0 || preferredColors.some(c => g.colors.includes(c));
      return matchVibe && matchColor;
    });
  }
}

// ============================================================================
// 10. FASHION QUALITY ENGINE
// ============================================================================

export class FashionQualityEngine {
  public static evaluateQuality(
    composition: OutfitComposition,
    harmony: ColorHarmonyReport,
    trend: TrendWeights
  ): FashionQualityReport {
    const harmonyScore = harmony.harmonyScore;
    
    let luxuryScore = 60;
    let practicalScore = 80;
    let wearabilityScore = 85;

    // Luxury criteria
    const elements = [
      composition.structure.shirt,
      composition.structure.jacket,
      composition.structure.pant,
      composition.structure.shoes
    ];

    const luxuryKeywords = ['Silk', 'Leather', 'Wool', 'Velvet'];
    elements.forEach(el => {
      if (el?.fabric && luxuryKeywords.includes(el.fabric)) luxuryScore += 10;
    });
    luxuryScore = Math.min(100, luxuryScore);

    // Practical score rules: jackets or lots of elements reduce simple sport comfort but increase score
    if (composition.structure.jacket && composition.structure.bag) {
      practicalScore = 90;
    }

    const trendScore = Math.round(
      (trend.seasonTrendScore + trend.luxuryTrendScore + trend.streetTrendScore + trend.colorTrendScore) / 4
    );

    const creativityScore = composition.dominantVibe === 'Cyberpunk' || composition.dominantVibe === 'Elegant' ? 95 : 75;

    const overallFashionScore = Math.round(
      (harmonyScore * 0.25) + (luxuryScore * 0.15) + (creativityScore * 0.20) + (wearabilityScore * 0.20) + (trendScore * 0.20)
    );

    return {
      harmonyScore,
      luxuryScore,
      creativityScore,
      practicalScore,
      wearabilityScore,
      trendScore,
      overallFashionScore
    };
  }
}

// ============================================================================
// 11. FASHION CRITIC ENGINE
// ============================================================================

export class FashionCriticEngine {
  public static reviewComposition(
    composition: OutfitComposition,
    harmony: ColorHarmonyReport,
    quality: FashionQualityReport
  ): FashionCriticReport {
    const pros: string[] = [];
    const cons: string[] = [];
    const improvements: string[] = [];
    const luxurySuggestions: string[] = [];
    const budgetAlternatives: string[] = [];

    // Evaluate pros
    if (harmony.harmonyScore > 85) {
      pros.push(`Exemplary color coordination, matching a ${harmony.paletteType} palette configuration flawlessly.`);
    } else {
      pros.push('Stable everyday palette distribution with standard contrast borders.');
    }

    if (quality.luxuryScore > 80) {
      pros.push('Premium material selected, amplifying aesthetic luxury scores and drapery quality.');
    }

    // Evaluate cons
    if (!composition.structure.jacket) {
      cons.push('Absence of layering elements decreases visual depth and dynamic posture definition.');
      improvements.push('Consider integrating a deconstructed blazer or cropped lightweight shell to elevate silhouette dimension.');
    }

    if (harmony.contrastRatio === 'Low') {
      cons.push('Low visual contrast borders may cause garments to blur together into a singular profile.');
      improvements.push('Inject a contrasting high-saturation accessory or pocket square to split color panels.');
    }

    // Curate bespoke lists
    luxurySuggestions.push('Upgrade the top layer to a bespoke Loro Piana heavy cashmere overcoat.');
    luxurySuggestions.push('Substitute baseline watch with a vintage 1970s hand-wound Chronometer.');

    budgetAlternatives.push('Replace silk elements with high-grade premium organic mercerized cotton alternates.');
    budgetAlternatives.push('Select Goodyear welted loafers from specialized boutique manufacturers to preserve luxury posture at 40% budget cost.');

    return {
      pros,
      cons,
      improvements,
      luxurySuggestions,
      budgetAlternatives
    };
  }
}

// ============================================================================
// 12. CENTRALIZED AI FASHION DIRECTOR (The Orchestrator)
// ============================================================================

export class AIFashionDirector {
  public static orchestrateFashionIntelligence(
    userId: string,
    inputs: {
      tags: string[];
      description?: string;
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
      bodyMetrics?: BodyMetricsInput;
      targetOccasion?: OccasionType;
    }
  ): UnifiedFashionDirectorOutput {
    // 1. Analyze DNA
    const dnaScores = FashionDNAEngine.analyzeDNA(inputs.tags, inputs.description);
    const dominantVibe = dnaScores[0]?.category || 'Minimalist';

    // 2. Draft composite garments
    const curatedGarments: GarmentNode[] = [
      { id: 'sc_1', type: 'Shirt', name: `Premium ${dominantVibe} Draped Shirt`, vibe: dominantVibe, colors: [inputs.primaryColor || 'Charcoal'], fabric: 'Cotton' },
      { id: 'sc_2', type: 'Pant', name: `Tailored ${dominantVibe} Trousers`, vibe: dominantVibe, colors: [inputs.secondaryColor || 'Black'], fabric: 'Linen' }
    ];

    if (dominantVibe === 'Luxury' || dominantVibe === 'Elegant' || dominantVibe === 'Business') {
      curatedGarments.push({ id: 'sc_3', type: 'Jacket', name: 'Bespoke Structural Lapel Blazer', vibe: dominantVibe, colors: [inputs.primaryColor || 'Charcoal'], fabric: 'Wool' });
    }

    const composition = OutfitCompositionEngine.createComposition(dominantVibe, curatedGarments);

    // 3. Color Harmony
    const harmony = ColorHarmonyEngine.evaluateHarmony(
      inputs.primaryColor || 'Charcoal',
      inputs.secondaryColor || 'Black',
      inputs.accentColor || 'Silver'
    );

    // 4. Occasion Suitability
    const suitability = OccasionIntelligenceEngine.evaluateOccasionSuitability(dominantVibe, dnaScores);

    // 5. Body Compatibility
    const standardMetrics: BodyMetricsInput = inputs.bodyMetrics || {
      heightCm: 175,
      bodyType: 'Mesomorph',
      bodyShape: 'Rectangle',
      skinTone: 'Warm Beige',
      faceShape: 'Oval'
    };
    const compatibility = BodyCompatibilityEngine.evaluateCompatibility(standardMetrics, dominantVibe);

    // 6. Trend Weights
    const trend = TrendIntelligenceEngine.evaluateTrendWeights(dominantVibe, harmony.curatedTheme);

    // 7. Overall quality evaluation
    const quality = FashionQualityEngine.evaluateQuality(composition, harmony, trend);

    // 8. Critic review
    const critic = FashionCriticEngine.reviewComposition(composition, harmony, quality);

    return {
      composition,
      harmony,
      quality,
      critic,
      dna: dnaScores,
      suitability,
      compatibility
    };
  }
}
