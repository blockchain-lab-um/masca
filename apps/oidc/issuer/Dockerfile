FROM bclabum/ssi-snap-oidc-demo:latest as builder

FROM node:16.18.1-alpine3.16
WORKDIR /app

COPY --from=builder /app/yarn.lock yarn.lock
COPY --from=builder /app/apps/issuer/package.json ./apps/issuer/package.json
COPY --from=builder /app/apps/issuer/dist ./apps/issuer/dist

# Copy oidc-plugin
COPY --from=builder /app/libs/oidc/rp-plugin/dist ./libs/oidc/rp-plugin/dist
COPY --from=builder /app/libs/oidc/rp-plugin/package.json ./libs/oidc/rp-plugin/package.json

ENV NODE_ENV=production

RUN yarn install --immutable --ignore-scripts && yarn cache clean
RUN chown node:node /app

USER node
CMD [ "node", "apps/issuer/dist/main" ]
