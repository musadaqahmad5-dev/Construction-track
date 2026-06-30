# Enterprise Autonomous Fashion Operating System (EAOS)
## Core Specification: AIStyleHub User Style Memory System

This specification defines the architectural design, schema representation, and functional contracts for the **AIStyleHub User Style Memory System**, engineered as a foundational sub-layer of the **Enterprise Autonomous Fashion Operating System (EAOS)** memory architecture.

---

### 1. Architectural Topology

The style memory system integrates dual-tier storage (Structured Relational + Unstructured High-Dimensional Vector) to track style lifecycle states across episodic and semantic spaces.

```
                   +------------------------+
                   |  Sartorial Feed Ingest |
                   +-----------+------------+
                               |
                               v
               +---------------+---------------+
               |     Behavior Learning Engine  |
               +---------------+---------------+
                               |
            +------------------+------------------+
            |                                     |
            v                                     v
+-----------+------------+          +-------------+------------+
|  Active Style Profile  |          |  Episodic Outfit History  |
|  (Relational state /   |          |  (1536d Cosine Vector    |
|   Aesthetic Weights)   |          |   Semantic Search Space) |
+------------------------+          +--------------------------+
```

---

### 2. User Style Profile Schema Blueprint

Represents the core structured state of a user's style preference:

*   **Aesthetic Archetypes (`AestheticPreference`)**: Structured ratings (0.0 to 1.0) for style archetypes (e.g., *Classic Minimalism*, *Techwear*, *Sartorial Elegance*).
*   **Aesthetic Exclusions**: Hard-coded exclusions such as banned color hex codes or structural silhouettes to prevent undesirable recommendations.
*   **Semantic Style DNA Vector**: A 1536-dimensional unit vector modeling multi-concept wardrobe affinities.

---

### 3. Core Functional Components

#### A. Style Preference Tracking System
Tracks clickstream and purchase feed events. An exponential moving average (EMA) decays old preferences at rate $\lambda = 0.1$, while positive reinforcement scales active archetype weights to respond to rapid user style drifts.

#### B. Outfit History Memory
Episodic records representing outfit ensembles worn on specific occasions are saved into the HNSW (Hierarchical Navigable Small World) index. Similar past outfit profiles are retrieved using cosine similarity matches to enable comparative analogical reasoning.

#### C. Personalization & Ranking Engine
Takes candidate garment assets from global brand feeds and filters/ranks them on-the-fly via high-performance vector alignment queries.

---

### 4. Verification & Testing Registry

The schema, algorithms, and controller routes have been successfully deployed and validated:
*   **Path Reference**: `/packages/memory-engine/src/StyleMemorySystem.ts`
*   **Ingress Router**: `/apps/api-gateway/src/routes.ts`
*   **Compilation Status**: `PASS`
