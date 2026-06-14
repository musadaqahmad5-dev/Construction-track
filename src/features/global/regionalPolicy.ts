export interface TaxPolicy {
  countryCode: string;
  vatRate: number;
  ecoTaxLevy: number; // For green textile mandates
  isExportCompliant: boolean;
  requiredSizingStandard: string;
}

export class RegionalPolicy {
  private static localPolicies: Record<string, TaxPolicy> = {
    'EU': {
      countryCode: 'EU',
      vatRate: 0.21,
      ecoTaxLevy: 4.50, // EUR eco-levy per garment layer
      isExportCompliant: true,
      requiredSizingStandard: 'EU-EN-13402'
    },
    'US': {
      countryCode: 'US',
      vatRate: 0.0825,
      ecoTaxLevy: 0.00,
      isExportCompliant: true,
      requiredSizingStandard: 'ASTM-D5585'
    },
    'JP': {
      countryCode: 'JP',
      vatRate: 0.10,
      ecoTaxLevy: 200, // JPY levy
      isExportCompliant: true,
      requiredSizingStandard: 'JIS L 0101'
    }
  };

  static fetchPolicyForRegion(region: string): TaxPolicy {
    return this.localPolicies[region.toUpperCase()] || this.localPolicies['US'];
  }
}
