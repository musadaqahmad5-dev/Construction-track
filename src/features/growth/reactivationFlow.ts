export interface ReactivationCampaign {
  id: string;
  triggerName: string;
  copytext: string;
  promoCode: string;
  isActive: boolean;
  engagementLiftExpected: number; // percentage
}

export class ReactivationFlow {
  private static campaigns: ReactivationCampaign[] = [
    {
      id: 'react-01',
      triggerName: '7-Day Dna Dormancy Trigger',
      copytext: '"Your Style DNA map is shifting! Re-examine today\'s top 3 Copenhagen trench coats and save 15% on your next box checkout."',
      promoCode: 'DNAREVIVE15',
      isActive: true,
      engagementLiftExpected: 18
    },
    {
      id: 'react-02',
      triggerName: 'Seasonal Stockholm Tailoring Blast',
      copytext: '"Winter drapes are live. Explore Savile cashmere options tailored specifically to your classic/minimalist vectors."',
      promoCode: 'SAVILEWINTER',
      isActive: false,
      engagementLiftExpected: 24
    }
  ];

  static listActiveReactivationEngines(): ReactivationCampaign[] {
    return this.campaigns;
  }
}
