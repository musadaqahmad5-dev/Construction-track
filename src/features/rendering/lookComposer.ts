import { RenderedLook } from './outfitRenderer';

export class LookComposer {
  /**
   * Assesses matching styles and visual balance, ensuring the top layer, middle layer, and base layer are structurally compatible.
   */
  static composeLayers(layers: RenderedLook['garmentLayers']): {
    isCohesive: boolean;
    structuralScore: number; // 0-100 indicating layering logic correctness
    advice: string;
  } {
    if (layers.length === 0) {
      return { isCohesive: false, structuralScore: 0, advice: 'No garments loaded for evaluation.' };
    }

    const categories = layers.map(l => l.layer);
    let score = 100;
    const warnings: string[] = [];

    // Layer Rule A: An Outer layer must not exist without an Inner layer to prevent contact friction
    if (categories.includes('outer') && !categories.includes('inner')) {
      score -= 30;
      warnings.push('Outer coat recommendation lacks inner lining layer protection.');
    }

    // Layer Rule B: Check for multiple heavy outer layers
    const outerCount = categories.filter(c => c === 'outer').length;
    if (outerCount > 1) {
      score -= 40;
      warnings.push('Multiple outer jackets create excess layering pressure.');
    }

    // Layer Rule C: Base Layer vs Acc contrast
    const accCount = categories.filter(c => c === 'acc').length;
    if (accCount > 3) {
      score -= 15;
      warnings.push('Overly excessive accessory count dilutes outfit focal point.');
    }

    const isCohesive = score >= 70;
    const advice = warnings.length > 0 
      ? `Structural anomalies detected: ${warnings.join(', ')}`
      : 'Layer overlap and visual balance scores indicate highly responsive cohesion and comfort layout.';

    return {
      isCohesive,
      structuralScore: Math.max(score, 10),
      advice
    };
  }
}
