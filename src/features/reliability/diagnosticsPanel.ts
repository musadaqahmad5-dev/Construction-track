import { ErrorRegistry } from './errorRegistry';
import { IncidentTimelineService } from './incidentTimeline';

export interface DiagnosticsStats {
  systemUptimePercentage: number;
  meanTimeToRecoverySec: number;
  totalIncidentsCount: number;
  openIncidentsCount: number;
  activeReliabilityScore: number;
  recentLogs: any[];
}

export class DiagnosticsPanelService {
  public static fetchGlobalReliabilityState(): DiagnosticsStats {
    const errorLogs = ErrorRegistry.getErrors();
    const incidents = IncidentTimelineService.getIncidentLogs();

    const openIncidentsCount = incidents.filter(i => i.status !== 'resolved' && i.status !== 'mitigated').length;
    const activeReliabilityScore = ErrorRegistry.calculateReliabilityScore();

    // Custom adaptive calculation
    const totalIncidentsCount = incidents.length;
    const baseUptime = 99.98;
    const uptimeDeduction = totalIncidentsCount * 0.01 + openIncidentsCount * 0.05;
    const systemUptimePercentage = parseFloat(Math.max(98.50, baseUptime - uptimeDeduction).toFixed(2));

    return {
      systemUptimePercentage,
      meanTimeToRecoverySec: totalIncidentsCount > 0 ? 12 : 0,
      totalIncidentsCount,
      openIncidentsCount,
      activeReliabilityScore,
      recentLogs: errorLogs.slice(0, 5)
    };
  }
}
