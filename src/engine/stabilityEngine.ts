/**
 * AIStyleHub / AI-SEOS - StabilityEngine
 * 
 * Central hub for logging, tracking, and auditing security alerts,
 * latency degradation, policy violations, and container resource failures.
 */

export interface SecurityAlert {
  id: string;
  timestamp: string;
  namespace: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  policyAction: string;
  message: string;
  metrics: {
    cpuLoad: number;
    memoryLoad: number;
    activeRequestQueue: number;
  };
}

export class StabilityEngine {
  private static alertLogs: SecurityAlert[] = [];

  /**
   * Log a security alert to the centralized audit console
   */
  public static logSecurityAlert(
    namespace: string,
    message: string,
    metrics: { cpuLoad: number; memoryLoad: number; activeRequestQueue: number },
    policyAction: string = 'DenyAll'
  ): SecurityAlert {
    const alert: SecurityAlert = {
      id: `sec-alert-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      namespace,
      severity: 'Critical',
      policyAction,
      message,
      metrics
    };

    this.alertLogs.unshift(alert);
    
    // Broadcast security event to lookvision_show_toast via custom browser events
    if (typeof window !== 'undefined') {
      const toastEvent = new CustomEvent('lookvision_show_toast', {
        detail: `[SECURITY ALERT] ${namespace}: Policy attempt [${policyAction}] activated! Anomaly detected.`
      });
      window.dispatchEvent(toastEvent);
    }

    console.warn(`[StabilityEngine] [${alert.severity}] [${namespace}] ${message}`, alert);
    return alert;
  }

  /**
   * Retrieve active stability logs
   */
  public static getAlertLogs(): SecurityAlert[] {
    return [...this.alertLogs];
  }

  /**
   * Clears the alert logs
   */
  public static clearLogs(): void {
    this.alertLogs = [];
  }
}
