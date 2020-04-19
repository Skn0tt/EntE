FROM node:12.16-alpine as build

WORKDIR /app

# Install dependencies
ADD package.json yarn.lock ./
ADD patches/ ./patches/
RUN yarn install --frozen-lockfile

# Copy over sources
ADD next.config.js tsconfig.json next-env.d.ts .babelrc ./
ADD src/ ./src/
ADD public/ ./public/

# Build with placeholder env vars
ENV SENTRY_DSN=__SENTRY_DSN_HERE__
ENV ROTATION_PERIOD=1415626180484145813288575

RUN yarn build

## New stage for running, keeps image size low
FROM node:12.16-alpine as run

WORKDIR /app

# alpine is naked by default, so we'll add curl for our healthcheck
RUN apk add --no-cache curl

RUN yarn add next@^9.3.5 react@16.13.1 react-dom@16.13.1 && yarn cache clean
RUN echo 'module.exports = { target: "serverless" }' > next.config.js

# Get dist files
COPY --from=build /app/.next /app/.next

# Replace env var placeholders before running
ADD entrypoint.sh ./
ENTRYPOINT ["/app/entrypoint.sh"]

# environment variable defaults
ENV NODE_ENV=production

ENV BASE_URL=localhost:3000
ENV CRON_WEEKLY_SUMMARY="0 16 * * 5"

ENV JWT_ROTATION_INTERVAL=900000
ENV JWT_EXPIRY=900000

ENV REDIS_HOST=host.docker.internal
ENV REDIS_PORT=6379
ENV REDIS_PREFIX=ente

ENV MYSQL_HOST=host.docker.internal
ENV MYSQL_PORT=3306
ENV MYSQL_USERNAME=root
ENV MYSQL_PASSWORD=root
ENV MYSQL_DATABASE=ente
ENV MYSQL_TIMEZONE=Z

ENV SMTP_HOST=host.docker.internal
ENV SMTP_PORT=1025
ENV SMTP_USERNAME=admin
ENV SMTP_PASSWORD=root
ENV SMTP_POOL=
ENV SMTP_ADDRESS=ente@ente.app
ENV SMTP_RETRY_DELAY=3600000

# More available env vars:
## ENV SENTRY_DSN=
## ENV ROTATION_PERIOD=

# Run
EXPOSE 3000
HEALTHCHECK --timeout=1s --start-period=5s CMD curl --fail localhost:3000/api/status && curl --fail localhost:3000/ || exit 1
CMD ./node_modules/.bin/next start