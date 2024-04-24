#!/bin/bash

echo "Updating beta version..."

pnpm changeset version && \
  node scripts/changesets/update-snap-version.mjs && \
  pnpm install --no-frozen-lockfile && \
  pnpm build && \
  pnpm lint:fix && \
  git add --all && \
  git commit -m "chore: update versions" && \
  echo "Successfully updated beta version!" || \
  echo "Failed to update beta version!"
