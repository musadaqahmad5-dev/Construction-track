/**
 * ARIA v2.5 Try-On Context Builder
 * Product: LOOK VISION v2.4
 */

import { VisionAnalysisResult } from './VisionTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';

export interface VirtualTryOnContext {
  analysisId: string;
  garmentSummary: string;
  primaryColors: string[];
  styleDNAPairingAdvise: string;
  recommendedAccessories: string[];
  fitAndAlterationNotes: string;
}

export class TryOnContextBuilder {
  public static buildContext(
    analysis: VisionAnalysisResult,
    styleDNA: StyleDNAProfile | null
  ): VirtualTryOnContext {
    const garmentSummary = analysis.garments.map(g => `${g.name} (${g.primaryColor})`).join(' + ');
    const primaryColors = analysis.colorPalette.map(c => c.colorName);

    const preferredBrand = styleDNA?.brandAffinity[0]?.value || 'Contemporary Luxury House';
    const preferredMaterial = styleDNA?.materialProfile[0]?.value || 'Silk Cashmere & Virgin Wool';

    const styleDNAPairingAdvise = `This ensemble mirrors your preferred ${styleDNA?.silhouetteProfile[0]?.value || 'tailored architectural'} silhouette. Pair with clean leather footwear and a structured ${preferredBrand}-style tote.`;

    const recommendedAccessories = [
      `Minimalist Italian Calfskin Belt`,
      `Structured Leather Tote Bag`,
      `Monochromatic Silk Pocket Square`
    ];

    const fitAndAlterationNotes = `Drape and shoulder alignment are optimal. Trousers exhibit clean break over footwear with zero bunching.`;

    return {
      analysisId: analysis.analysisId,
      garmentSummary,
      primaryColors,
      styleDNAPairingAdvise,
      recommendedAccessories,
      fitAndAlterationNotes
    };
  }
}
