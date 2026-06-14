export interface IncidentLog {
  id: string;
  time: string;
  title: string;
  category: string;
  status: 'open' | 'investigating' | 'mitigated' | 'resolved';
  severity: 'high' | 'medium' | 'low';
  summary: string;
}

export class IncidentTimelineService {
  private static readonly TIMELINE_KEY = 'ai_fashion_incident_timeline';

  public static getIncidentLogs(): IncidentLog[] {
    try {
      const data = localStorage.getItem(this.TIMELINE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Swallowed
    }

    // Default seed data for professional visuals if empty
    const defaults: IncidentLog[] = [
      {
        id: 'inc-01',
        time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        title: 'Transient Render Timeout 504',
        category: 'rendering',
        status: 'resolved',
        severity: 'medium',
        summary: 'Rendering microservice timed out under heavy aesthetic analysis. Swapped to cached state smoothly without user impact.'
      },
      {
        id: 'inc-02',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        title: 'Local Database Memory Spikes',
        category: 'storage',
        status: 'mitigated',
        severity: 'low',
        summary: 'Rapid layout synthesis caused heavy SQLite block transfers. Optimistic locks and state thrashing mitigated by GC.'
      }
    ];

    try {
      localStorage.setItem(this.TIMELINE_KEY, JSON.stringify(defaults));
    } catch {
      // Swallowed
    }

    return defaults;
  }

  public static reportIncident(title: string, category: string, summary: string, severity: 'high' | 'medium' | 'low'): IncidentLog {
    const logs = this.getIncidentLogs();
    const newLog: IncidentLog = {
      id: `inc-${Date.now()}`,
      time: new Date().toISOString(),
      title,
      category,
      status: 'investigating',
      severity,
      summary
    };
    logs.unshift(newLog);
    try {
      localStorage.setItem(this.TIMELINE_KEY, JSON.stringify(logs.slice(0, 40)));
    } catch {
      // Swallowed
    }
    return newLog;
  }

  public static resolveIncident(id: string): void {
    const logs = this.getIncidentLogs();
    const idx = logs.findIndex(l => l.id === id);
    if (idx !== -1) {
      logs[idx].status = 'resolved';
      try {
        localStorage.setItem(this.TIMELINE_KEY, JSON.stringify(logs));
      } catch {
        // Swallowed
      }
    }
  }
}
