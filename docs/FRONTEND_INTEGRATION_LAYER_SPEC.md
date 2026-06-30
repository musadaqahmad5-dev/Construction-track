# AIStyleHub Frontend Integration Layer Specification
=========================================================================
Enterprise Autonomous Fashion Operating System (EAOS) User Interface Spec
=========================================================================

This specification defines the complete client-side architecture, view state topologies, real-time response rendering pipelines, and API integrations for the **AIStyleHub Frontend Operating Layer**.

---

## 1. USER INTERFACE FLOWS & SCREEN STATES

The frontend is engineered as a responsive, high-fidelity Single Page Application (SPA) segmented into three main views, utilizing dynamic route animations via `motion/react` for smooth view transitions.

```
                                  +-----------------------+
                                  │      APP CONTAINER    │
                                  +-----------┬-----------+
                                              │
                     ┌────────────────────────┼────────────────────────┐
                     ▼                        ▼                        ▼
         +-----------------------+ +-----------------------+ +-----------------------+
         │      HOME PORTAL      │ │    AI CHAT STYLIST    │ │   OUTFIT GENERATOR    │
         │ - Sartorial Maturity  │ │ - Chat interface      │ │ - Wardrobe Inventory  │
         │ - Active DNA Summary  │ │ - Live-streamed steps │ │ - Occasion Selection  │
         │ - Trend-forward feed  │ │ - Contextual overrides│ │ - Visual Ensemble view│
         +-----------------------+ +-----------------------+ +-----------------------+
```

### 1.1 View 1: Home Sartorial Portal (Home.tsx)
*   **Key Features**:
    *   **Style DNA Card**: Visualizes preferred aesthetic archetypes using stylized progress bars and a high-contrast palette distribution.
    *   **Sartorial Maturity Dial**: Animated gauge highlighting the maturity rating (e.g., `89%`).
    *   **Curated Trend Feed**: Infinite horizontal scroll showing rising macro and micro trends with dynamic alignment scores.

### 1.2 View 2: Interactive AI Chat Stylist (ChatStylist.tsx)
*   **Key Features**:
    *   **Message Feed Scroll**: Double-buffered interactive stream showing user prompts and markdown-rendered stylist responses.
    *   **Cognitive Plan Viewer**: Collapsible status drawer showing the current underlying reasoning chain step-by-step (e.g., *"[RESOLVED] Prompt overrides style exclusion 'magenta'"*).
    *   **Interactive Feedback Button Rails**: Inline thumbs-up/down feedback triggers backpropagating adjustments to the user profile instantly.

### 1.3 View 3: Visual Outfit Generator (OutfitGenerator.tsx)
*   **Key Features**:
    *   **Occasion & Temp Sliders**: Ingress controls to parameterize the styling context.
    *   **Visual Wardrobe Grid**: Interactive bento-grid detailing active digital garments, filtered by category with check-selection toggles.
    *   **Ensemble Presentation Board**: Centered display showing the selected curated ensemble with product tags, cohesion scoring dials, and tailored stylist recommendations.

---

## 2. API CONNECTION MAPPING

All frontend services map directly to the unified Express Gateway REST surface documented in `/docs/FRONTEND_API_SPEC.md`.

```
  Frontend Service (SartorialClient)                API Gateway Endpoint
┌────────────────────────────────────┐             ┌───────────────────────────────────┐
│ fetchUserProfile(userId)           │ ── (GET)  ──> │ /api/v1/user/profile              │
├────────────────────────────────────┤             ├───────────────────────────────────┤
│ processConsultation(userPrompt)    │ ── (POST) ──> │ /api/v1/stylist/consult           │
├────────────────────────────────────┤             ├───────────────────────────────────┤
│ submitStylistFeedback(sessionRes)  │ ── (POST) ──> │ /api/v1/stylist/feedback          │
├────────────────────────────────────┤             ├───────────────────────────────────┤
│ generateRecommendations(candidates)│ ── (POST) ──> │ /api/v1/fashion/recommend         │
└────────────────────────────────────┘             └───────────────────────────────────┘
```

---

## 3. STATE MANAGEMENT STRUCTURE

The application state is structured using a lightweight React Context wrapper to manage global style DNA and session properties, ensuring cross-view coherence without excessive re-renders.

```typescript
// src/context/SartorialContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserStyleProfile } from "../../packages/memory-engine/src/StyleMemorySystem";
import { getApiBaseUrl } from "../utils/api";

interface SartorialContextType {
  profile: UserStyleProfile | null;
  activeSessionId: string | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfileOnFeedback: (sessionId: string, rating: number) => Promise<void>;
}

const SartorialContext = createContext<SartorialContextType | undefined>(undefined);

export const SartorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserStyleProfile | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${getApiBaseUrl()}/user/profile?userId=usr_9921_sartor`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("aistylehub_token")}` }
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.payload);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <SartorialContext.Provider value={{ profile, activeSessionId, loading, error, refreshProfile, updateProfileOnFeedback: async () => {} }}>
      {children}
    </SartorialContext.Provider>
  );
};
```

---

## 4. USER INTERACTION FLOWS & FEEDBACK

```
[User Action] ──> Enter Prompt: "Tailored suit but casual for summer sunset"
                      │
                      ▼
[UI Dispatch] ──> Set loading state. Show animated progress bar ("Generating style plan...")
                      │
                      ▼
[API Request] ──> POST /api/v1/stylist/consult with available inventory
                      │
                      ▼
[UI Render]   ──> Staggered display of styling reasoning chain steps:
                  1. Match occasion "summer sunset" with light linens
                  2. Override DNA dark color restrictions for brighter hues
                  3. Select tailored blazer coordinate
                      │
                      ▼
[End State]   ──> Display recommended outfit card with 5-star feedback rating rail
```

---

## 5. REAL-TIME AI RESPONSE RENDERING

To prevent sudden UI layout shifts during large text payload deliveries, responses are parsed and structured progressively:
1.  **Split Rendering Nodes**: The JSON payload separates technical data (cohesiveness scores, item arrays) from markdown-based justifications.
2.  **Staggered Layout Fades**: Individual clothing components in the recommended outfit card fade in sequentially using micro-animations to create a premium, hand-curated experience.
3.  **Typographic Styling**: Justifications use proportional sans-serif styling with ample margins, while reasoning chains use high-contrast monospaced cards for visual distinction.

---

## 6. MOBILE + DESKTOP RESPONSIVENESS DESIGN

*   **Responsive Breakpoints**:
    *   **Desktop (`lg` / `xl`)**: Three-column bento layout displaying the core profile navigation side-by-side with the active workspace panels.
    *   **Tablet (`md`)**: Split-screen dashboard pairing the interactive chats with contextual wardrobe controls.
    *   **Mobile (`sm`)**: Full-screen single scrollable view with bottom navigation drawers and sliding profile widgets.
*   **Touch Targets**: Buttons, checkboxes, and rating elements maintain a minimum size of `44px` with smooth transition hover indicators for desktop pointers.
