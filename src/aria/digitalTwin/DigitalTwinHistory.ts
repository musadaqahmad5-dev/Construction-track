/**
 * ARIA v2.5 Digital Twin History
 * Product: LOOK VISION v2.4
 */

import { DigitalTwinModel } from './DigitalTwinTypes';

export class DigitalTwinHistory {
  private static readonly HISTORY_KEY = 'aria_digital_twin_history_v25';

  public static addSnapshot(profile: DigitalTwinModel): void {
    try {
      if (typeof window !== 'undefined') {
        const history = this.getHistory(profile.userId);
        const updated = [profile, ...history].slice(0, 20);
        localStorage.setItem(`${this.HISTORY_KEY}_${profile.userId}`, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('[DigitalTwinHistory] Local storage snapshot error:', e);
    }
  }

  public static getHistory(userId: string): DigitalTwinModel[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`${this.HISTORY_KEY}_${userId}`);
        if (raw) {
          return JSON.parse(raw) as DigitalTwinModel[];
        }
      }
    } catch (e) {
      console.warn('[DigitalTwinHistory] Local storage history load error:', e);
    }
    return [];
  }
}
