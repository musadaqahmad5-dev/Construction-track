export interface LatencyMetric {
  tag: string;
  durationMs: number;
  timestamp: string;
}

let latencyRecords: LatencyMetric[] = [
  { tag: 'cold-start', durationMs: 120, timestamp: new Date(Date.now() - 3600000).toLocaleTimeString() },
  { tag: 'outfit-rendering', durationMs: 450, timestamp: new Date(Date.now() - 1800000).toLocaleTimeString() },
  { tag: 'dns-analysis', durationMs: 180, timestamp: new Date(Date.now() - 900000).toLocaleTimeString() }
];

export const getLatencyRecords = (): LatencyMetric[] => {
  return latencyRecords;
};

export class LatencyTracker {
  /**
   * Logs a new timestamped duration metric for latency audits
   */
  static logLatency(tag: string, durationMs: number) {
    if (latencyRecords.length >= 100) {
      latencyRecords.shift(); // Evict oldest
    }
    latencyRecords.push({
      tag,
      durationMs,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  /**
   * Measures average duration for specific tags
   */
  static getAverageLatency(tag: string): number {
    const matched = latencyRecords.filter(r => r.tag === tag);
    if (matched.length === 0) return 0;
    const total = matched.reduce((sum, r) => sum + r.durationMs, 0);
    return parseFloat((total / matched.length).toFixed(1));
  }

  /**
   * Returns cold-start performance state
   */
  static evaluatePerformanceStatus() {
    const avgColdStart = this.getAverageLatency('cold-start') || 120;
    return {
      averageColdStartMs: avgColdStart,
      isUnderTarget: avgColdStart < 300, // Hard threshold is 300ms
      performanceHealth: avgColdStart < 200 ? 'excellent' : avgColdStart < 300 ? 'nominal' : 'degraded'
    };
  }
}
