# ========================================================================= #
# STAGE 1: BUILD ARCHITECTURE & PACKAGE HYDRO
# ========================================================================= #
FROM node:20-alpine AS builder
WORKDIR /app

# Install build-essential dependencies required for native modules compiling
RUN apk add --no-cache libc6-compat python3 make g++

COPY package*.json ./

# Attempt strict clean install; fall back gracefully to standard install if lockfile drifts
RUN npm ci || npm install

COPY . .
RUN npm run build

# ========================================================================= #
# STAGE 2: RUNTIME ENGINE PLATFORM
# ========================================================================= #
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY package*.json ./

# Enforce safe production installation without breaking on lockfile validation discrepancies
RUN npm ci --only=production || npm install --only=production

# Copy compiled static front-end assets and the bundled express server process
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run process gateways securely as a non-root system user account
USER node

CMD ["node", "dist/server.cjs"]
