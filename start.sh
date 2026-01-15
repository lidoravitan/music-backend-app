#!/bin/sh
set -e

echo "Running Prisma migrations..."

# DEV (if you really want migrate dev)
# npx prisma migrate dev

# PROD (recommended)
npx prisma migrate deploy

echo "Starting server..."
exec pm2-runtime start ecosystem.config.js