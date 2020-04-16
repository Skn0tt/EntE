FROM node:12.16

WORKDIR /app

# Install dependencies
ADD package.json yarn.lock ./
ADD patches/ ./patches/
RUN yarn install --frozen-lockfile

# Copy over sources
ADD next.config.js tsconfig.json next-env.d.ts .babelrc ./
ADD src/ ./src/

# Build with placeholder env vars
ENV SENTRY_DSN=__SENTRY_DSN_HERE__
ENV ROTATION_PERIOD=1415626180484145813288575

RUN yarn build

# Replace placeholders before running
ADD entrypoint.sh ./
ENTRYPOINT ["/app/entrypoint.sh"]

# Run
EXPOSE 3000
HEALTHCHECK --timeout=1s --start-period=5s CMD curl --fail localhost:3000/api/status && curl --fail localhost:3000/ || exit 1
CMD ./node_modules/.bin/next start