FROM node:9 as build
WORKDIR /usr/src/app

ADD package.json yarn.lock tsconfig.json lerna.json ./
ADD packages/ui/package.json ./packages/ui/
ADD packages/types/package.json ./packages/types/
ADD packages/redux/package.json ./packages/redux/
ADD packages/lang/package.json ./packages/lang/
ADD packages/validator/package.json ./packages/validator/
ADD packages/parser/package.json ./packages/parser/

RUN yarn --frozen-lockfile
RUN yarn lerna bootstrap

COPY packages/ui ./packages/ui
COPY packages/types ./packages/types
COPY packages/redux ./packages/redux
COPY packages/lang ./packages/lang
COPY packages/validator ./packages/validator
COPY packages/parser ./packages/parser

RUN yarn --cwd packages/ui build

FROM skn0tt/nginx-spa

# Install Curl (for Healthcheck)
RUN apt-get update; apt-get -y install curl;

# Copy over static content
COPY --from=build /usr/src/app/packages/ui/dist /app/

HEALTHCHECK CMD curl --fail -A "healthcheck" http://localhost || exit 1
