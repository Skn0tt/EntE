FROM node:10 as build
WORKDIR /usr/src/app

ADD package.json yarn.lock tsconfig.json lerna.json ./
ADD packages/ente-ui/package.json ./packages/ente-ui/package.json
ADD packages/ente-types/package.json ./packages/ente-types/package.json

RUN yarn --frozen-lockfile --network-concurrency 1
RUN yarn lerna bootstrap

COPY packages/ente-ui ./packages/ente-ui
COPY packages/ente-types ./packages/ente-types

RUN yarn --cwd packages/ente-ui build

FROM skn0tt/nginx-spa:v0.1.0

# Install Curl (for Healthcheck)
RUN apt-get update; apt-get -y install curl;

# Copy over static content

COPY packages/ente-ui/nginx.conf /etc/nginx/conf.d/default.template

COPY --from=build /usr/src/app/packages/ente-ui/dist /app/

HEALTHCHECK CMD curl --fail -A "healthcheck" http://localhost || exit 1
