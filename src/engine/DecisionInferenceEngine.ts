/**
 * AIStyleHub / AI-SEOS - DecisionInferenceEngine
 * 
 * High-performance System Architecture inference module that evaluates real-time
 * telemetry metrics against JSON security and scaling policies.
 */

import dualNamespaceConfig from '../core/contracts/dual_namespace_config.json';
import { StabilityEngine, SecurityAlert } from './stabilityEngine';

export interface NamespaceMetrics {
  cpuLoad: number;             // 0 to 100 %
  memoryLoad: number;          // 0 to 100 %
  activeRequestQueue: number;  // Requests/sec or active queue size
}

export interface DecisionAction {
  actionTriggered: 'AutoScaling' | 'SecurityAlert' | 'None';
  namespace: string;
  reasoning: string;
  timestamp: string;
  dryRun: boolean;
  details: {
    targetReplicas?: number;
    currentReplicas?: number;
    alertSeverity?: 'Low' | 'Medium' | 'High' | 'Critical';
    stabilityLogId?: string;
    metricsEvaluated: NamespaceMetrics;
    triggeredPolicy?: string;
  };
}

export class DecisionInferenceEngine {
  private static currentReplicasMap: Record<string, number> = {
    'community-user-data': 1,
    'ai-creation-workload': 1
  };

  /**
   * Evaluates system metrics for a given namespace against its configured policy triggers
   * 
   * @param namespace The target namespace: 'community-user-data' or 'ai-creation-workload'
   * @param metrics Real-time cpuLoad, memoryLoad, and activeRequestQueue telemetry
   * @param dryRun If true, evaluates and logs reasoning without committing/alerting
   */
  public static evaluate(
    namespace: string,
    metrics: NamespaceMetrics,
    dryRun: boolean = false
  ): DecisionAction {
    const timestamp = new Date().toISOString();
    const config = dualNamespaceConfig as any;
    const nsConfig = config.namespaces?.[namespace];

    if (!nsConfig) {
      return {
        actionTriggered: 'None',
        namespace,
        reasoning: `Namespace '${namespace}' is not defined in the dual-namespace configuration.`,
        timestamp,
        dryRun,
        details: { metricsEvaluated: metrics }
      };
    }

    // 1. Evaluate 'ai-creation-workload' scaling triggers
    if (namespace === 'ai-creation-workload') {
      const scaling = nsConfig.scaling;
      const triggers = scaling?.scaling_triggers;
      const autoScaling = scaling?.auto_scaling;

      const memoryThreshold = triggers?.memory_threshold_percentage || 85;
      const minScale = autoScaling?.minScale || 1;
      const maxScale = autoScaling?.maxScale || 5;

      if (metrics.memoryLoad >= memoryThreshold) {
        const currentReplicas = this.currentReplicasMap[namespace] || 1;
        const targetReplicas = Math.min(currentReplicas + (triggers?.increment_replicas || 1), maxScale);
        
        let reasoning = `High-compute alert: 'ai-creation-workload' memory usage (${metrics.memoryLoad}%) exceeds threshold of ${memoryThreshold}%.`;
        if (currentReplicas >= maxScale) {
          reasoning += ` However, scaling is capped at maximum scale limit of ${maxScale} replicas.`;
        } else {
          reasoning += ` Triggering auto-scaling scaling event to increment replicas to ${targetReplicas}.`;
        }

        if (dryRun) {
          console.log(`[DecisionInferenceEngine] [DRY RUN] Reasoning: ${reasoning}`);
        } else if (currentReplicas < maxScale) {
          this.currentReplicasMap[namespace] = targetReplicas;
        }

        return {
          actionTriggered: 'AutoScaling',
          namespace,
          reasoning,
          timestamp,
          dryRun,
          details: {
            currentReplicas,
            targetReplicas,
            metricsEvaluated: metrics,
            triggeredPolicy: 'scaling_triggers.memory_threshold_percentage'
          }
        };
      }
    }

    // 2. Evaluate 'community-user-data' security triggers
    if (namespace === 'community-user-data') {
      const accessControl = nsConfig.security?.access_control;
      const secTriggers = accessControl?.security_triggers;
      
      const maxRequestRate = secTriggers?.max_request_rate_per_sec || 500;
      const policyAction = secTriggers?.policy_action || 'DenyAll';

      // If activeRequestQueue exceeds maximum allowable rate, trigger DenyAll
      if (metrics.activeRequestQueue >= maxRequestRate) {
        const reasoning = `Security Policy Alert: 'community-user-data' request rate (${metrics.activeRequestQueue} req/sec) exceeds maximum safe rate limit (${maxRequestRate} req/sec). Security Policy '${policyAction}' attempt triggered.`;
        
        let stabilityLogId = 'dry-run-no-log';

        if (dryRun) {
          console.log(`[DecisionInferenceEngine] [DRY RUN] Reasoning: ${reasoning}`);
        } else {
          const alert = StabilityEngine.logSecurityAlert(
            namespace,
            reasoning,
            metrics,
            policyAction
          );
          stabilityLogId = alert.id;
        }

        return {
          actionTriggered: 'SecurityAlert',
          namespace,
          reasoning,
          timestamp,
          dryRun,
          details: {
            alertSeverity: 'Critical',
            stabilityLogId,
            metricsEvaluated: metrics,
            triggeredPolicy: `access_control.security_triggers.max_request_rate_per_sec`
          }
        };
      }
    }

    // Default: No action required
    return {
      actionTriggered: 'None',
      namespace,
      reasoning: `Telemetry within nominal limits for namespace '${namespace}'. No policies triggered.`,
      timestamp,
      dryRun,
      details: {
        metricsEvaluated: metrics,
        currentReplicas: this.currentReplicasMap[namespace] || 1
      }
    };
  }

  /**
   * Helper to fetch the current active replicas
   */
  public static getCurrentReplicas(namespace: string): number {
    return this.currentReplicasMap[namespace] || 1;
  }

  /**
   * Helper to manually reset replicas
   */
  public static setReplicas(namespace: string, count: number): void {
    this.currentReplicasMap[namespace] = count;
  }
}
