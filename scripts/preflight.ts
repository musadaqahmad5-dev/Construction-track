// AI Fashion OS preflight checks script
import { checkReadinessGate } from '../src/features/release/readinessGate';

function runPreflightCheck() {
  console.log('=== AI FASHION OS: PREFLIGHT SYSTEM VERIFICATION ===');
  console.log('Validating configuration gates...');
  
  const gateReport = checkReadinessGate();
  
  console.log(`Gate Verification Status: ${gateReport.isReady ? 'READY' : 'IMMATURE'}`);
  console.log(`Total Errors Detected: ${gateReport.errorsCount}`);
  
  if (gateReport.criticalWarnings.length > 0) {
    console.log('Warnings reported:');
    gateReport.criticalWarnings.forEach(warn => console.log(` - [WARN] ${warn}`));
  }
  
  console.log('Preflight validation concluded successfully.');
}

runPreflightCheck();
