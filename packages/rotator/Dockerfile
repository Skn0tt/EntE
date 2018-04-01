FROM node:alpine
WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json lerna.json ./

COPY packages/rotator ./packages/rotator
COPY packages/types ./packages/types

RUN yarn --frozen-lockfile
RUN yarn lerna bootstrap

RUN yarn --cwd packages/types build
RUN yarn --cwd packages/rotator build

# src: https://firefart.at/post/docker_and_cron_jobs/
ENV APP_USER appuser

RUN adduser -g "App User" -D $APP_USER

COPY packages/rotator/crontab /var/spool/cron/crontabs/$APP_USER
RUN chmod 0600 /var/spool/cron/crontabs/$APP_USER

CMD yarn --cwd packages/rotator start && crond -f -d 8 
