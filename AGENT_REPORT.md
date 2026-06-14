# Personal Fashion Agent System Architecture Report

This report documents the architectural implementation and system characteristics of the **Personal Fashion Agent** built in Phase L5.

## 1. System Overview
The Personal Fashion Agent (`fashionAgent.ts`) acts as our proactive styling coordinator that continuously monitors closet state, evaluates recent wear counts, compiles daily contextual styling outlooks, and prepares structured actionable system proposals.

## 2. Core Capabilities & Mechanics
*   **Active Wardrobe Monitoring**: Scans the registered clothing assets, isolating overused pieces (bottlenecks) and long-neglected pieces to guide balanced wear loops.
*   **Garment Repetition Detector**: Interrogates past wearing occurrences. If the identical clothing asset has been utilized in immediate continuous sequence, triggers a repetition/fatigue caution box encouraging fiber relaxation.
*   **Actionable System Proposals**: Translates style indices and calendar demands into concrete proposals:
    *   *Circular Laundry Care* (Washing soiled pieces to return them to closet pool).
    *   *Back-Drawer Asset Activation* (Rotating underutilized garments).
    *   *Agenda Pre-composition* (Staging matching coordinates for specified calendar events).

## 3. Human-in-the-Loop Governance
To enforce extreme financial safety, all proposals map directly to the **Agent Policies Module** (`agentPolicies.ts`). Continuous autonomous purchasing is strictly forbidden. Solidified actions require manual user confirmation to execute.
