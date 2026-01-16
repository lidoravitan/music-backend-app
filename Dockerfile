# Use Node.js LTS version
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Install development dependencies for build
FROM base AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.js ./prisma.config.js

RUN npm ci

# Copy source code
COPY . .
COPY tsconfig.json ./

# Build TypeScript code
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install PM2 globally
RUN npm install -g pm2

# Copy necessary files from builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.js ./prisma.config.js

# Copy PM2 ecosystem file and entrypoint script
COPY ecosystem.config.js ./
COPY ./scripts/docker-entrypoint.sh ./

# Make entrypoint executable
RUN chmod +x docker-entrypoint.sh

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
RUN chown -R expressjs:nodejs /app

USER expressjs

# Expose the port
EXPOSE 3030

# Start application with entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]
