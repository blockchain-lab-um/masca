FROM blockchain-lab-um/masca:latest as builder

FROM node:18.15-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/packages/dapp/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/dapp/.next/static ./packages/dapp/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/packages/dapp/public ./packages/dapp/public

USER nextjs

EXPOSE 3000

ENV PORT 3000

WORKDIR /app/packages/dapp

CMD ["node", "server.js"]
