export interface TrendingHashtag {
  tag: string;
  count: number;
  trendingTier: 'Breakout' | 'High Growth' | 'Sustained';
  deltaPercentage: number;
}

export class TrendFeed {
  private static trends: TrendingHashtag[] = [
    { tag: 'SartorialRetro', count: 4890, trendingTier: 'Breakout', deltaPercentage: 114 },
    { tag: 'GoretexStealth', count: 12400, trendingTier: 'High Growth', deltaPercentage: 45 },
    { tag: 'StockholmMinimal', count: 18200, trendingTier: 'Sustained', deltaPercentage: 12 },
    { tag: 'CashmereShield', count: 2310, trendingTier: 'Breakout', deltaPercentage: 88 }
  ];

  static getTrendingHashtags(): TrendingHashtag[] {
    return this.trends;
  }
}
