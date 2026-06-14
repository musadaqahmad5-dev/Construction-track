import { ExecutionBudget } from './executionBudget';
import { PolicyEngine, PolicyCheckResult } from './policyEngine';

export class AIGovernor {
  private static locksActive = false;

  /**
   * Main guard function to check if the loop should be permitted to execute or write.
   */
  static authorizeCycleExecution(): { authorized: boolean; reason?: string } {
    if (this.locksActive) {
      return { authorized: false, reason: 'AI Governor: Manual emergency lockout override is active.' };
    }

    // 1. Check Cycle Budget Limits
    const budget = ExecutionBudget.getBudgetReport();
    if (budget.isCycleBudgetExceeded) {
      return { authorized: false, reason: `AI Governor: Limit of ${budget.cyclesAllowed} loop cycles reached. Throttling active to prevent infinite loop.` };
    }

    // 2. Check Throttle Cooldown Delta
    const policyResult = PolicyEngine.validateExecutionPolicy();
    if (!policyResult.allowed) {
      return { authorized: false, reason: `AI Governor: ${policyResult.reason}` };
    }

    // Register valid execution cycle count
    ExecutionBudget.registerCycle();

    return { authorized: true };
  }

  /**
   * Verifies if writing to database is permissible inside governor rules.
   */
  static authorizeDbWrite(): boolean {
    const budget = ExecutionBudget.getBudgetReport();
    if (budget.isWriteBudgetExceeded) {
      console.warn('[AI GOVERNOR] Blocked Firestore write payload to prevent write cost spam.');
      return false;
    }
    return ExecutionBudget.registerFirestoreWrite();
  }

  static toggleSafetyLock(): boolean {
    this.locksActive = !this.locksActive;
    return this.locksActive;
  }

  static isLocked(): boolean {
    return this.locksActive;
  }

  static resetCycleLogs() {
    ExecutionBudget.resetBudgets();
  }
}
