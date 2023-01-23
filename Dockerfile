FROM node:18.13.0-alpine3.16

RUN apk add --no-cache libc6-compat git
WORKDIR /app

# Copy root package.json + yarn.lock + .yarn
COPY yarn.lock package.json .yarnrc.yml ./
COPY .yarn ./.yarn

# Copy projects' package.json files
COPY ./packages/docs/package.json ./packages/docs/
COPY ./packages/connector/package.json ./packages/connector/
COPY ./packages/types/package.json ./packages/types/
COPY ./packages/website/package.json ./packages/website/

# Install all the dependencies
RUN yarn install && yarn cache clean

# Copy all other files
COPY . .

# Create .env file for website (required to set PRE_PROD env variable)
RUN echo "VITE_PRE_PROD=true" > ./packages/website/.env

# Build affected projects
RUN yarn build:docker
