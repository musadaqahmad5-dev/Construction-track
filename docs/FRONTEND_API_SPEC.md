# AIStyleHub API Integration Specification
## Enterprise-Ready Frontend API Architecture Design

This document details the complete production-grade API architecture engineered within the **Enterprise Autonomous Fashion Operating System (EAOS)** gateway layer to connect frontend clients with style intelligence services.

---

### 1. Unified Gateway Endpoints & Mappings

| Method | Endpoint | Description | Service Layer |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/style/analyze` | Generates structured Style DNA profiles from raw interaction signals. | `StyleAnalysisEngine` + Gemini 2.5 Flash |
| `POST` | `/api/outfit/generate` | Synthesizes custom outfit combinations based on inventories and occasions. | `OutfitRecommender` + Gemini 2.5 Pro |
| `POST` | `/api/trend/get` | Forecasts rising and peaking macro/micro global fashion trends. | `TrendDetector` |
| `GET` | `/api/user/profile` | Fetches consolidated User Style DNA, profile statuses, and vectors. | `StyleMemorySystem` |
| `POST` | `/api/recommendations` | Filters, ranks, and personalizes product collections via style vector alignment. | `StyleMemorySystem` (HNSW) |

---

### 2. High-Performance Middleware Pipelines

#### A. Authentication Verification & Session Binding
*   **Security standard**: Handled via robust Bearer JWT credential check.
*   **Decoded Identity Injection**: Standardized payload bindings automatically populate downstream request (`req.user`) contexts for user identification and plan tiering limits.

#### B. Sliding-Window Rate Limiter
*   **Algorithmic Guard**: In-memory IP registry tracks client rate ceilings.
*   **Header Protocol**: Transparently outputs standard HTTP rate indicators:
    *   `X-RateLimit-Limit`: Maximum permitted request ceilings.
    *   `X-RateLimit-Remaining`: Remaining request allocations within the current window.
    *   `X-RateLimit-Reset`: Timestamp indicating reset of limit.

---

### 3. Execution Verification Registry

All system endpoints, middleware, and schemas have been integrated, verified, and compiled inside the gateway:
*   **Ingress Router Router Path**: `/apps/api-gateway/src/routes.ts`
*   **Compilation Build Check**: `SUCCESS`
