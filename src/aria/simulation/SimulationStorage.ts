/**
 * ARIA v2.5 Simulation Storage
 * Product: LOOK VISION v2.4
 */

import { SimulationReport } from './SimulationTypes';

export class SimulationStorage {
  private static readonly KEY = 'aria_simulation_reports_v25';

  public static saveReport(report: SimulationReport): void {
    try {
      if (typeof window !== 'undefined') {
        const history = this.getReports(report.userId);
        const updated = [report, ...history.filter(r => r.simulationId !== report.simulationId)].slice(0, 30);
        localStorage.setItem(`${this.KEY}_${report.userId}`, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('[SimulationStorage] Save report error:', e);
    }
  }

  public static getReports(userId: string): SimulationReport[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`${this.KEY}_${userId}`);
        if (raw) {
          return JSON.parse(raw) as SimulationReport[];
        }
      }
    } catch (e) {
      console.warn('[SimulationStorage] Get reports error:', e);
    }
    return [];
  }

  public static getReportById(userId: string, id: string): SimulationReport | null {
    const reports = this.getReports(userId);
    return reports.find(r => r.simulationId === id) || null;
  }
}
