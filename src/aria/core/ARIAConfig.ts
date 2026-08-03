/**
 * ARIA v2.5 Shared Configuration
 * Product: LOOK VISION v2.4
 */

import { ARIAConfig } from './ARIATypes';

export const DEFAULT_ARIA_CONFIG: ARIAConfig = {
  version: '2.5.0-foundation',
  primaryModel: 'gemini-2.5-flash',
  fallbackModel: 'gemini-2.5-flash',
  temperature: 0.3,
  maxTokens: 2048,
  confidenceThreshold: 0.75,
  autoAdaptLayout: true,
  enableTelemetry: true,
  activeModules: ['core', 'orchestrator', 'confidence-engine'],
  maxReasoningSteps: 5,
  cacheTtlMs: 60000,
};

export class ARIAConfigManager {
  private currentConfig: ARIAConfig;

  constructor(initialConfig?: Partial<ARIAConfig>) {
    this.currentConfig = {
      ...DEFAULT_ARIA_CONFIG,
      ...initialConfig,
    };
  }

  public getConfig(): ARIAConfig {
    return { ...this.currentConfig };
  }

  public updateConfig(partial: Partial<ARIAConfig>): ARIAConfig {
    this.currentConfig = {
      ...this.currentConfig,
      ...partial,
    };
    return this.getConfig();
  }

  public resetToDefault(): ARIAConfig {
    this.currentConfig = { ...DEFAULT_ARIA_CONFIG };
    return this.getConfig();
  }

  public isModuleActive(moduleId: string): boolean {
    return this.currentConfig.activeModules.includes(moduleId);
  }

  public activateModule(moduleId: string): void {
    if (!this.isModuleActive(moduleId)) {
      this.currentConfig.activeModules.push(moduleId);
    }
  }

  public deactivateModule(moduleId: string): void {
    this.currentConfig.activeModules = this.currentConfig.activeModules.filter(
      (id) => id !== moduleId
    );
  }
}
