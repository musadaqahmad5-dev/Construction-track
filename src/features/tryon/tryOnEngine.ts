import { BodyMapper, BodyDimensions } from './bodyMapper';
import { GarmentAligner, AlignmentAnatomy } from './garmentAligner';
import { FittingScore, FittingReport } from './fittingScore';

export interface TryOnResult {
  evaluationId: string;
  hasSucceeded: boolean;
  timestamp: string;
  bodyProfile: BodyDimensions;
  alignment: AlignmentAnatomy;
  results: FittingReport;
  simulatedMeshSource: string; // Styling SVG style gradient or rendering path
}

export class TryOnEngine {
  /**
   * Primary virtual try on layout orchestrator.
   */
  static runTryOnSimulation(
    shape: 'Slim' | 'Regular' | 'Athletic' | 'Broad',
    garmentName: string,
    category: string,
    userHeightCm: number = 175
  ): TryOnResult {
    // 1. Detect body layout coordinates
    const dims = BodyMapper.calculateMeasurements(shape, userHeightCm);

    // 2. Align apparel boundaries
    const alignMap = GarmentAligner.alignAnchors(dims, category);

    // 3. Compute fitting scores and tolerances
    const fits = FittingScore.calculateFitQuality(dims, alignMap, category);

    // 4. Formulate mockup draping visualization path (Gradient representations mimicking fitting tension warmth)
    let heatGrad = 'from-violet-600 via-purple-700 to-indigo-900';
    if (fits.fitScore > 88) heatGrad = 'from-emerald-500 via-teal-700 to-cyan-900';
    else if (fits.fitScore < 60) heatGrad = 'from-rose-500 via-orange-600 to-stone-900';

    return {
      evaluationId: `sim-v2-${Date.now()}`,
      hasSucceeded: true,
      timestamp: new Date().toLocaleTimeString(),
      bodyProfile: dims,
      alignment: alignMap,
      results: fits,
      simulatedMeshSource: heatGrad
    };
  }
}
