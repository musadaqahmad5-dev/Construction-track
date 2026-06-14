import { WardrobeItem } from '../../types';

export interface UserBodyMetrics {
  heightCm: number;
  weightKg: number;
  chestInches?: number;
  waistInches?: number;
  preferredSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
}

export interface FitAssessment {
  fitConfidence: number;        // 0.0 to 1.0 accuracy matching
  fitLabel: 'Oversized' | 'Relaxed' | 'Tailored Fitting' | 'Slim Fit' | 'Tight / Restrictive' | 'Perfect Synergy';
  styleAdviceNotes: string;
  sizeDelta: number;            // 0 is perfect, negative is too small, positive is too large
}

export class FitEstimator {
  private static readonly SIZE_RANK: Record<string, number> = {
    'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6
  };

  /**
   * Evaluates clothing item specs against user body metrics profiles.
   */
  static assessFit(item: WardrobeItem, metrics?: UserBodyMetrics): FitAssessment {
    const defaultMetrics: UserBodyMetrics = metrics || {
      heightCm: 175,
      weightKg: 70,
      chestInches: 38,
      waistInches: 32,
      preferredSize: 'M'
    };

    // Extract item size, defaulting to M if not found or custom
    const rawSize = (item.size || 'M').toUpperCase();
    let normalizedItemSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' = 'M';
    if (rawSize in this.SIZE_RANK) {
      normalizedItemSize = rawSize as any;
    }

    const itemRank = this.SIZE_RANK[normalizedItemSize];
    const userRank = this.SIZE_RANK[defaultMetrics.preferredSize];
    const sizeDelta = itemRank - userRank;

    let fitConfidence = 0.95;
    let fitLabel: FitAssessment['fitLabel'] = 'Perfect Synergy';
    let styleAdviceNotes = '';

    if (sizeDelta === 0) {
      fitConfidence = 0.98;
      fitLabel = 'Perfect Synergy';
      styleAdviceNotes = `True to size. The silhouette wraps symmetrically matching standard ${item.category} lines.`;
    } else if (sizeDelta === 1) {
      fitConfidence = 0.85;
      fitLabel = 'Relaxed';
      styleAdviceNotes = `A bit fluid. Gives a modern visual drape. Perfect for relaxed casual layering aesthetics.`;
    } else if (sizeDelta >= 2) {
      fitConfidence = 0.65;
      fitLabel = 'Oversized';
      styleAdviceNotes = `Extremely exaggerated proportions. Recommend cinching or structural belts to anchor the outline.`;
    } else if (sizeDelta === -1) {
      fitConfidence = 0.80;
      fitLabel = 'Slim Fit';
      styleAdviceNotes = `Form-fitting skin contact. Complements highly structured tailored trousers or jackets.`;
    } else if (sizeDelta <= -2) {
      fitConfidence = 0.40;
      fitLabel = 'Tight / Restrictive';
      styleAdviceNotes = `Mobility restrictions probable. Consider active stretchy base wear layer adjustments.`;
    }

    // Adapt based on specific categories
    if (item.category === 'Outerwear' && sizeDelta === 1) {
      // For jackets, 1 size up is actually super trendy and tailoring approved
      fitConfidence = 0.95;
      fitLabel = 'Tailored Fitting';
      styleAdviceNotes = `Optimal outerwear sizing. Allows smooth insulation sweaters or base layers underneath without bulging.`;
    }

    return {
      fitConfidence: parseFloat(fitConfidence.toFixed(2)),
      fitLabel,
      styleAdviceNotes,
      sizeDelta
    };
  }
}
