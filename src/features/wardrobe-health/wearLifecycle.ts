import { WardrobeItem } from '../../types';

export interface GarmentWearStats {
  id: string;
  title: string;
  wearsTillWash: number;
  durabilityPercentage: number;
  washTriggerNeeded: boolean;
}

export class WearLifecycle {
  /**
   * Tracks garments through wash cycle thresholds (e.g. casual is 5 washes, formal is 8 washes before laundry/steam).
   */
  static getLifecycleAnalysis(wardrobe: WardrobeItem[]): GarmentWearStats[] {
    return wardrobe.map(item => {
      const wearCount = item.wearCount || 0;
      
      let washThreshold = 5; // standard casual cotton washes
      if (item.category === 'Formal') washThreshold = 3; // suit dry clean
      if (item.category === 'Sportswear') washThreshold = 2; // technical wash

      const wearsTillWash = Math.max(0, washThreshold - (wearCount % washThreshold));
      const durabilityPercentage = Math.max(10, 100 - (wearCount * 2.5)); // estimate wear depreciation

      return {
        id: item.id,
        title: item.title,
        wearsTillWash,
        durabilityPercentage,
        washTriggerNeeded: item.status === 'Worn/Wash' || wearsTillWash === 0
      };
    });
  }
}
