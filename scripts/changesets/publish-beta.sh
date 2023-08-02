#!/bin/bash

echo "Publishing beta version..."

pnpm install --frozen-lockfile && \
  pnpm build && \
  pnpm changeset publish && \
  echo "Successfully published beta version!" || \
  echo "Failed to publish beta version!"

