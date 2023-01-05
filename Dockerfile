# FROM node:16.18.1-alpine3.16
FROM node:18.12-alpine3.16

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

# Build affected projects
RUN yarn build:docker
