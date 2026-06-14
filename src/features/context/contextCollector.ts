export interface ContextProfile {
  occasion: string;
  weatherSummary: string;
  traveling: boolean;
  energyLevel: number; // 1 to 10 scale representing physical movement expectation
  priorityWeights: {
    comfort: number;     // 0.0 to 1.0
    formality: number;   // 0.0 to 1.0
    layering: number;    // 0.0 to 1.0 (warmth requirement)
    variety: number;     // 0.0 to 1.0
  };
}

export class ContextCollector {
  private static STORAGE_KEY = 'fashion_lifestyle_context_profile';

  /**
   * Loads or bootstrap-saves the active context parameters.
   */
  static getActiveContext(): ContextProfile {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // Fallback to bootstrap
      }
    }

    const defaultProfile: ContextProfile = {
      occasion: 'Creative Office Workshop',
      weatherSummary: 'Cool Breeze (16°C)',
      traveling: false,
      energyLevel: 4,
      priorityWeights: {
        comfort: 0.60,
        formality: 0.70,
        layering: 0.50,
        variety: 0.80
      }
    };

    this.saveContext(defaultProfile);
    return defaultProfile;
  }

  /**
   * Save context variables.
   */
  static saveContext(profile: ContextProfile): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
  }

  /**
   * Compiles the dynamic lifestyle context weights by combining weather overlays and activity metrics.
   */
  static compileAdaptiveProfile(
    occasion: string,
    weather: string,
    travel: boolean,
    energy: number
  ): ContextProfile {
    const formality = occasion.toLowerCase().includes('wedding') || occasion.toLowerCase().includes('formal') || occasion.toLowerCase().includes('business') ? 0.90 : 
                      occasion.toLowerCase().includes('loungewear') || occasion.toLowerCase().includes('lazying') ? 0.20 : 0.50;

    const comfort = energy > 7 ? 0.85 : 0.60;
    
    const layering = weather.toLowerCase().includes('cold') || weather.toLowerCase().includes('cool') || weather.toLowerCase().includes('15') || weather.toLowerCase().includes('16') ? 0.80 : 0.30;

    const profile: ContextProfile = {
      occasion,
      weatherSummary: weather,
      traveling: travel,
      energyLevel: energy,
      priorityWeights: {
        comfort,
        formality,
        layering,
        variety: travel ? 0.90 : 0.75
      }
    };

    this.saveContext(profile);
    return profile;
  }
}
