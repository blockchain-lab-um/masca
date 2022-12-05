FROM node:16.18.1-alpine3.16

RUN apk add --no-cache libc6-compat git
WORKDIR /app

# Copy root package.json + yarn.lock + .yarn
COPY yarn.lock package.json .yarnrc.yml ./
COPY .yarn ./.yarn

# Copy projects' package.json files
COPY ./apps/oidc/issuer/package.json ./apps/oidc/issuer/
COPY ./apps/oidc/verifier/package.json ./apps/oidc/verifier/
COPY ./libs/oidc/rp-plugin/package.json ./libs/oidc/rp-plugin/
COPY ./libs/oidc/rp-plugin/.eslintrc.js ./libs/oidc/rp-plugin/
COPY ./libs/oidc/types/package.json ./libs/oidc/types/

# Install all the dependencies
RUN yarn install && yarn cache clean

# Copy all other files
COPY . .

# Build affected projects
RUN yarn build:docker
