// AI Fashion OS full verification script
import { runSmokeSuite } from '../src/features/testing/smokeSuite';
import { runWorkflowTestSuite } from '../src/features/testing/workflowTests';
import { runUIRegressionSuite } from '../src/features/testing/uiRegression';
import { runContractVerificationSuite } from '../src/features/testing/contractVerification';

function runFullValidation() {
  console.log('=== AI FASHION OS: COMPLETE SYSTEM SUITE VALIDATION ===');
  
  const smoke = runSmokeSuite();
  const wf = runWorkflowTestSuite();
  const uiReg = runUIRegressionSuite();
  const contract = runContractVerificationSuite();

  console.log(`- Smoke Suite: ${smoke.passRate.toFixed(1)}% Passed (${smoke.passedCount}/${smoke.totalTests})`);
  console.log(`- Workflow Pipelines Suite: ${wf.passRate.toFixed(1)}% Passed`);
  console.log(`- UI Visual Regression Suite: ${uiReg.passRate.toFixed(1)}% Passed`);
  console.log(`- Schema contract alignment: ${contract.passRate.toFixed(1)}% Passed`);

  const cumulativePassRate = (smoke.passRate + wf.passRate + uiReg.passRate + contract.passRate) / 4;
  console.log(`===============================================`);
  console.log(`Cumulative Verification Rating: ${cumulativePassRate.toFixed(2)}%`);
  console.log(`===============================================`);
}

runFullValidation();
