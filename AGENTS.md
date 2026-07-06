# AIStyleHub / AI-SEOS — Technical Workspace Guidelines

## 1. Visual & Aesthetic Invariants
* **Background Colors**: All main layouts must utilize a deep, premium dark-slate background (`#05050a` / `#06060c`). Never introduce bright white or standard gray backgrounds unless explicitly locked to a user-selected high-contrast accessibility theme.
* **Sidebar Styling**: The persistent left-sidebar must remain locked to `#07070c` with a high-fidelity border-right of `border-white/5` (or a subtle glassmorphic indigo overlay).
* **Card Design**: Cards (Creations, Closet items, Marketplace listing cards) must have uniform dimensions, subtle aspect ratios matching portrait orientation, and a border style of `border-white/5` with hover transitions `hover:border-violet-500/20 hover:scale-[1.01] duration-300`.
* **Color Accents**:
  * **AI Operations**: Indigo / Violet shades (`from-indigo-500 to-purple-600` gradients or glowing text shadows).
  * **Marketplace / Commerce Transactions**: High-contrast, clean Emerald greens (`#22c55e` / `#16a34a`).
  * **General Typography**: Base-zinc text colors (`text-zinc-100` / `text-zinc-400` / `text-white/70`).

## 2. Component Architecture & Contracts
* **Modular Code Structure**: Avoid consolidating multiple massive dashboards into single-file components. Always modularize layout sections (e.g., `AIEngineStudio.tsx`, `MarketplaceModule.tsx`, `WardrobeGrid.tsx`) into separate high-integrity files.
* **State Propagation**:
  * Sub-view switching must be managed cleanly using the main state container in `AIStyleHub.tsx`.
  * Real-time notifications and UI feedback must pass through standard lightweight browser event dispatchers (e.g., custom event triggers like `lookvision_show_toast`) to ensure decouple-ability.
* **Icons**: All interface icons must be imported natively from `lucide-react`. Never generate inline SVG files or introduce third-party icon libraries that conflict with existing structures.

## 3. Server-Side Security
* **Secret Containment**: Keep API keys, model parameters, and workspace tokens private. Never define sensitive keys inside frontend components. Utilize server-side router proxies (`/api/*`) in `server.ts` to query Google Gemini or other external intelligence engines.
