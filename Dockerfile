FROM node:18.13.0-alpine3.16

RUN apk add --no-cache libc6-compat git
WORKDIR /app

# Install pnpm
RUN npm i -g pnpm@7.25.1

# Copy root package.json + pnpm-lock.yaml + pnpm-workspace.yaml
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Copy projects package.json files
COPY ./packages/docs/package.json ./packages/docs/
COPY ./packages/connector/package.json ./packages/connector/
COPY ./packages/types/package.json ./packages/types/
COPY ./packages/website/package.json ./packages/website/
COPY ./packages/dapp/package.json ./packages/dapp/

# Copy libs package.json files
COPY ./libs/utils/package.json ./libs/utils/

# Install all the dependencies
RUN pnpm install

# Copy all other files
COPY . .

# Create .env file for website (required to set PRE_PROD env variable)
RUN echo "VITE_PRE_PROD=true" > ./packages/website/.env

# Build affected projects
RUN pnpm build:docker
