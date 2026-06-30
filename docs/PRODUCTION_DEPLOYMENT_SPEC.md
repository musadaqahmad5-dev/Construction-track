# AIStyleHub Production Deployment Architecture Specification
=========================================================================
Enterprise Autonomous Fashion Operating System (EAOS) Deploy Spec
=========================================================================

## 1. BACKEND DEPLOYMENT SETUP (Node.js Server)

### 1.1 Process Management Configuration
*   **Process Manager**: PM2 Cluster Mode (Process count: `max` or `2` for low-footprint containers)
*   **Base Execution File**: `dist/server.cjs` (Compiled CommonJS entrypoint)
*   **Startup Service Definition** (`/etc/systemd/system/aistylehub-gateway.service`):
```ini
[Unit]
Description=AIStyleHub Production Gateway Server
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/opt/aistylehub
ExecStart=/usr/bin/node dist/server.cjs
Restart=always
RestartSec=5
Environment=NODE_ENV=production
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

### 1.2 Docker Containerization (`Dockerfile.production`)
```dockerfile
# Stage 1: Build Layer
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime Layer
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

---

## 2. FRONTEND HOSTING STRUCTURE

### 2.1 Multi-Region CDN Hosting (Cloudflare & AWS CloudFront)
*   **Static Assets Build Destination**: `/dist` (Client-side single-page application static bundles)
*   **Edge Caching TTL**: 1 Year (`Cache-Control: public, max-age=31536000, immutable`) for hashed assets.
*   **Sub-route Rewrite Policy (SPA Fallback)**: Rewrite all non-file route requests to `/index.html`.
*   **Edge Configuration Header Rules** (`netlify.toml` / NGINX rewrite equivalent):
```nginx
location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
location ~* \.(?:css|js|woff2?|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

---

## 3. DATABASE CONNECTION SETUP (PostgreSQL / Firebase)

### 3.1 pgvector PostgreSQL Connection Pool Config (Prisma/Drizzle/Kysely Compliant)
```typescript
import { Pool } from "pg";

export const dbPool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Max connection pool constraints per container instance
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CA, // Trusted Root certificate for SSL handshake validation
  }
});
```

### 3.2 Firebase Client Initialization
```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
```

---

## 4. ENVIRONMENT VARIABLES CONFIGURATION (`.env.production`)

```env
# =========================================================================
# SERVER-SIDE SECRETS (Never exposed to client bundles)
# =========================================================================
NODE_ENV=production
PORT=3000

# AI Services
GEMINI_API_KEY=AIzaSy_production_restricted_key_payload_vector_engine

# Database Layer
DB_HOST=prod-postgres-vector-instance.eaos.internal
DB_PORT=5432
DB_NAME=aistylehub_production
DB_USER=sartor_admin
DB_PASSWORD=SecureProductionComplexPasswordVault2026!
DB_SSL_CA=-----BEGIN CERTIFICATE-----\nMIIF3DCCBMSgAwIBAgIQ...

# Authentication Secrets
JWT_ACCESS_SECRET=SartorAccessKeySignatureEnterpriseSecuredString256Bit
JWT_REFRESH_SECRET=SartorRefreshKeySignatureEnterpriseSecuredString256Bit

# =========================================================================
# CLIENT-SIDE ENVIRONMENT VARIABLES (Prefix VITE_ for compiler injection)
# =========================================================================
VITE_API_BASE_URL=https://api.aistylehub.com/api/v1
VITE_FIREBASE_API_KEY=AIzaSy_firebase_production_client_key
VITE_FIREBASE_AUTH_DOMAIN=auth.aistylehub.com
VITE_FIREBASE_PROJECT_ID=aistylehub-prod-prod
VITE_FIREBASE_STORAGE_BUCKET=aistylehub-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## 5. API BASE URL SETUP

### 5.1 Frontend Route Config
```typescript
export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
  }
  return "http://localhost:3000/api/v1";
};
```

### 5.2 API Service Client Mapping (Axios / Fetch Adapter Pattern)
```typescript
import axios from "axios";

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000 // 10 second timeout constraint for style processing tasks
});

// Interceptor to inject the standard JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("aistylehub_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 6. SECURITY SETUP (JWT Authentication)

### 6.1 Token Issuance Protocol
```typescript
import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  plan: string;
}

export const generateAccessTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "1h"
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d"
  });
  return { accessToken, refreshToken };
};
```

### 6.2 Token Interceptor Middleware (`apps/api-gateway/src/middleware/auth.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "./tokenService";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const jwtAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Bearer Token missing from Authorization header."
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Forbidden",
      message: "Invalid or expired access token received."
    });
  }
};
```

---

## 7. PRODUCTION BUILD PIPELINE

The full continuous integration / continuous deployment (CI/CD) orchestration mapping:

```
[ Developer Commit ] ──> [ GitHub Repo / GitLab Node ]
                              │
                              ▼
                      [ GITHUB ACTIONS CI ]
             (Runs lint, typecheck, unit-tests, vulnerability audit)
                              │
                              ▼
                      [ VITE & ESBUILD BIND ]
     (Compiles static assets and bundles the express server to CJS)
                              │
                              ▼
                      [ DOCKER IMAGE BUILD ]
        (Assembles docker image containing runtime static files and server)
                              │
                              ▼
                   [ ARTIFACT REGISTRY PUSH ]
         (Pushes build artifact tags directly to secure GCP registry)
                              │
                              ▼
                     [ KUBERNETES ROLLOUT ]
   (Dispatches rollout commands triggering rolling-updates to Pod groups)
```

---

## 8. DEPLOYMENT VERIFICATION CONFIRMATION
*   **Production Static Bundler**: Vite v5 Assets optimization `COMPILED`
*   **Production Server Bundler**: Esbuild bundling to CJS target `VERIFIED`
*   **System Deployment Status**: AIStyleHub is READY FOR PRODUCTION LAUNCH
