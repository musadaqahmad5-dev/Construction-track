# System Launch Checklist & Playbook
**Version**: 2.0.0-READY  
**Assigned Leads**: Design Lead & Application Architect  
**Launch Scope**: Live Regional Deployment to Production Gateway  

---

## 1. Pre-Launch Validation Phase (Days L-2 to L-1)
Essential dry-run preparation steps to execute prior to traffic cut-over.

* [ ] **Verify Environment Variables**: Confirm that production Cloud Run registry has active secrets set for `GEMINI_API_KEY` (ensure no legacy test keys are in use).
* [ ] **Firestore Verification**: Execute a dry-run auth handshake. Ensure that `firestore.rules` is successfully deployed and ESLint checks are zero-warning compliant.
* [ ] **Catalog Integration Sync Check**: Process manual POST to `/api/catalog/sync` to verify that external shop connections return structural nodes without timeout.
* [ ] **Run Core UAT Suite**: Verify that the entire 6-step testing cycle (auth, wardrobe add, strategy prompt, look generate, save, logout) passes perfectly.

---

## 2. Launch Day Operations Phase (Day L-0)
Actions to complete during the live migration window.

* [ ] **Traffic Drain Routing**: Check existing connection pools and safely schedule active container drain cycles.
* [ ] **Code Deployment Trigger**: Run production deployment scripts to update Cloud Run target container images.
* [ ] **Verify Ingress Paths**: Navigate directly to production domain and open browser debug console to verify there are zero websocket or HMR errors.
* [ ] **Live Auditing Check**: Trigger `GET /api/system/reality-audit` and confirm the compiled Truth evaluation index returns $\ge 88\%$.

---

## 3. Rollback & Fail-Safe Playbook
If critical operational alerts break threshold boundaries within the first 120 minutes of launch:

### Trigger Criteria:
* API success rate drops to $< 95\%$.
* Average lookbook generation latency exceeds $15s$ on Imagen provider endpoints.
* Unhandled exception rates spike $> 2\%$ of active user sessions.

### Rollback Action Plan:
1. **Immediate Ingress Re-Routing**: In Cloud Run console, instantly adjust traffic routing percentage to redirect 100% of incoming users to the previous safe revision.
2. **Database Schema Safeguard**: The `constructions` collection has been kept backward-compatible; do NOT drop tables or collections, as raw data models are intact on prior schemas.
3. **Emergency Logging Review**: Access server logs, search for structured JSON objects printed via `handleFirestoreError()` to isolate permission exceptions.

---

## 4. Post-Launch Monitoring Protocol
To sustain long-term operations post-release:

* **Monthly Security Rule Audits**: Verify no shadow updates can bypass state transitions. Refer to `SECURITY_REVIEW.md` for specific penetration testing scripts.
* **Daily Quota Resets Notification Tracker**: If standard Firestore free daily write metrics are exhausted, send automated reminders pointing users to upgrade paths in the Spark-Enterprise columns.
