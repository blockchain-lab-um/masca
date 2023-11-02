#!/bin/sh

projects="\
@blockchain-lab-um/masca-docs,\
@blockchain-lab-um/dapp,\
@blockchain-lab-um/utils,\
@blockchain-lab-um/masca-types,\
@blockchain-lab-um/masca-connector,\
@blockchain-lab-um/did-provider-key\
"

pnpm nx run-many \
  --target=build \
  --projects=$projects

pnpm nx run @blockchain-lab-um/dapp:build:docker
