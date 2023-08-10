#!/bin/bash

# Checkout or create a new branch
git checkout changeset-release/master 2>/dev/null || git checkout -b changeset-release/master

echo "Updating beta version..."

# First we exit rc mode and then we version the packages
echo $1

pnpm changeset pre exit && \
  node scripts/changesets/version-stable.mjs $1 && \
  node scripts/changesets/update-snap-version.mjs && \
  pnpm install --lockfile-only && \
  pnpm build && \
  git add --all && \
  git commit -m "chore: update versions" && \
  git push --force --set-upstream origin changeset-release/master && \
  echo "Successfully updated stable version!" || \
  echo "Failed to update stable version!"

