FROM blockchain-lab-um/ssi-snap:latest as builder

FROM node:18.13.0-alpine3.16

WORKDIR /app

# Install pnpm
RUN npm i -g pnpm@7.30.0

# Copy patches
COPY ./patches ./patches

# Copy root package.json + pnpm-lock.yaml + pnpm-workspace.yaml
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

##############
#  PACKAGES  #
##############
COPY ./packages/docs/package.json ./packages/docs/
COPY ./packages/connector/package.json ./packages/connector/
COPY ./packages/types/package.json ./packages/types/
COPY ./packages/dapp/package.json ./packages/dapp/

##########
#  LIBS  #
##########
COPY ./libs/utils/package.json ./libs/utils/
COPY ./libs/oidc/rp-plugin/package.json ./libs/oidc/rp-plugin/
COPY ./libs/oidc/types/package.json ./libs/oidc/types/

##########
#  APPS  #
##########
COPY ./apps/oidc/issuer/package.json ./apps/oidc/issuer/
COPY ./apps/oidc/verifier/package.json ./apps/oidc/verifier/

# Remove prepare script
RUN npm pkg delete scripts.prepare

# Install all the dependencies
RUN pnpm install --frozen-lockfile

# Copy all other files
COPY . .

# Copy nx-cloud.env
COPY ./nx-cloud.env ./

# Build affected projects
RUN pnpm build:docker
