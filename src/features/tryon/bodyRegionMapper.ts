import { ClothingCategory } from '../../types';

export interface BodyRegion {
  regionId: 'head' | 'torso_under' | 'torso_over' | 'legs' | 'feet' | 'wrist';
  label: string;
  yOffsetPercent: number; // Percentage from top of avatar
  heightPercent: number;  // Visual height percentage
  widthPercent: number;   // Visual width percentage
  zIndex: number;         // Stack layer ordering
}

export class BodyRegionMapper {
  private static readonly REGIONS: Record<string, BodyRegion> = {
    'Outerwear': {
      regionId: 'torso_over',
      label: 'Torso Outer layer',
      yOffsetPercent: 22,
      heightPercent: 38,
      widthPercent: 62,
      zIndex: 15
    },
    'Casual': { // Mostly Tops/Shirts
      regionId: 'torso_under',
      label: 'Torso Base layer',
      yOffsetPercent: 24,
      heightPercent: 35,
      widthPercent: 55,
      zIndex: 10
    },
    'Formal': { // Treated as full suit or high layered top
      regionId: 'torso_over',
      label: 'Formal Torso Coat',
      yOffsetPercent: 22,
      heightPercent: 42,
      widthPercent: 58,
      zIndex: 12
    },
    'Sportswear': { // Treated as secondary pants/shirt bounds
      regionId: 'torso_under',
      label: 'Athletic Inner Layer',
      yOffsetPercent: 25,
      heightPercent: 33,
      widthPercent: 53,
      zIndex: 9
    },
    'Pants': { // Custom category or fallback check
      regionId: 'legs',
      label: 'Lower Body',
      yOffsetPercent: 55,
      heightPercent: 38,
      widthPercent: 45,
      zIndex: 8
    },
    'Accessories': {
      regionId: 'wrist',
      label: 'Wrist / Multi Accent',
      yOffsetPercent: 45,
      heightPercent: 12,
      widthPercent: 12,
      zIndex: 20
    }
  };

  /**
   * Retrieves precise visual coordinate mappings for any garment categories.
   */
  static getRegionForCategory(category: string): BodyRegion {
    // Standard mapper rules
    if (category.toLowerCase().includes('pant') || category.toLowerCase().includes('jeans') || category.toLowerCase().includes('skirt') || category.toLowerCase().includes('short')) {
      return this.REGIONS['Pants'];
    }

    const matched = this.REGIONS[category];
    if (matched) return matched;

    // Fallbacks
    return {
      regionId: 'torso_under',
      label: 'General Placement',
      yOffsetPercent: 30,
      heightPercent: 30,
      widthPercent: 50,
      zIndex: 5
    };
  }
}
