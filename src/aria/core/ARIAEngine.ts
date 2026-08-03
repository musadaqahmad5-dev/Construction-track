/**
 * ARIA v2.5 Core Engine
 * Product: LOOK VISION v2.4
 */

import { 
  ARIAContextState, 
  ARIAConfig, 
  ARIAModule, 
  ARIAQueryRequest, 
  ARIAStructuredResponse, 
  ARIAConfidenceScore, 
  ARIASystemStatus,
  ARIAReasoningStep
} from './ARIATypes';
import { ARIAConfigManager, DEFAULT_ARIA_CONFIG } from './ARIAConfig';
import { ariaService } from '../services/ARIAService';

export class ARIAEngine {
  private static instance: ARIAEngine;
  private configManager: ARIAConfigManager;
  private modules: Map<string, ARIAModule> = new Map();
  private contextState: ARIAContextState;
  private statusState: ARIASystemStatus;
  private listeners: Set<(status: ARIASystemStatus) => void> = new Set();

  private constructor() {
    this.configManager = new ARIAConfigManager();
    this.contextState = {
      sessionId: `aria_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      currentWorkspace: 'LookVisionMainDashboard',
      viewportMode: 'DESKTOP',
      theme: 'Moon Pearl Glow',
      activeFeatures: ['Orchestrator', 'ConfidenceScoring', 'ModuleRegistry'],
      environment: {
        platform: 'LOOK VISION v2.4',
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        locale: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
      },
      lastUpdated: new Date().toISOString(),
    };

    this.statusState = {
      id: 'aria-core-v2.5',
      name: 'ARIA Foundation v2.5 Engine',
      status: 'online',
      latencyMs: 12,
      activeModulesCount: 0,
      version: DEFAULT_ARIA_CONFIG.version,
      lastCheck: new Date().toISOString(),
      details: 'Core architecture active and operational.'
    };

    this.registerBuiltinFoundationModules();
  }

  public static getInstance(): ARIAEngine {
    if (!ARIAEngine.instance) {
      ARIAEngine.instance = new ARIAEngine();
    }
    return ARIAEngine.instance;
  }

  /**
   * Registers default foundation capabilities
   */
  private registerBuiltinFoundationModules(): void {
    const orchestratorModule: ARIAModule = {
      id: 'orchestrator',
      name: 'ARIA Query Orchestrator',
      version: '2.5.0',
      description: 'Orchestrates incoming AI queries across modules with confidence assessment',
      capabilities: [
        { id: 'query-routing', name: 'Query Routing', description: 'Routes requests to registered target modules' },
        { id: 'context-enrichment', name: 'Context Enrichment', description: 'Applies global context to user requests' }
      ],
      isLoaded: true,
      load: async () => true,
      execute: async (input: unknown) => input
    };

    const confidenceEngineModule: ARIAModule = {
      id: 'confidence-engine',
      name: 'ARIA Confidence Evaluator',
      version: '2.5.0',
      description: 'Provides structured confidence scores and multi-factor evaluation',
      capabilities: [
        { id: 'score-computation', name: 'Score Computation', description: 'Calculates overall certainty percentage' }
      ],
      isLoaded: true,
      load: async () => true,
      execute: async (input: unknown) => input
    };

    this.registerModule(orchestratorModule);
    this.registerModule(confidenceEngineModule);
  }

  /**
   * Module Registration System
   */
  public registerModule(module: ARIAModule): void {
    if (this.modules.has(module.id)) {
      console.warn(`[ARIAEngine] Overwriting registered module: ${module.id}`);
    }
    this.modules.set(module.id, module);
    this.configManager.activateModule(module.id);
    this.updateStatus({
      activeModulesCount: this.modules.size,
      lastCheck: new Date().toISOString()
    });
  }

  public unregisterModule(moduleId: string): boolean {
    const removed = this.modules.delete(moduleId);
    if (removed) {
      this.configManager.deactivateModule(moduleId);
      this.updateStatus({
        activeModulesCount: this.modules.size,
        lastCheck: new Date().toISOString()
      });
    }
    return removed;
  }

  public getModule(moduleId: string): ARIAModule | undefined {
    return this.modules.get(moduleId);
  }

  public getRegisteredModules(): ARIAModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Future Module Loading System
   */
  public async loadModule(moduleId: string): Promise<boolean> {
    const module = this.modules.get(moduleId);
    if (!module) {
      console.error(`[ARIAEngine] Module not registered: ${moduleId}`);
      return false;
    }
    if (module.isLoaded) return true;

    try {
      const success = await module.load();
      module.isLoaded = success;
      return success;
    } catch (err) {
      console.error(`[ARIAEngine] Failed to load module ${moduleId}:`, err);
      return false;
    }
  }

  /**
   * Global Context & Configuration Management
   */
  public getContext(): ARIAContextState {
    return { ...this.contextState };
  }

  public updateContext(partialContext: Partial<ARIAContextState>): ARIAContextState {
    this.contextState = {
      ...this.contextState,
      ...partialContext,
      lastUpdated: new Date().toISOString()
    };
    return this.getContext();
  }

  public getConfig(): ARIAConfig {
    return this.configManager.getConfig();
  }

  public updateConfig(partialConfig: Partial<ARIAConfig>): ARIAConfig {
    return this.configManager.updateConfig(partialConfig);
  }

  public getStatus(): ARIASystemStatus {
    return { ...this.statusState };
  }

  private updateStatus(partialStatus: Partial<ARIASystemStatus>): void {
    this.statusState = {
      ...this.statusState,
      ...partialStatus
    };
    this.listeners.forEach(fn => fn(this.statusState));
  }

  public subscribeStatus(listener: (status: ARIASystemStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Confidence Score Framework
   */
  public calculateConfidenceScore(
    factors: Array<{ name: string; weight: number; score: number; description: string }>
  ): ARIAConfidenceScore {
    let totalWeight = 0;
    let weightedSum = 0;

    for (const factor of factors) {
      totalWeight += factor.weight;
      weightedSum += factor.score * factor.weight;
    }

    const overallScore = totalWeight > 0 ? Number((weightedSum / totalWeight).toFixed(2)) : 0;
    const threshold = this.getConfig().confidenceThreshold;

    let confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN' = 'UNCERTAIN';
    if (overallScore >= 0.85) {
      confidenceLevel = 'HIGH';
    } else if (overallScore >= 0.65) {
      confidenceLevel = 'MEDIUM';
    } else if (overallScore >= 0.45) {
      confidenceLevel = 'LOW';
    }

    return {
      overallScore,
      confidenceLevel,
      factors,
      thresholdMet: overallScore >= threshold
    };
  }

  /**
   * AI Request Orchestration
   */
  public async processQuery<T = unknown>(
    request: ARIAQueryRequest
  ): Promise<ARIAStructuredResponse<T>> {
    const startTime = Date.now();
    this.updateStatus({ status: 'syncing' });

    try {
      // 1. Prepare context-enriched request
      const enrichedRequest: ARIAQueryRequest = {
        ...request,
        contextOverrides: {
          ...this.contextState,
          ...request.contextOverrides
        }
      };

      // 2. Route to target registered module if specified
      if (request.targetModule) {
        const target = this.modules.get(request.targetModule);
        if (target) {
          if (!target.isLoaded) {
            await this.loadModule(target.id);
          }
        }
      }

      // 3. Dispatch to backend service
      const response = await ariaService.queryARIA<T>(enrichedRequest);

      const duration = Date.now() - startTime;
      this.updateStatus({
        status: 'online',
        latencyMs: duration,
        lastCheck: new Date().toISOString()
      });

      return response;
    } catch (err: any) {
      const duration = Date.now() - startTime;
      this.updateStatus({
        status: 'degraded',
        latencyMs: duration,
        details: err.message || 'Error processing ARIA query'
      });

      // Construct structured error response
      const fallbackConfidence: ARIAConfidenceScore = {
        overallScore: 0.2,
        confidenceLevel: 'UNCERTAIN',
        factors: [
          { name: 'System Connectivity', weight: 0.5, score: 0.1, description: 'API call encountered error' },
          { name: 'Model Response', weight: 0.5, score: 0.3, description: 'Using architectural fallback' }
        ],
        thresholdMet: false
      };

      const fallbackSteps: ARIAReasoningStep[] = [
        {
          id: 'step-err-1',
          stageName: 'Request Dispatch',
          description: 'Orchestrated request failed on primary backend gateway.',
          status: 'completed',
          confidenceScore: 0.2
        }
      ];

      return {
        id: `aria_err_${Date.now()}`,
        timestamp: new Date().toISOString(),
        query: request.query,
        intent: request.intent || 'GeneralQuery',
        response: { error: err.message || 'Execution error' } as unknown as T,
        displayText: `ARIA encountered an architectural issue: ${err.message || 'Service unavailable'}. Please verify your connection or retry.`,
        confidence: fallbackConfidence,
        reasoningChain: fallbackSteps,
        metadata: {
          latencyMs: duration,
          model: this.getConfig().primaryModel,
          timestamp: new Date().toISOString(),
          requestId: `req_err_${Date.now()}`,
          agentVersion: DEFAULT_ARIA_CONFIG.version
        }
      };
    }
  }
}

export const ariaEngine = ARIAEngine.getInstance();
