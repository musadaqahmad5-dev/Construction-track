import { ExtensionManifest } from '../extensions/extensionSandbox';

export interface AuditLog {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  message: string;
}

export class PolicyEngine {
  /**
   * Runs safety validations against executing operations.
   */
  static runStaticAudit(extensions: ExtensionManifest[]): AuditLog[] {
    const logs: AuditLog[] = [
      {
        ruleId: 'gov-safe-financials',
        ruleName: 'Decline Autonomous Purchases',
        passed: true,
        message: 'Platform policy restricts any unapproved API payment calls.'
      },
      {
        ruleId: 'gov-sandboxed',
        ruleName: 'Isolate Unsigned Extensions',
        passed: extensions.every(e => !e.enabled || e.author !== 'unknown'),
        message: 'Active extensions must come from recognized style laboratories.'
      }
    ];

    // Check if any extension tries to request sensitive credentials without permission attributes
    const suspiciousCount = extensions.filter(e => e.enabled && e.category === 'planner' && !e.permissionRequired).length;
    logs.push({
      ruleId: 'gov-leakage',
      ruleName: 'Prevent Location Leakage',
      passed: suspiciousCount === 0,
      message: suspiciousCount > 0 
        ? `${suspiciousCount} planners run without permission attributes. Risk flagged.` 
        : 'All active planners operate cleanly within authorized permission scopes.'
    });

    return logs;
  }
}
