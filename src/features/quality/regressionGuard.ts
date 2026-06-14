export interface GoldenOutfit {
  vibe: string;
  colors: string[];
  garments: string[];
  notes: string;
}

export class RegressionGuard {
  private static readonly GOLDEN_ANCHORS: Record<string, GoldenOutfit> = {
    minimalist: {
      vibe: 'minimalist',
      colors: ['#FFFFFF', '#1A1A1E', '#DFDED9'],
      garments: ['Muted Fine Knit Cotton Tee', 'Tailored Pleated Trouser', 'Vegan Calfskin Loafers'],
      notes: 'Golden Minimalist baseline anchors - 100% aesthetic rating.'
    },
    cyberpunk: {
      vibe: 'cyberpunk',
      colors: ['#0A0B10', '#00FFFF', '#FF0055'],
      garments: ['Water-resistant Asymmetrical Parka', 'Reflective Panel Cargoes', 'Magnetically Buckled Combat Boots'],
      notes: 'Golden Cyberpunk baseline anchors - 100% aesthetic rating.'
    },
    classic: {
      vibe: 'classic',
      colors: ['#0F2027', '#E4E3E0', '#565554'],
      garments: ['Nouveau Chevron Double-Breasted Wool Blazer', 'Pima Cotton Oxford Shirt', 'Brushed Nubuck Derbies'],
      notes: 'Golden Classic baseline anchors - 100% aesthetic rating.'
    }
  };

  /**
   * Retrieves stable anchor look block if a generated dynamic candidate fails validity gating
   */
  static triggerFallback(vibe: string): GoldenOutfit {
    const matchedVibe = vibe.toLowerCase();
    if (this.GOLDEN_ANCHORS[matchedVibe]) {
      return this.GOLDEN_ANCHORS[matchedVibe];
    }
    return this.GOLDEN_ANCHORS.minimalist; // Ultimate general fallback
  }

  /**
   * Evaluates if a sequence of error steps indicates regression
   */
  static checkRegression(failureRate: number): boolean {
    // If failure rates exceed 30%, trigger regression warnings
    return failureRate > 0.30;
  }
}
