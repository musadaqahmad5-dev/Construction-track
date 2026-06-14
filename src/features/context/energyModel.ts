export interface FabricRecommendation {
  weight: 'Ultra-lightweight' | 'Medium breathable' | 'Heavy insulation';
  stretchRatio: 'High stretch' | 'Moderate comfort' | 'Rigid tailored';
  breathabilityIndex: number; // 1 to 100
}

export class EnergyModel {
  /**
   * Translates activity physical intensity into specific fabric advice.
   */
  static evaluateEnergyLevel(intensityScore: number): FabricRecommendation {
    // scale 1-10
    if (intensityScore >= 8) {
      return {
        weight: 'Ultra-lightweight',
        stretchRatio: 'High stretch',
        breathabilityIndex: 95
      };
    }

    if (intensityScore >= 4) {
      return {
        weight: 'Medium breathable',
        stretchRatio: 'Moderate comfort',
        breathabilityIndex: 65
      };
    }

    return {
      weight: 'Heavy insulation',
      stretchRatio: 'Rigid tailored',
      breathabilityIndex: 30
    };
  }
}
