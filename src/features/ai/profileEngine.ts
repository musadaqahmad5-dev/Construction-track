import { WardrobeItem, StyleProfile } from '../../types';

export interface StyleMemory {
  favoriteColors: string[];     // Most frequently logged colors
  repeatPatterns: string[];     // Textures or words indicating fabric patterns e.g., "Heavy", "Tailored", "Ribbed"
  styleMode: 'minimalist' | 'classic' | 'streetwear' | 'vintage' | 'bold';
  avoidHistory: string[];       // Colors or titles that should be rested to prevent rotation fatigue
}

export class ProfileEngine {
  /**
   * Generates a style memory profile dynamically based on wardrobe history and a target vibe.
   */
  static extractStyleMemory(wardrobe: WardrobeItem[], currentVibe: string): StyleMemory {
    const favoriteColorsMap: Record<string, number> = {};
    const texturesMap: Record<string, number> = {};
    const avoidColors: string[] = [];

    // Analyze colors and descriptions
    wardrobe.forEach(item => {
      // Color extraction
      if (item.primaryColor && item.primaryColor !== 'Neutral shade' && item.primaryColor !== 'Contrast hue') {
        favoriteColorsMap[item.primaryColor] = (favoriteColorsMap[item.primaryColor] || 0) + 1;
      }
      if (item.secondaryColor && item.secondaryColor !== 'Contrast hue') {
        favoriteColorsMap[item.secondaryColor] = (favoriteColorsMap[item.secondaryColor] || 0) + 1;
      }

      // Texture patterns descriptors scanning
      const descriptors = ['wool', 'shearling', 'heavy', 'ribbed', 'tailored', 'cotton', 'knit', 'leather', 'denim', 'fleece'];
      const textToScan = `${item.title} ${item.description}`.toLowerCase();
      descriptors.forEach(desc => {
        if (textToScan.includes(desc)) {
          texturesMap[desc] = (texturesMap[desc] || 0) + 1;
        }
      });

      // Avoidance rules (e.g. if wearCount is high, avoid fatiguing this color)
      if ((item.wearCount || 0) >= 5 && item.primaryColor) {
        if (!avoidColors.includes(item.primaryColor)) {
          avoidColors.push(item.primaryColor);
        }
      }
    });

    // Sort to find favorite colors (top 3)
    const favoriteColors = Object.entries(favoriteColorsMap)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 3);

    // Sort to find prominent textures/patterns
    const repeatPatterns = Object.entries(texturesMap)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 4);

    // Normalize styleMode vibe
    const validVibes: Array<'minimalist' | 'classic' | 'streetwear' | 'vintage' | 'bold'> = [
      'minimalist', 'classic', 'streetwear', 'vintage', 'bold'
    ];
    const styleMode = (validVibes.includes(currentVibe as any) 
      ? currentVibe 
      : 'minimalist') as StyleMemory['styleMode'];

    return {
      favoriteColors: favoriteColors.length > 0 ? favoriteColors : ['Black', 'Beige', 'White'],
      repeatPatterns: repeatPatterns.length > 0 ? repeatPatterns : ['solid', 'tailored', 'cotton'],
      styleMode,
      avoidHistory: avoidColors
    };
  }
}
