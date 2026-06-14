# Launch Gating Checklist - Release Candidate 1 (RC1)

This checklist defines the non-negotiable operational readiness wickets that must be executed and approved prior to promotion to the stable product lane.

## 1. App Shell Verification
- [ ] Bootstrap execution time is certified below `300ms` on typical client thread.
- [ ] Active diagnostics scoring returns greater than or equal to `90` points.
- [ ] Critical warnings count equals exactly `0`.
- [ ] SafeMode checks return `inactive` (Standard runtime enabled).

## 2. Testing & Quality Gating
- [ ] `SmokeSuite` returns `100%` pass rate on client tests checks.
- [ ] `WorkflowSuite` executes sequential synthesis state changes with correct timing metrics.
- [ ] `uiRegression` confirms high-contrast visual layout balances.
- [ ] `contractVerification` authenticates JSON schema structure validity.

## 3. Reliability Gating
- [ ] MTTR (Mean Time to Recovery) remains under `15 seconds`.
- [ ] Error operations center indicates `0` fatal untriggered loop faults.
- [ ] System active uptime matches or exceeds `99.9%`.

## 4. Security Controls
- [ ] Session rate burst limits prevent more than 8 immediate concurrent requests.
- [ ] Input sanitization successfully rejects external XSS payload vectors.
- [ ] Tenant credit bounds protection prevents free-to-premium boundary overruns.
- [ ] Storage local integrity monitor validates storage parameters are untampered.

## 5. Deployment Approvals
- [ ] Run `./scripts/validate.sh` pre-rollout validation tool manually.
- [ ] Perform canary release at `10%` ratio increments.
- [ ] Validate immediate rollback scripts with simulate errors.
