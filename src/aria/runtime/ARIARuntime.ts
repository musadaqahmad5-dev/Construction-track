/**
 * ARIA v3.2 Application Runtime Singleton
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Architecture
 * 
 * Provides application-level lifecycle management, execution routing,
 * health monitoring, and system initialization.
 */

import { ARIARequest, ARIAResponse } from '../orchestrator/ARIAOrchestratorTypes';
import { ARIAOrchestrator } from '../orchestrator/ARIAOrchestrator';
import { ARIAEngine } from '../core/ARIAEngine';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';
import { memoryEngine } from '../memory/MemoryEngine';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';

export interface ARIARuntimeHealth {
  readonly status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  readonly version: string;
  readonly uptimeMs: number;
  readonly activeModules: readonly string[];
  readonly totalRequestsHandled: number;
  readonly lastExecutionTimestamp?: string;
  readonly memoryStatus: string;
  readonly styleDNAInitialized: boolean;
  readonly observabilityActive: boolean;
}

export class ARIARuntime {
  private static instance: ARIARuntime;

  private isInitialized = false;
  private startTime = 0;
  private requestsHandled = 0;
  private lastExecutionTimestamp?: string;

  private constructor() {}

  public static getInstance(): ARIARuntime {
    if (!ARIARuntime.instance) {
      ARIARuntime.instance = new ARIARuntime();
    }
    return ARIARuntime.instance;
  }

  /**
   * Initializes application-level runtime components and connects ARIA ecosystem engines
   */
  public async initialize(userId?: string): Promise<boolean> {
    if (this.isInitialized) return true;

    this.startTime = Date.now();

    try {
      // 1. Initialize Memory Engine
      await memoryEngine.initialize(userId || 'guest_user');

      // 2. Initialize Style DNA Engine
      await styleDNAEngine.initialize(userId || 'guest_user');

      this.isInitialized = true;

      EnterpriseObservabilityEngine.logTrace({
        engine: 'ARIARuntime',
        eventName: 'ARIA_RUNTIME_INITIALIZED',
        category: 'Execution',
        payload: `ARIARuntime initialized for user "${userId || 'guest_user'}"`,
        latencyMs: Date.now() - this.startTime,
        status: 'Success'
      });

      return true;
    } catch (err) {
      console.warn('[ARIARuntime] Initialization error, running in degraded mode:', err);
      this.isInitialized = true;
      return true;
    }
  }

  /**
   * Core runtime execution entry point
   */
  public async execute(request: ARIARequest): Promise<ARIAResponse> {
    if (!this.isInitialized) {
      await this.initialize(request.userId);
    }

    const response = await ARIAOrchestrator.getInstance().executeRequest(request);

    this.requestsHandled++;
    this.lastExecutionTimestamp = response.timestamp;

    return response;
  }

  /**
   * Returns current ARIA runtime system status
   */
  public getStatus() {
    const orchestratorStatus = ARIAOrchestrator.getInstance().getStatus();
    const contextState = ARIAEngine.getInstance().getContext();

    return {
      runtimeInitialized: this.isInitialized,
      orchestratorStatus,
      contextState,
      requestsHandled: this.requestsHandled,
      lastExecutionTimestamp: this.lastExecutionTimestamp
    };
  }

  /**
   * Returns system health evaluation metrics
   */
  public getHealth(): ARIARuntimeHealth {
    const orchestratorStatus = ARIAOrchestrator.getInstance().getStatus();
    const uptimeMs = this.startTime > 0 ? Date.now() - this.startTime : 0;

    return {
      status: this.isInitialized ? 'HEALTHY' : 'DEGRADED',
      version: 'ARIA v3.2 Production',
      uptimeMs,
      activeModules: orchestratorStatus.activeEngines,
      totalRequestsHandled: this.requestsHandled,
      lastExecutionTimestamp: this.lastExecutionTimestamp,
      memoryStatus: memoryEngine.getStatus().storageMode,
      styleDNAInitialized: styleDNAEngine.getStatus().isInitialized,
      observabilityActive: true
    };
  }
}

export const ariaRuntime = ARIARuntime.getInstance();
