import { startStartupDiagnostics } from './startupDiagnostics';
import { checkReadinessGate } from './readinessGate';

export interface BootstrapResult {
  success: boolean;
  timestamp: string;
  durationMs: number;
  startupScore: number;
  criticalWarnings: string[];
  safeMode: boolean;
}

export function bootstrapAppShell(): BootstrapResult {
  const startTime = Date.now();
  const diagnostics = startStartupDiagnostics();
  const readiness = checkReadinessGate();

  const criticalWarnings = [
    ...diagnostics.criticalWarnings,
    ...readiness.criticalWarnings
  ];

  const safeMode = diagnostics.startupScore < 70 || readiness.errorsCount > 0;
  const durationMs = Date.now() - startTime;

  return {
    success: diagnostics.startupScore >= 50,
    timestamp: new Date().toISOString(),
    durationMs,
    startupScore: diagnostics.startupScore,
    criticalWarnings,
    safeMode
  };
}
