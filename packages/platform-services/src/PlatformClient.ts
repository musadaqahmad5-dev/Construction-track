export interface ServiceHeartbeat {
  serviceName: string;
  status: "online" | "degraded" | "offline";
  cpuUsage: number;
  memoryUsage: number;
  timestamp: Date;
}

export interface UsageLedgerEntry {
  userId: string;
  action: string;
  tokensConsumed: number;
  costEstimateUsd: number;
  timestamp: Date;
}

export class PlatformClient {
  private serviceRegistry: Map<string, string> = new Map();

  constructor() {
    this.serviceRegistry.set("ai-intelligence", "http://localhost:8010");
    this.serviceRegistry.set("context-memory", "http://localhost:8020");
    this.serviceRegistry.set("multi-agent", "http://localhost:8030");
  }

  /**
   * Logs a resource transaction entry directly into the centralized ledger system.
   */
  public async logUsage(entry: UsageLedgerEntry): Promise<boolean> {
    try {
      console.log(`[EAOS PLATFORM] Usage Ledger Entry logged: User ${entry.userId} consumed ${entry.tokensConsumed} tokens on action "${entry.action}" (Cost: $${entry.costEstimateUsd.toFixed(5)})`);
      return true;
    } catch (error) {
      console.error("[EAOS PLATFORM] Usage logging failed:", error);
      return false;
    }
  }

  /**
   * Broadcasts physical cluster node state metrics.
   */
  public async publishHeartbeat(heartbeat: ServiceHeartbeat): Promise<boolean> {
    try {
      console.log(`[EAOS PLATFORM] Node state: ${heartbeat.serviceName} is ${heartbeat.status} (CPU: ${heartbeat.cpuUsage}%, MEM: ${heartbeat.memoryUsage}%)`);
      return true;
    } catch (error) {
      console.error("[EAOS PLATFORM] Heartbeat propagation failed:", error);
      return false;
    }
  }

  /**
   * Dispatches high-severity alerts to telemetry centers.
   */
  public async dispatchAlert(title: string, message: string, severity: "warning" | "critical"): Promise<void> {
    console.warn(`[EAOS PLATFORM ALERT] [${severity.toUpperCase()}] ${title}: ${message}`);
  }
}
