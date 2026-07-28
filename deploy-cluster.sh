#!/usr/bin/env bash
set -e

APP_NAME="look-vision"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
IMAGE_NAME="${APP_NAME}:${TIMESTAMP}"
LATEST_TAG="${APP_NAME}:latest"

docker build -t "${IMAGE_NAME}" -t "${LATEST_TAG}" .

docker stop "${APP_NAME}-container" 2>/dev/null || true
docker rm "${APP_NAME}-container" 2>/dev/null || true

docker run -d \
  --name "${APP_NAME}-container" \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NODE_OPTIONS="--max-old-space-size=2048" \
  --restart unless-stopped \
  "${IMAGE_NAME}"
