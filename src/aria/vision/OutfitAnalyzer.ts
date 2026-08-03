/**
 * ARIA v2.5 Outfit Analyzer
 * Product: LOOK VISION v2.4
 */

import { DetectedGarment } from './VisionTypes';

export interface OutfitStructureResult {
  hasOuterwear: boolean;
  hasTop: boolean;
  hasBottom: boolean;
  hasFootwear: boolean;
  layerCount: number;
  completenessScore: number; // 0.0 to 1.0
  structureNotes: string[];
}

export class OutfitAnalyzer {
  public static analyzeStructure(garments: DetectedGarment[]): OutfitStructureResult {
    let hasOuterwear = false;
    let hasTop = false;
    let hasBottom = false;
    let hasFootwear = false;

    garments.forEach(g => {
      const cat = g.category.toLowerCase();
      if (cat.includes('outerwear') || cat.includes('blazer') || cat.includes('jacket')) hasOuterwear = true;
      if (cat.includes('top') || cat.includes('knitwear') || cat.includes('shirt')) hasTop = true;
      if (cat.includes('bottom') || cat.includes('trouser') || cat.includes('pant') || cat.includes('skirt')) hasBottom = true;
      if (cat.includes('footwear') || cat.includes('shoe') || cat.includes('boot')) hasFootwear = true;
    });

    const layerCount = garments.length;
    let categoryScore = 0;
    if (hasTop || hasOuterwear) categoryScore += 0.4;
    if (hasBottom) categoryScore += 0.4;
    if (hasFootwear) categoryScore += 0.2;

    const completenessScore = Number(Math.min(categoryScore, 1.0).toFixed(2));

    const structureNotes: string[] = [
      `Multi-layered ensemble detected with ${layerCount} distinct garments.`,
      hasOuterwear ? 'Structured outerwear provides strong upper anchoring.' : 'Single top layer silhouette.',
      hasBottom ? 'Tailored lower silhouette creates balanced vertical proportions.' : 'Bottom garment unconfirmed in framing.'
    ];

    return {
      hasOuterwear,
      hasTop,
      hasBottom,
      hasFootwear,
      layerCount,
      completenessScore,
      structureNotes
    };
  }
}
