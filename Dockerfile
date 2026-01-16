# Use Node.js LTS version
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install OpenSSL for Prisma and libc6-compat for better compatibility
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files for better layer caching
COPY package.json package-lock.json* ./

# Install production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Build stage - install all dependencies and build
FROM base AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy Prisma schema and config files
COPY prisma ./prisma
COPY prisma.config.js* prisma.config.ts* ./

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY tsconfig.json ./
COPY app ./app

# Build TypeScript code
RUN npm run build

# Production image
FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production

# Install PM2 globally with specific version for reproducibility
RUN npm install -g pm2@latest

# Create a non-root user early
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy production dependencies
COPY --from=deps --chown=expressjs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=expressjs:nodejs /app/lib ./lib

# Copy Prisma files (including generated client)
COPY --from=builder --chown=expressjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=expressjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=expressjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Copy configuration files
COPY --chown=expressjs:nodejs package.json ./
COPY --chown=expressjs:nodejs prisma.config.js* prisma.config.ts* ./
COPY --chown=expressjs:nodejs ecosystem.config.js ./
COPY --chown=expressjs:nodejs ./scripts/docker-entrypoint.sh ./

# Make entrypoint executable
RUN chmod +x docker-entrypoint.sh

# Switch to non-root user
USER expressjs

# Expose the port
EXPOSE 3030

# Start application with entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]
