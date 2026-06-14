import { getExperimentsState, recordExperimentImpression } from './experimentEngine';

export class VariantAllocator {
  /**
   * Deterministically assigns a user handle or ID to a specific variant for an active experiment
   */
  static allocateUser(userId: string, experimentId: string): string {
    const experiments = getExperimentsState();
    const experiment = experiments.find(exp => exp.id === experimentId);

    if (!experiment || experiment.status !== 'active') {
      return 'control'; // Default standard safe variant fallback
    }

    // Hash userId and experimentId to locate variant index deterministically
    const compositeString = `${userId}-${experimentId}`;
    let hash = 0;
    for (let i = 0; i < compositeString.length; i++) {
      hash = compositeString.charCodeAt(i) + ((hash << 5) - hash);
    }
    const finalHash = Math.abs(hash);

    // Cumulative frequency ratio picker
    const variantCount = experiment.variants.length;
    const pickedIdx = finalHash % variantCount;
    const assignedVariant = experiment.variants[pickedIdx];

    // Log the visual impression record update
    recordExperimentImpression(experimentId, assignedVariant.id);

    return assignedVariant.id;
  }
}
