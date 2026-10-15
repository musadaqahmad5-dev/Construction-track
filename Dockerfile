# ========================================================================= #
# STAGE 1: BUILD ENVIRONMENT & DEPENDENCY RESOLUTION
# ========================================================================= #
FROM node:20-alpine AS builder
WORKDIR /app

# Install system dependencies required for handling production compilation safely
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package descriptors independently to cache engine layers productively
COPY package*.json ./

# Execute a clean standard install without enforcing strict lockfile validation matching
RUN npm install

COPY . .
RUN npm run build

# ========================================================================= #
# STAGE 2: HIGH-PERFORMANCE PRODUCTION ENGINE RUNTIME
# ========================================================================= #
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy package configurations to execute a lightweight production install slice
COPY package*.json ./
RUN npm install --only=production

# Pull our compiled dist tracking layers directly from Stage 1
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Enforce secure operational constraints via non-root execution
USER node

CMD ["node", "dist/server.cjs"]
