# Explainability Layer Architecture Report

This report documents our design details for the **Explainability Layer** built in Phase L5.

## 1. System Overview
The Explainability Layer (`decisionNarrator.ts`, `agentSummary.ts`) ensures that recomendations are accompanied by clear narratives, detailing choices and comparing options.

## 2. Core Capabilities & Mechanics
*   **Decisional Narrative Generation**: Every suggested look is paired with structured answers covering three critical questions:
    1.  *Why Chosen*: Precise alignment of fabric weights to context parameters.
    2.  *Why Alternatives Dropped*: Explicit explanation of bypassed options (e.g. avoiding overuse fatigue).
    3.  *Memory Influence*: Tracing the recommendation back to user satisfaction ratings and interaction logs.
*   **Interactive Trace Drawer**: Interactive UI elements that allow deep-diving into individual garment logs.
*   **Precision Aggregator**: Tracks overall recommendation matching statistics and summaries across all catalog items.
