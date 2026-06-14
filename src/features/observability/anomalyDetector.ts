import { Telemetry } from './telemetry';

export class AnomalyDetector {
  /**
   * Scans latest historical readings to fetch active alert conditions.
   */
  static detectAnomalies(): string[] {
    const alerts: string[] = [];
    const readings = Telemetry.getHistoricalReadings();
    if (readings.length === 0) return [];

    const latest = readings[0];

    // Threshold 1: high loop latency
    if (latest.cycleLatencyMs > 250) {
      alerts.push(`High latency spike detected: ${latest.cycleLatencyMs}ms`);
    }

    // Threshold 2: low decision scores
    if (latest.averageDecisionQuality < 50) {
      alerts.push(`Suboptimal styling quality warning: Confidence dropped to ${latest.averageDecisionQuality}%`);
    }

    // Threshold 3: excessive single agent duration
    if (latest.agentExecutionTimes.TrendAgentMs > 80) {
      alerts.push(`Agent warning: TrendAgent execution latency bottlenecked (${latest.agentExecutionTimes.TrendAgentMs}ms)`);
    }

    return alerts;
  }
}
