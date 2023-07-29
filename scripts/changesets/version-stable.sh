#!/bin/bash

echo "Updating beta version..."

# First we exit rc mode and then we version the packages
echo $1

pnpm changeset pre exit && \
  node scripts/version-stable.mjs $1 && \
  pnpm install --lockfile-only && \
  pnpm build && \
  git add . && \
  git commit -m \"chore: update versions\" && \
  git push --force && \
  echo "Successfully updated stable version!" || \
  echo "Failed to update stable version!"

