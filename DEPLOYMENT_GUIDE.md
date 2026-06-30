# AIStyleHub Production Deployment Instructions
=========================================================================
Enterprise Autonomous Fashion Operating System (EAOS) Build & Deployment
=========================================================================

This deployment guide contains concrete, copy-pasteable instructions for deploying the AIStyleHub full-stack application.

---

## 1. Local Verification & Building

Ensure you have Node.js 20+ installed.

### 1.1 Standard Build Command
Runs Vite to compile front-end assets and esbuild to compile the Express backend into `/dist`.
```bash
# Install all required packages
npm install

# Build static front-end assets & bundle the Express server
npm run build
```

### 1.2 Local Execution
Runs the production bundle.
```bash
# Spin up production server
npm run start
```
By default, the application runs on **http://localhost:3000**.

---

## 2. Environment Configurations (`.env`)

Create a `.env` file in the root directory by copying the `.env.example` file:
```bash
cp .env.example .env
```
Fill out the variables using the following rules:
*   **GEMINI_API_KEY**: Retrieve from Google AI Studio. Keep it private.
*   **FIREBASE_SERVICE_ACCOUNT**: Set to your Firebase IAM JSON credentials.
*   **STRIPE_SECRET_KEY** / **STRIPE_WEBHOOK_SECRET**: Set to your Stripe developer key pairs to enable subscriptions.
*   **VITE_FIREBASE_API_KEY** / **VITE_FIREBASE_PROJECT_ID**: Public credentials to connect the front-end interface directly to your client database.

---

## 3. Deployment to Google Cloud Run (Recommended)

Because Cloud Run executes the full-stack container natively, it supports both the Express API routers and the React single-page frontend from a unified port (3000).

### 3.1 Step 1: Build & Tag Docker Image
Using Google Cloud Build or your local docker client, build and push the container:
```bash
# Build the container
docker build -t gcr.io/[PROJECT_ID]/aistylehub:latest .

# Push image to GCP Container Registry
docker push gcr.io/[PROJECT_ID]/aistylehub:latest
```

### 3.2 Step 2: Deploy Container
Deploy the image directly to Cloud Run:
```bash
gcloud run deploy aistylehub \
  --image gcr.io/[PROJECT_ID]/aistylehub:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars="NODE_ENV=production,GEMINI_API_KEY=your_gemini_key_here"
```

---

## 4. Deployment to Netlify

Vite compiles static front-end assets inside `/dist`. Netlify can host the frontend statically and proxy the backend routes via serverless endpoints.

### 4.1 netlify.toml Configuration
The project is configured out-of-the-box with a `netlify.toml` file in the root. 

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4.2 Steps:
1.  Connect this repository to Netlify.
2.  Set Build command: `npm run build`
3.  Set Publish directory: `dist`
4.  Add your client-side environment variables prefixed with `VITE_` under Site Settings > Environment Variables.

---

## 5. Deployment to Vercel

Vercel provides native Vite hosting and is ideal for quick client-side deployments.

### 5.1 vercel.json Configuration
Create a `vercel.json` file to manage rewrites for the Single Page Application:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 5.2 Steps:
1.  Install Vercel CLI: `npm install -g vercel`
2.  Run `vercel` from root directory.
3.  Confirm build settings: Vercel auto-detects Vite and sets build parameters correctly.
4.  Add `VITE_` environment variables on the Vercel Dashboard.
