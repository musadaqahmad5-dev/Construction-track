import { WardrobeItem } from '../../types';

export interface CoverageGap {
  category: string;
  seasonSuitability: string;
  gapSeverity: 'Low' | 'Medium' | 'High';
  reason: string;
}

export class CoverageAnalyzer {
  /**
   * Compiles deep analyses of missing wardrobe requirements.
   */
  static detectGaps(wardrobe: WardrobeItem[]): CoverageGap[] {
    const gaps: CoverageGap[] = [];

    const categoryCounts = {
      Casual: wardrobe.filter(x => x.category === 'Casual').length,
      Formal: wardrobe.filter(x => x.category === 'Formal').length,
      Sportswear: wardrobe.filter(x => x.category === 'Sportswear').length,
      Outerwear: wardrobe.filter(x => x.category === 'Outerwear').length,
      Accessories: wardrobe.filter(x => x.category === 'Accessories').length
    };

    // Assessment 1: Outerwear protection
    if (categoryCounts.Outerwear === 0) {
      gaps.push({
        category: 'Outerwear',
        seasonSuitability: 'Winter/Autumn',
        gapSeverity: 'High',
        reason: 'Zero high-insulation windcoats or trenchcoats logged. Cold climate protection is vulnerable.'
      });
    }

    // Assessment 2: Formal coordinates
    if (categoryCounts.Formal === 0) {
      gaps.push({
        category: 'Formal',
        seasonSuitability: 'All-Season',
        gapSeverity: 'Medium',
        reason: 'No tailored blazers or trousers found. Professional workplace representation is missing.'
      });
    }

    // Assessment 3: Accessory accentuation
    if (categoryCounts.Accessories < 2) {
      gaps.push({
        category: 'Accessories',
        seasonSuitability: 'All-Season',
        gapSeverity: 'Low',
        reason: 'Less than two accessories detected. Outfit personalization depth could be enhanced with beanies or shades.'
      });
    }

    return gaps;
  }
}
