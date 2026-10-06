/**
 * EAOS Look Vision AI Fashion OS - Resilient Cognitive Architecture & Fault Tolerance
 * Path: packages/ai-engine/src/CognitiveCircuitBreaker.ts
 * Subsystem: Cognitive Circuit Breaker, Upstream Model Quota Defense & Deterministic Local Fallback Routing
 */

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerStatus {
  state: CircuitBreakerState;
  consecutiveFailuresCount: number;
  lastTrippedTimestamp: number | null;
}

export interface FallbackResolutionReceipt {
  originalModelId: string;
  activeFallbackType: 'LOCAL_DETERMINISTIC_CACHE' | 'RULE_BASED_HEURISTIC' | 'SYNTHETIC_DEGRADED';
  resolutionTimestamp: number;
  executionTraceId: string;
}

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  cooldownWindowMs?: number;
  monitoredModelId?: string;
}

export class CognitiveCircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED';
  private consecutiveFailuresCount: number = 0;
  private lastTrippedTimestamp: number | null = null;
  private readonly failureThreshold: number;
  private readonly cooldownWindowMs: number;
  private readonly monitoredModelId: string;

  constructor(options?: CircuitBreakerOptions) {
    this.failureThreshold = options?.failureThreshold ?? 3;
    this.cooldownWindowMs = options?.cooldownWindowMs ?? 30000;
    this.monitoredModelId = options?.monitoredModelId ?? 'gemini-2.5-flash';
  }

  /**
   * Retrieves the current snapshot state of the circuit breaker
   */
  public getStatus(): CircuitBreakerStatus {
    this.evaluateCooldownTransition();
    return {
      state: this.state,
      consecutiveFailuresCount: this.consecutiveFailuresCount,
      lastTrippedTimestamp: this.lastTrippedTimestamp
    };
  }

  /**
   * Evaluates if the cooldown timer has elapsed to transition an OPEN state to HALF_OPEN
   */
  private evaluateCooldownTransition(): void {
    if (this.state === 'OPEN' && this.lastTrippedTimestamp !== null) {
      const elapsed = Date.now() - this.lastTrippedTimestamp;
      if (elapsed >= this.cooldownWindowMs) {
        this.state = 'HALF_OPEN';
        console.info(
          `[CIRCUIT BREAKER HALF_OPEN] Cooldown window of ${this.cooldownWindowMs}ms expired. Testing single remote invocation probe.`
        );
      }
    }
  }

  /**
   * Evaluates whether an error represents a trippable upstream failure (HTTP 429, 503, timeout)
   */
  private isTrippableError(error: unknown): boolean {
    if (!error) return false;
    const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();

    return (
      msg.includes('429') ||
      msg.includes('503') ||
      msg.includes('quota') ||
      msg.includes('rate limit') ||
      msg.includes('timeout') ||
      msg.includes('etimedout') ||
      msg.includes('econnaborted') ||
      msg.includes('service unavailable') ||
      msg.includes('temporarily unavailable')
    );
  }

  /**
   * Trips the circuit breaker to OPEN state upon reaching failure threshold
   */
  private tripCircuit(traceId: string, triggerError: unknown): void {
    this.state = 'OPEN';
    this.lastTrippedTimestamp = Date.now();
    const errorDetails = triggerError instanceof Error ? triggerError.message : String(triggerError);

    console.warn(
      JSON.stringify({
        level: 'WARN',
        event: 'CIRCUIT_BREAKER_TRIPPED',
        'x-trace-id': traceId,
        modelId: this.monitoredModelId,
        state: 'OPEN',
        consecutiveFailures: this.consecutiveFailuresCount,
        cooldownWindowMs: this.cooldownWindowMs,
        cause: errorDetails,
        timestamp: new Date().toISOString()
      })
    );
  }

  /**
   * Resets the circuit breaker back to healthy CLOSED state after successful probe
   */
  private resetCircuit(traceId: string): void {
    const previousState = this.state;
    this.state = 'CLOSED';
    this.consecutiveFailuresCount = 0;
    this.lastTrippedTimestamp = null;

    if (previousState === 'HALF_OPEN') {
      console.info(
        JSON.stringify({
          level: 'INFO',
          event: 'CIRCUIT_BREAKER_RECOVERED',
          'x-trace-id': traceId,
          modelId: this.monitoredModelId,
          state: 'CLOSED',
          timestamp: new Date().toISOString()
        })
      );
    }
  }

  /**
   * Executes a model call protected by the circuit breaker, with instant deterministic fallback
   *
   * @param modelInvocationCall Remote AI model async invocation promise
   * @param localDeterministicFallbackCall Local zero-latency deterministic fallback promise
   * @param traceId Active request correlation tracing ID
   */
  public async executeWithFallback<T>(
    modelInvocationCall: () => Promise<T>,
    localDeterministicFallbackCall: () => Promise<T>,
    traceId: string
  ): Promise<T> {
    const startTime = performance.now();
    const cleanTraceId = traceId && typeof traceId === 'string' && traceId.trim() ? traceId.trim() : 'trc_untracked';

    this.evaluateCooldownTransition();

    // 1. If Circuit is OPEN: Bypass remote model instantly to preserve sub-second SLA
    if (this.state === 'OPEN') {
      const receipt: FallbackResolutionReceipt = {
        originalModelId: this.monitoredModelId,
        activeFallbackType: 'LOCAL_DETERMINISTIC_CACHE',
        resolutionTimestamp: Date.now(),
        executionTraceId: cleanTraceId
      };

      console.warn(
        JSON.stringify({
          level: 'WARN',
          event: 'CIRCUIT_BYPASS_FALLBACK_ROUTED',
          'x-trace-id': cleanTraceId,
          receipt,
          circuitState: 'OPEN',
          timestamp: new Date().toISOString()
        })
      );

      const fallbackResult = await localDeterministicFallbackCall();
      return fallbackResult;
    }

    // 2. Circuit is CLOSED or HALF_OPEN: Attempt primary model invocation
    try {
      const result = await modelInvocationCall();
      const latencyMs = (performance.now() - startTime).toFixed(2);

      this.resetCircuit(cleanTraceId);

      console.info(
        JSON.stringify({
          level: 'INFO',
          event: 'COGNITIVE_INVOCATION_SUCCESS',
          'x-trace-id': cleanTraceId,
          modelId: this.monitoredModelId,
          latencyMs,
          circuitState: this.state,
          timestamp: new Date().toISOString()
        })
      );

      return result;
    } catch (primaryError: unknown) {
      const latencyMs = (performance.now() - startTime).toFixed(2);
      this.consecutiveFailuresCount++;

      const isTrippable = this.isTrippableError(primaryError);
      const errorMessage = primaryError instanceof Error ? primaryError.message : String(primaryError);

      console.error(
        JSON.stringify({
          level: 'ERROR',
          event: 'COGNITIVE_INVOCATION_FAILED',
          'x-trace-id': cleanTraceId,
          modelId: this.monitoredModelId,
          consecutiveFailures: this.consecutiveFailuresCount,
          isTrippable,
          error: errorMessage,
          latencyMs,
          timestamp: new Date().toISOString()
        })
      );

      // Check if threshold breached or if failed in HALF_OPEN probe mode
      if (this.state === 'HALF_OPEN' || (isTrippable && this.consecutiveFailuresCount >= this.failureThreshold)) {
        this.tripCircuit(cleanTraceId, primaryError);
      }

      // Execute immediate local deterministic fallback to maintain uninterrupted availability
      const receipt: FallbackResolutionReceipt = {
        originalModelId: this.monitoredModelId,
        activeFallbackType: 'LOCAL_DETERMINISTIC_CACHE',
        resolutionTimestamp: Date.now(),
        executionTraceId: cleanTraceId
      };

      console.info(
        JSON.stringify({
          level: 'INFO',
          event: 'TRIGGERING_EMERGENCY_FALLBACK',
          'x-trace-id': cleanTraceId,
          receipt,
          timestamp: new Date().toISOString()
        })
      );

      try {
        const fallbackResult = await localDeterministicFallbackCall();
        return fallbackResult;
      } catch (fallbackError: unknown) {
        const fallbackMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        console.error(
          JSON.stringify({
            level: 'FATAL',
            event: 'DOUBLE_FAULT_FALLBACK_FAILED',
            'x-trace-id': cleanTraceId,
            primaryError: errorMessage,
            fallbackError: fallbackMsg,
            timestamp: new Date().toISOString()
          })
        );
        throw fallbackError;
      }
    }
  }
}
