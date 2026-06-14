import { WardrobeItem } from '../../types';

export interface PackingListResult {
  luggageTypeRecommended: 'Compact Carry-on' | 'Medium Checked Bag' | 'Heavy Expedition Case';
  totalItemsCount: number;
  estimatedWeightKg: number;
  packingChecklist: {
    item: WardrobeItem;
    packed: boolean;
    priority: 'vital' | 'optional';
  }[];
  layeringStrategyAdvised: string;
}

export class PackingAssistant {
  /**
   * Translates outfit lists into precise suitcase packing blueprints.
   */
  static compileChecklist(items: WardrobeItem[]): PackingListResult {
    const packingChecklist = items.map(item => {
      const isVital = (item.category as string) === 'Casual' || (item.category as string) === 'Formal' || (item.category as string) === 'Pants';
      return {
        item,
        packed: false,
        priority: (isVital ? 'vital' : 'optional') as any
      };
    });

    const totalItemsCount = items.length;
    
    // Assign weight multipliers: 0.8kg for jackets, 0.4kg for shirts, 0.5kg for pants
    let estimatedWeightKg = 0;
    items.forEach(item => {
      const cat = item.category.toLowerCase();
      if (cat === 'outerwear') {
        estimatedWeightKg += 1.2;
      } else if (cat.includes('pant') || cat.includes('jeans')) {
        estimatedWeightKg += 0.6;
      } else {
        estimatedWeightKg += 0.3;
      }
    });

    // Add general baggage weight buffer
    estimatedWeightKg = parseFloat((estimatedWeightKg + 0.5).toFixed(1));

    let luggageTypeRecommended: PackingListResult['luggageTypeRecommended'] = 'Compact Carry-on';
    if (totalItemsCount > 10 || estimatedWeightKg > 8) {
      luggageTypeRecommended = 'Heavy Expedition Case';
    } else if (totalItemsCount > 4 || estimatedWeightKg > 4) {
      luggageTypeRecommended = 'Medium Checked Bag';
    }

    const hasOuter = items.some(item => item.category === 'Outerwear');
    const layeringStrategyAdvised = hasOuter 
      ? 'Aviation Hack: Wear your heaviest outerwear jacket directly on the plane to save 1.5kg bag weight.'
      : 'Ranger Roll Method: Roll cotton shirts and bottoms tightly to minimize travel crease damage and maximize cabin luggage space.';

    return {
      luggageTypeRecommended,
      totalItemsCount,
      estimatedWeightKg,
      packingChecklist,
      layeringStrategyAdvised
    };
  }
}
