export interface RegisteredError {
  id: string;
  timestamp: string;
  errorCode: string;
  message: string;
  severity: 'low' | 'moderate' | 'critical' | 'fatal';
  recovered: boolean;
  policyUsed?: string;
  affectedAspect: string;
}

export class ErrorRegistry {
  private static readonly RE_KEY = 'ai_fashion_reliability_registry';

  public static getErrors(): RegisteredError[] {
    try {
      const data = localStorage.getItem(this.RE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static registerError(
    code: string,
    message: string,
    severity: 'low' | 'moderate' | 'critical' | 'fatal',
    aspect: string,
    recovered = false,
    policyUsed?: string
  ): RegisteredError {
    const errors = this.getErrors();
    const newErr: RegisteredError = {
      id: `err-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      errorCode: code,
      message,
      severity,
      recovered,
      affectedAspect: aspect,
      policyUsed
    };

    errors.unshift(newErr);
    // Persist only latest 100 errors to maintain small storage footprint
    try {
      localStorage.setItem(this.RE_KEY, JSON.stringify(errors.slice(0, 100)));
    } catch (e) {
      console.error('Failed to write to ErrorRegistry storage', e);
    }
    return newErr;
  }

  public static markAsRecovered(id: string, policyUsed: string): void {
    const errors = this.getErrors();
    const idx = errors.findIndex(e => e.id === id);
    if (idx !== -1) {
      errors[idx].recovered = true;
      errors[idx].policyUsed = policyUsed;
      try {
        localStorage.setItem(this.RE_KEY, JSON.stringify(errors));
      } catch (e) {
        console.error('Failed to update ErrorRegistry state', e);
      }
    }
  }

  public static calculateReliabilityScore(): number {
    const errors = this.getErrors();
    if (errors.length === 0) return 100;

    // Weight penalty for each severity grade
    let penalty = 0;
    errors.slice(0, 20).forEach(err => {
      let baseCost = 0;
      switch (err.severity) {
        case 'low': baseCost = 1; break;
        case 'moderate': baseCost = 3; break;
        case 'critical': baseCost = 8; break;
        case 'fatal': baseCost = 20; break;
      }
      // If successfully recovered automatically, half the penalty
      if (err.recovered) {
        baseCost = baseCost * 0.4;
      }
      penalty += baseCost;
    });

    const score = 100 - penalty;
    return Math.max(10, Math.min(100, score));
  }
}
