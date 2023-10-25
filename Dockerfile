FROM node:18.18.2-alpine3.16

WORKDIR /app

# Install pnpm
RUN npm i -g pnpm@8.9.2

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
COPY ./libs/oidc/types/package.json ./libs/oidc/types/
COPY ./libs/did-provider-key/package.json ./libs/did-provider-key/

# Remove prepare script
RUN npm pkg delete scripts.prepare

# Copy all other files
COPY . .

# Install all the dependencies
# This would be better before COPY . . but we use postinstall scripts
# that depend on some of the files copied above
RUN pnpm install --frozen-lockfile

# Copy nx-cloud.env
COPY ./nx-cloud.env ./
ENV NODE_ENV=production

# For Dapp to build as Standalone
ENV DOCKER_BUILD=true

# Build affected projects
RUN pnpm build:docker
