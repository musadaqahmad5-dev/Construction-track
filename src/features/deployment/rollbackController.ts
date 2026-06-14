export interface RollbackActionReport {
  actionId: string;
  sourceVersion: string;
  targetVersion: string;
  rollbackDate: Date;
  outcomeStatus: 'SUCCESS' | 'TERMINATED' | 'COMPLETED';
}

export class RollbackController {
  private static actionsHistory: RollbackActionReport[] = [
    {
      actionId: 'roll-01',
      sourceVersion: 'v14.8.2-canary-broken',
      targetVersion: 'v14.8.1-stable-known-good',
      rollbackDate: new Date(Date.now() - 86400000 * 5),
      outcomeStatus: 'COMPLETED'
    }
  ];

  static executeRollback(source: string, target: string): RollbackActionReport {
    const report: RollbackActionReport = {
      actionId: `roll-${Date.now()}`,
      sourceVersion: source,
      targetVersion: target,
      rollbackDate: new Date(),
      outcomeStatus: 'COMPLETED'
    };
    this.actionsHistory.unshift(report);
    return report;
  }

  static getRollbackHistoryList(): RollbackActionReport[] {
    return this.actionsHistory;
  }
}
