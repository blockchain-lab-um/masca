FROM blockchain-lab-um/masca:latest as builder

FROM node:18.16.0-alpine3.16

WORKDIR /app

# Install pnpm
RUN npm i -g pnpm@8.6.10

# Copy patches
COPY --from=builder /app/patches ./patches

COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/oidc/issuer/package.json ./apps/oidc/issuer/package.json
COPY --from=builder /app/apps/oidc/issuer/dist ./apps/oidc/issuer/dist

# Copy oidc-plugin
COPY --from=builder /app/libs/oidc/rp-plugin/dist ./libs/oidc/rp-plugin/dist
COPY --from=builder /app/libs/oidc/rp-plugin/package.json ./libs/oidc/rp-plugin/package.json

# Copy oidc-types
COPY --from=builder /app/libs/oidc/types ./libs/oidc/types

# Copy did-provider-key
COPY --from=builder /app/libs/did-provider-key/dist ./libs/did-provider-key/dist
COPY --from=builder /app/libs/did-provider-key/package.json ./libs/did-provider-key/package.json

# Copy utils
COPY --from=builder /app/libs/utils/dist ./libs/utils/dist
COPY --from=builder /app/libs/utils/package.json ./libs/utils/package.json

ENV NODE_ENV=production

# Remove prepare script
RUN npm pkg delete scripts.prepare

RUN pnpm install --frozen-lockfile

RUN chown node:node /app

USER node
CMD [ "node", "apps/oidc/issuer/dist/src/main.js" ]
