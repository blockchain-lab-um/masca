#!/bin/bash

echo "Updating stable version..."

# First we exit rc mode and then we version the packages
pnpm changeset pre exit && \
  node scripts/changesets/version-stable.mjs $1 && \
  node scripts/changesets/update-snap-version.mjs && \
  pnpm install --no-frozen-lockfile && \
  pnpm build && \
  pnpm lint:fix && \
  git add --all && \
  git commit -m "chore: update versions" && \
  echo "Successfully updated stable version!" || \
  echo "Failed to update stable version!"

