import { ErrorRegistry } from '../reliability/errorRegistry';
import { ProductMetricsService } from './productMetrics';
import { IntegrityMonitorService } from '../security/integrityMonitor';

export interface HealthBreakdown {
  compositeScore: number;
  reliabilityMetric: number;
  performanceMetric: number;
  securityMetric: number;
  classification: 'PRISTINE' | 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
}

export class HealthScoreService {
  public static calculateHealth(): HealthBreakdown {
    // 1. Reliability (Based on error count and severity)
    const integrityAudit = IntegrityMonitorService.verifyStorageIntegrity();
    const reliabilityMetric = ErrorRegistry.calculateReliabilityScore();

    // 2. Performance (Based on golden roll averages)
    const productMetrics = ProductMetricsService.getMetrics();
    let performanceMetric = 100;
    if (productMetrics.avgGenerationTimeMs > 1000) {
      performanceMetric -= 20;
    } else if (productMetrics.avgGenerationTimeMs > 500) {
      performanceMetric -= 8;
    }
    if (productMetrics.errorRatePercentage > 5) {
      performanceMetric -= 15;
    }

    // 3. Security (Based on tampering or credentials validity)
    const securityMetric = integrityAudit.isTampered ? 40 : 100;

    // Combine values with weights
    const compositeScore = Math.round(
      reliabilityMetric * 0.4 + performanceMetric * 0.3 + securityMetric * 0.3
    );

    let classification: HealthBreakdown['classification'] = 'PRISTINE';
    if (compositeScore < 50) {
      classification = 'CRITICAL';
    } else if (compositeScore < 75) {
      classification = 'DEGRADED';
    } else if (compositeScore < 90) {
      classification = 'OPTIMAL';
    }

    return {
      compositeScore,
      reliabilityMetric,
      performanceMetric,
      securityMetric,
      classification
    };
  }
}
