import { WardrobeItem } from '../../types';

export class RotationEngine {
  /**
   * Sorts closet items by wearCount ascending and lastUsed oldest to isolate underused assets.
   */
  static getUnderusedItems(wardrobe: WardrobeItem[], filterCategory?: string): WardrobeItem[] {
    let list = [...wardrobe];
    if (filterCategory) {
      list = list.filter(item => item.category === filterCategory);
    }

    return list.sort((a, b) => {
      const wearA = a.wearCount || 0;
      const wearB = b.wearCount || 0;
      if (wearA !== wearB) return wearA - wearB;

      // Oldest lastUsed date first
      if (!a.lastUsed) return -1;
      if (!b.lastUsed) return 1;
      return new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime();
    });
  }

  /**
   * Isolates an outstanding alternative piece of the same clothing category to replace a repetitive look.
   */
  static getOptimalRotationAlternative(
    wardrobe: WardrobeItem[],
    category: WardrobeItem['category'],
    activeExcludes: string[]
  ): WardrobeItem | undefined {
    const freshAlternatives = this.getUnderusedItems(wardrobe, category)
      .filter(item => !activeExcludes.includes(item.id) && item.status === 'In Closet');

    return freshAlternatives[0];
  }

  /**
   * Compiles a variety index rating representing the health of overall rotation.
   */
  static runRotationAudit(wardrobe: WardrobeItem[]) {
    if (wardrobe.length === 0) return { score: 100, status: 'Healthy' };

    const totalWears = wardrobe.reduce((acc, curr) => acc + (curr.wearCount || 0), 0);
    const avgWearsPerItem = totalWears / wardrobe.length;

    // Detect variance
    let combinedVarianceSum = 0;
    wardrobe.forEach(item => {
      combinedVarianceSum += Math.pow((item.wearCount || 0) - avgWearsPerItem, 2);
    });

    const standardDev = Math.sqrt(combinedVarianceSum / wardrobe.length);
    const score = Math.max(10, Math.min(100, Math.round(100 - (standardDev * 10))));

    return {
      score,
      status: score > 70 ? 'Optimal Rotation' : (score > 40 ? 'Moderate Variance' : 'Skewed Usage Fatigue')
    };
  }
}
