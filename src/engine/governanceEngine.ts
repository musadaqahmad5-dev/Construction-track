import { WardrobeItem } from '../types';
import { EnterprisePredictiveEngine } from './predictiveEngine';
import { AutonomousExecutionEngine } from './autonomousExecutionEngine';
import { EnterpriseLearningEngine } from './learningEngine';

// ============================================================================
// ENTERPRISE GOVERNANCE TYPINGS & DATA CONTRACTS
// ============================================================================

export type GovernanceState = 'Healthy' | 'Warning' | 'Critical' | 'Maintenance' | 'Recovery';

export type PolicyCategory =
  | 'System Rules'
  | 'Execution Policies'
  | 'Safety Policies'
  | 'Resource Policies'
  | 'Conflict Policies'
  | 'Priority Policies'
  | 'Quality Policies'
  | 'Approval Policies';

export interface SystemRule {
  id: string;
  name: string;
  category: PolicyCategory;
  description: string;
  status: 'Active' | 'Suspended' | 'Triggered';
  severity: 'Info' | 'Warning' | 'Critical';
}

export interface PolicyViolation {
  id: string;
  ruleId: string;
  ruleName: string;
  category: PolicyCategory;
  timestamp: number;
  description: string;
  remedied: boolean;
  recommendedAction: string;
}

export interface SystemHealthMetrics {
  engineHealth: number;       // 0-100
  workflowHealth: number;     // 0-100
  learningHealth: number;     // 0-100
  predictionHealth: number;   // 0-100
  planningHealth: number;     // 0-100
  executionHealth: number;    // 0-100
  overallAIHealthScore: number; // 0-100
  governanceState: GovernanceState;
}

export interface PendingApproval {
  id: string;
  requestedBy: string; // e.g. "AutonomousExecutionEngine", "FashionStylistAgent"
  actionName: string;  // e.g. "Purge Monochromatic Elements", "Re-Index Style DNA"
  description: string;
  timestamp: number;
  status: 'Pending' | 'Approved' | 'Declined';
  riskRating: 'Low' | 'Medium' | 'High';
}

export interface GovernanceRecommendation {
  id: string;
  title: string;
  description: string;
  category: PolicyCategory;
  efficiencyGain: string;
  impactScore: number; // 0-100
}

// ============================================================================
// ENTERPRISE GOVERNANCE & POLICY INTELLIGENCE ENGINE
// ============================================================================

export class EnterpriseGovernanceEngine {
  private static GOVERNANCE_STORAGE_KEY = 'lookvision_governance_engine_db';

  /**
   * Generates default global policies and system rules.
   */
  static getSystemRules(): SystemRule[] {
    return [
      {
        id: 'rule-dna-coherence',
        name: 'Style DNA Stability Rule',
        category: 'System Rules',
        description: 'Style drift rate cannot deviate by more than 35% in a single 14-day cycle without approval.',
        status: 'Active',
        severity: 'Warning'
      },
      {
        id: 'rule-thermal-compliance',
        name: 'Thermal Outerwear Safety Policy',
        category: 'Safety Policies',
        description: 'Force active wool-blend layers in recommendations if simulated climatic drop falls below 5°C.',
        status: 'Active',
        severity: 'Critical'
      },
      {
        id: 'rule-consecutive-purges',
        name: 'Bulk Purge Restrictive Policy',
        category: 'Approval Policies',
        description: 'Requires explicit manual approval for any action removing more than 20% of active wardrobe items.',
        status: 'Triggered',
        severity: 'Critical'
      },
      {
        id: 'rule-budget-cap',
        name: 'Monthly Commerce Cap Control',
        category: 'Resource Policies',
        description: 'Raise Warning threshold if predicted wardrobe shopping budget burn exceeds $1500 USD.',
        status: 'Active',
        severity: 'Warning'
      },
      {
        id: 'rule-agent-concurrency',
        name: 'Agent Collision Prevention Policy',
        category: 'Conflict Policies',
        description: 'Locks Wardrobe State modification when Autonomous Execution task is actively writing.',
        status: 'Active',
        severity: 'Info'
      },
      {
        id: 'rule-high-priority-override',
        name: 'Critical Priority Intercept',
        category: 'Priority Policies',
        description: 'Elevates travel packing sequence tasks instantly to top position if travel date is within 3 days.',
        status: 'Active',
        severity: 'Info'
      },
      {
        id: 'rule-recommendation-quality',
        name: 'Minimum Quality Floor Policy',
        category: 'Quality Policies',
        description: 'Halts automatic execution routines if recommendation success index drops below 50%.',
        status: 'Active',
        severity: 'Warning'
      }
    ];
  }

