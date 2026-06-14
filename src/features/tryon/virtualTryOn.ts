import { WardrobeItem } from '../../types';
import { GarmentOverlay, OverlayPosition } from './garmentOverlay';
import { FitEstimator, FitAssessment, UserBodyMetrics } from './fitEstimator';

export interface TryOnSessionResult {
  sessionId: string;
  overlays: OverlayPosition[];
  assessments: Record<string, FitAssessment>;
  overallFitConfidence: number;
  unresolvedCategoryConflict: boolean;
  tryOnSuccess: boolean;
  stylingNotes: string[];
}

export class VirtualTryOn {
  /**
   * Evaluates and overlays multiple items concurrently over an avatar wireframe model.
   */
  static simulatedTryOn(items: WardrobeItem[], metrics?: UserBodyMetrics): TryOnSessionResult {
    const sessionId = `session_tryon_${Date.now()}`;
    const overlays: OverlayPosition[] = [];
    const assessments: Record<string, FitAssessment> = {};
    const stylingNotes: string[] = [];

    let summedFit = 0;
    let counts = 0;
    let categoryTally = new Set<string>();
    let unresolvedCategoryConflict = false;

    items.forEach(item => {
      // Avoid rendering duplicates in the exact same region (e.g. 2 pants)
      if (categoryTally.has(item.category)) {
        unresolvedCategoryConflict = true;
      }
      categoryTally.add(item.category);

      // 1. Placement calculations
      const position = GarmentOverlay.calculateOverlay(item);
      overlays.push(position);

      // 2. Physical sizing constraints
      const fit = FitEstimator.assessFit(item, metrics);
      assessments[item.id] = fit;

      summedFit += fit.fitConfidence;
      counts++;

      stylingNotes.push(`[${item.name}] - ${fit.fitLabel}: ${fit.styleAdviceNotes}`);
    });

    const overallFitConfidence = counts > 0 ? parseFloat((summedFit / counts).toFixed(2)) : 0.90;
    const tryOnSuccess = items.length > 0 && overallFitConfidence >= 0.50;

    return {
      sessionId,
      overlays,
      assessments,
      overallFitConfidence,
      unresolvedCategoryConflict,
      tryOnSuccess,
      stylingNotes
    };
  }
}
