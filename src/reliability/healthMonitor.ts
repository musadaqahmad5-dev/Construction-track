import { ResolutionError } from '../platform/dependencyResolver';

export interface DiagnosticsStatus {
  uptimePercentage: number;
  memoryOk: boolean;
  activeDegradation: boolean;
  errorsFound: string[];
}

export class HealthMonitor {
  /**
   * Automatically executes system diagnostics and determines if a degradation Mode is active.
   */
  static runDiagnostics(dependencyErrors: ResolutionError[]): DiagnosticsStatus {
    const errorsFound: string[] = [];
    let activeDegradation = false;

    if (dependencyErrors.length > 0) {
      activeDegradation = true;
      dependencyErrors.forEach(err => {
        errorsFound.push(`Dependency break: Module "${err.moduleId}" is missing "${err.missingDependency}" dependency.`);
      });
    }

    // Isolate localStorage availability checks
    let memoryOk = true;
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'ok');
      localStorage.removeItem(testKey);
    } catch {
      memoryOk = false;
      activeDegradation = true;
      errorsFound.push('LocalStorage limit exceeded. Transitioning to volatile state caches.');
    }

    return {
      uptimePercentage: activeDegradation ? 98.4 : 100.0,
      memoryOk,
      activeDegradation,
      errorsFound
    };
  }
}
