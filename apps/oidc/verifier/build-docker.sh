#!/bin/sh

projects="\
@blockchain-lab-um/masca-docs,\
@blockchain-lab-um/masca-connector,\
@blockchain-lab-um/masca-types,\
@blockchain-lab-um/dapp,\
@blockchain-lab-um/utils,\
@blockchain-lab-um/oidc-rp-plugin,\
@blockchain-lab-um/oidc-types,\
@blockchain-lab-um/did-provider-key,\
@blockchain-lab-um/oidc-issuer,\
@blockchain-lab-um/oidc-verifier\
"

pnpm nx run-many \
  --target=build \
  --projects=$projects

pnpm nx run @blockchain-lab-um/dapp:build:docker
