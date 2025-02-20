# Base image
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat g++ cmake tar make
WORKDIR /app

# Install dependencies based on package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci

# Build the application
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Apply environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Ensure the Next.js build uses correct settings
RUN rm -rf .next && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Add Next.js user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js 
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure permissions for prerender cache
RUN mkdir -p .next && chown -R nextjs:nodejs .next 

# Entrypoint script
COPY scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT [ "/entrypoint.sh" ]
