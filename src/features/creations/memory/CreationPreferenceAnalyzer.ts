import { FashionCreation } from '../CreationTypes';

export interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
}

export interface ColorPreference {
  hex: string;
  count: number;
  label: string;
}

export interface FabricPreference {
  fabric: string;
  count: number;
  percentage: number;
}

export interface SilhouettePreference {
  silhouette: string;
  count: number;
}

export interface CreationPreferencesAnalysis {
  topCategories: CategoryDistribution[];
  dominantColors: ColorPreference[];
  preferredFabrics: FabricPreference[];
  preferredSilhouettes: SilhouettePreference[];
  averageLuxuryIntensity: number;
  averageModernityRatio: number;
  designConsistencyScore: number;
  creativeIdentityScore: number;
  dominantTheme: string;
  totalCreationsAnalyzed: number;
}

const COLOR_NAMES: Record<string, string> = {
  '#05050A': 'Obsidian Dark',
  '#09090D': 'Midnight Noir',
  '#1C1C28': 'Deep Charcoal',
  '#8B5CF6': 'Electric Violet',
  '#D4AF37': 'Champagne Gold',
  '#22C55E': 'Emerald Accent',
  '#3B82F6': 'Sapphire Blue',
  '#F43F5E': 'Crimson Luxury',
  '#A1A1AA': 'Sterling Silver',
  '#FAFAFA': 'Pure Pearl White'
};

export function analyzeCreationPreferences(creations: FashionCreation[]): CreationPreferencesAnalysis {
  if (!creations || creations.length === 0) {
    return {
      topCategories: [
        { category: 'Outfit', count: 1, percentage: 50 },
        { category: 'Jacket', count: 1, percentage: 50 }
      ],
      dominantColors: [
        { hex: '#05050A', count: 2, label: 'Obsidian Dark' },
        { hex: '#8B5CF6', count: 2, label: 'Electric Violet' },
        { hex: '#D4AF37', count: 1, label: 'Champagne Gold' }
      ],
      preferredFabrics: [
        { fabric: 'Italian Mulberry Silk & Cashmere', count: 2, percentage: 60 },
        { fabric: 'Technical Liquid Metallic Nylon', count: 1, percentage: 40 }
      ],
      preferredSilhouettes: [
        { silhouette: 'Architectural Tailored Structured', count: 2 }
      ],
      averageLuxuryIntensity: 92,
      averageModernityRatio: 78,
      designConsistencyScore: 94,
      creativeIdentityScore: 91,
      dominantTheme: 'Architectural Quiet Luxury',
      totalCreationsAnalyzed: 0
    };
  }

  const categoryMap: Record<string, number> = {};
  const colorMap: Record<string, number> = {};
  const fabricMap: Record<string, number> = {};
  const silhouetteMap: Record<string, number> = {};

  let totalLuxury = 0;
  let totalModernity = 0;

  creations.forEach(c => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;

    (c.colorPalette || []).forEach(hex => {
      colorMap[hex] = (colorMap[hex] || 0) + 1;
    });

    if (c.fabric) {
      fabricMap[c.fabric] = (fabricMap[c.fabric] || 0) + 1;
    }

    if (c.silhouette) {
      silhouetteMap[c.silhouette] = (silhouetteMap[c.silhouette] || 0) + 1;
    }

    totalLuxury += c.luxuryIntensity || 85;
    totalModernity += c.modernVsClassic || 70;
  });

  const total = creations.length;

  const topCategories: CategoryDistribution[] = Object.entries(categoryMap)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  const dominantColors: ColorPreference[] = Object.entries(colorMap)
    .map(([hex, count]) => ({
      hex,
      count,
      label: COLOR_NAMES[hex.toUpperCase()] || COLOR_NAMES[hex] || hex
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const preferredFabrics: FabricPreference[] = Object.entries(fabricMap)
    .map(([fabric, count]) => ({
      fabric,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  const preferredSilhouettes: SilhouettePreference[] = Object.entries(silhouetteMap)
    .map(([silhouette, count]) => ({ silhouette, count }))
    .sort((a, b) => b.count - a.count);

  const avgLuxury = Math.round(totalLuxury / total);
  const avgModernity = Math.round(totalModernity / total);

  // Consistency & Identity Score
  const topCategoryShare = topCategories[0]?.percentage || 50;
  const designConsistencyScore = Math.min(98, Math.max(70, Math.round(topCategoryShare * 0.6 + 40)));
  const creativeIdentityScore = Math.min(99, Math.round((avgLuxury + avgModernity + designConsistencyScore) / 3));

  let dominantTheme = 'Avant-Garde Architectural';
  if (avgLuxury > 88 && avgModernity < 60) dominantTheme = 'Heritage Bespoke Couture';
  else if (avgLuxury > 85 && avgModernity > 75) dominantTheme = 'Cyberpunk Haute Luxury';
  else if (avgModernity > 80) dominantTheme = 'Futuristic Modular Minimalist';

  return {
    topCategories,
    dominantColors,
    preferredFabrics,
    preferredSilhouettes,
    averageLuxuryIntensity: avgLuxury,
    averageModernityRatio: avgModernity,
    designConsistencyScore,
    creativeIdentityScore,
    dominantTheme,
    totalCreationsAnalyzed: total
  };
}
