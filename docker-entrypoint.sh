#!/bin/sh
set -e

echo "Running Prisma migrations..."

npx prisma migrate deploy

echo "Starting server..."
exec pm2-runtime start ecosystem.config.js