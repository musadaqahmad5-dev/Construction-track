import { useState } from 'react';
import { 
  EnterpriseGovernanceEngine, 
  SystemRule, 
  PendingApproval, 
  PolicyViolation, 
  GovernanceRecommendation 
} from '../../../engine';

export function useGovernanceData(wardrobeItems: any[], uId: string, setAgentLog: (msg: string) => void) {
  const [governanceRules, setGovernanceRules] = useState<SystemRule[]>(() =>
    EnterpriseGovernanceEngine.getSystemRules()
  );

  const [governanceApprovals, setGovernanceApprovals] = useState<PendingApproval[]>(() =>
    EnterpriseGovernanceEngine.getPendingApprovals(uId)
  );

  const [governanceViolations, setGovernanceViolations] = useState<PolicyViolation[]>(() =>
    EnterpriseGovernanceEngine.getViolations(uId)
  );

  const [governanceRecommendations, setGovernanceRecommendations] = useState<GovernanceRecommendation[]>(() =>
    EnterpriseGovernanceEngine.getRecommendations()
  );

  const [governanceTimeline, setGovernanceTimeline] = useState<Array<{ time: string; text: string; category: string }>>([
    { time: '13:02:40', text: 'Style DNA Stability check initiated headlessly.', category: 'System Rules' },
    { time: '12:45:12', text: 'Blocked unauthorized bulk purge sequence.', category: 'Safety Policies' },
    { time: '11:14:02', text: 'Synchronized local learning backpropagation rules.', category: 'Quality Policies' }
  ]);

  const systemHealthMetrics = EnterpriseGovernanceEngine.evaluateSystemHealth(uId, wardrobeItems);

  const handleApprovalDecision = (approvalId: string, approve: boolean) => {
    const updatedApprovals = EnterpriseGovernanceEngine.processApproval(uId, approvalId, approve);
    setGovernanceApprovals(updatedApprovals);

    const updatedViolations = EnterpriseGovernanceEngine.getViolations(uId);
    setGovernanceViolations(updatedViolations);

    const actionStr = approve ? 'Approved' : 'Declined';
    const approvalItem = updatedApprovals.find(a => a.id === approvalId);
    const newEvent = {
      time: new Date().toTimeString().split(' ')[0],
      text: `Administrator ${actionStr} action: "${approvalItem?.actionName || approvalId}"`,
      category: 'Approval Policies'
    };
    setGovernanceTimeline([newEvent, ...governanceTimeline]);
    setAgentLog(`GovernanceEngine: Action "${approvalItem?.actionName || approvalId}" was ${actionStr}.`);
  };

  const toggleRuleStatus = (ruleId: string) => {
    const updated = governanceRules.map(r => {
      if (r.id === ruleId) {
        const nextStatus = r.status === 'Active' ? 'Suspended' : 'Active';
        return { ...r, status: nextStatus };
      }
      return r;
    });
    setGovernanceRules(updated as SystemRule[]);
    setAgentLog(`GovernanceEngine: Policy rule "${ruleId}" toggled.`);
  };

  return {
    governanceRules,
    governanceApprovals,
    governanceViolations,
    governanceRecommendations,
    governanceTimeline,
    systemHealthMetrics,
    handleApprovalDecision,
    toggleRuleStatus
  };
}
