# Next.js (standalone) image for Dokploy. Build context = the repo root.
# ---- build ----
FROM node:24-alpine AS builder
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# Projects are fetched from Notion at build time — needs the token during build.
ARG NOTION_TOKEN
ENV NOTION_TOKEN=$NOTION_TOKEN
RUN pnpm build

# ---- run ----
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Next's standalone server otherwise binds to localhost → unreachable in a container.
ENV HOSTNAME=0.0.0.0
# Next's standalone output bundles a minimal server + node_modules.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
