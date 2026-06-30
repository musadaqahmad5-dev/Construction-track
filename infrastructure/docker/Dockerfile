# ==========================================
# STAGE 1: Dependency Resolver & Build Cache
# ==========================================
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /workspace

# Copy root monorepo manifest structures
COPY package.json package-lock.json ./
# If using turborepo / yarn workspaces, copy global structures here
# RUN npm ci --only=production

# ==========================================
# STAGE 2: Source Code Builder
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /workspace
COPY --from=installer /workspace/node_modules ./node_modules
COPY . .

# Perform typescript compilation of backend services
# RUN npm run build

# ==========================================
# STAGE 3: Slim Production Runtime Runner
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create root-less runtime user for optimal security hardening
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs-runner

# Copy build files from builder stage
COPY --from=builder --chown=nodejs-runner:nodejs /workspace/dist ./dist
COPY --from=builder --chown=nodejs-runner:nodejs /workspace/package.json ./package.json
COPY --from=builder --chown=nodejs-runner:nodejs /workspace/node_modules ./node_modules

USER nodejs-runner

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
