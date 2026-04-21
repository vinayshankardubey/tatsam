# Multi-stage build for the Tatsam Next.js app.
# The project uses Supabase (no Prisma) and Next.js standalone output.

FROM node:20-alpine AS base

# ── Dependencies layer ──────────────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only the manifests so this layer caches cleanly across source edits.
COPY package.json package-lock.json* ./

RUN npm ci --legacy-peer-deps

# ── Builder layer ───────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# `output: "standalone"` in next.config.mjs emits .next/standalone
# with a minimal server.js and only the required node_modules.
RUN npm run build

# ── Runtime layer ───────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8042
ENV HOSTNAME=0.0.0.0

# Non-root user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Static assets and public files.
COPY --from=builder /app/public ./public

# Standalone build output — carries the production server + trimmed deps.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Writable cache dir for Next's runtime prerender.
RUN mkdir -p .next && chown nextjs:nodejs .next

USER nextjs

EXPOSE 8042

CMD ["node", "server.js"]
