/**
 * ARIA v2.5 Memory Confidence Evaluator
 * Product: LOOK VISION v2.4
 */

import { FashionMemoryItem, MemorySource, MemoryLevel } from './MemoryTypes';

export class MemoryConfidenceEvaluator {
  /**
   * Calculates base confidence score for newly created memory item
   */
  public static calculateInitialConfidence(
    source: MemorySource,
    level: MemoryLevel
  ): number {
    let baseScore = 0.5;

    // Explicit source carries highest confidence
    switch (source) {
      case 'user_explicit':
        baseScore = 0.95;
        break;
      case 'correction':
        baseScore = 0.98; // User explicitly correcting AI
        break;
      case 'feedback_loop':
        baseScore = 0.80;
        break;
      case 'system_inferred':
        baseScore = 0.60;
        break;
    }

    // Adjust for memory persistence level
    switch (level) {
      case 'long_term':
        baseScore = Math.min(1.0, baseScore + 0.05);
        break;
      case 'preference':
        baseScore = Math.min(1.0, baseScore + 0.02);
        break;
      case 'short_term':
        baseScore = Math.max(0.3, baseScore - 0.1);
        break;
    }

    return Number(baseScore.toFixed(2));
  }

  /**
   * Adjusts confidence when user re-confirms or corrects an existing memory item
   */
  public static adjustConfidence(
    existingItem: FashionMemoryItem,
    action: 'CONFIRM' | 'CORRECT' | 'REINFORCE' | 'DECAY'
  ): number {
    let current = existingItem.confidence;

    switch (action) {
      case 'CORRECT':
        // Strong boost if user specifically corrected it
        current = 0.98;
        break;
      case 'REINFORCE':
      case 'CONFIRM':
        // Incremental boost up to max 1.0
        current = Math.min(1.0, current + 0.08);
        break;
      case 'DECAY':
        // Soft decay for outdated short-term signals
        current = Math.max(0.2, current - 0.05);
        break;
    }

    return Number(current.toFixed(2));
  }

  /**
   * Classifies numerical score into confidence bracket
   */
  public static classifyConfidenceLevel(
    confidence: number
  ): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (confidence >= 0.8) return 'HIGH';
    if (confidence >= 0.55) return 'MEDIUM';
    return 'LOW';
  }
}
