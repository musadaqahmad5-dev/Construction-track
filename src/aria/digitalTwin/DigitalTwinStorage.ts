/**
 * ARIA v2.5 Digital Twin Storage
 * Product: LOOK VISION v2.4
 */

import { DigitalTwinModel } from './DigitalTwinTypes';

export class DigitalTwinStorage {
  private static readonly STORAGE_KEY = 'aria_digital_twin_profile_v25';

  public static saveProfile(profile: DigitalTwinModel): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${this.STORAGE_KEY}_${profile.userId}`, JSON.stringify(profile));
      }
    } catch (e) {
      console.warn('[DigitalTwinStorage] Local storage save error:', e);
    }
  }

  public static loadProfile(userId: string): DigitalTwinModel | null {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
        if (raw) {
          return JSON.parse(raw) as DigitalTwinModel;
        }
      }
    } catch (e) {
      console.warn('[DigitalTwinStorage] Local storage load error:', e);
    }
    return null;
  }
}
