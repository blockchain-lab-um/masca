#!/bin/bash

echo "Publishing stable version..."

pnpm install --frozen-lockfile && \
  pnpm build && \
  pnpm changeset publish && \
  pnpm changeset pre enter beta && \
  node scripts/changesets/fix-after-stable-release.mjs && \
  git add . && \
  git commit -m "chore: release stable and enter beta mode" && \
  git push --follow-tags && \
  git checkout develop && \
  git rebase master && \
  git push && \
  echo "Successfully published stable version!" || \
  echo "Failed to publish stable version!"
