#!/bin/bash

echo "Updating beta version..."

pnpm changeset version && \
  pnpm install --lockfile-only && \
  pnpm build && \
  git add . && \
  git commit -m \"chore: update versions\" && \
  echo "Successfully updated beta version!" || \
  echo "Failed to update beta version!"

