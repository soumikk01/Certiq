# ─── Stage 1: Dependencies ───────────────────────────────────────────────────
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

WORKDIR /app

# Copy workspace config files needed for install
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./

# Copy package.json for the API and all workspace packages it depends on
COPY apps/api/package.json ./apps/api/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/ui/package.json ./packages/ui/

# Install all dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile

# ─── Stage 2: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages ./packages

# Copy source code and config files needed for build
COPY apps/api/ ./apps/api/
COPY package.json pnpm-workspace.yaml .npmrc ./

# Build the API
RUN pnpm --filter @certiq/api run build

# ─── Stage 3: Runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built output
COPY --from=builder /app/apps/api/dist ./dist

# Copy production node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

# Copy package.json for runtime metadata
COPY apps/api/package.json ./package.json

EXPOSE 12500

CMD ["node", "dist/main.js"]
