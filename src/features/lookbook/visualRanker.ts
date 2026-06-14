import { WardrobeItem } from '../../types';

export interface VisualScoreResult {
  visualComboScore: number; // 0 to 100 representing harmony and proportion
  colorContrastRating: 'High Contrast' | 'Monochromatic Sophistication' | 'Balanced Palette' | 'Low Contrast Clutter';
  compositionClarity_percent: number;
  aestheticNotes: string[];
}

export class VisualRanker {
  /**
   * Computes layout synergy scores using balance and chromatic pairing metrics.
   */
  static rankVisualComposition(items: WardrobeItem[]): VisualScoreResult {
    const notes: string[] = [];

    if (items.length === 0) {
      return {
        visualComboScore: 0,
        colorContrastRating: 'Low Contrast Clutter',
        compositionClarity_percent: 0,
        aestheticNotes: ['No items found to compute synergy.']
      };
    }

    // Color counting & matching
    const colors = items.map(i => (i.primaryColor || '').trim().toLowerCase()).filter(Boolean);
    const uniqueColors = new Set(colors);

    let contrastRank: VisualScoreResult['colorContrastRating'] = 'Balanced Palette';
    let colorBonus = 0;

    if (uniqueColors.size === 1) {
      contrastRank = 'Monochromatic Sophistication';
      colorBonus = 12;
      notes.push("Clean monochrome layout. Elevated elegance through shade unification.");
    } else if (uniqueColors.size === 2) {
      contrastRank = 'High Contrast';
      colorBonus = 15;
      notes.push("High contrast dual-tone matching. Highly structured focus segments.");
    } else if (uniqueColors.size >= 4) {
      contrastRank = 'Low Contrast Clutter';
      colorBonus = -10;
      notes.push("Color over-saturation warning. Too many competing chromatic accents.");
    } else {
      contrastRank = 'Balanced Palette';
      colorBonus = 8;
      notes.push("Standard palette harmony. Good color balance across categories.");
    }

    // Structure category balance
    const categoriesPresented = new Set(items.map(i => i.category));
    let structureBonus = 20;

    const hasTop = categoriesPresented.has('Casual') || categoriesPresented.has('Formal') || categoriesPresented.has('Sportswear');
    
    // Pants validation helper (treating Pants as standard bottom category)
    let hasBottom = false;
    items.forEach(i => {
      const cat = i.category.toLowerCase();
      if (cat.includes('pant') || cat.includes('jeans') || cat.includes('short') || cat.includes('skirt')) {
        hasBottom = true;
      }
    });

    if (hasTop && hasBottom) {
      structureBonus += 30;
      notes.push("Excellent proportional verticality (Fully coordinated coordinate sets).");
    } else {
      structureBonus -= 20;
      notes.push("Incomplete vertical profile (Suggestion lacks either appropriate tops or pants).");
    }

    // Base composition score calculation
    const baseVal = 50;
    const visualComboScore = Math.max(0, Math.min(100, baseVal + colorBonus + structureBonus));
    const compositionClarity_percent = Math.round(visualComboScore * 0.95);

    return {
      visualComboScore,
      colorContrastRating: contrastRank,
      compositionClarity_percent,
      aestheticNotes: notes
    };
  }
}
