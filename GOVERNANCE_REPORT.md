# Governance Policies & Risk Audits Report

This document outlines our compliance structures, risk metrics, and the human checkpoint workflow.

## 1. Compliance Metrics & Static Policies
Our Policy Engine (`src/governance/policyEngine.ts`) enforces rules in real time:
*   **Restriction of Purchases**: Strictly bans styling algorithms from initiating commercial purchases, checking APIs to prevent financial leaks.
*   **Source Verification**: Flags sandboxed plugins that request background features without declaring mandatory permission parameters.

## 2. Integrated Risk Scoring
The Risk Evaluator (`riskEvaluator.ts`) scores platform vulnerabilities dynamically on a 0-100 scale:
*   **Sartorial Strain Index**: Tallies heavily worn garments to preserve delicate fabrics or prompt professional dry-cleaning loops.
*   **Sensory Completeness**: Warns users if their wardrobe lists fall below required baseline totals.

## 3. Executive Checked Approvals
*   **Checked Approvals** (`approvalFlow.ts`): Requires manual user permission for hot extension installations or high-impact wardrobe cleanouts, preventing code anomalies from introducing silent changes.
