#!/bin/bash

echo "Updating beta version..."

pnpm changeset version && \
  node scripts/changesets/update-snap-version.mjs && \
  pnpm install --lockfile-only && \
  pnpm build && \
  git add --all && \
  git commit -m "chore: update versions" && \
  echo "Successfully updated beta version!" || \
  echo "Failed to update beta version!"
