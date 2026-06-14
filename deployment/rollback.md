# Rollback & Recovery SOP - AI Fashion OS

This SOP outlines actions required if release indicators exceed critical stability ranges on high exposure counts.

## 1. Automated Canary Rollbacks
The integrated experimentation and canary engines trace fault spikes of features in production.
- If error frequency ratio of active canary variant jumps above `5%` within any 15-minute interval:
  - The feature is automatically capped back to `0%` exposure.
  - Users are served the stable main fallback cache options transparently.

## 2. Emergency Manual Rollbacks
If a fatal UI regression bypasses automated telemetry checks:
1. Run preflight rollback check:
   ```bash
   npm run rollback -- --env=production --target-version=v1.6.8
   ```
2. Revert static asset directory:
   - Symlink stable container target folders.
   - Clean ephemeral caches by calling `CrashRecoveryService.purgeStateAndSelfHeal()`.
3. Verify site resolves correctly with zero console log regression loops.
