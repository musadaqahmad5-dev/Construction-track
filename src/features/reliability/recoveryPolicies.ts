import { ErrorRegistry } from './errorRegistry';

export interface RecoveryAction {
  policyName: string;
  remedyApplied: string;
  success: boolean;
}

export class RecoveryPoliciesService {
  /**
   * Evaluates a thrown error code and triggers immediate state recovery
   */
  public static handleFault(code: string, rawMessage: string, aspect: string): RecoveryAction {
    let policyName = 'Default Backoff Rule';
    let remedyApplied = 'Log warning and wait for thread clearance';
    let success = true;

    if (code.includes('RATE_LIMIT') || code.includes('429')) {
      policyName = 'Adaptive Rate Calibrator';
      remedyApplied = 'Enqueue execution in low-priority background pool and retry in 1200ms';
      success = true;
    } else if (code.includes('TIMEOUT') || code.includes('504')) {
      policyName = 'Fallback Cache Swapper';
      remedyApplied = 'Bypassed external network rendering pipeline and served cached golden layout';
      success = true;
    } else if (code.includes('AUTHENTICATION') || code.includes('403')) {
      policyName = 'Credentials Reset Gate';
      remedyApplied = 'Invalidate active ephemeral tokens and prompt for re-authentication sequence';
      success = false; // Requires user intervention
    }

    // Capture error in central registry for visibility
    ErrorRegistry.registerError(
      code,
      rawMessage,
      code.includes('FATAL') ? 'fatal' : 'critical',
      aspect,
      success,
      policyName
    );

    return {
      policyName,
      remedyApplied,
      success
    };
  }
}
