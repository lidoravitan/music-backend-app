#!/usr/bin/env sh
set -e

IMAGE_NAME="lidoravitan/music-backend-app"
TAG="latest"
PLATFORMS="linux/amd64,linux/arm64"

echo "🔧 Ensuring buildx builder exists..."
docker buildx create --use --name multiarch-builder 2>/dev/null || docker buildx use multiarch-builder

echo "🚀 Building and pushing multi-arch image..."
docker buildx build \
  --platform ${PLATFORMS} \
  -t ${IMAGE_NAME}:${TAG} \
  --push .

echo "✅ Deployment complete: ${IMAGE_NAME}:${TAG}"
