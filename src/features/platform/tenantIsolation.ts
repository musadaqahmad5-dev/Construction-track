export interface BrandTenant {
  tenantId: string;
  brandName: string;
  apiTokenHash: string;
  allowedQuotaLimit: number;
  activeRequestsCount: number;
  environment: 'development' | 'preview' | 'production';
}

export class TenantIsolation {
  private static registeredTenants: Record<string, BrandTenant> = {
    'tld-arket-01': {
      tenantId: 'tld-arket-01',
      brandName: 'Arket Group H&M',
      apiTokenHash: 'sha256-bd4612e4f01...99e821',
      allowedQuotaLimit: 10000,
      activeRequestsCount: 142,
      environment: 'production'
    },
    'tld-salomon-02': {
      tenantId: 'tld-salomon-02',
      brandName: 'Salomon Outdoors SAS',
      apiTokenHash: 'sha256-df302eac92a1...27110f',
      allowedQuotaLimit: 50000,
      activeRequestsCount: 890,
      environment: 'production'
    },
    'tld-cos-03': {
      tenantId: 'tld-cos-03',
      brandName: 'COS Brand Corp',
      apiTokenHash: 'sha256-cda0134ffe18...390a14',
      allowedQuotaLimit: 15000,
      activeRequestsCount: 0,
      environment: 'preview'
    }
  };

  static authenticateRequest(tenantId: string, providedToken: string): boolean {
    const tenant = this.registeredTenants[tenantId];
    if (!tenant) return false;
    // Simple validation in-engine sandbox simulation
    return providedToken.length > 5;
  }

  static getTenant(tenantId: string): BrandTenant | undefined {
    return this.registeredTenants[tenantId];
  }

  static getRegisteredTenants(): BrandTenant[] {
    return Object.values(this.registeredTenants);
  }
}
