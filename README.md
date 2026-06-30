# AIStyleHub: Enterprise Autonomous Fashion Operating System (EAOS)
=========================================================================
AIStyleHub is an advanced, production-ready, full-stack SaaS platform powered by Google's Gemini models. It provides real-time personalized styling, multi-agent sartorial consultations, interactive wardrobe management, trend analytics, and robust billing engines.

This repository is designed for instant, turnkey deployment to production hosting services (Google Cloud Run, Netlify, Vercel) or local enterprise environments.

---

## 1. System Folder Structure

The project is structured as a modular Monorepo containing reusable package domains and an executable full-stack application.

```
AIStyleHub/
├── apps/                               # Executable Environments
│   └── api-gateway/                    # Central security & API routing endpoint
│       ├── src/
│       │   ├── index.ts                # Gateway Express server entry point
│       │   └── routes.ts               # Unified API route mappings & proxies
│       └── package.json
├── packages/                           # Domain Domain Modules (NPM workspaces)
│   ├── ai-engine/                      # Real-time Fashion Recommendation & Gemini Core
│   │   ├── src/
│   │   │   ├── FashionRecommendationEngine.ts # Core high-performance scorer
│   │   │   ├── GeminiService.ts        # @google/genai orchestration client
│   │   │   ├── AIStylistSystem.ts      # Multi-turn cognitive chatbot logic
│   │   │   └── TrendDetector.ts        # Predictive style analytics stream
│   │   └── package.json
│   ├── memory-engine/                  # Distributed context & user style DNA
│   │   ├── src/
│   │   │   ├── StyleMemorySystem.ts    # Style profile DNA synthesis engine
│   │   │   └── VectorMemoryStore.ts    # Cosine vector similarity search (pgvector)
│   │   └── package.json
│   ├── multi-agent/                    # Multi-agent coordination core
│   │   └── src/
│   │       └── AgentOrchestrator.ts    # Cognitive planners & materials governor
│   └── workflow-engine/                # Transaction lifecycle supervisor (DAG)
│       └── src/
│           └── WorkflowEngine.ts       # Dependency resolver with step retry pools
├── src/                                # Front-end React Interface (Vite Powered)
│   ├── components/                     # High-fidelity dashboard modules
│   │   ├── AIStyleHub.tsx              # Interactive application workspace
│   │   ├── OnboardingFlow.tsx          # Dynamic Style DNA onboarding questionnaire
│   │   ├── SaaSPricingUpsell.tsx      # Multi-tier subscription gating visualizer
│   │   └── WardrobeGrid.tsx            # Digital clothing inventory visual workspace
│   ├── core/                           # System core layout and wrappers
│   ├── App.tsx                         # Main client routing wrapper
│   ├── index.css                       # Global Tailwind styling sheets
│   └── main.tsx                        # Frontend entrypoint
├── docs/                               # Architecture Specifications & Manuals
│   ├── FRONTEND_INTEGRATION_LAYER_SPEC.md # Client structure layout and states
│   ├── PRODUCTION_DEPLOYMENT_SPEC.md   # Deployment blueprints & Docker definitions
│   ├── MONETIZATION_SPEC.md            # Tiered billing schemas and Stripe proxies
│   ├── RECOMMENDATION_ENGINE_SPEC.md   # Mathematical formulas & JSON schemas
│   └── LAUNCH_READINESS_REPORT.md      # System validation & operational metrics
├── DEPLOYMENT_GUIDE.md                 # Clear step-by-step release instructions
├── package.json                        # Monorepo workspaces & dependency map
├── server.ts                           # Full-stack dev/production gateway loader
├── tsconfig.json                       # Common TypeScript compiling parameters
└── vite.config.ts                      # Client asset bundler configurations
```

---

## 2. Local Installation & Configuration

### Prerequisites
*   **Node.js**: Version 20.0.0 or higher
*   **NPM**: Version 10.0.0 or higher

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/aistylehub.git
cd aistylehub
```

### Step 2: Install Base Dependencies
From the repository root directory, run:
```bash
npm install
```

### Step 3: Populate Environment Variables
Copy the `.env.example` file to create a `.env` file:
```bash
cp .env.example .env
```
Fill out your specific application parameters inside `.env`:
*   `GEMINI_API_KEY`: Required server-side secret key from Google AI Studio.
*   `VITE_API_BASE_URL`: Inbound endpoint routing for client interfaces (defaults to `/api` or `http://localhost:3000/api`).
*   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`: Client coordinates to sync with your database cluster.

---

## 3. Starting the Application

The full-stack application can be executed locally in both development and production bundles.

### 3.1 Run in Development Mode
Starts a local development server for continuous, instant client updates:
```bash
npm run dev
```
Open **http://localhost:3000** on your browser to view the live dashboard.

### 3.2 Build for Production
Prepares and compiles optimized production static client files and backend server scripts:
```bash
npm run build
```

### 3.3 Run Production Bundle
Runs the compiled server from `/dist`:
```bash
npm run start
```

---

## 4. Multi-Platform Deployment Guides

### 4.1 Deployment to Google Cloud Run (Full-Stack Containerized)
This is the recommended deployment pattern as it runs both the Express APIs and static React assets in a unified container.

1.  **Build & Tag the Docker Image**:
    ```bash
    docker build -t gcr.io/[YOUR_PROJECT_ID]/aistylehub:latest .
    ```
2.  **Push the Image to GCP Registry**:
    ```bash
    docker push gcr.io/[YOUR_PROJECT_ID]/aistylehub:latest
    ```
3.  **Deploy Container to Cloud Run**:
    ```bash
    gcloud run deploy aistylehub \
      --image gcr.io/[YOUR_PROJECT_ID]/aistylehub:latest \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --port 3000
    ```

### 4.2 Deployment to Netlify (Static Hosting)
Netlify compiles and hosts the Vite frontend statically.

1.  Ensure `netlify.toml` exists in the project root directory.
2.  Connect your GitHub repository to the Netlify dashboard.
3.  Set **Build Command** to `npm run build`.
4.  Set **Publish Directory** to `dist`.
5.  Add your public environment variables (prefixed with `VITE_`) in the Site Settings console.

### 4.3 Deployment to Vercel (Static Hosting)
Deploy optimized assets directly using Vercel CLI.

1.  Install Vercel CLI globally: `npm install -g vercel`
2.  Run the initiation command from the project root:
    ```bash
    vercel
    ```
3.  Confirm default settings. Vercel automatically detects the Vite runtime environment, compiles static assets to `/dist`, and serves routes with clean rewrites.

---

## 5. Deployment Verification Registry

To ensure robust operations before pushing to your GitHub main branch, run:
```bash
# Code Quality check
npm run lint

# Compile and type check verify
npm run build
```
Once both return successfully, **AIStyleHub is 100% ready for live production launch!**
