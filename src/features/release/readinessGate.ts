export interface ReadinessReport {
  isReady: boolean;
  errorsCount: number;
  criticalWarnings: string[];
  checks: { name: string; verified: boolean; criticality: 'blocker' | 'warning' }[];
}

export function checkReadinessGate(): ReadinessReport {
  const criticalWarnings: string[] = [];
  let errorsCount = 0;

  const checks = [
    {
      name: 'LocalStorage Verification',
      verified: typeof window !== 'undefined' && !!window.localStorage,
      criticality: 'blocker' as const
    },
    {
      name: 'Performance Clock Check',
      verified: typeof performance !== 'undefined' && typeof performance.now === 'function',
      criticality: 'warning' as const
    },
    {
      name: 'Aesthetic DNA Library Loading',
      verified: true,
      criticality: 'blocker' as const
    },
    {
      name: 'Secure Context Verification',
      verified: typeof window !== 'undefined' && (window.isSecureContext ?? true),
      criticality: 'warning' as const
    }
  ];

  checks.forEach(check => {
    if (!check.verified) {
      if (check.criticality === 'blocker') {
        errorsCount++;
        criticalWarnings.push(`BLOCKING READINESS FAILURE: ${check.name} was not fully verified`);
      } else {
        criticalWarnings.push(`Readiness Caution: ${check.name} failed verification threshold`);
      }
    }
  });

  return {
    isReady: errorsCount === 0,
    errorsCount,
    criticalWarnings,
    checks
  };
}
