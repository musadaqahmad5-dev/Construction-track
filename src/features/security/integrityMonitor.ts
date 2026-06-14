export interface IntegrityReport {
  isTampered: boolean;
  tamperScore: number;
  untrustedModifications: string[];
}

export class IntegrityMonitorService {
  private static readonly INTEGRITY_HASH_KEY = 'ai_fashion_integrity_hashes';

  /**
   * Evaluates if store content has been manually manipulated externally
   */
  public static verifyStorageIntegrity(): IntegrityReport {
    const untrustedModifications: string[] = [];
    let tamperScore = 0;

    // Check 1: Does subscriptions match credits boundaries?
    const subLevel = localStorage.getItem('subscriptionLevel') || 'free';
    const creditsLeftStr = localStorage.getItem('userCreditsLeft');

    if (creditsLeftStr) {
      const credits = parseFloat(creditsLeftStr);
      if (subLevel === 'free' && credits > 100) {
        tamperScore += 30;
        untrustedModifications.push('UNEXPECTED_CREDITS_OVERRUN_FOR_FREE_TIER');
      }
      if (credits > 9999) {
        tamperScore += 60;
        untrustedModifications.push('ILLEGAL_CREDITS_VALUE_ABOVE_MAX_LIMIT');
      }
    }

    // Check 2: Verify DOM injection checks if iframe has rogue tags
    if (typeof document !== 'undefined') {
      const hijackedInputs = document.querySelectorAll('input[type="hidden"][id^="tamper-"]');
      if (hijackedInputs.length > 0) {
        tamperScore += 40;
        untrustedModifications.push('ROGUE_HIDDEN_FORM_FIELDS_INJECTED');
      }
    }

    return {
      isTampered: tamperScore >= 30,
      tamperScore,
      untrustedModifications
    };
  }
}
