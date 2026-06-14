import { TrendItem } from '../trend-engine/trendIntelligence';

export class TrendNormalizer {
  /**
   * Safe parser to convert string volumes (e.g. '120k') into raw counts
   */
  static parseVolumeNumeric(vol: string): number {
    const raw = vol.toLowerCase().trim();
    if (raw.endsWith('m')) {
      return parseFloat(raw.replace('m', '')) * 1000000;
    }
    if (raw.endsWith('k')) {
      return parseFloat(raw.replace('k', '')) * 1000;
    }
    const num = parseInt(raw, 10);
    return isNaN(num) ? 10000 : num;
  }

  /**
   * Safe parser to convert string percentages (e.g. '+92%') into float rates
   */
  static parseGrowthRate(rate: string): number {
    const cleaned = rate.replace(/[+%]/g, '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 1.0 : parsed / 100;
  }

  /**
   * Normalizes a collection of trend metrics to a relative scoring scale (1 to 100).
   */
  static normalizeTrendScore(trend: TrendItem): number {
    const volume = this.parseVolumeNumeric(String(trend.searchVolume || ''));
    const growth = this.parseGrowthRate(String(trend.growthRate || ''));

    // Calculate a simple aggregate weight
    const rawVal = (volume * 0.0001) + (growth * 50);
    const scaled = Math.round(Math.min(Math.max(rawVal, 40), 100));
    return scaled;
  }
}
