export interface AuditLogEntry {
  logId?: string;
  timestamp?: Date;
  actor?: string;
  action?: string;
  status?: 'SUCCESS' | 'WARNING' | 'DENIED';
  ipAddress?: string;
  message?: string;
  time?: string;
  user?: string;
}

export class AuditTrail {
  private static auditLogs: AuditLogEntry[] = [
    {
      logId: 'audit-01',
      timestamp: new Date(Date.now() - 3600000 * 2),
      actor: 'system-gardener',
      action: 'Garbage collect expired preview vectors',
      status: 'SUCCESS',
      ipAddress: '127.0.0.1'
    },
    {
      logId: 'audit-02',
      timestamp: new Date(Date.now() - 300000),
      actor: 'tld-arket-01',
      action: 'Fetch premium aesthetic ontology coordinates',
      status: 'SUCCESS',
      ipAddress: '34.90.114.88'
    }
  ];

  static appendLog(actor: string, action: string, status: 'SUCCESS' | 'WARNING' | 'DENIED' = 'SUCCESS'): AuditLogEntry {
    const entry: AuditLogEntry = {
      logId: `aud-${Date.now()}`,
      timestamp: new Date(),
      actor,
      action,
      status,
      ipAddress: '10.240.0.4'
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  static getTraceLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }
}
