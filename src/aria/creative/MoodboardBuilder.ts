/**
 * ARIA v2.5 Moodboard Builder
 * Product: LOOK VISION v2.4
 */

import { MoodboardElement } from './CreativeTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';

export class MoodboardBuilder {
  public static buildMoodboard(
    styleDNA: StyleDNAProfile | null,
    themeTitle?: string
  ): MoodboardElement[] {
    const primaryColor = styleDNA?.colorProfile[0]?.value || 'Charcoal Grey';
    const secondaryColor = styleDNA?.colorProfile[1]?.value || 'Oatmeal / Cream';
    const accentColor = styleDNA?.colorProfile[2]?.value || 'Deep Violet / Indigo';

    const topSilhouette = styleDNA?.silhouetteProfile[0]?.value || 'Structured Minimalist Drape';
    const topMaterial = styleDNA?.materialProfile[0]?.value || 'Virgin Wool & Cashmere';

    return [
      {
        id: `mb_${Date.now()}_1`,
        title: 'Anchor Shade',
        type: 'color_swatch',
        value: primaryColor,
        accentColor: '#1e1e2d'
      },
      {
        id: `mb_${Date.now()}_2`,
        title: 'Contrast Shade',
        type: 'color_swatch',
        value: secondaryColor,
        accentColor: '#e2d8ce'
      },
      {
        id: `mb_${Date.now()}_3`,
        title: 'Accent Shade',
        type: 'color_swatch',
        value: accentColor,
        accentColor: '#4f46e5'
      },
      {
        id: `mb_${Date.now()}_4`,
        title: 'Primary Tactility',
        type: 'texture',
        value: `${topMaterial} with rich matte surface finish.`
      },
      {
        id: `mb_${Date.now()}_5`,
        title: 'Key Proportions',
        type: 'silhouette',
        value: topSilhouette
      },
      {
        id: `mb_${Date.now()}_6`,
        title: 'Editorial Mood Note',
        type: 'editorial_note',
        value: `Restrained luxury defined by architectural lines, subtle tonal depth, and effortless elegance.`
      }
    ];
  }
}
