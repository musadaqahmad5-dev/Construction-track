/**
 * ARIA v2.5 Outfit Idea Generator
 * Product: LOOK VISION v2.4
 */

import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';
import { FashionMemoryItem } from '../memory/MemoryTypes';

export class OutfitIdeaGenerator {
  public static generateOutfitDirections(
    styleDNA: StyleDNAProfile | null,
    memories: FashionMemoryItem[],
    prompt?: string
  ): string[] {
    const topSilhouette = styleDNA?.silhouetteProfile[0]?.value || 'Architectural Tailored Layering';
    const topColor = styleDNA?.colorProfile[0]?.value || 'Charcoal & Slate Monochrome';
    const topBrand = styleDNA?.brandAffinity[0]?.value || 'Contemporary High Fashion House';
    const topMaterial = styleDNA?.materialProfile[0]?.value || 'Virgin Wool & Cashmere';

    const directions: string[] = [
      `Monochromatic anchor using ${topColor} with layered ${topSilhouette} proportions.`,
      `Textural contrast pairing smooth ${topMaterial} with crisp tailored silhouettes inspired by ${topBrand}.`,
      `Proportional balance featuring structured upper layering and fluid lower drape.`
    ];

    if (prompt) {
      directions.unshift(`Custom Direction: Tailored specifically to "${prompt}", emphasizing ${topColor} accents.`);
    }

    return directions;
  }
}
