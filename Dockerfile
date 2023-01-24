FROM node:18.13.0-alpine3.16

RUN apk add --no-cache libc6-compat git
WORKDIR /app

# Copy root package.json + pnpm-lock.yaml + pnpm-workspace.yaml
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Copy projects' package.json files
COPY ./packages/docs/package.json ./packages/docs/
COPY ./packages/connector/package.json ./packages/connector/
COPY ./packages/types/package.json ./packages/types/
COPY ./packages/website/package.json ./packages/website/

# Install all the dependencies
RUN pnpm install

# Copy all other files
COPY . .

# Create .env file for website (required to set PRE_PROD env variable)
RUN echo "VITE_PRE_PROD=true" > ./packages/website/.env

# Build affected projects
RUN pnpm build:docker
