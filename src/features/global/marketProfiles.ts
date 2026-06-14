export interface MarketProfileSnapshot {
  marketId: string;
  label: string;
  popularCategories: string[];
  demandIndex: number; // 0-100 indicating active market velocity
  avgOrderValue: number;
}

export class MarketProfiles {
  private static profiles: MarketProfileSnapshot[] = [
    {
      marketId: 'nordics',
      label: 'Scandinavian Peninsula',
      popularCategories: ['Base layers', 'Merino outer coats'],
      demandIndex: 89,
      avgOrderValue: 320
    },
    {
      marketId: 'east-asia',
      label: 'Tokyo-Kyoto Megalopolis',
      popularCategories: ['Asymmetry techwear', 'Asymmetric shell outerwear'],
      demandIndex: 96,
      avgOrderValue: 840
    }
  ];

  static listMarketProfiles(): MarketProfileSnapshot[] {
    return this.profiles;
  }
}
