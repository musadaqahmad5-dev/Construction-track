import { WardrobeItem } from '../../types';

export interface HealthMetric {
  title: string;
  value: string | number;
  status: 'optimal' | 'warning' | 'critical';
  impact: string;
}

export class RotationHealth {
  /**
   * Evaluates the standard deviation or frequency bias of garment wearing.
   */
  static analyzeHealth(wardrobe: WardrobeItem[]): HealthMetric[] {
    if (wardrobe.length === 0) {
      return [{
        title: 'Closet Status',
        value: 'Empty Wardrobe',
        status: 'critical',
        impact: 'Log new items to start rotation audit.'
      }];
    }

    const overusedItems = wardrobe.filter(w => (w.wearCount || 0) >= 8);
    const unusedItems = wardrobe.filter(w => !w.wearCount || w.wearCount === 0);

    const metrics: HealthMetric[] = [
      {
        title: 'Overused Bottlenecks',
        value: `${overusedItems.length} Items`,
        status: overusedItems.length > 2 ? 'warning' : 'optimal',
        impact: overusedItems.length > 2 
          ? 'Fabric strain detected on over-rotated pieces.' 
          : 'Wearing stress levels are safely distributed.'
      },
      {
        title: 'Unused Stagnancy',
        value: `${unusedItems.length} Items`,
        status: unusedItems.length > (wardrobe.length / 2) ? 'warning' : 'optimal',
        impact: unusedItems.length > (wardrobe.length / 2) 
          ? 'High volume of wardrobe capital remains unutilized.' 
          : 'Closet elements show active seasonal participation.'
      }
    ];

    return metrics;
  }
}
