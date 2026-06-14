import { ModuleInfo } from './moduleManifest';

export interface ResolutionError {
  moduleId: string;
  missingDependency: string;
  severity: 'blocking' | 'warning';
}

export class DependencyResolver {
  /**
   * Evaluates if any active module has inactive or missing dependencies.
   */
  static validateDependencies(modules: ModuleInfo[]): ResolutionError[] {
    const errors: ResolutionError[] = [];
    const activeIds = new Set(modules.filter(m => m.enabled).map(m => m.id));

    modules.forEach(m => {
      if (m.enabled) {
        m.dependencies.forEach(dep => {
          if (!activeIds.has(dep)) {
            // Find if the dependency actually exists in registry but is disabled
            const existsInRegistry = modules.some(x => x.id === dep);
            errors.push({
              moduleId: m.id,
              missingDependency: dep,
              severity: existsInRegistry ? 'warning' : 'blocking'
            });
          }
        });
      }
    });

    return errors;
  }
}
