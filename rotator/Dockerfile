FROM node AS build
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./
RUN yarn build

FROM node:alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile


# src: https://firefart.at/post/docker_and_cron_jobs/
ENV APP_USER appuser

RUN adduser -g "App User" -D $APP_USER

COPY crontab /var/spool/cron/crontabs/$APP_USER
RUN chmod 0600 /var/spool/cron/crontabs/$APP_USER

CMD ["crond", "-f", "-d", "8"]
