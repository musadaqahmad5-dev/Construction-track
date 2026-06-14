import { TrendItem } from '../trend-engine/trendIntelligence';

export type TrendSourceMode = 'manual' | 'cached' | 'api' | 'offline';

export class TrendProvider {
  private static activeMode: TrendSourceMode = 'offline';
  private static cachedTrends: TrendItem[] = [];

  static setMode(mode: TrendSourceMode) {
    this.activeMode = mode;
  }

  static getActiveMode(): TrendSourceMode {
    return this.activeMode;
  }

  /**
   * Fetches trend information from the designated source.
   */
  static async fetchLatestTrends(region: string = 'Global'): Promise<TrendItem[]> {
    console.log(`[TrendProvider] Sourcing trends from mode: [${this.activeMode}] for Region: [${region}]`);

    switch (this.activeMode) {
      case 'manual':
        return [
          { topic: 'Fluid Soft Outer Shells', searchVolume: '88k', growthRate: '+142%', aestheticVibe: 'minimalist', regionalPeak: 'Copenhagen' },
          { topic: 'Heavy Metal Cargo Hardware', searchVolume: '104k', growthRate: '+89%', aestheticVibe: 'cyberpunk', regionalPeak: 'Tokyo' }
        ];

      case 'cached':
        if (this.cachedTrends.length > 0) {
          return this.cachedTrends;
        }
        // Fallback to offline if cache empty
        return this.getOfflineHardcodedTrends(region);

      case 'api':
        try {
          // Represent active API pipeline response simulating latest metrics
          const apiMockData: TrendItem[] = [
            { topic: 'Scandi Soft Minimalism Wool', searchVolume: '142k', growthRate: '+240%', aestheticVibe: 'minimalist', regionalPeak: 'Stockholm' },
            { topic: 'Cyberwear Waterproof Shell Jackets', searchVolume: '94k', growthRate: '+180%', aestheticVibe: 'cyberpunk', regionalPeak: 'Seoul' },
            { topic: 'Savile Row Tailored Double-Breasted Blazers', searchVolume: '110k', growthRate: '+85%', aestheticVibe: 'classic', regionalPeak: 'London' },
            { topic: 'Oversized Distressed Knitwear', searchVolume: '230k', growthRate: '+115%', aestheticVibe: 'streetwear', regionalPeak: 'New York' }
          ];
          this.cachedTrends = apiMockData;
          return apiMockData;
        } catch (e) {
          console.error('[TrendProvider] Api mode fetch failure. Triggering offline fallback.');
          return this.getOfflineHardcodedTrends(region);
        }

      case 'offline':
      default:
        return this.getOfflineHardcodedTrends(region);
    }
  }

  private static getOfflineHardcodedTrends(region: string): TrendItem[] {
    const list: TrendItem[] = [
      { topic: 'Ultra-Comfort Merino Heavy Knits', searchVolume: '120k', growthRate: '+92%', aestheticVibe: 'luxury', regionalPeak: 'Milan' },
      { topic: 'Loose Indigo Worker Pants', searchVolume: '80k', growthRate: '+54%', aestheticVibe: 'streetwear', regionalPeak: 'Osaka' },
      { topic: 'Raw Tech-Shield Windbreakers', searchVolume: '105k', growthRate: '+76%', aestheticVibe: 'cyberpunk', regionalPeak: 'Berlin' },
      { topic: 'Linen Pleated Drape Trousers', searchVolume: '95k', growthRate: '+110%', aestheticVibe: 'minimalist', regionalPeak: 'Paris' }
    ];

    if (region === 'Asia') {
      return [list[1], list[2]];
    }
    if (region === 'Europe') {
      return [list[0], list[3]];
    }
    
    return list;
  }
}