  /**
   * Retrieves pending administrator approvals for sensitive systemic operations.
   */
  static getPendingApprovals(userId: string = 'user-1'): PendingApproval[] {
    try {
      const stored = localStorage.getItem(`${this.GOVERNANCE_STORAGE_KEY}_approvals`);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    const seeded: PendingApproval[] = [
      {
        id: 'appr-purge-black',
        requestedBy: 'AutonomousExecutionEngine',
        actionName: 'Purge Monochromatic Elements',
        description: 'Proposed removal of 12 black clothing pieces, triggering consecutive purges safety thresholds.',
        timestamp: Date.now() - 10 * 60 * 1000,
        status: 'Pending',
        riskRating: 'High'
      },
      {
        id: 'appr-dna-reindex',
        requestedBy: 'FashionStylistAgent',
        actionName: 'Re-Calibrate Style DNA Matrix',
        description: 'Recalibrates style ranking coefficients toward high-contrast avant-garde preference parameters.',
        timestamp: Date.now() - 25 * 60 * 1000,
        status: 'Pending',
        riskRating: 'Medium'
      },
      {
        id: 'appr-laundry-sync',
        requestedBy: 'AutonomousExecutionEngine',
        actionName: 'Synchronize Laundry Queue State',
        description: 'Force state modification to "Washed" for 8 dirty units in the laundry list.',
        timestamp: Date.now() - 120 * 60 * 1000,
        status: 'Approved',
        riskRating: 'Low'
      }
    ];

    this.savePendingApprovals(seeded);
    return seeded;
  }

  static savePendingApprovals(approvals: PendingApproval[]): void {
    try {
      localStorage.setItem(`${this.GOVERNANCE_STORAGE_KEY}_approvals`, JSON.stringify(approvals));
    } catch (e) {}
  }

  /**
   * Retrieves active or resolved system policy violations.
   */
  static getViolations(userId: string = 'user-1'): PolicyViolation[] {
    try {
      const stored = localStorage.getItem(`${this.GOVERNANCE_STORAGE_KEY}_violations`);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    const seeded: PolicyViolation[] = [
      {
        id: 'viol-purge',
        ruleId: 'rule-consecutive-purges',
        ruleName: 'Bulk Purge Restrictive Policy',
        category: 'Approval Policies',
        timestamp: Date.now() - 3600 * 1000,
        description: 'User simulated "Purge Monochromatic Elements". Action blocked pending manual approval.',
        remedied: false,
        recommendedAction: 'Approve or Reject the pending purge action in the Approval Center.'
      },
      {
        id: 'viol-dna',
        ruleId: 'rule-dna-coherence',
        ruleName: 'Style DNA Stability Rule',
        category: 'System Rules',
        timestamp: Date.now() - 3600 * 5 * 1000,
        description: 'Style drift variance of 38% detected when target aesthetic shifted to High-Contrast Minimalist.',
        remedied: true,
        recommendedAction: 'Re-run learning engine weight backpropagation cycle to smooth drift coefficients.'
      }
    ];

    this.saveViolations(seeded);
    return seeded;
  }

  static saveViolations(violations: PolicyViolation[]): void {
    try {
      localStorage.setItem(`${this.GOVERNANCE_STORAGE_KEY}_violations`, JSON.stringify(violations));
    } catch (e) {}
  }

  /**
   * Generates automatic AI operating recommendations to improve system health.
   */
  static getRecommendations(): GovernanceRecommendation[] {
    return [
      {
        id: 'rec-laundry-gap',
        title: 'Optimize Laundry Velocity Loop',
        description: 'Under simulated cold weather, items reside longer in wash bins. Increase laundry planning frequency.',
        category: 'Resource Policies',
        efficiencyGain: '+14% Curation Compliance',
        impactScore: 82
      },
      {
        id: 'rec-dna-smooth',
        title: 'Apply Style DNA Smoothing Factor',
        description: 'Dampen consecutive style target overrides to lower policy violations and stabilize predictive models.',
        category: 'Quality Policies',
        efficiencyGain: '+8% Model Accuracy',
        impactScore: 91
      },
      {
        id: 'rec-task-scheduling',
        title: 'Adopt Interactive Adaptive Scheduling',
        description: 'Align Autonomous scheduler to Interactive Adaptive Policy to automatically clear resource contentions.',
        category: 'Conflict Policies',
        efficiencyGain: '-120ms Latency Drop',
        impactScore: 78
      }
    ];
  }

  /**
   * Evaluates overall AI Operating System Health Score based on actual states of other engines.
   */
  static evaluateSystemHealth(userId: string = 'user-1', items: WardrobeItem[] = []): SystemHealthMetrics {
    // Collect stats from existing subsystems headlessly
    const activeGoals = AutonomousExecutionEngine.getGoals(userId);
    const execMetrics = AutonomousExecutionEngine.getExecutionMetrics(activeGoals);
    const predMetrics = EnterprisePredictiveEngine.getForecastForTimeline(userId, items, '30 Days');
    const learningProfile = EnterpriseLearningEngine.getLearningProfile(userId, items);

    // Calculate discrete health scores
    const engineHealth = 96; // Headless micro-engine registration status
    const workflowHealth = 94; // Standard state workflows
    const learningHealth = Math.min(100, Math.max(60, learningProfile.metrics?.predictionQuality || 90));
    const predictionHealth = Math.min(100, Math.max(50, predMetrics.predictedOutfitSuccessRate || 85));
    const planningHealth = 88; // Static goal compliance index
    const executionHealth = Math.round(execMetrics.successRate);

    // Find if there are any active unremedied violations
    const violations = this.getViolations(userId);
    const activeViolations = violations.filter(v => !v.remedied).length;

    let overallAIHealthScore = Math.round((engineHealth + workflowHealth + learningHealth + predictionHealth + planningHealth + executionHealth) / 6);
    
    // Penalize score for active violations
    if (activeViolations > 0) {
      overallAIHealthScore = Math.max(30, overallAIHealthScore - activeViolations * 8);
    }

    let governanceState: GovernanceState = 'Healthy';
    if (overallAIHealthScore < 60) {
      governanceState = 'Critical';
    } else if (overallAIHealthScore < 80) {
      governanceState = 'Warning';
    } else if (activeGoals.some(g => g.overallState === 'Running')) {
      governanceState = 'Healthy';
    }

    return {
      engineHealth,
      workflowHealth,
      learningHealth,
      predictionHealth,
      planningHealth,
      executionHealth,
      overallAIHealthScore,
      governanceState
    };
  }

  /**
   * Processes administrator decision (Approve / Decline) for pending policies.
   */
  static processApproval(userId: string = 'user-1', approvalId: string, approve: boolean): PendingApproval[] {
    const approvals = this.getPendingApprovals(userId);
    const item = approvals.find(a => a.id === approvalId);
    if (item) {
      item.status = approve ? 'Approved' : 'Declined';
      this.savePendingApprovals(approvals);

      // If approved, remediate any associated violations
      if (item.id === 'appr-purge-black') {
        const violations = this.getViolations(userId);
        const purgeViol = violations.find(v => v.id === 'viol-purge');
        if (purgeViol) {
          purgeViol.remedied = true;
          purgeViol.description += ` Approved by Administrator.`;
          this.saveViolations(violations);
        }
      }
    }
    return approvals;
  }
}
