export interface PolicyCheckResult {
  allowed: boolean;
  reason?: string;
  cooldownActive: boolean;
  timeRemaining?: number; // seconds
}

export class PolicyEngine {
  private static lastExecutionTimestamp = 0;
  private static cooldownWindowMs = 6000; // minimum 6 seconds between state executions to prevent CPU thrashing
  private static agentTimeoutMs = 1500; // soft agent execution time threshold in ms

  /**
   * Enforces loop throttle policy checks.
   */
  static validateExecutionPolicy(): PolicyCheckResult {
    const now = Date.now();
    const timeDelta = now - this.lastExecutionTimestamp;

    if (this.lastExecutionTimestamp > 0 && timeDelta < this.cooldownWindowMs) {
      const remaining = Math.ceil((this.cooldownWindowMs - timeDelta) / 1000);
      return {
        allowed: false,
        cooldownActive: true,
        timeRemaining: remaining,
        reason: `Engine cooldown window active. Please wait ${remaining} more seconds before recalculating.`
      };
    }

    // Set last run timestamp to now upon success
    this.lastExecutionTimestamp = now;

    return {
      allowed: true,
      cooldownActive: false
    };
  }

  static getRulesSummary() {
    return {
      cooldownWindowSeconds: this.cooldownWindowMs / 1000,
      agentTimeoutMs: this.agentTimeoutMs,
    };
  }
}
