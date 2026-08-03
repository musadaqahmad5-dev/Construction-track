import { CatalogItem, evaluateCatalogItemMatch } from './AICatalogMatcher';

export interface ARIAShoppingRecommendationRequest {
  userQuery?: string;
  userStyleDNA?: string[];
  userPreferredColors?: string[];
  userWardrobeCategories?: string[];
  maxPriceBudget?: number;
}

export interface RankedRecommendationItem {
  item: CatalogItem;
  overallScore: number; // 0 - 100
  fitScore: number;
  compatibilityScore: number;
  trendScore: number;
  creatorQualityScore: number;
  ariaRecommendationNote: string;
  wardrobeGapFilled: boolean;
}

export interface ARIAShoppingIntelligenceResponse {
  queryInterpretation: string;
  wardrobeContextNote: string;
  recommendations: RankedRecommendationItem[];
  topCategoriesToExplore: string[];
}

export function generateARIAMarketplaceRecommendations(
  catalog: CatalogItem[],
  request: ARIAShoppingRecommendationRequest
): ARIAShoppingIntelligenceResponse {
  const userDNA = request.userStyleDNA || ['Architectural', 'Quiet Luxury', 'Monochrome'];
  const userColors = request.userPreferredColors || ['#05050A', '#8B5CF6', '#D4AF37'];
  const userCategories = request.userWardrobeCategories || ['T-Shirt', 'Denim'];
  const query = (request.userQuery || '').toLowerCase();

  // Filter catalog based on query if present
  let filteredCatalog = catalog;
  if (query) {
    filteredCatalog = catalog.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.styleDNA.some(s => s.toLowerCase().includes(query)) ||
      item.fabric.toLowerCase().includes(query)
    );

    if (filteredCatalog.length === 0) {
      filteredCatalog = catalog; // Fallback to all items if query is too specific
    }
  }

  const ranked: RankedRecommendationItem[] = filteredCatalog.map(item => {
    const evalResult = evaluateCatalogItemMatch(item, userDNA, userColors, userCategories);

    const fitScore = item.isCustomTailored ? 98 : 88;
    const trendScore = item.salesCount > 30 ? 94 : 85;
    const creatorQualityScore = Math.round((item.rating / 5) * 100);

    const overallScore = Math.round(
      (evalResult.overallCompatibility * 0.40) +
      (fitScore * 0.20) +
      (trendScore * 0.20) +
      (creatorQualityScore * 0.20)
    );

    const isGap = !userCategories.map(c => c.toLowerCase()).includes(item.category.toLowerCase());

    const note = isGap
      ? `ARIA Analysis: Fills key ${item.category} gap with +${evalResult.styleDNAMatchScore}% Style DNA alignment.`
      : `ARIA Analysis: Harmonizes with your existing closet palette and ${item.fabric} preferences.`;

    return {
      item,
      overallScore,
      fitScore,
      compatibilityScore: evalResult.overallCompatibility,
      trendScore,
      creatorQualityScore,
      ariaRecommendationNote: note,
      wardrobeGapFilled: isGap
    };
  }).sort((a, b) => b.overallScore - a.overallScore);

  let wardrobeContextNote = "Your wardrobe contains versatile staples, but lacks structured luxury outerwear.";
  if (query.includes('jacket') || query.includes('formal') || query.includes('outerwear')) {
    wardrobeContextNote = "Your wardrobe currently lacks structured formal outerwear. These curated creator pieces match your architectural style DNA.";
  }

  return {
    queryInterpretation: query 
      ? `Targeted Search: "${request.userQuery}" matched with ARIA Wardrobe Intelligence.`
      : 'Automated Style Synergy: High-affinity creator recommendations based on your active Style DNA.',
    wardrobeContextNote,
    recommendations: ranked.slice(0, 6),
    topCategoriesToExplore: ['Tailored Outerwear', 'Bespoke Jackets', 'Silk Couture', 'Liquid Footwear']
  };
}
