export interface QualityReport {
  overallScore: number; // 0 to 1
  lookId: string;
  usefulnessScore: number;
  renderFidelityScore: number;
  decisionConsistencyScore: number;
  violationsCount: number;
  isBlockRecommended: boolean;
  notes: string[];
}

export class QualityEvaluator {
  /**
   * Aggregates styling outputs and scores them against strict aesthetic standards
   */
  static evaluateLook(look: {
    id: string;
    vibe: string;
    colors: string[];
    garmentCount: number;
  }): QualityReport {
    const notes: string[] = [];
    let violationsCount = 0;

    // Check color contrasts or excessive shades (e.g. over 5 colors can look cluttered)
    let usefulnessScore = 0.90;
    let renderFidelityScore = 0.88;
    let decisionConsistencyScore = 0.92;

    if (look.colors.length > 4) {
      violationsCount++;
      usefulnessScore -= 0.15;
      notes.push('Excessive color diversity. Advise simplifying palette.');
    }

    if (look.garmentCount < 2) {
      violationsCount++;
      renderFidelityScore -= 0.20;
      notes.push('Incomplete layering. Multi-layer outfits score higher in visual depth.');
    }

    // Specific vibe checks
    if (look.vibe === 'minimalist' && look.colors.includes('#FF00FF')) {
      violationsCount++;
      decisionConsistencyScore -= 0.30;
      notes.push('Vibe mismatch: Hot magenta shades violate standard muted minimalist philosophy.');
    }

    // Weighted average overall score
    const rawScore = (usefulnessScore * 0.4) + (renderFidelityScore * 0.3) + (decisionConsistencyScore * 0.3);
    const overallScore = parseFloat(Math.max(0, Math.min(1, rawScore)).toFixed(3));
    
    // Hard gate blocking thresholds: Any score under 0.65 or over 2 violations is blocked for quality assurance
    const isBlockRecommended = overallScore < 0.65 || violationsCount > 2;

    if (isBlockRecommended) {
      notes.push('BLOCKED: Fails quality thresholds. Regression gate activated.');
    } else {
      notes.push('APPROVED: Pass production styling standards.');
    }

    return {
      overallScore,
      lookId: look.id,
      usefulnessScore: parseFloat(usefulnessScore.toFixed(3)),
      renderFidelityScore: parseFloat(renderFidelityScore.toFixed(3)),
      decisionConsistencyScore: parseFloat(decisionConsistencyScore.toFixed(3)),
      violationsCount,
      isBlockRecommended,
      notes
    };
  }
}
