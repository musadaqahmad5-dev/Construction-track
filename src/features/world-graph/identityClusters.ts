export interface IdentityCluster {
  clusterId: string;
  name: string;
  archetype: string;
  demographicFocus: string;
  averageSpentBasket: number;
  representedStyles: string[];
}

export class IdentityClusters {
  private static userClusters: IdentityCluster[] = [
    {
      clusterId: 'cl-01',
      name: 'Architectural Minimalist Elite',
      archetype: 'Designers & Developers',
      demographicFocus: 'Global Metro Areas (Tokyo, Copenhagen, Berlin)',
      averageSpentBasket: 450,
      representedStyles: ['Minimalistize', 'Monochrome Earth']
    },
    {
      clusterId: 'cl-02',
      name: 'Stealth Tactical Nomads',
      archetype: 'Ventuers & Urban Commuters',
      demographicFocus: 'High Precipitation Regions (Seattle, London, Vancouver)',
      averageSpentBasket: 680,
      representedStyles: ['Cyberpunk', 'Gorpcore']
    }
  ];

  static scanActiveClusters(): IdentityCluster[] {
    return this.userClusters;
  }
}
