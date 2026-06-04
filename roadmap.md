# Migration Roadmap: Transformation to AI Fashion Platform

This roadmap details the staged approach to migrating the legacy construction tracker into a modern, aesthetic AI Fashion Assistant and Closet Planner, ensuring zero service disruption or data corruption.

---

## Phase 1: Workspace Sanitation & Preservation

### 1.1 Document Legacy Interfaces
* Freeze `/src/components/KiaTelemetry.tsx` to preserve the original visual layout math.
* Ensure assets and imports are documented before refactoring.

### 1.2 Deprecate Industrial Copy
* Plan the removal of construction headers (e.g., *"KIA MOVEMENT TECHNOLOGY"*, *"CONSTRUCT"*) and replacement with clean sartorial copy.
* Isolate icons from `lucide-react` such as `HardHat`, `Hammer`, and `ConstructionIcon` to be swapped with `Shirt`, `Sparkles`, `Calendar` and `ShoppingBag`.

---

## Phase 2: Schema Refactoring & Security Updates

### 2.1 Update Data Definitions (`firebase-blueprint.json`)
* Rewrite entity mappings to reflect `WardrobeItem` instead of `Construction`.
* Redefine types and valid enums to map wardrobe states: `['In Closet', 'Planned', 'Worn/Wash']`.

### 2.2 Rebuild Database Safe-Guards (`firestore.rules`)
* Ensure default-deny logic remains untouched.
* Transition validation functions from `isValidConstruction` to `isValidWardrobeItem`.
* Reinforce PII guards to isolate user metadata securely.

---

## Phase 3: Redirecting UI Elements & Client State

### 3.1 Swap Component Presentation layers
* **Header / Landing View**: Rebrand the logo to a stylish, minimalist vector asset with elegant tracking typography.
* **Form Submissions**: Replace "Project Name" with "Apparel Name" and categories list to `['Casual', 'Formal', 'Sportswear', 'Outerwear', 'Accessories']`.
* **View Toggles**: Rename "Active Base" list view to "My Closet / Dressing Room" and transition "Tactical Fleet" to an interactive "Styling Canvas".

### 3.2 Relabel Lifecycle Controls
* Rebrand the status cycling flow:
  1. *Planning* $\rightarrow$ **Ready / In Closet**
  2. *In Progress* $\rightarrow$ **Planned to Wear**
  3. *Completed* $\rightarrow$ **Worn / Needs Wash**
* Update color styles associated with badges to soft, aesthetic colors (slates, sands, sage greens) matching the minimalist fashion palette.

---

## Phase 4: Refactoring cognitive AI Prompts

### 4.1 Update Vision Prompts (`src/lib/gemini.ts`)
* Reprogram `analyzeSiteImage` $\rightarrow$ `analyzeOutfitImage`.
* Shift analysis prompt to extract:
  - Material weights and fabric quality guesses
  - Primary, secondary, and tertiary outfit color codes
  - Suggested matching pants, skirts, or accessories.

### 4.2 Reprogram Text-Generators
* Adjust the generation logic to formulate customized style cards instead of construction strategies.
* Ensure the tactical list matches styling rules (e.g., contrast rules, layering techniques, occasion suitability).
