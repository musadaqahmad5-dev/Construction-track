/**
 * AIStyleHub / AI-SEOS - OptimizationEngine
 * 
 * Performance monitoring, prediction caching, telemetry ingestion, 
 * and dynamic health-checks/fallback orchestrations.
 */

import { StabilityEngine } from './stabilityEngine';

export interface TelemetryPayload {
  timestamp: string;
  namespace: string;
  latencyMs: number;
  successRate: number; // 0 to 1
  memoryPressure: number; // %
}

export class PredictionCache {
  private static styleHistory: string[] = [];
  private static prewarmedStyles: Set<string> = new Set();

  /**
   * Logs a generation style pattern and automatically keeps the last 10
   */
  public static recordStyle(style: string) {
    this.styleHistory.unshift(style);
    if (this.styleHistory.length > 10) {
      this.styleHistory.pop();
    }
    this.updatePrewarming();
  }

  /**
   * Analyzes the last 10 entries to pre-warm the cache for the most frequent style patterns
   */
  private static updatePrewarming() {
    const counts: Record<string, number> = {};
    this.styleHistory.forEach((s) => {
      counts[s] = (counts[s] || 0) + 1;
    });

    // Find style(s) with frequency >= 2, or just the top styles
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    
    // Pre-warm styles that have multiple occurrences, or the absolute highest
    this.prewarmedStyles.clear();
    if (sorted.length > 0) {
      const topStyle = sorted[0][0];
      this.prewarmedStyles.add(topStyle);
      
      // Also add any style with at least 2 occurrences
      sorted.forEach(([style, count]) => {
        if (count >= 2) {
          this.prewarmedStyles.add(style);
        }
      });
    }
  }

  /**
   * Checks if a style is pre-warmed in memory
   */
  public static isPrewarmed(style: string): boolean {
    return this.prewarmedStyles.has(style);
  }

  /**
   * Retrieves all currently pre-warmed styles
   */
  public static getPrewarmedStyles(): string[] {
    return Array.from(this.prewarmedStyles);
  }

  /**
   * Gets the raw style logs
   */
  public static getStyleHistory(): string[] {
    return [...this.styleHistory];
  }

  /**
   * Reset prediction cache
   */
  public static clearCache(): void {
    this.styleHistory = [];
    this.prewarmedStyles.clear();
  }
}

export class TelemetryIngestion {
  private static telemetryLogs: TelemetryPayload[] = [];

  /**
   * Ingest performance logs
   */
  public static ingest(payload: TelemetryPayload) {
    this.telemetryLogs.unshift(payload);
    if (this.telemetryLogs.length > 100) {
      this.telemetryLogs.pop();
    }

    console.log(`[TelemetryIngestion] Ingested performance data for [${payload.namespace}]: Latency: ${payload.latencyMs}ms, Success Rate: ${payload.successRate * 100}%`);
  }

  /**
   * Get all ingested telemetry
   */
  public static getLogs(): TelemetryPayload[] {
    return [...this.telemetryLogs];
  }

  /**
   * Clear telemetry records
   */
  public static clearLogs(): void {
    this.telemetryLogs = [];
  }
}

export class OptimizationEngine {
  private static lowLatencyFallbackMode: boolean = false;
  private static latencyHistory: number[] = [];

  /**
   * Runs a health-check ping simulator.
   * If average latency is consistently > 1000ms, triggers StabilityEngine and switches fallback mode.
   */
  public static pingGoogleAIService(simulatedLatencyMs: number): { 
    latencyMs: number; 
    lowLatencyFallbackActive: boolean; 
    triggeredAlert: boolean 
  } {
    this.latencyHistory.unshift(simulatedLatencyMs);
    if (this.latencyHistory.length > 5) {
      this.latencyHistory.pop();
    }

    // Evaluate average of last few pings (e.g. last 3)
    const recentPings = this.latencyHistory.slice(0, 3);
    const avgLatency = recentPings.reduce((sum, val) => sum + val, 0) / (recentPings.length || 1);

    let triggeredAlert = false;
    if (avgLatency > 1000 && !this.lowLatencyFallbackMode) {
      this.lowLatencyFallbackMode = true;
      triggeredAlert = true;

      // Log security/reliability alert to the StabilityEngine
      StabilityEngine.logSecurityAlert(
        'ai-creation-workload',
        `[HEALTH CHECK FAILURE] Google AI Studio latency is consistently degraded (Average: ${avgLatency.toFixed(1)}ms > 1000ms). Activating low-latency fallback mode (reducing step parameters and image resolutions).`,
        { cpuLoad: 80, memoryLoad: 85, activeRequestQueue: 400 },
        'DegradedServiceFallback'
      );
    } else if (avgLatency <= 1000 && this.lowLatencyFallbackMode) {
      // Heal the fallback mode if latency drops to safe levels
      this.lowLatencyFallbackMode = false;
      console.warn(`[OptimizationEngine] Health restored. Latency returned to safe parameters (Average: ${avgLatency.toFixed(1)}ms). Disabling low-latency fallback mode.`);
    }

    return {
      latencyMs: simulatedLatencyMs,
      lowLatencyFallbackActive: this.lowLatencyFallbackMode,
      triggeredAlert
    };
  }

  /**
   * Check if currently operating in degraded fallback mode
   */
  public static isLowLatencyFallbackActive(): boolean {
    return this.lowLatencyFallbackMode;
  }

  /**
   * Manually toggle low-latency fallback
   */
  public static setLowLatencyFallbackMode(active: boolean): void {
    this.lowLatencyFallbackMode = active;
  }

  /**
   * Get latency history
   */
  public static getLatencyHistory(): number[] {
    return [...this.latencyHistory];
  }
}
