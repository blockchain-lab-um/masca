FROM bclabum/ssi-snap-oidc-demo:latest as builder

FROM node:16.18.1-alpine3.16
WORKDIR /app

COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/oidc/verifier/package.json ./apps/oidc/verifier/package.json
COPY --from=builder /app/apps/oidc/verifier/dist ./apps/oidc/verifier/dist

# Copy oidc-plugin
COPY --from=builder /app/libs/oidc/rp-plugin/dist ./libs/oidc/rp-plugin/dist
COPY --from=builder /app/libs/oidc/rp-plugin/package.json ./libs/oidc/rp-plugin/package.json

# Copy oidc-types
COPY --from=builder /app/libs/oidc/types ./libs/oidc/types

ENV NODE_ENV=production

RUN pnpm install
RUN chown node:node /app

USER node
CMD [ "node", "apps/oidc/verifier/dist/main" ]
