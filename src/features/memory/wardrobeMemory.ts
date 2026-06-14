import { WardrobeItem } from '../../types';

export interface ItemWearMetrics {
  wearCount: number;
  lastWornDate: string | null;
  comfortRating: number; // 1-10
}

export class WardrobeMemory {
  private static wearMetrics: Record<string, ItemWearMetrics> = {};

  /**
   * Tracks garment style count logs
   */
  static logGarmentWorn(itemId: string) {
    if (!this.wearMetrics[itemId]) {
      this.wearMetrics[itemId] = { wearCount: 0, lastWornDate: null, comfortRating: 8 };
    }
    this.wearMetrics[itemId].wearCount++;
    this.wearMetrics[itemId].lastWornDate = new Date().toLocaleDateString();
  }

  static getMetricsForGarment(itemId: string): ItemWearMetrics {
    return this.wearMetrics[itemId] || { wearCount: 0, lastWornDate: null, comfortRating: 8 };
  }

  static setComfortRating(itemId: string, score: number) {
    if (!this.wearMetrics[itemId]) {
      this.wearMetrics[itemId] = { wearCount: 0, lastWornDate: null, comfortRating: 8 };
    }
    this.wearMetrics[itemId].comfortRating = Math.max(1, Math.min(score, 10));
  }
}
