/**
 * ARIA v2.5 Simulation History Tracker
 * Product: LOOK VISION v2.4
 */

import { SimulationReport } from './SimulationTypes';
import { SimulationStorage } from './SimulationStorage';

export class SimulationHistory {
  public static record(report: SimulationReport): void {
    SimulationStorage.saveReport(report);
  }

  public static getHistory(userId: string): SimulationReport[] {
    return SimulationStorage.getReports(userId);
  }
}
