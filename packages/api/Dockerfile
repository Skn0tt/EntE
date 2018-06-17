FROM node:9
WORKDIR /usr/src/app

ADD package.json yarn.lock tsconfig.json lerna.json ./
ADD packages/api/package.json ./packages/api/package.json
ADD packages/types/package.json ./packages/types/package.json
ADD packages/mail/package.json ./packages/mail/package.json
ADD packages/validator/package.json ./packages/validator/package.json
ADD packages/db/package.json ./packages/db/package.json

RUN yarn --frozen-lockfile
RUN yarn lerna bootstrap
RUN yarn global add nodemon

ADD packages/api ./packages/api
ADD packages/types ./packages/types
ADD packages/mail ./packages/mail
ADD packages/validator ./packages/validator
ADD packages/db ./packages/db

HEALTHCHECK CMD curl --fail http://localhost:3000/status || exit 1

EXPOSE 3000
CMD [ "yarn", "--cwd", "packages/api", "start" ]
