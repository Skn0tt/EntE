FROM node:9
WORKDIR /usr/src/app

ADD package.json yarn.lock tsconfig.json lerna.json ./
ADD packages/ente-api/package.json ./packages/ente-api/package.json
ADD packages/ente-types/package.json ./packages/ente-types/package.json
ADD packages/ente-mail/package.json ./packages/ente-mail/package.json
ADD packages/ente-validator/package.json ./packages/ente-validator/package.json
ADD packages/ente-db/package.json ./packages/ente-db/package.json

RUN yarn --frozen-lockfile
RUN yarn lerna bootstrap
RUN yarn global add nodemon

ADD packages/ente-api ./packages/ente-api
ADD packages/ente-types ./packages/ente-types
ADD packages/ente-mail ./packages/ente-mail
ADD packages/ente-validator ./packages/ente-validator
ADD packages/ente-db ./packages/ente-db

HEALTHCHECK CMD curl --fail http://localhost:3000/status || exit 1

EXPOSE 3000
CMD [ "yarn", "--cwd", "packages/ente-api", "start" ]
