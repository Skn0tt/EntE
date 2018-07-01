FROM node:9 as build
WORKDIR /usr/src/app

ADD package.json yarn.lock tsconfig.json lerna.json ./
ADD packages/ente-ui/package.json ./packages/ente-ui/package.json
ADD packages/ente-types/package.json ./packages/ente-types/package.json
ADD packages/ente-redux/package.json ./packages/ente-redux/package.json
ADD packages/ente-lang/package.json ./packages/ente-lang/package.json
ADD packages/ente-validator/package.json ./packages/ente-validator/package.json
ADD packages/ente-parser/package.json ./packages/ente-parser/package.json

RUN yarn --frozen-lockfile
RUN yarn lerna bootstrap

COPY packages/ente-ui ./packages/ente-ui
COPY packages/ente-types ./packages/ente-types
COPY packages/ente-redux ./packages/ente-redux
COPY packages/ente-lang ./packages/ente-lang
COPY packages/ente-validator ./packages/ente-validator
COPY packages/ente-parser ./packages/ente-parser

RUN yarn --cwd packages/ente-ui build

FROM skn0tt/nginx-spa

# Install Curl (for Healthcheck)
RUN apt-get update; apt-get -y install curl;

# Copy over static content
COPY --from=build /usr/src/app/packages/ente-ui/dist /app/

HEALTHCHECK CMD curl --fail -A "healthcheck" http://localhost || exit 1
