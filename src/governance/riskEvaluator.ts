import { WardrobeItem } from '../types';

export class RiskEvaluator {
  /**
   * Computes a risk score between 0 and 100 based on wardrobe status.
   */
  static evaluatePlatformRisk(wardrobe: WardrobeItem[], extensionCount: number): { score: number; level: 'Low' | 'Medium' | 'Critical'; breakdown: string[] } {
    const breakdown: string[] = [];
    let score = 5; // offset basis

    if (wardrobe.length === 0) {
      score += 30;
      breakdown.push('Wardrobe is empty. Recommendations lack baseline references.');
    }

    const dirtyPercentage = wardrobe.filter(w => w.status === 'Worn/Wash').length / Math.max(1, wardrobe.length);
    if (dirtyPercentage > 0.4) {
      score += 25;
      breakdown.push('Over 40% of standard wardrobe assets are currently soiled.');
    }

    const highWearCount = wardrobe.filter(w => (w.wearCount || 0) > 10).length;
    if (highWearCount > 2) {
      score += 20;
      breakdown.push(`${highWearCount} items display heavy fabric strain (wearCount > 10).`);
    }

    if (extensionCount > 5) {
      score += 15;
      breakdown.push('More than 5 styling modules enabled. Interoperability complexity elevated.');
    }

    const level = score > 60 ? 'Critical' : (score > 30 ? 'Medium' : 'Low');

    return {
      score: Math.min(100, score),
      level,
      breakdown: breakdown.length > 0 ? breakdown : ['All platform operations are clean and nominal.']
    };
  }
}
