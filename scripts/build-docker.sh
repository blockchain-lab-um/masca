#!/bin/sh

projects="\
@blockchain-lab-um/ssi-snap-docs,\
@blockchain-lab-um/dapp,\
@blockchain-lab-um/utils,\
@blockchain-lab-um/ssi-snap-types,\
@blockchain-lab-um/ssi-snap-connector,\
@blockchain-lab-um/oidc-issuer,\
@blockchain-lab-um/oidc-verifier,\
@blockchain-lab-um/oidc-rp-plugin\
"

pnpm nx run-many \
  --target=build \
  --projects=$projects

pnpm nx run @blockchain-lab-um/dapp:build:docker
