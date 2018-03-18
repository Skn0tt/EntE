# Build Static Files
FROM node as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . ./
RUN yarn build

# Host Static Files
FROM socialengine/nginx-spa

# Install Curl (for Healthcheck)
RUN apt-get update; apt-get -y install curl;

# Copy over static content
COPY --from=build-deps /usr/src/app/build /app

HEALTHCHECK CMD curl --fail -A "healthcheck" http://localhost || exit 1
