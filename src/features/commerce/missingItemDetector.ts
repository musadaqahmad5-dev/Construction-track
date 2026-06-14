import { WardrobeItem } from '../../types';

export interface DeficitCategory {
  categoryName: string;
  severity: 'high' | 'medium' | 'suggestion';
  rationale: string;
}

export class MissingItemDetector {
  /**
   * Scans outfit elements to identify gaps in wardrobe layers.
   */
  static scanForWardrobeGaps(items: WardrobeItem[], weatherCondition?: string): DeficitCategory[] {
    const gaps: DeficitCategory[] = [];
    const categoriesPresented = new Set(items.map(i => i.category.toLowerCase()));

    // Bottoms categories checker
    const hasBottoms = items.some(i => {
      const cat = i.category.toLowerCase();
      return cat.includes('pant') || cat.includes('jeans') || cat.includes('short') || cat.includes('skirt');
    });

    // Check Tops categories checker
    const hasTops = items.some(i => {
      const cat = i.category.toLowerCase();
      return cat.includes('top') || cat === 'casual' || cat === 'formal' || cat === 'sportswear';
    });

    if (!hasTops) {
      gaps.push({
        categoryName: 'Casual',
        severity: 'high',
        rationale: 'Primary upper segment (Shirt/Blouse/Tee) is absent from this outfit recommendation.'
      });
    }

    if (!hasBottoms) {
      gaps.push({
        categoryName: 'Pants',
        severity: 'high',
        rationale: 'An appropriate bottom coordinate is completely missing.'
      });
    }

    // Outerwear and layering checks based on weather conditions
    const weatherLower = (weatherCondition || '').toLowerCase();
    const isCold = weatherLower.includes('cold') || weatherLower.includes('rain') || weatherLower.includes('snow') || weatherLower.includes('freeze') || weatherLower.includes('breezy');

    const hasOuterwear = categoriesPresented.has('outerwear');
    if (isCold && !hasOuterwear) {
      gaps.push({
        categoryName: 'Outerwear',
        severity: 'high',
        rationale: `Thermal protection. Outdoor conditions recommend full coat layering, but your wardrobe has no Outerwear assigned.`
      });
    }

    // Accessories checks
    const hasAccessories = categoriesPresented.has('accessories');
    if (!hasAccessories) {
      gaps.push({
        categoryName: 'Accessories',
        severity: 'suggestion',
        rationale: 'Elevate visual interest. Accent items like bags or belts frame matching garments beautifully.'
      });
    }

    return gaps;
  }
}
