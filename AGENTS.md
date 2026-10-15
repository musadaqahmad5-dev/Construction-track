# AIStyleHub / AI-SEOS — Technical Workspace Guidelines

## 1. Visual & Aesthetic Invariants
* **Background Palette Invariants**: All primary interfaces must adhere strictly to minimal light workspace palettes: High-contrast minimal off-white (`#FBFBFA`), warm studio sand (`#F5F4F0`), and soft linen (`#F7F6F2`). Never introduce dark slates as standard layout defaults.
* **Sidebar & Header Styling**: Crisp architectural layout with high-fidelity division borders (`border-zinc-200/80` or `border-black/5`), pristine elevated light surfaces (`#FFFFFF` or subtle linen tones), and clear typographic hierarchy.
* **Card & Container Architecture**: Elevated surfaces (`#FFFFFF` / `bg-white`) with subtle border containment (`border-zinc-200/80` or `border-black/5`), minimal drop-shadows (`shadow-sm`, `hover:shadow-md`), and smooth hover transitions (`hover:scale-[1.01] duration-300`).
* **Color Accents & Typography**:
  * **AI Operations**: Indigo / Violet shades (`#4F46E5` / `from-indigo-600 to-purple-600` gradients or soft ambient glow).
  * **Marketplace / Commerce Transactions**: High-contrast, clean Emerald greens (`#22c55e` / `#16a34a`).
  * **General Typography**: High-contrast dark charcoal and obsidian text colors (`#1C1B1A` / `#111827` / `text-zinc-900` / `text-zinc-600`) guaranteeing WCAG AA contrast compliance (>= 4.5:1).

## 2. Component Architecture & Contracts
* **Modular Code Structure**: Avoid consolidating multiple massive dashboards into single-file components. Always modularize layout sections (e.g., `AIEngineStudio.tsx`, `MarketplaceModule.tsx`, `WardrobeGrid.tsx`) into separate high-integrity files.
* **State Propagation**:
  * Sub-view switching must be managed cleanly using the main state container in `AIStyleHub.tsx`.
  * Real-time notifications and UI feedback must pass through standard lightweight browser event dispatchers (e.g., custom event triggers like `lookvision_show_toast`) to ensure decouple-ability.
* **Icons**: All interface icons must be imported natively from `lucide-react`. Never generate inline SVG files or introduce third-party icon libraries that conflict with existing structures.

## 3. Server-Side Security
* **Secret Containment**: Keep API keys, model parameters, and workspace tokens private. Never define sensitive keys inside frontend components. Utilize server-side router proxies (`/api/*`) in `server.ts` to query Google Gemini or other external intelligence engines.
