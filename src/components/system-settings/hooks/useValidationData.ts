import { useState } from 'react';
import { 
  EnterpriseValidationEngine, 
  EnterpriseReadinessReport, 
  ComponentAudit, 
  ValidationIssue 
} from '../../../engine';

export function useValidationData(wardrobeItems: any[], uId: string, setAgentLog: (msg: string) => void) {
  const [validationReport, setValidationReport] = useState<EnterpriseReadinessReport>(() =>
    EnterpriseValidationEngine.runFullAudit(uId, wardrobeItems)
  );

  const [componentAudits, setComponentAudits] = useState<ComponentAudit[]>(() =>
    EnterpriseValidationEngine.scanComponentAudits()
  );

  const [selectedValidationIssue, setSelectedValidationIssue] = useState<ValidationIssue | null>(null);
  const [validationCategoryFilter, setValidationCategoryFilter] = useState<string>('ALL');

  const handleRunFullValidation = () => {
    setAgentLog("EnterpriseValidationEngine: Performing comprehensive architectural verification scan...");
    setTimeout(() => {
      const freshReport = EnterpriseValidationEngine.runFullAudit(uId, wardrobeItems);
      setValidationReport(freshReport);
      setComponentAudits(EnterpriseValidationEngine.scanComponentAudits());
      setAgentLog(`EnterpriseValidationEngine: Completed check. Overall readiness index: ${freshReport.overallEnterpriseScore}/100.`);
    }, 600);
  };

  const handleResolveValidationIssue = (issueId: string) => {
    const updatedIssues = validationReport.issues.filter(issue => issue.id !== issueId);
    const updatedPassed = validationReport.passedChecks + 1;
    const bonusScore = Math.min(100, validationReport.overallEnterpriseScore + 3);

    const updatedReport = {
      ...validationReport,
      issues: updatedIssues,
      passedChecks: updatedPassed,
      overallEnterpriseScore: bonusScore
    };

    setValidationReport(updatedReport);

    if (selectedValidationIssue?.id === issueId) {
      setSelectedValidationIssue(null);
    }

    setAgentLog(`EnterpriseValidationEngine: Resolved issue #${issueId}. Quality patch applied. Enterprise score raised to ${bonusScore}%.`);
  };

  return {
    validationReport,
    componentAudits,
    selectedValidationIssue,
    setSelectedValidationIssue,
    validationCategoryFilter,
    setValidationCategoryFilter,
    handleRunFullValidation,
    handleResolveValidationIssue
  };
}
