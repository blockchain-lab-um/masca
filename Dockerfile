FROM node:18.16.0-alpine3.16

RUN apk add --no-cache libc6-compat git
WORKDIR /app

# Install pnpm
RUN npm i -g pnpm@7.30.0

# Copy patches
COPY ./patches ./patches

# Copy root package.json + pnpm-lock.yaml + pnpm-workspace.yaml
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Copy projects package.json files
COPY ./packages/docs/package.json ./packages/docs/
COPY ./packages/connector/package.json ./packages/connector/
COPY ./packages/types/package.json ./packages/types/
COPY ./packages/dapp/package.json ./packages/dapp/

# Copy libs package.json files
COPY ./libs/utils/package.json ./libs/utils/

# Install all the dependencies
RUN pnpm install

# Copy all other files
COPY . .

# Build affected projects
RUN pnpm build:docker
