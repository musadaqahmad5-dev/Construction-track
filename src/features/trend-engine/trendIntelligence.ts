export interface TrendItem {
  id?: string;
  topic: string;
  volumeScore?: number;         // 1 to 100 search/pulse metric
  searchVolume?: string | number; // Added to support search volume metrics used in UI and normalization
  growthRatePercent?: number | string;    // e.g. +145%
  growthRate?: string | number; // Added to support percentage rate metrics used in UI and normalization
  sourceType?: 'GoogleTrends' | 'PinterestAPI' | 'SocialScraper' | 'SimulationModel';
  associatedColors?: string[];
  recommendedCategories?: string[];
  aestheticVibe: string;
  timeframe?: 'weekly' | 'seasonal' | 'microtrend';
  regionalPeak?: string; // Added to support geo-target peaks in trend provider
}

export interface IngestionMetrics {
  totalRequestsIngested: number;
  lastScrapedAt: string;
  activeSourcesCount: number;
}

/**
 * Interface standard for real-world API ingestions (Google Trends / Pinterest Fashion / Instagram Crawling)
 */
export interface ITrendAPIConnector {
  fetchGlobalAestheticVolume(topic: string): Promise<number>;
  fetchTrendingTags(region: string): Promise<string[]>;
}

// Concrete class simulating future real-world integration blocks
export class GoogleTrendsConnector implements ITrendAPIConnector {
  async fetchGlobalAestheticVolume(topic: string): Promise<number> {
    console.log(`[INGESTION] Querying Google Trends index for "${topic}"`);
    // Placeholder representing actual external network fetch structure
    return Math.floor(Math.random() * 30) + 70; 
  }

  async fetchTrendingTags(region: string): Promise<string[]> {
    console.log(`[INGESTION] Inspecting localized fashion keyword matrices in region: ${region}`);
    if (region === 'Asia') return ['Harajuku Denim Oversized', 'Sake-dyed Canvas', 'Cyber Goggles'];
    if (region === 'Europe') return ['Merino Mock Necks', 'Italian Riviera Cottons', 'Quiet Trench Coat'];
    return ['Structured Blazer Coat', 'Recycled Heavyweight Knit', 'Asymmetric Shell Jacket'];
  }
}

export class TrendIntelligence {
  private static apiConnector: ITrendAPIConnector = new GoogleTrendsConnector();
  private static metrics: IngestionMetrics = {
    totalRequestsIngested: 2840,
    lastScrapedAt: new Date().toISOString(),
    activeSourcesCount: 3
  };

  /**
   * Mock of the external data ingestion pipeline.
   * Feeds raw data directly into the system or reads state indicators.
   */
  static getIngestionStatus(): IngestionMetrics {
    return { ...this.metrics };
  }

  /**
   * Resolves currently active global trend boards either using simulation engine rules
   * or proxying with active remote connectors (API Ready).
   */
  static async loadCurrentTrends(region: string): Promise<TrendItem[]> {
    // 1. Simulate data ingestion layer fetching
    this.metrics.totalRequestsIngested += 1;
    this.metrics.lastScrapedAt = new Date().toISOString();

    const ingestedTags = await this.apiConnector.fetchTrendingTags(region);

    // 2. Synthesize models cleanly with explicit identifiers
    return [
      {
        id: 'trend-nordic',
        topic: ingestedTags[2] || 'Scandinavian Minimalist Knitwear',
        volumeScore: 94,
        growthRatePercent: 145,
        sourceType: 'GoogleTrends',
        associatedColors: ['Oatmeal Beige', 'Slate Gray', 'Minimalist White'],
        recommendedCategories: ['Outerwear', 'Casual'],
        aestheticVibe: 'minimalist',
        timeframe: 'weekly'
      },
      {
        id: 'trend-utility',
        topic: ingestedTags[1] || 'Desert Earth-tone Multi-pocket Jackets',
        volumeScore: 88,
        growthRatePercent: 81,
        sourceType: 'PinterestAPI',
        associatedColors: ['Dry Sage', 'Olive Drab', 'Sandstone'],
        recommendedCategories: ['Outerwear', 'Formal'],
        aestheticVibe: 'classic',
        timeframe: 'seasonal'
      },
      {
        id: 'trend-cyber',
        topic: ingestedTags[0] || 'Zero-Gravity High-Performance Shells',
        volumeScore: 85,
        growthRatePercent: 62,
        sourceType: 'SocialScraper',
        associatedColors: ['Pitch Black', 'Obsidian Void', 'Volt Yellow'],
        recommendedCategories: ['Outerwear', 'Sportswear'],
        aestheticVibe: 'streetwear',
        timeframe: 'microtrend'
      }
    ];
  }
}
