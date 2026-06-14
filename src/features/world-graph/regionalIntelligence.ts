export interface RegionalTrend {
  regionCode: string;
  regionName: string;
  climateVibe: string;
  dominantStyle: string;
  trendVelocity: number; // rate of change
  currencySymbol: string;
}

export class RegionalIntelligence {
  private static regions: RegionalTrend[] = [
    {
      regionCode: 'DK_CPH',
      regionName: 'Copenhagen, Nordics',
      climateVibe: 'Cool, Damp & Windy',
      dominantStyle: 'Earth Tone Wool Tailoring',
      trendVelocity: 1.12,
      currencySymbol: 'DKK'
    },
    {
      regionCode: 'JP_TYO',
      regionName: 'Shibuya, Tokyo',
      climateVibe: 'Temperate Urban High Density',
      dominantStyle: 'Deconstructed Techwear Kimonos',
      trendVelocity: 1.35,
      currencySymbol: 'JPY'
    },
    {
      regionCode: 'UK_LON',
      regionName: 'Soho, London',
      climateVibe: 'Frequent Shower Overcasts',
      dominantStyle: 'Classic Trench & Merino Knit',
      trendVelocity: 1.05,
      currencySymbol: 'GBP'
    }
  ];

  static queryRegionalPulse(): RegionalTrend[] {
    return this.regions;
  }
}
