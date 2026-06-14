export interface BodyDimensions {
  shoulderWidthCm: number;
  chestCircumferenceCm: number;
  waistCircumferenceCm: number;
  inseamCm: number;
  silhouetteClass: 'Slim' | 'Regular' | 'Athletic' | 'Broad';
}

export class BodyMapper {
  /**
   * Translates visual posture labels to clear numeric proportions for coordinates calculations.
   */
  static calculateMeasurements(
    shape: 'Slim' | 'Regular' | 'Athletic' | 'Broad',
    heightCm: number
  ): BodyDimensions {
    let shoulder = 40;
    let chest = 92;
    let waist = 78;
    let inseam = Math.round(heightCm * 0.45);

    switch (shape) {
      case 'Slim':
        shoulder = Math.round(heightCm * 0.23);
        chest = Math.round(heightCm * 0.50);
        waist = Math.round(heightCm * 0.42);
        break;
      case 'Athletic':
        shoulder = Math.round(heightCm * 0.26);
        chest = Math.round(heightCm * 0.58);
        waist = Math.round(heightCm * 0.45);
        break;
      case 'Broad':
        shoulder = Math.round(heightCm * 0.28);
        chest = Math.round(heightCm * 0.62);
        waist = Math.round(heightCm * 0.55);
        break;
      case 'Regular':
      default:
        shoulder = Math.round(heightCm * 0.24);
        chest = Math.round(heightCm * 0.54);
        waist = Math.round(heightCm * 0.48);
        break;
    }

    return {
      shoulderWidthCm: shoulder,
      chestCircumferenceCm: chest,
      waistCircumferenceCm: waist,
      inseamCm: inseam,
      silhouetteClass: shape
    };
  }
}
