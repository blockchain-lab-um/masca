FROM blockchain-lab-um/ssi-snap:latest as builder

FROM node:18.13.0-alpine3.16

WORKDIR /app

# Install pnpm
RUN npm i -g pnpm@7.30.0

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

ENV NODE_ENV=production

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN chown node:node /app

USER node
CMD [ "node", "apps/oidc/issuer/dist/src/main.js" ]
