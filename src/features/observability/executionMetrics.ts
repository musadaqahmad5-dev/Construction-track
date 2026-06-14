import { Telemetry } from './telemetry';

export class ExecutionMetrics {
  static getExecutionLoadSummary() {
    const history = Telemetry.getHistoricalReadings();
    if (history.length === 0) return { cpuLoadPercent: 12, memoryMb: 45.0, status: 'NORMAL' };

    const latest = history[0];
    const totalAgentMs = 
      latest.agentExecutionTimes.StyleAgentMs +
      latest.agentExecutionTimes.TrendAgentMs +
      latest.agentExecutionTimes.FabricAgentMs +
      latest.agentExecutionTimes.CultureAgentMs +
      latest.agentExecutionTimes.DecisionAgentMs;

    const cpuLoad = Math.min(Math.round((totalAgentMs / 300) * 100), 100);
    const heapMb = parseFloat((latest.memoryGrowthBytes / (1024 * 1024)).toFixed(2));

    let status = 'NORMAL';
    if (cpuLoad > 65) status = 'WARNING';
    if (cpuLoad > 90) status = 'CRITICAL';

    return {
      cpuLoadPercent: cpuLoad,
      memoryMb: heapMb,
      totalAgentMs,
      status
    };
  }

  static getPerformanceSummary() {
    const readings = Telemetry.getHistoricalReadings();
    const sum = readings.reduce((acc, curr) => acc + curr.averageDecisionQuality, 0);
    const avgQuality = readings.length > 0 ? Math.round(sum / readings.length) : 84;

    return {
      averageDecisionQuality: avgQuality,
      healthScore: Telemetry.getSystemHealthScore()
    };
  }
}
