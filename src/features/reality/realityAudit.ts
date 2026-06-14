import { CapabilityRegistry } from './capabilityRegistry';
import { EvidenceCollector, CodeEvidence } from './evidenceCollector';
import { ReadinessMatrix, ReadinessEvaluation } from './readinessMatrix';

export interface ComprehensiveAuditReport {
  timestamp: string;
  evaluation: ReadinessEvaluation;
  evidence: CodeEvidence[];
  scoreNotes: string;
}

export class RealityAudit {
  /**
   * Compiles and outputs the full real-time forensic system audit.
   */
  static runAudit(): ComprehensiveAuditReport {
    console.log('[RealityAudit] Initializing live program audits...');

    const capabilities = CapabilityRegistry.listAll();
    const evidence = EvidenceCollector.collectEvidence();
    const evaluation = ReadinessMatrix.evaluate(capabilities);

    return {
      timestamp: new Date().toISOString(),
      evaluation,
      evidence,
      scoreNotes: `Dynamic score metrics compiled successfully. Reality state ratio stands at ${evaluation.realityRatio}%.`
    };
  }
}
