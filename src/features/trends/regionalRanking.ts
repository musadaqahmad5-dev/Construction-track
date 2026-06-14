import { TrendItem } from '../trend-engine/trendIntelligence';
import { TrendNormalizer } from './trendNormalizer';

export class RegionalRanking {
  private static regionBiases: Record<string, string[]> = {
    'Global': ['minimalist', 'luxury', 'streetwear', 'classic', 'cyberpunk'],
    'North America': ['streetwear', 'cyberpunk'],
    'Europe': ['luxury', 'minimalist', 'classic'],
    'Asia': ['streetwear', 'cyberpunk', 'traditional'],
  };

  /**
   * Sorts and filters trend items based on regional affinity matching.
   */
  static filterAndRankByRegion(trends: TrendItem[], region: string): TrendItem[] {
    const biases = this.regionBiases[region] || this.regionBiases['Global'];

    const sorted = [...trends].sort((a, b) => {
      const aBias = biases.includes(a.aestheticVibe.toLowerCase()) ? 1.2 : 1.0;
      const bBias = biases.includes(b.aestheticVibe.toLowerCase()) ? 1.2 : 1.0;

      const aNormalized = TrendNormalizer.normalizeTrendScore(a) * aBias;
      const bNormalized = TrendNormalizer.normalizeTrendScore(b) * bBias;

      return bNormalized - aNormalized;
    });

    return sorted;
  }
}
