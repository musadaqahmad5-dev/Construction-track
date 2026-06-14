import { runSmokeSuite } from '../testing/smokeSuite';
import { runWorkflowTestSuite } from '../testing/workflowTests';
import { runUIRegressionSuite } from '../testing/uiRegression';
import { runContractVerificationSuite } from '../testing/contractVerification';
import { HealthScoreService } from './healthScore';

export interface LaunchGateReport {
  overallScore: number;
  passedGatesCount: number;
  totalGatesCount: number;
  gates: { name: string; status: 'GO' | 'NO_GO'; metricRef: string }[];
  recommendation: 'PROCEED_WITH_LAUNCH' | 'STAGED_CANARY_ONLY' | 'HOLD_IMMEDIATE';
  isReady: boolean;
  criticalWarnings: string[];
}

export class LaunchReadinessService {
  public static evaluateGates(): LaunchGateReport {
    const smoke = runSmokeSuite();
    const wf = runWorkflowTestSuite();
    const uiReg = runUIRegressionSuite();
    const contract = runContractVerificationSuite();
    const health = HealthScoreService.calculateHealth();

    const gates = [
      {
        name: 'Startup Smoke Suite Integrity',
        status: smoke.passRate >= 99 ? ('GO' as const) : ('NO_GO' as const),
        metricRef: `${smoke.passRate.toFixed(0)}% pass rate`
      },
      {
        name: 'Workflow Orchestration Pipelines',
        status: wf.passRate >= 99 ? ('GO' as const) : ('NO_GO' as const),
        metricRef: `${wf.passRate.toFixed(0)}% pass rate`
      },
      {
        name: 'UI Alignment Visual Regression',
        status: uiReg.passRate >= 99 ? ('GO' as const) : ('NO_GO' as const),
        metricRef: `${uiReg.passRate.toFixed(0)}% accuracy check`
      },
      {
        name: 'JSON Schema API Contract Alignment',
        status: contract.passRate >= 99 ? ('GO' as const) : ('NO_GO' as const),
        metricRef: `${contract.passRate.toFixed(0)}% valid definitions`
      },
      {
        name: 'Active Running System Health',
        status: health.compositeScore >= 90 ? ('GO' as const) : ('NO_GO' as const),
        metricRef: `Health score is ${health.compositeScore}/100`
      }
    ];

    const passedGatesCount = gates.filter(g => g.status === 'GO').length;
    const totalGatesCount = gates.length;
    const overallScore = Math.round((passedGatesCount / totalGatesCount) * 100);

    let recommendation: LaunchGateReport['recommendation'] = 'HOLD_IMMEDIATE';
    if (overallScore === 100) {
      recommendation = 'PROCEED_WITH_LAUNCH';
    } else if (overallScore >= 80) {
      recommendation = 'STAGED_CANARY_ONLY';
    }

    const isReady = overallScore === 100;
    const criticalWarnings = gates
      .filter(g => g.status === 'NO_GO')
      .map(g => `${g.name} failed limits check (${g.metricRef})`);

    return {
      overallScore,
      passedGatesCount,
      totalGatesCount,
      gates,
      recommendation,
      isReady,
      criticalWarnings
    };
  }
}
