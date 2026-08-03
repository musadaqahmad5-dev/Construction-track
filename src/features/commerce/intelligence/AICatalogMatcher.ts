import { FashionCreation } from '../../creations/CreationTypes';

export interface CatalogItem {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
  styleDNA: string[];
  fabric: string;
  colorPalette: string[];
  occasion: string;
  rating: number;
  salesCount: number;
  isCustomTailored?: boolean;
}

export interface WardrobeGapMatch {
  gapCategory: string;
  importanceScore: number; // 0 - 100
  recommendedItem: CatalogItem;
  compatibilityScore: number; // 0 - 100
  styleDNAMatch: number;
  colorHarmonyScore: number;
  reasoning: string;
}

export interface MatchEvaluationResult {
  overallCompatibility: number;
  styleDNAMatchScore: number;
  colorHarmonyScore: number;
  fabricSuitabilityScore: number;
  occasionMatchScore: number;
  wardrobeGapImportance: number;
  matchReasoning: string[];
}

export function evaluateCatalogItemMatch(
  item: CatalogItem,
  userStyleDNA: string[] = ['Minimalist', 'Architectural', 'Monochrome'],
  userColorPalette: string[] = ['#05050A', '#1C1C28', '#8B5CF6'],
  userWardrobeCategories: string[] = ['T-Shirt', 'Denim']
): MatchEvaluationResult {
  // 1. Style DNA match
  const matchedDNA = item.styleDNA.filter(dna => 
    userStyleDNA.some(uDna => uDna.toLowerCase().includes(dna.toLowerCase()) || dna.toLowerCase().includes(uDna.toLowerCase()))
  ).length;
  const styleDNAMatchScore = Math.min(99, Math.max(65, 70 + matchedDNA * 12));

  // 2. Color harmony
  const sharedColors = item.colorPalette.filter(c => userColorPalette.includes(c)).length;
  const colorHarmonyScore = Math.min(98, Math.max(60, 75 + sharedColors * 10));

  // 3. Fabric suitability
  const isPremiumFabric = item.fabric.toLowerCase().includes('silk') || 
    item.fabric.toLowerCase().includes('cashmere') || 
    item.fabric.toLowerCase().includes('leather') || 
    item.fabric.toLowerCase().includes('metallic');
  const fabricSuitabilityScore = isPremiumFabric ? 94 : 82;

  // 4. Occasion match
  const occasionMatchScore = 88;

  // 5. Wardrobe gap importance
  const isMissingCategory = !userWardrobeCategories.includes(item.category);
  const wardrobeGapImportance = isMissingCategory ? 92 : 55;

  // Overall weighted score
  const overallCompatibility = Math.round(
    (styleDNAMatchScore * 0.35) + 
    (colorHarmonyScore * 0.25) + 
    (fabricSuitabilityScore * 0.15) + 
    (wardrobeGapImportance * 0.25)
  );

  const matchReasoning = [
    `Style DNA overlap: +${styleDNAMatchScore}% alignment with your ${userStyleDNA.slice(0, 2).join(' & ')} aesthetic.`,
    isMissingCategory 
      ? `Critical Wardrobe Gap: User closet currently lacks high-tier ${item.category} outerwear.` 
      : `Complements existing closet items in ${item.category}.`,
    `Tonal Harmony: Shares key neutrals with your preferred palette.`
  ];

  return {
    overallCompatibility,
    styleDNAMatchScore,
    colorHarmonyScore,
    fabricSuitabilityScore,
    occasionMatchScore,
    wardrobeGapImportance,
    matchReasoning
  };
}

export function matchWardrobeGaps(
  catalogItems: CatalogItem[],
  userStyleDNA: string[] = ['Minimalist', 'Architectural'],
  userWardrobeCategories: string[] = ['T-Shirt', 'Sneakers']
): WardrobeGapMatch[] {
  const gapCategories = ['Jacket', 'Couture Dress', 'Tailored Outerwear', 'Luxury Footwear'].filter(
    cat => !userWardrobeCategories.includes(cat)
  );

  return gapCategories.map((gapCat, idx) => {
    const candidates = catalogItems.filter(i => i.category.toLowerCase().includes(gapCat.toLowerCase()) || gapCat.toLowerCase().includes(i.category.toLowerCase()));
    const bestItem = candidates[0] || catalogItems[idx % catalogItems.length];

    const evalResult = evaluateCatalogItemMatch(bestItem, userStyleDNA, ['#05050A', '#8B5CF6'], userWardrobeCategories);

    return {
      gapCategory: gapCat,
      importanceScore: 85 + idx * 4,
      recommendedItem: bestItem,
      compatibilityScore: evalResult.overallCompatibility,
      styleDNAMatch: evalResult.styleDNAMatchScore,
      colorHarmonyScore: evalResult.colorHarmonyScore,
      reasoning: evalResult.matchReasoning[0]
    };
  });
}
