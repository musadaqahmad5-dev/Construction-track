export interface AccessLimitReport {
  tenantId: string;
  maxRequestsAllowedMinute: number;
  currentRequestsMinute: number;
  rateLimitExceeded: boolean;
  throttleFactor: number; // 0.0 - 1.0 multiplier
}

export class AccessGovernor {
  private static tenantUsageRate: Record<string, number> = {
    'tld-arket-01': 14,
    'tld-salomon-02': 48,
    'tld-cos-03': 0
  };

  static evaluateAccessLimits(tenantId: string): AccessLimitReport {
    const current = this.tenantUsageRate[tenantId] || 0;
    const maxLimit = tenantId === 'tld-salomon-02' ? 500 : 200;
    
    return {
      tenantId,
      maxRequestsAllowedMinute: maxLimit,
      currentRequestsMinute: current,
      rateLimitExceeded: current >= maxLimit,
      throttleFactor: current >= maxLimit * 0.8 ? 0.5 : 1.0
    };
  }

  static trackUsagePulse(tenantId: string): void {
    if (!this.tenantUsageRate[tenantId]) {
      this.tenantUsageRate[tenantId] = 0;
    }
    this.tenantUsageRate[tenantId] += 1;
  }
}
