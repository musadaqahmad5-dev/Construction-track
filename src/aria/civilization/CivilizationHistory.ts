/**
 * ARIA v2.5 Civilization History Tracker
 * Product: LOOK VISION v2.4
 */

import { TemporalSnapshot } from './CivilizationMemoryTypes';

export class CivilizationHistory {
  private static readonly KEY = 'aria_civilization_snapshots_v25';

  public static addSnapshot(userId: string, snapshot: TemporalSnapshot): void {
    try {
      if (typeof window !== 'undefined') {
        const history = this.getHistory(userId);
        const updated = [snapshot, ...history].slice(0, 50);
        localStorage.setItem(`${this.KEY}_${userId}`, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('[CivilizationHistory] Save snapshot error:', e);
    }
  }

  public static getHistory(userId: string): TemporalSnapshot[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`${this.KEY}_${userId}`);
        if (raw) {
          return JSON.parse(raw) as TemporalSnapshot[];
        }
      }
    } catch (e) {
      console.warn('[CivilizationHistory] Get snapshots error:', e);
    }
    return [];
  }
}
