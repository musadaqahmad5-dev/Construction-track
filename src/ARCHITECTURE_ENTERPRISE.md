# AIStyleHub - Enterprise Architecture Specification

This document details the transition of the **AIStyleHub** codebase to a clean, multi-layered enterprise architecture. This refactoring cleanly isolates concerns, prevents duplication, and preserves **100% of the visual interface, navigation, user workflows, and database interfaces**.

---

## 1. Multi-Layer High-Level Overview

To guarantee long-term maintainability, scalability, and developer experience, the workspace is organized into three distinct logical layers:

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                   PRODUCT LAYER                                   |
|               (UI Components, Interactive Screens, Layout Modules)                 |
|                                                                                   |
|  [Home Feed]  [AI Creations]  [Virtual Try-On]  [Marketplace]  [Cognitive Passport] |
|                                                                                   |
+----------------------------------------+------------------------------------------+
                                         | Reads State & Requests Decisions
                                         v
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                   ENGINE LAYER                                    |
|               (Decision-Loops, Recommendation Scoring, State Brokers)             |
|                                                                                   |
|  [FashionOrchestrator]  [UnifiedFashionOS]  [AIEngine]  [StorageHardening]        |
|                                                                                   |
+----------------------------------------+------------------------------------------+
                                         | Triggers Operations & Persistence
                                         v
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                  PLATFORM LAYER                                   |
|                (Database Bridges, Capability Registry, API Clients)                |
|                                                                                   |
|   [Firebase/Firestore]  [CapabilityRegistry]  [Google GenAI]  [Shared Types]      |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Structural Mappings

### 2.1 Product Layer
The Product Layer handles **presentation and user interactions**. Components here have **zero reusable core business logic** and delegate heavy operations, recommendations, and metrics computations to the underlying engines.

*   **Core UI Shell & Routing Gateway:**
    *   `AIStyleHub`: The global coordinator that orchestrates sidebar layouts, sub-view navigation, global notifications, and context switches.
*   **User-Facing Product Modules:**
    *   `HomeFeed`: Aggregates the discovery feed, editor's picks, community styling reels, and trending items.
    *   `AIFashionMVPSuite` (AI Creations): Houses the virtual garment creator, prompt constructor, and custom coordinate mixer.
    *   `VirtualStudioTryOn`: Conducts visual fitting, sizing estimations, and pose overlay alignments.
    *   `MarketplaceModule`: Integrates creator collections, listings, commerce actions, and local shop matchers.
    *   `CognitivePassport` (User Profile): Organizes personal stylist histories, 8D preference vectors, and historic outfit logs.

### 2.2 Engine Layer
The Engine Layer isolates **reusable fashion intelligence, algorithms, and states** from the UI. It can run in any context (even headlessly inside background workers or CLI processes).

*   **Intelligence & Recommendation:**
    *   `FashionOrchestrator`: The primary styling core that evaluates coordinate suitability, calculates weather pairings, and ranks daily matching candidates.
    *   `AIEngine`: Decides the structure of the discovery feed and pairs items with local inventory.
*   **System State & Telemetry Brokers:**
    *   `UnifiedFashionOS`: The core operating system of AIStyleHub. It brokers all in-memory states, maintains action trails, coordinates incident logs, and computes real-time activation/retention rates.
    *   `StorageHardening`: Runs proactive integrity checks, counts database sync statuses, and drives self-healing database loops.
    *   `AnalyticsEngine`: Governs event tracking queues and computes dropoffs inside the conversion funnel.

### 2.3 Platform Layer
The Platform Layer contains **infrastructure, low-level connectors, and cross-cutting utilities**. No product-specific logic resides here.

*   **Persistence & Real-Time Cloud Connections:**
    *   `firebase.ts`: Establishes connections to Google Firestore and Google Firebase Authentication.
*   **Platform Modularization Core:**
    *   `CapabilityRegistry`: Toggles platform extension modules safely.
    *   `DependencyResolver`: Assesses if active features have critical dependencies disabled.
    *   `RuntimeGuard`: Shields the runtime from memory or UI loop exceptions.
*   **API Connectors & Cross-Cutting Helpers:**
    *   `gemini.ts`: Wraps direct server-side calls to the Google GenAI SDK.
    *   `types.ts`: Serves as the universal contract repository for the entire platform.

---

## 3. Dependency Graph

The architecture strictly enforces **unidirectional top-down dependency flow**:

```
[ Product Layer Components ] ─── (Import UI Cards, Layout Widgets) ───► [ Shared Layouts ]
            │
            │ (Read State / Request Decisions)
            ▼
[ Engine Layer Orchestrators ] ─── (Self-Heal State / Track Events) ───► [ Hardened Monitors ]
            │
            │ (Query / Persist / Log)
            ▼
[ Platform Layer APIs ] ─── (Interact / Run Queries) ───► [ Google Firebase / GenAI SDK ]
```

*   **Rule 1:** The Product Layer can depend on the Engine Layer and the Platform Layer.
*   **Rule 2:** The Engine Layer can depend ONLY on the Platform Layer. It must have **zero imports** referencing the Product Layer (no React UI components, layout buttons, etc.).
*   **Rule 3:** The Platform Layer must be completely independent, relying only on universal schemas, configuration values, and external SDKs.

---

## 4. Component Relationship Map

To understand the core interaction pathways:

1.  **AI Workspace Action Loop:**
    *   User uploads a photo in `AIFashionMVPSuite` (Product) $\rightarrow$ Requests vision categorization from `FashionOrchestrator` (Engine) $\rightarrow$ Uses Gemini Vision API via `gemini.ts` (Platform) $\rightarrow$ Persists item record into Firestore via `firebase.ts` (Platform) $\rightarrow$ Generates audit trail entry inside `UnifiedFashionOS` (Engine) $\rightarrow$ Displays success feedback on `HomeFeed` (Product).
2.  **Telemetry Sync Loop:**
    *   Interactive events on the UI (Product) $\rightarrow$ Dispatch data to `AnalyticsEngine` (Engine) $\rightarrow$ Trigger state updates via `UnifiedFashionOS` (Engine) $\rightarrow$ Check network status via `useOnlineStatus` (Platform) $\rightarrow$ Log incidents safely in `ErrorRegistry` (Engine).

---

## 5. Architectural Alignment Check

*   **UI Changes:** None. The app looks, feels, and behaves identically.
*   **API Breakages:** None. Re-export entry points preserve existing TypeScript types, contracts, and APIs.
*   **Reliability:** Preserved. The hardened database self-healing cycles and telemetry collection are fully intact.
