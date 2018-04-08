FROM node as build
WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json lerna.json ./

COPY packages/ui ./packages/ui
COPY packages/types ./packages/types
COPY packages/redux ./packages/redux
COPY packages/lang ./packages/lang
COPY packages/validator ./packages/validator
COPY packages/parser ./packages/parser

RUN yarn --frozen-lockfile
RUN yarn lerna bootstrap

RUN yarn --cwd packages/ui build

FROM socialengine/nginx-spa

# Install Curl (for Healthcheck)
RUN apt-get update; apt-get -y install curl;

# Copy over static content
COPY --from=build /usr/src/app/packages/ui/dist /app/

HEALTHCHECK CMD curl --fail -A "healthcheck" http://localhost || exit 1
