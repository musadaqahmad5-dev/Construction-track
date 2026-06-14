import { BodyDimensions } from './bodyMapper';
import { AlignmentAnatomy } from './garmentAligner';

export interface FittingReport {
  fitScore: number; // 0-100 indicating tightness optimization
  comfortEstimate: number; // 0-100 comfort rating
  mobilityEstimate: number; // 0-100 flexible motion index
  styleAlignment: number; // 0-100 match with target shape aesthetics
  fitVibe: 'Relaxed/Draped' | 'Standard/Flattering' | 'Compressed/Tensioned' | 'Slightly Restricted';
}

export class FittingScore {
  /**
   * Evaluates the mechanical style fit logic based on garment alignment.
   */
  static calculateFitQuality(
    body: BodyDimensions,
    alignment: AlignmentAnatomy,
    category: string
  ): FittingReport {
    let fitScore = 80;
    let comfort = 85;
    let mobility = 88;
    let styleMatch = 82;

    const shoulderOffset = alignment.shoulderDrapeOffsetMm;
    const friction = alignment.contactResistanceFactor;

    if (shoulderOffset > 10) {
      // Loose coat/relaxed layout
      fitScore = 85;
      comfort = 92;
      mobility = 85;
      styleMatch = body.silhouetteClass === 'Broad' ? 95 : 82;
    } else if (shoulderOffset < 5) {
      // Tight athletic/compression styling
      fitScore = 88;
      comfort = 70;
      mobility = 95; // highly responsive synthetic
      styleMatch = body.silhouetteClass === 'Athletic' ? 96 : 74;
    } else {
      // Regular tailored cuts
      fitScore = 90;
      comfort = 85;
      mobility = 80;
      styleMatch = body.silhouetteClass === 'Regular' ? 95 : 85;
    }

    // Adjust comfort/mobility ratios slightly depending on calculated tension frictions
    if (friction > 0.7) {
      comfort = Math.max(comfort - 10, 50);
    }

    let fitVibe: FittingReport['fitVibe'] = 'Standard/Flattering';
    if (shoulderOffset > 10) fitVibe = 'Relaxed/Draped';
    else if (shoulderOffset < 5) fitVibe = 'Compressed/Tensioned';
    else if (comfort < 65) fitVibe = 'Slightly Restricted';

    return {
      fitScore,
      comfortEstimate: comfort,
      mobilityEstimate: mobility,
      styleAlignment: styleMatch,
      fitVibe
    };
  }
}
