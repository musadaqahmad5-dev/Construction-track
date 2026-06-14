import { ExecutionStatus } from './capabilityRegistry';

export interface ReadinessEvaluation {
  realityRatio: number; // Percentage
  evidenceRatio: number;
  unsupportedCount: number;
  totalCapabilities: number;
  blockers: string[];
}

export class ReadinessMatrix {
  private static WEIGHTS: Record<ExecutionStatus, number> = {
    REAL: 1.0,
    PARTIAL: 0.7,
    MOCK: 0.1,
    DISABLED: 0.0
  };

  static evaluate(capabilities: Array<{ status: ExecutionStatus; name: string }>): ReadinessEvaluation {
    let weightedSum = 0;
    let realCount = 0;
    let mockCount = 0;
    let partialCount = 0;
    
    capabilities.forEach((c) => {
      weightedSum += this.WEIGHTS[c.status];
      if (c.status === 'REAL') realCount++;
      if (c.status === 'PARTIAL') partialCount++;
      if (c.status === 'MOCK') mockCount++;
    });

    const realityRatio = (weightedSum / capabilities.length) * 100;
    const evidenceRatio = (realCount / capabilities.length) * 100;

    const blockers: string[] = [];
    if (mockCount > 0) {
      blockers.push(`3D TryOn physics canvas uses static model classes. Need to upgrade to WebGL.`);
    }
    if (partialCount > 0) {
      blockers.push(`AI Recommendations require process.env.GEMINI_API_KEY environment variables to be fully operational.`);
    }

    return {
      realityRatio: Math.round(realityRatio),
      evidenceRatio: Math.round(evidenceRatio),
      unsupportedCount: mockCount,
      totalCapabilities: capabilities.length,
      blockers
    };
  }
}
