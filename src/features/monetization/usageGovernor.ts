import { SubscriptionEngine } from './subscriptionEngine';

export interface UsageReport {
  monthlyQuotaAllocated: number;
  monthlyQuotaUsed: number;
  remainingPercentage: number;
  isGovernorActive: boolean;
  warningsRaised: string[];
}

export class UsageGovernor {
  private static mockUsedCount = 18;

  static checkUsageStats(): UsageReport {
    const sub = SubscriptionEngine.getActiveSubscription();
    const warns: string[] = [];
    
    const remainingFraction = Math.max(0, (sub.maxCredits - this.mockUsedCount) / sub.maxCredits);
    
    if (remainingFraction < 0.2) {
      warns.push("Usage exceeds 80% of your current tier. Upgrade to Pro/Creator to avoid throttling.");
    }

    return {
      monthlyQuotaAllocated: sub.maxCredits,
      monthlyQuotaUsed: this.mockUsedCount,
      remainingPercentage: Math.round(remainingFraction * 100),
      isGovernorActive: this.mockUsedCount >= sub.maxCredits,
      warningsRaised: warns
    };
  }

  static incrementUsage() {
    this.mockUsedCount += 1;
  }
}
