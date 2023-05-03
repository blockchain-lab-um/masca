FROM blockchain-lab-um/masca:latest as builder

FROM node:18.15.0-bullseye-slim

RUN apt-get update && apt-get install -y \
  bash \
  git \
  g++ \
  make \
  python3 \
  python3-pip \
  libsqlite3-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pnpm
RUN npm i -g pnpm@7.30.0

# Copy patches
COPY --from=builder /app/patches ./patches

COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/oidc/verifier/package.json ./apps/oidc/verifier/package.json
COPY --from=builder /app/apps/oidc/verifier/dist ./apps/oidc/verifier/dist

# Copy oidc-plugin
COPY --from=builder /app/libs/oidc/rp-plugin/dist ./libs/oidc/rp-plugin/dist
COPY --from=builder /app/libs/oidc/rp-plugin/package.json ./libs/oidc/rp-plugin/package.json

# Copy oidc-types
COPY --from=builder /app/libs/oidc/types ./libs/oidc/types

ENV NODE_ENV=production

# Remove prepare script
RUN npm pkg delete scripts.prepare

RUN pnpm install --frozen-lockfile

RUN chown node:node /app

USER node
CMD [ "node", "apps/oidc/verifier/dist/src/main.js" ]
