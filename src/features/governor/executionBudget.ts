export class ExecutionBudget {
  private static totalCyclesCount = 0;
  private static firestoreWritesCount = 0;
  
  private static maxCyclesAllowed = 50; // Max autonomous cycles per mount segment
  private static maxWritesAllowed = 30; // Max database commits allowed before cooling down

  static registerCycle(): boolean {
    if (this.totalCyclesCount >= this.maxCyclesAllowed) {
      console.warn(`[AI GOVERNOR] Safety Lock: Max autonomous cycle limit (${this.maxCyclesAllowed}) reached.`);
      return false;
    }
    this.totalCyclesCount++;
    return true;
  }

  static registerFirestoreWrite(): boolean {
    if (this.firestoreWritesCount >= this.maxWritesAllowed) {
      console.warn(`[AI GOVERNOR] Safety Lock: Firestore spam prevention triggered. Limit of ${this.maxWritesAllowed} writes/session reached.`);
      return false;
    }
    this.firestoreWritesCount++;
    return true;
  }

  static getBudgetReport() {
    return {
      cyclesAllowed: this.maxCyclesAllowed,
      cyclesExecuted: this.totalCyclesCount,
      writesAllowed: this.maxWritesAllowed,
      writesExecuted: this.firestoreWritesCount,
      isCycleBudgetExceeded: this.totalCyclesCount >= this.maxCyclesAllowed,
      isWriteBudgetExceeded: this.firestoreWritesCount >= this.maxWritesAllowed,
    };
  }

  static resetBudgets() {
    this.totalCyclesCount = 0;
    this.firestoreWritesCount = 0;
  }
}
