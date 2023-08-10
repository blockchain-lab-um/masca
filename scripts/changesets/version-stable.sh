#!/bin/bash

echo "Updating stable version..."

node scripts/changesets/version-stable.mjs $1 && \
  node scripts/changesets/update-snap-version.mjs && \
  pnpm install --lockfile-only && \
  pnpm build && \
  git status && \
  git add . && \
  git commit -m "chore: update versions" && \
  echo "Successfully updated stable version!" || \
  echo "Failed to update stable version!"
