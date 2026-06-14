export interface CrashReport {
  timestamp: string;
  exceptionMessage: string;
  fatal: boolean;
  affectedModule?: string;
}

export class CrashRecoveryService {
  private static readonly STORAGE_KEY = 'ai_fashion_crash_history';

  public static getCrashHistory(): CrashReport[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static logIncident(message: string, fatal = false, moduleName?: string): void {
    try {
      const history = this.getCrashHistory();
      const incident: CrashReport = {
        timestamp: new Date().toISOString(),
        exceptionMessage: message,
        fatal,
        affectedModule: moduleName
      };
      history.unshift(incident);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.error('Failed to log recovery incident', e);
    }
  }

  public static purgeStateAndSelfHeal(): void {
    try {
      // Retain subscription level but purge cache & active workflows to reset App state safely
      const subState = localStorage.getItem('subscriptionLevel');
      localStorage.clear();
      if (subState) {
        localStorage.setItem('subscriptionLevel', subState);
      }
      this.logIncident('Triggered self-heal state purge successfully', false, 'AppShell');
    } catch (e) {
      console.error('Purge failed', e);
    }
  }

  public static checkHealthFailureRatio(): boolean {
    const history = this.getCrashHistory();
    // More than 3 failures in past 10 minutes indicates persistent crash looping
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const recentCrashes = history.filter(report => {
      const timeMs = new Date(report.timestamp).getTime();
      return timeMs > tenMinutesAgo;
    });
    return recentCrashes.length >= 3;
  }
}
