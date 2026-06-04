import { ClothingCategory } from '../../types';

export interface GarmentClassification {
  category: ClothingCategory;
  formality: 'Casual' | 'Semi-formal' | 'Formal';
  styleTags: string[];
  materialGuess: string;
  confidence: number;
}

export class GarmentClassifier {
  private static categoryKeywords: Record<ClothingCategory, string[]> = {
    Outerwear: ['jacket', 'coat', 'trench', 'blazer', 'parka', 'shearling', 'windbreaker', 'cardigan', 'anorak'],
    Formal: ['suit', 'tuxedo', 'dress shirt', 'blazer', 'trousers', 'gown', 'evening dress', 'tie'],
    Sportswear: ['hoodie', 'activewear', 'gym', 'joggers', 'tracksuit', 'shorts', 'running', 'breathable', 'performance'],
    Casual: ['t-shirt', 'jean', 'denim', 'shirt', 'sweater', 'chinos', 'cardigan', 'skirt', 'blouse', 'pants', 'polo'],
    Accessories: ['beanie', 'sunglasses', 'glasses', 'watch', 'belt', 'scarf', 'hat', 'cap', 'bag', 'socks', 'gloves', 'jewelry', 'shoes', 'boots', 'sneakers']
  };

  /**
   * Performs quick deterministic heuristic classification on text keywords as a backup classifier.
   */
  static classifyByKeywords(text: string): GarmentClassification {
    const normalized = text.toLowerCase();
    let bestCategory: ClothingCategory = 'Casual';
    let maxMatches = 0;

    for (const [cat, keywords] of Object.entries(this.categoryKeywords)) {
      let matches = 0;
      for (const keyword of keywords) {
        if (normalized.includes(keyword)) {
          matches++;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestCategory = cat as ClothingCategory;
      }
    }

    // Default formality guesses
    let formality: 'Casual' | 'Semi-formal' | 'Formal' = 'Casual';
    if (bestCategory === 'Formal') {
      formality = 'Formal';
    } else if (bestCategory === 'Outerwear' || normalized.includes('button') || normalized.includes('chinos') || normalized.includes('knit')) {
      formality = 'Semi-formal';
    }

    // Guessed materials
    let materialGuess = 'Cotton Blend';
    if (normalized.includes('wool') || normalized.includes('shearling') || normalized.includes('trench')) {
      materialGuess = 'Wool / Cashmere Blend';
    } else if (normalized.includes('leather') || normalized.includes('acetate')) {
      materialGuess = 'Premium Synthetics / Leather';
    } else if (normalized.includes('gore') || normalized.includes('poly') || normalized.includes('technical')) {
      materialGuess = 'Technical Polyester / GoreTex';
    } else if (normalized.includes('cotton') || normalized.includes('loopback')) {
      materialGuess = '100% Organic Loopback Cotton';
    }

    const styleTags: string[] = [];
    if (bestCategory === 'Formal') styleTags.push('Tailored', 'Smart-Classic');
    if (bestCategory === 'Sportswear') styleTags.push('Athleisure', 'Active comfort');
    if (bestCategory === 'Outerwear') styleTags.push('Structured Layering', 'Weather resistant');
    if (bestCategory === 'Casual') styleTags.push('Daily Essential', 'Comfort styling');
    if (bestCategory === 'Accessories') styleTags.push('Statement accent', 'Finishing detail');

    return {
      category: bestCategory,
      formality,
      styleTags: styleTags.length > 0 ? styleTags : ['Contemporary'],
      materialGuess,
      confidence: maxMatches > 0 ? 0.85 : 0.60
    };
  }
}
