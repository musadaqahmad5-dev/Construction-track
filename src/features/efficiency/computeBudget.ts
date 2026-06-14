export interface BudgetStats {
  maxMemoryAllocatedBytes: number;
  expectedCostPerRenderUsd: number;
  totalComputedSpendUsd: number;
}

export class ComputeBudget {
  private static accumulatedCostUsd = 0.042; // starting trace cost

  static getBudgetStats(tier: 'free' | 'pro' | 'creator' | 'enterprise'): BudgetStats {
    let maxMemoryAllocatedBytes = 64 * 1024 * 1024; // 64MB for Free
    let expectedCostPerRenderUsd = 0.002;

    switch (tier) {
      case 'free':
        maxMemoryAllocatedBytes = 64 * 1024 * 1024;
        expectedCostPerRenderUsd = 0.002; // Small base models
        break;
      case 'pro':
      case 'creator':
        maxMemoryAllocatedBytes = 256 * 1024 * 1024;
        expectedCostPerRenderUsd = 0.008; // High-precision styling
        break;
      case 'enterprise':
        maxMemoryAllocatedBytes = 1024 * 1024 * 1024;
        expectedCostPerRenderUsd = 0.015; // Complete recursive cluster searches
        break;
    }

    return {
      maxMemoryAllocatedBytes,
      expectedCostPerRenderUsd,
      totalComputedSpendUsd: parseFloat(this.accumulatedCostUsd.toFixed(4))
    };
  }

  static recordComputeUsage(cost: number) {
    this.accumulatedCostUsd += cost;
  }
}
