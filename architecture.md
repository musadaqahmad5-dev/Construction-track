# Architecture Specification: AI Fashion Assistant & Style Platform

This document describes the architectural transition from the legacy **Construction & Fleet Tracking Telemetry System** to the **AI Fashion Assistant & Personal Closet Platform**.

---

## 1. High-Level Architectural State

The platform is constructed as a **Serverless Client-Side Single Page Application (SPA)** that integrates real-time cloud data streams with multi-modal generative intelligence models.

```
+--------------------------------------------------------------------------+
|                                                                          |
|                            CLIENT BROWSER (Vite + React)                  |
|                                                                          |
|    +------------------------+  +------------------------------------+    |
|    |    Tailwind V4 CSS     |  |       Framer Motion Layers         |    |
|    |      UI Presentation   |  |      Animate / State Toggles       |    |
|    +------------------------+  +------------------------------------+    |
|                               |                                          |
|                               v                                          |
|                     +----------------------+                             |
|                     |   App Router / State |                             |
|                     +----------------------+                             |
|                               |                                          |
+-------------------------------|------------------------------------------+
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
+--------------------------+             +--------------------------+
|     CLOUD STORAGE        |             |  AI GENERATIVE COGNITION |
|                          |             |                          |
|  Firebase Firestore DB   |             |    Google GenAI SDK      |
|  * User-bound records    |             |    * Multi-modal models  |
|  * Real-time listeners   |             |    * Vision context input|
|                          |             |                          |
|  Firebase Auth (Google)  |             |                          |
+--------------------------+             +--------------------------+
```

---

## 2. Technical Stack Specification

| Technology Layer | Solution Component | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Framework Engine** | **React 19 + TypeScript** | Enables type-safe, componentized rendering of closet views and style grids. |
| **Vite Tooling** | **Vite 6** | Serves as the light, ultra-fast HMR-ready development builder and bundler. |
| **Graphic Styles** | **Tailwind CSS V4** | Utility-first layout styles supporting an elegant, minimalist fashion palette. |
| **Animations** | **Motion (`motion/react`)**| Drives layout reordering, card transitions, and slide-in dressing room views. |
| **Durable Firestore**| **Firebase Firestore** | Houses real-time collections of clothing items, style strategies, and histories. |
| **Authentication** | **Firebase Auth** | Locks user closets to personal Google Identities via secured popups. |
| **Cognitive Engine** | **Google GenAI SDK** | Powers the styling brain (`gemini-3-flash-preview`) to generate coordinates. |

---

## 3. Persistent Data Model Blueprint

To support the AI Fashion platform, the Firestore data architecture shifts from industrial units to personal wardrobe assets.

```
       LEGACY SCHEMA                            TARGET SCHEMA
+-------------------------+             +--------------------------+
|  Collection:            |             |   Collection:            |
|  /constructions         |             |   /wardrobe              |
+-------------------------+             +--------------------------+
|  * id: string           |             |   * id: string           |
|  * title: string        |  =======>   |   * title: string        |
|  * category: string     |             |   * category: string     |
|  * description: string  |             |   * description: txt     |
|  * status: string       |             |   * status: string       |
|  * strategy: string     |             |   * aiStyleAdvice: txt   |
|  * userId: string       |             |   * userId: string       |
|  * createdAt: datetime  |             |   * createdAt: datetime  |
+-------------------------+             +--------------------------+
```

### 3.1 Legacy System Key-Mapping
1. **`title`**: Represents the apparel item descriptor (e.g., *"Merino Wool Trench Coal"*).
2. **`category`**: Encapsulates closet categories: `['Casual', 'Formal', 'Sportswear', 'Outerwear', 'Accessories']` (instead of building types).
3. **`description`**: Describes fabric properties, fit styles, colors, and season suitability.
4. **`status`**: Maps the laundering or wearing lifecycle:
   - **Legacy: "Planning"** $\rightarrow$ **Target: "In Closet"** (Available)
   - **Legacy: "In Progress"** $\rightarrow$ **Target: "Planned"** (Set aside to wear soon)
   - **Legacy: "Completed"** $\rightarrow$ **Target: "Worn/Wash"** (Need laundering or recently exhausted)
5. **`strategy`**: Refactored to represent the **AI Style Advice & Coordinates** generated dynamically for each wardrobe piece.

---

## 4. Cognitive Intelligence (AI) API Structures

The system employs `@google/genai` completely serverless on the client side, bound strictly to the Google Cloud Run environment secrets.

### 4.1 Vision Pipeline: Clothing Recognition (`analyzeOutfitImage`)
Examines user-uploaded outfit or selfie photos to extract aesthetic profiles:
* **Input**: Base64 JPEG/PNG stream.
* **Output**: Styled JSON containing recognized category, color wheel suggestions, and style coordinates.

### 4.2 Textual Coordination Brain (`generateStylingIdeas`)
Produces dynamic dressing ideas based on personal fit preference and categorical style targets:
* **Parameters**: `title`, `category`, `description`.
* **Output**: Distinct output structured with:
  1. *STYLING PAIRINGS*: Direct recommendations for what to coordinate it with.
  2. *SEASON/OCCASION*: Target contexts (e.g., Rainy autumn, business casual).
  3. *COLOR HARMONY WARNING*: Pitfalls or matching rules for maximum visual appeal.

---

## 5. Security & Authorization Layout

ABAC (Attribute-Based Access Control) boundaries are enforced at the Firestore security interface layer (`firestore.rules`).

1. **Isolation Invariant**: Every read/write operation verifies that the document's `userId` field perfectly matches the verified Google Login Token:
   `request.auth.uid == resource.data.userId`
2. **Schema Hardening**: Custom validation constraints ensure only legitimate categories and statuses are written.
3. **Temporal Control**: All updates verify that `createdAt` remains immutable and that `updatedAt` relies on server-managed timestamps.
