import { WardrobeItem } from '../../types';
import { BodyRegionMapper } from './bodyRegionMapper';

export interface OverlayPosition {
  itemId: string;
  category: string;
  color: string;
  name: string;
  style: {
    top: string;
    left: string;
    width: string;
    height: string;
    zIndex: number;
  };
  svgPlaceholderPath?: string; // Standardized vector shape mockup representing the category
}

export class GarmentOverlay {
  /**
   * Generates responsive inline offset classes to render clothes directly stacked over an avatar visual grid.
   */
  static calculateOverlay(item: WardrobeItem): OverlayPosition {
    const region = BodyRegionMapper.getRegionForCategory(item.category);

    // Calculate left margins depending on width to keep it centered on the 100% parent container
    const leftMargin = (100 - region.widthPercent) / 2;

    const top = `${region.yOffsetPercent}%`;
    const left = `${leftMargin}%`;
    const width = `${region.widthPercent}%`;
    const height = `${region.heightPercent}%`;

    // Choose stylized generic SVG mask paths matching dress categories for realistic vector tryon overlays
    let svgPath = '';
    const catLower = item.category.toLowerCase();
    
    if (catLower.includes('pant') || catLower.includes('jeans') || catLower.includes('short')) {
      svgPath = 'M 20,0 L 80,0 L 85,100 L 55,100 L 50,25 L 45,100 L 15,100 Z'; // Trouser bounds
    } else if (catLower === 'outerwear' || catLower.includes('jacket') || catLower.includes('coat')) {
      svgPath = 'M 15,10 L 35,0 L 65,0 L 85,10 L 90,45 L 80,50 L 75,30 L 75,100 L 25,100 L 25,30 L 20,50 L 10,45 Z'; // Open coat bounds
    } else if (catLower === 'accessories' || catLower.includes('bag') || catLower.includes('hat')) {
      svgPath = 'M 25,75 A 25,25 0 1,1 75,75 Z'; // Accent cap bounds
    } else {
      svgPath = 'M 20,0 L 80,0 L 90,30 L 75,35 L 70,100 L 30,100 L 25,35 L 10,30 Z'; // General shirt bounds
    }

    return {
      itemId: item.id,
      category: item.category,
      color: item.primaryColor || '#CBD5E1',
      name: item.name,
      style: {
        top,
        left,
        width,
        height,
        zIndex: region.zIndex
      },
      svgPlaceholderPath: svgPath
    };
  }
}
