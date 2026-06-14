export interface OccasionDressingRule {
  occasion: string;
  recommendedCategory: 'Casual' | 'Formal' | 'Sportswear' | 'Outerwear' | 'Accessories';
  colorPaletteAdvice: string;
  formalityLevel: 'Minimal' | 'Structured' | 'Strict';
  shoesRecommended: string;
}

export class OccasionResolver {
  private static DRESS_CODES: Record<string, OccasionDressingRule> = {
    'wedding': {
      occasion: 'Wedding Celebration',
      recommendedCategory: 'Formal',
      colorPaletteAdvice: 'Oatmeal Beige, Minimalist White, or deep Navy. Avoid loud graphic contrasts.',
      formalityLevel: 'Strict',
      shoesRecommended: 'Polished calfskin loaders'
    },
    'creative office': {
      occasion: 'Creative Office Workshop',
      recommendedCategory: 'Formal',
      colorPaletteAdvice: 'Charcoal Grays paired with dry sage or modern earth tones.',
      formalityLevel: 'Structured',
      shoesRecommended: 'Suede minimal dress sneakers'
    },
    'workout': {
      occasion: 'Cardio Workout / Jogging',
      recommendedCategory: 'Sportswear',
      colorPaletteAdvice: 'High-contrast White, Silver, or pitch black for functional night visibility.',
      formalityLevel: 'Minimal',
      shoesRecommended: 'Cushioned mesh running trainers'
    },
    'travel': {
      occasion: 'Cross-border Flight & Transit',
      recommendedCategory: 'Outerwear',
      colorPaletteAdvice: 'Oatmeal, heather grey, and loose layer coordinates.',
      formalityLevel: 'Minimal',
      shoesRecommended: 'Slip-on breathable travel knit sneakers'
    }
  };

  /**
   * Resolves a string occasion suffix into full dressing rules.
   */
  static resolveOccasion(occasion: string): OccasionDressingRule {
    const key = Object.keys(this.DRESS_CODES).find(k => occasion.toLowerCase().includes(k));
    if (key) {
      return this.DRESS_CODES[key];
    }

    return {
      occasion,
      recommendedCategory: 'Casual',
      colorPaletteAdvice: 'Balanced combination of neutrals with one accent color.',
      formalityLevel: 'Minimal',
      shoesRecommended: 'Default everyday comfort flats'
    };
  }
}
