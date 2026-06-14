export interface CanaryRollout {
  featureKey: string;
  exposurePercentage: number; // 0 to 100
  isEnabled: boolean;
  errorThreshold: number; // Max tolerated error rate (e.g. 0.05)
  activeErrorRate: number;
  rollbackActionTriggered: boolean;
}

let canaryRecords: CanaryRollout[] = [
  {
    featureKey: 'feature-neural-explainability',
    exposurePercentage: 10,
    isEnabled: true,
    errorThreshold: 0.03,
    activeErrorRate: 0.005,
    rollbackActionTriggered: false
  },
  {
    featureKey: 'feature-instant-budget-renderer',
    exposurePercentage: 50,
    isEnabled: true,
    errorThreshold: 0.05,
    activeErrorRate: 0.075, // Spiked error rate
    rollbackActionTriggered: true // Automatically rolled back
  }
];

export const getCanariesState = (): CanaryRollout[] => {
  return canaryRecords;
};

export class RolloutEvaluator {
  /**
   * Performs dynamic canary exposure gating and triggers safety rollbacks
   */
  static evaluateCanaryExposure(featureKey: string): boolean {
    const record = canaryRecords.find(c => c.featureKey === featureKey);
    if (!record || !record.isEnabled) return false;

    // Trigger immediate automatic rollback if error rate violates safety threshold
    if (record.activeErrorRate > record.errorThreshold) {
      record.rollbackActionTriggered = true;
      record.exposurePercentage = 0; // Immediate exposure cut-off
      return false;
    }

    // Dynamic scale-up percentage gate check
    const randomCheck = Math.random() * 100;
    return randomCheck <= record.exposurePercentage;
  }

  /**
   * Adjusts the canary scale-up factor
   */
  static setCanaryExposure(featureKey: string, percent: number) {
    canaryRecords = canaryRecords.map(c => {
      if (c.featureKey === featureKey) {
        const errorSpiked = c.activeErrorRate > c.errorThreshold;
        return {
          ...c,
          exposurePercentage: errorSpiked ? 0 : Math.max(0, Math.min(100, percent)),
          rollbackActionTriggered: errorSpiked ? true : percent === 0
        };
      }
      return c;
    });
  }
}
